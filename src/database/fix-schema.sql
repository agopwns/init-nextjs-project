-- 1. 기존 외래키 제약 조건 제거
ALTER TABLE
    reservations DROP CONSTRAINT IF EXISTS reservations_user_id_fkey;

-- 2. auth.users를 참조하는 새로운 외래키 제약 조건 추가
ALTER TABLE
    reservations
ADD
    CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. RLS 정책도 auth.uid()를 사용하도록 이미 설정되어 있으므로 변경 불필요
-- 4. products 테이블의 created_by도 같은 방식으로 수정
ALTER TABLE
    products DROP CONSTRAINT IF EXISTS products_created_by_fkey;

ALTER TABLE
    products
ADD
    CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE
SET
    NULL;

-- 5. 기존 public.users 테이블이 불필요하다면 제거 (선택사항)
-- DROP TABLE IF EXISTS users CASCADE;