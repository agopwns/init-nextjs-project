-- 예약 관리 테스트를 위한 샘플 데이터
-- 테스트용 고객 계정 생성
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
        'c1234567-1234-4567-8901-123456789011',
        'customer1@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '김철수',
        '010-1234-5678',
        'customer',
        true
    ),
    (
        'c1234567-1234-4567-8901-123456789012',
        'customer2@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '이영희',
        '010-9876-5432',
        'customer',
        true
    ),
    (
        'c1234567-1234-4567-8901-123456789013',
        'customer3@example.com',
        '$2b$10$6V8D.kpOYkT.JZxvEeOqLOJ4x3n6rR8yTgPX8dVL.abV2F3KJGhiW',
        '박민수',
        '010-5555-7777',
        'customer',
        true
    ),
    (
        'c1234567-1234-4567-8901-123456789014',
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
        'r1234567-1234-4567-8901-123456789011',
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        'c1234567-1234-4567-8901-123456789011',
        -- 김철수
        '2024-12-20 14:00:00+09',
        2,
        90000.00,
        'pending',
        '처음 하는 카약이라 조금 걱정됩니다. 안전하게 잘 부탁드려요!',
        NOW() - INTERVAL '1 day'
    ),
    (
        'r1234567-1234-4567-8901-123456789012',
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 제주도 승마 체험
        'c1234567-1234-4567-8901-123456789012',
        -- 이영희
        '2024-12-22 10:00:00+09',
        1,
        80000.00,
        'pending',
        '말을 무서워하는데 괜찮을까요?',
        NOW() - INTERVAL '2 hours'
    ),
    (
        'r1234567-1234-4567-8901-123456789013',
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 패러글라이딩
        'c1234567-1234-4567-8901-123456789013',
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
        'r1234567-1234-4567-8901-123456789014',
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 부산 서핑 레슨
        'c1234567-1234-4567-8901-123456789014',
        -- 정수진
        '2024-12-18 09:00:00+09',
        1,
        65000.00,
        'confirmed',
        '서핑보드는 어떤 걸로 준비해주시나요?',
        NOW() - INTERVAL '3 days'
    ),
    (
        'r1234567-1234-4567-8901-123456789015',
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 경주 문화유산 투어
        'c1234567-1234-4567-8901-123456789011',
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
        'r1234567-1234-4567-8901-123456789016',
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 전주 한옥마을 전통체험
        'c1234567-1234-4567-8901-123456789012',
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
        'r1234567-1234-4567-8901-123456789017',
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        'c1234567-1234-4567-8901-123456789013',
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
        'p1234567-1234-4567-8901-123456789011',
        'r1234567-1234-4567-8901-123456789014',
        65000.00,
        'KRW',
        'card',
        'toss',
        'toss_payment_12345',
        'completed',
        NOW() - INTERVAL '3 days'
    ),
    (
        'p1234567-1234-4567-8901-123456789012',
        'r1234567-1234-4567-8901-123456789015',
        105000.00,
        'KRW',
        'transfer',
        'bank',
        'bank_transfer_67890',
        'completed',
        NOW() - INTERVAL '2 days'
    ),
    (
        'p1234567-1234-4567-8901-123456789013',
        'r1234567-1234-4567-8901-123456789017',
        45000.00,
        'KRW',
        'mobile',
        'kakaopay',
        'kakao_12345abcde',
        'completed',
        NOW() - INTERVAL '1 week'
    );

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