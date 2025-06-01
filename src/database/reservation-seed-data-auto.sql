-- 예약 관리 테스트를 위한 샘플 데이터 (자동 UUID 생성 버전)
-- 테스트용 고객 계정 생성
DO $ $ DECLARE customer1_id UUID := uuid_generate_v4();

customer2_id UUID := uuid_generate_v4();

customer3_id UUID := uuid_generate_v4();

customer4_id UUID := uuid_generate_v4();

reservation1_id UUID := uuid_generate_v4();

reservation2_id UUID := uuid_generate_v4();

reservation3_id UUID := uuid_generate_v4();

reservation4_id UUID := uuid_generate_v4();

reservation5_id UUID := uuid_generate_v4();

reservation6_id UUID := uuid_generate_v4();

reservation7_id UUID := uuid_generate_v4();

BEGIN -- 고객 계정 생성
INSERT INTO
    users (
        id,
        email,
        password,
        name,
        phone,
        role,
        is_verified
    )
VALUES
    (
        customer1_id,
        'customer1@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '김철수',
        '010-1234-5678',
        'customer',
        true
    ),
    (
        customer2_id,
        'customer2@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '이영희',
        '010-9876-5432',
        'customer',
        true
    ),
    (
        customer3_id,
        'customer3@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '박민수',
        '010-5555-7777',
        'customer',
        true
    ),
    (
        customer4_id,
        'customer4@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '정수진',
        '010-3333-9999',
        'customer',
        true
    ) ON CONFLICT (email) DO NOTHING;

-- 샘플 예약 데이터 삽입
INSERT INTO
    reservations (
        id,
        product_id,
        user_id,
        reservation_date,
        participants,
        total_amount,
        status,
        special_requests,
        created_at
    )
VALUES
    -- 대기 중인 예약들
    (
        reservation1_id,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        customer1_id,
        -- 김철수
        '2024-12-20 14:00:00+09',
        2,
        90000.00,
        'pending',
        '처음 하는 카약이라 조금 걱정됩니다. 안전하게 잘 부탁드려요!',
        NOW() - INTERVAL '1 day'
    ),
    (
        reservation2_id,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 제주도 승마 체험
        customer2_id,
        -- 이영희
        '2024-12-22 10:00:00+09',
        1,
        80000.00,
        'pending',
        '말을 무서워하는데 괜찮을까요?',
        NOW() - INTERVAL '2 hours'
    ),
    (
        reservation3_id,
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 패러글라이딩
        customer3_id,
        -- 박민수
        '2024-12-25 11:00:00+09',
        2,
        240000.00,
        'pending',
        '친구와 함께 가는데 같이 탈 수 있나요?',
        NOW() - INTERVAL '30 minutes'
    ),
    -- 확정된 예약들
    (
        reservation4_id,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 부산 서핑 레슨
        customer4_id,
        -- 정수진
        '2024-12-18 09:00:00+09',
        1,
        65000.00,
        'confirmed',
        '서핑보드는 어떤 걸로 준비해주시나요?',
        NOW() - INTERVAL '3 days'
    ),
    (
        reservation5_id,
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 경주 문화유산 투어
        customer1_id,
        -- 김철수
        '2024-12-19 13:00:00+09',
        3,
        105000.00,
        'confirmed',
        '가족 여행입니다. 아이들에게 설명도 쉽게 해주세요.',
        NOW() - INTERVAL '2 days'
    ),
    -- 취소된 예약
    (
        reservation6_id,
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 전주 한옥마을 전통체험
        customer2_id,
        -- 이영희
        '2024-12-17 15:00:00+09',
        2,
        56000.00,
        'cancelled',
        '일정이 급하게 변경되어 취소합니다.',
        NOW() - INTERVAL '4 days'
    ),
    -- 완료된 예약
    (
        reservation7_id,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        customer3_id,
        -- 박민수
        '2024-12-10 16:00:00+09',
        1,
        45000.00,
        'completed',
        NULL,
        NOW() - INTERVAL '1 week'
    );

-- 샘플 결제 데이터 삽입 (확정된 예약과 완료된 예약에 대해서만)
INSERT INTO
    payments (
        id,
        reservation_id,
        amount,
        currency,
        payment_method,
        payment_provider,
        transaction_id,
        status,
        paid_at
    )
VALUES
    (
        uuid_generate_v4(),
        reservation4_id,
        65000.00,
        'KRW',
        'card',
        'toss',
        'toss_payment_12345',
        'completed',
        NOW() - INTERVAL '3 days'
    ),
    (
        uuid_generate_v4(),
        reservation5_id,
        105000.00,
        'KRW',
        'transfer',
        'bank',
        'bank_transfer_67890',
        'completed',
        NOW() - INTERVAL '2 days'
    ),
    (
        uuid_generate_v4(),
        reservation7_id,
        45000.00,
        'KRW',
        'mobile',
        'kakaopay',
        'kakao_12345abcde',
        'completed',
        NOW() - INTERVAL '1 week'
    );

END $ $;

-- 삽입된 예약 데이터 확인
SELECT
    r.id,
    r.status,
    u.name as customer_name,
    p.title as product_title,
    r.reservation_date,
    r.participants,
    r.total_amount,
    r.created_at
FROM
    reservations r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN products p ON r.product_id = p.id
ORDER BY
    r.created_at DESC;