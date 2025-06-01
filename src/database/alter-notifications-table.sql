-- notifications 테이블을 auth.users 참조로 변경하는 스크립트
-- 1. 기존 외래키 제약조건 제거 (있다면)
DO $ $ BEGIN -- notifications 테이블의 기존 외래키 제약조건 찾기 및 삭제
IF EXISTS (
    SELECT
        1
    FROM
        information_schema.table_constraints
    WHERE
        constraint_name LIKE '%notifications_recipient_id%'
        AND table_name = 'notifications'
) THEN -- 기존 외래키 제약조건 삭제
ALTER TABLE
    notifications DROP CONSTRAINT IF EXISTS notifications_recipient_id_fkey;

END IF;

-- 다른 가능한 외래키 제약조건명들도 확인 및 삭제
DECLARE constraint_name text;

BEGIN FOR constraint_name IN
SELECT
    con.conname
FROM
    pg_constraint con
    INNER JOIN pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE
    nsp.nspname = 'public'
    AND rel.relname = 'notifications'
    AND con.contype = 'f'
    AND con.confrelid = (
        SELECT
            oid
        FROM
            pg_class
        WHERE
            relname = 'users'
            AND relnamespace = (
                SELECT
                    oid
                FROM
                    pg_namespace
                WHERE
                    nspname = 'public'
            )
    ) LOOP EXECUTE 'ALTER TABLE notifications DROP CONSTRAINT IF EXISTS ' || constraint_name;

END LOOP;

END;

END $ $;

-- 2. recipient_id 컬럼이 auth.users의 id와 호환되는지 확인 및 수정
-- (UUID 타입이어야 함)
DO $ $ BEGIN -- recipient_id 컬럼 타입 확인 및 변경
IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'notifications'
        AND column_name = 'recipient_id'
        AND data_type != 'uuid'
) THEN -- UUID 타입이 아니면 변경
ALTER TABLE
    notifications
ALTER COLUMN
    recipient_id TYPE UUID USING recipient_id :: UUID;

END IF;

END $ $;

-- 3. auth.users를 참조하는 새로운 외래키 제약조건 추가
ALTER TABLE
    notifications
ADD
    CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. 기존 RLS 정책들 확인 및 업데이트
-- 기존 정책들 제거
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON notifications;

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON notifications;

DROP POLICY IF EXISTS "Enable update for own notifications" ON notifications;

DROP POLICY IF EXISTS "Enable delete for own notifications" ON notifications;

DROP POLICY IF EXISTS "Enable read access for own notifications" ON notifications;

DROP POLICY IF EXISTS "Enable insert for service role" ON notifications;

-- 새로운 RLS 정책 생성
-- 읽기 권한: 인증된 사용자는 자신의 알림만 읽을 수 있음
CREATE POLICY "Enable read access for own notifications" ON notifications FOR
SELECT
    USING (recipient_id = auth.uid());

-- 삽입 권한: 서비스 역할을 통해서만 알림 생성 가능
CREATE POLICY "Enable insert for service role" ON notifications FOR
INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 일반 인증된 사용자도 알림 삽입 가능하도록 추가 정책 (필요에 따라)
CREATE POLICY "Enable insert for authenticated users" ON notifications FOR
INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 업데이트 권한: 자신의 알림만 업데이트 가능 (읽음 처리 등)
CREATE POLICY "Enable update for own notifications" ON notifications FOR
UPDATE
    USING (recipient_id = auth.uid());

-- 삭제 권한: 자신의 알림만 삭제 가능
CREATE POLICY "Enable delete for own notifications" ON notifications FOR DELETE USING (recipient_id = auth.uid());

-- 5. 인덱스 재생성 (필요한 경우)
-- 기존 인덱스 제거 및 재생성
DROP INDEX IF EXISTS idx_notifications_recipient_id;

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);

-- 6. 트리거 및 함수 확인
-- 업데이트 트리거 함수가 없다면 생성
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

-- 업데이트 트리거 재생성
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

CREATE TRIGGER update_notifications_updated_at BEFORE
UPDATE
    ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Realtime 설정 확인
-- Realtime publication에 추가 (이미 있어도 에러 없음)
DO $ $ BEGIN BEGIN ALTER publication supabase_realtime
ADD
    TABLE notifications;

EXCEPTION
WHEN duplicate_object THEN -- 이미 추가되어 있으면 무시
NULL;

END;

END $ $;

-- 8. 실시간 알림 트리거 함수 및 트리거 재생성
CREATE
OR REPLACE FUNCTION handle_new_notification() RETURNS trigger AS $ $ BEGIN -- PostgreSQL NOTIFY로 실시간 알림 전송
PERFORM pg_notify('new_notification', row_to_json(NEW) :: text);

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

-- 기존 트리거 제거 후 재생성
DROP TRIGGER IF EXISTS on_notification_created ON notifications;

CREATE TRIGGER on_notification_created
AFTER
INSERT
    ON notifications FOR EACH ROW EXECUTE FUNCTION handle_new_notification();

-- 9. 완료 메시지
DO $ $ BEGIN RAISE NOTICE 'notifications 테이블이 성공적으로 auth.users 참조로 변경되었습니다.';

END $ $;