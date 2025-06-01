-- 알림 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'new_reservation',
            'payment_completed',
            'cancellation',
            'system'
        )
    ),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS (Row Level Security) 활성화
ALTER TABLE
    notifications ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
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

-- 업데이트 트리거 함수
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

-- 업데이트 트리거 적용
CREATE TRIGGER update_notifications_updated_at BEFORE
UPDATE
    ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Realtime 활성화 (실시간 알림을 위해)
ALTER publication supabase_realtime
ADD
    TABLE notifications;

-- 실시간 알림을 위한 트리거 함수 (선택사항 - PostgreSQL NOTIFY 사용)
CREATE
OR REPLACE FUNCTION handle_new_notification() RETURNS trigger AS $ $ BEGIN -- PostgreSQL NOTIFY로 실시간 알림 전송
PERFORM pg_notify('new_notification', row_to_json(NEW) :: text);

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

-- 새 알림 생성 시 트리거 실행
CREATE TRIGGER on_notification_created
AFTER
INSERT
    ON notifications FOR EACH ROW EXECUTE FUNCTION handle_new_notification();