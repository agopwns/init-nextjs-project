-- Supabase Storage 설정
-- 이미지 저장을 위한 버킷 생성 및 정책 설정
-- 1. 이미지 저장용 버킷 생성
INSERT INTO
    storage.buckets (id, name, public)
VALUES
    ('images', 'images', true);

-- 2. 버킷 정책 설정 (공개 읽기 허용)
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT
    USING (bucket_id = 'images');

-- 3. 관리자 업로드 권한 설정
CREATE POLICY "Admin Upload" ON storage.objects FOR
INSERT
    WITH CHECK (
        bucket_id = 'images'
        AND EXISTS (
            SELECT
                1
            FROM
                auth.users
            WHERE
                auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- 4. 관리자 업데이트 권한 설정
CREATE POLICY "Admin Update" ON storage.objects FOR
UPDATE
    USING (
        bucket_id = 'images'
        AND EXISTS (
            SELECT
                1
            FROM
                auth.users
            WHERE
                auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- 5. 관리자 삭제 권한 설정
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'images'
    AND EXISTS (
        SELECT
            1
        FROM
            auth.users
        WHERE
            auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- 6. 파일 크기 제한 (5MB)
-- 이는 클라이언트 사이드에서 처리됩니다
-- 7. 지원 파일 형식 확인
-- 클라이언트 사이드에서 MIME 타입 검증: image/jpeg, image/jpg, image/png, image/webp
-- 버킷 확인
SELECT
    *
FROM
    storage.buckets
WHERE
    id = 'images';

-- 정책 확인
SELECT
    *
FROM
    storage.policies
WHERE
    bucket_id = 'images';