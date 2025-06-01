-- 예약 관리를 위한 RLS 정책 업데이트
-- 기존 예약 정책 삭제
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;

DROP POLICY IF EXISTS "Users can create reservations" ON reservations;

DROP POLICY IF EXISTS "Admins can view all reservations" ON reservations;

-- 새로운 예약 정책 생성
-- 사용자는 자신의 예약만 볼 수 있음
CREATE POLICY "Users can view own reservations" ON reservations FOR
SELECT
    USING (auth.uid() = user_id);

-- 사용자는 예약을 생성할 수 있음
CREATE POLICY "Users can create reservations" ON reservations FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 예약을 수정할 수 있음 (취소 등)
CREATE POLICY "Users can update own reservations" ON reservations FOR
UPDATE
    USING (auth.uid() = user_id);

-- 관리자는 모든 예약을 볼 수 있음
CREATE POLICY "Admins can view all reservations" ON reservations FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                users
            WHERE
                users.id = auth.uid()
                AND users.role = 'admin'
        )
    );

-- 관리자는 모든 예약을 수정할 수 있음 (상태 변경 등)
CREATE POLICY "Admins can update all reservations" ON reservations FOR
UPDATE
    USING (
        EXISTS (
            SELECT
                1
            FROM
                users
            WHERE
                users.id = auth.uid()
                AND users.role = 'admin'
        )
    );

-- 관리자는 예약을 삭제할 수 있음
CREATE POLICY "Admins can delete reservations" ON reservations FOR DELETE USING (
    EXISTS (
        SELECT
            1
        FROM
            users
        WHERE
            users.id = auth.uid()
            AND users.role = 'admin'
    )
);

-- 결제 정책도 업데이트 (관리자가 결제 정보를 볼 수 있도록)
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

-- 사용자는 자신의 결제 정보만 볼 수 있음
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

-- 관리자는 모든 결제 정보를 볼 수 있음
CREATE POLICY "Admins can view all payments" ON payments FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                users
            WHERE
                users.id = auth.uid()
                AND users.role = 'admin'
        )
    );

-- 관리자는 결제 정보를 수정할 수 있음 (환불 처리 등)
CREATE POLICY "Admins can update payments" ON payments FOR
UPDATE
    USING (
        EXISTS (
            SELECT
                1
            FROM
                users
            WHERE
                users.id = auth.uid()
                AND users.role = 'admin'
        )
    );