-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

DROP POLICY IF EXISTS "System can manage payments" ON payments;

-- 새로운 RLS 정책 설정
-- 1. 사용자는 자신의 예약과 연관된 결제 정보만 볼 수 있음
CREATE POLICY "Users can view own payments" ON payments FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                reservations
            WHERE
                reservations.id = payments.reservation_id
                AND reservations.user_id = auth.uid()
        )
    );

-- 2. 서비스 역할(service_role)은 모든 작업 가능 (API에서 사용)
CREATE POLICY "Service role can manage payments" ON payments FOR ALL USING (auth.role() = 'service_role');

-- 3. 인증된 사용자는 자신의 결제 정보 삽입 가능 (필요한 경우)
CREATE POLICY "Users can insert own payments" ON payments FOR
INSERT
    WITH CHECK (
        EXISTS (
            SELECT
                1
            FROM
                reservations
            WHERE
                reservations.id = payments.reservation_id
                AND reservations.user_id = auth.uid()
        )
    );

-- 4. 관리자 정책은 별도 테이블이나 다른 방식으로 관리
-- (users 테이블 대신 별도 관리자 확인 방법 필요시 추가)
-- 권한 확인을 위한 샘플 쿼리
-- 현재 RLS 정책 확인
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename = 'payments';

-- 테이블 권한 확인
SELECT
    table_name,
    privilege_type,
    is_grantable
FROM
    information_schema.table_privileges
WHERE
    table_name = 'payments';