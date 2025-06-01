-- auth.users 테이블만 사용하는 설정
-- 1. 기존 외래키 제약조건 제거
ALTER TABLE
    reservations DROP CONSTRAINT IF EXISTS reservations_user_id_fkey;

ALTER TABLE
    products DROP CONSTRAINT IF EXISTS products_created_by_fkey;

-- 2. profiles 테이블이 있다면 제거 (이미 없을 수도 있음)
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. 외래키 제약조건을 auth.users로 생성
ALTER TABLE
    reservations
ADD
    CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE
    products
ADD
    CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE
SET
    NULL;

-- 4. 기존 RLS 정책 제거
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;

DROP POLICY IF EXISTS "Users can create reservations" ON reservations;

DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;

DROP POLICY IF EXISTS "Admins can view all reservations" ON reservations;

DROP POLICY IF EXISTS "Admins can update all reservations" ON reservations;

DROP POLICY IF EXISTS "Admins can delete reservations" ON reservations;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;

DROP POLICY IF EXISTS "Admins can update payments" ON payments;

DROP POLICY IF EXISTS "Anyone can view active products" ON products;

DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- 5. 새로운 RLS 정책 생성 (auth.users만 사용)
-- PRODUCTS 정책
-- 모든 사용자가 활성화된 상품을 볼 수 있음
CREATE POLICY "Anyone can view active products" ON products FOR
SELECT
    USING (is_active = true);

-- 관리자는 모든 상품을 관리할 수 있음 (raw_app_meta_data에서 role 확인)
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- RESERVATIONS 정책
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
        (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 관리자는 모든 예약을 수정할 수 있음 (상태 변경 등)
CREATE POLICY "Admins can update all reservations" ON reservations FOR
UPDATE
    USING (
        (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 관리자는 예약을 삭제할 수 있음
CREATE POLICY "Admins can delete reservations" ON reservations FOR DELETE USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- PAYMENTS 정책
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
        (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 관리자는 결제 정보를 수정할 수 있음 (환불 처리 등)
CREATE POLICY "Admins can update payments" ON payments FOR
UPDATE
    USING (
        (auth.jwt() ->> 'role') = 'admin'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 6. 관리자 사용자 생성을 위한 함수 (선택사항)
CREATE
OR REPLACE FUNCTION create_admin_user(
    user_email TEXT,
    user_password TEXT,
    user_name TEXT DEFAULT NULL,
    user_phone TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $ $ DECLARE new_user_id UUID;

BEGIN -- 이 함수는 실제로는 Supabase Auth API를 통해 사용자를 생성해야 합니다.
-- 여기서는 참고용으로만 제공됩니다.
RAISE NOTICE 'Admin user should be created through Supabase Auth API with role metadata';

RETURN NULL;

END;

$ $;

-- 7. 외래키 제약조건 확인
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND (
        kcu.column_name LIKE '%user%'
        OR kcu.column_name = 'created_by'
    )
ORDER BY
    tc.table_name,
    kcu.column_name;

-- 8. RLS 정책 확인
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM
    pg_policies
WHERE
    tablename IN ('reservations', 'payments', 'products')
ORDER BY
    tablename,
    policyname;