-- 테스트용 관리자 계정 생성 (이미 있다면 무시)
INSERT INTO
    users (id, email, password, name, role, is_verified)
VALUES
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'admin@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        -- password: admin123
        '관리자',
        'admin',
        true
    ) ON CONFLICT (email) DO NOTHING;

-- 테스트용 상품 데이터 삽입
INSERT INTO
    products (
        id,
        title,
        description,
        price,
        duration,
        category,
        images,
        is_active,
        max_participants,
        location,
        requirements,
        created_by
    )
VALUES
    (
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '서울 한강 카약 체험',
        '아름다운 한강에서 즐기는 카약 체험! 초보자도 안전하게 즐길 수 있는 가이드 동반 프로그램입니다.',
        45000.00,
        120,
        '수상스포츠',
        ARRAY ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'],
        true,
        8,
        '서울 한강공원',
        '수영 가능자, 만 12세 이상',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ),
    (
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '제주도 승마 체험',
        '제주의 아름다운 자연 속에서 말과 함께하는 특별한 시간을 보내세요. 전문 강사가 안전하게 지도합니다.',
        80000.00,
        90,
        '승마',
        ARRAY ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop'],
        true,
        6,
        '제주도 한림읍',
        '만 10세 이상, 체중 80kg 이하',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ),
    (
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '부산 서핑 레슨',
        '부산 해운대에서 즐기는 서핑 레슨! 보드와 웻슈트 모두 제공되며, 전문 강사의 1:1 맞춤 지도를 받을 수 있습니다.',
        65000.00,
        150,
        '서핑',
        ARRAY ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop'],
        true,
        4,
        '부산 해운대해수욕장',
        '수영 가능자, 만 14세 이상',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ),
    (
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '강원도 패러글라이딩',
        '강원도의 아름다운 산맥을 하늘에서 내려다보는 패러글라이딩 체험! 안전장비 완비 및 전문 파일럿 동반.',
        120000.00,
        180,
        '항공스포츠',
        ARRAY ['https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop'],
        true,
        2,
        '강원도 평창군',
        '만 16세 이상, 체중 45-90kg',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ),
    (
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '경주 문화유산 투어',
        '천년 고도 경주의 역사와 문화를 체험하는 가이드 투어. 불국사, 석굴암, 첨성대 등 주요 문화재를 둘러봅니다.',
        35000.00,
        240,
        '문화체험',
        ARRAY ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
        true,
        15,
        '경주시 일원',
        '연령 제한 없음',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    ),
    (
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '전주 한옥마을 전통체험',
        '전주 한옥마을에서 즐기는 전통 문화 체험! 한복 입기, 전통차 마시기, 한지 공예 등 다양한 활동을 즐겨보세요.',
        28000.00,
        180,
        '문화체험',
        ARRAY ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],
        true,
        12,
        '전주 한옥마을',
        '연령 제한 없음',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    );

-- 삽입된 데이터 확인
SELECT
    id,
    title,
    category,
    price,
    duration,
    max_participants,
    is_active,
    created_at
FROM
    products
ORDER BY
    created_at DESC;