-- auth.users를 사용하는 예약 샘플 데이터
-- 참고: 실제 auth.users에 사용자가 먼저 생성되어 있어야 합니다.
-- 샘플 예약 데이터 삽입 (임시 UUID 사용)
-- 실제 환경에서는 auth.users에 존재하는 UUID를 사용해야 합니다.
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
    -- 대기 중인 예약들 (UUID 직접 생성)
    (
        uuid_generate_v4(),
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        uuid_generate_v4(),
        -- 임시 사용자 ID (실제로는 auth.users의 ID 사용)
        '2024-12-20 14:00:00+09',
        2,
        90000.00,
        'pending',
        '처음 하는 카약이라 조금 걱정됩니다. 안전하게 잘 부탁드려요!',
        NOW() - INTERVAL '1 day'
    ),
    (
        uuid_generate_v4(),
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 제주도 승마 체험
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-22 10:00:00+09',
        1,
        80000.00,
        'pending',
        '말을 무서워하는데 괜찮을까요?',
        NOW() - INTERVAL '2 hours'
    ),
    (
        uuid_generate_v4(),
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 패러글라이딩
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-25 11:00:00+09',
        2,
        240000.00,
        'pending',
        '친구와 함께 가는데 같이 탈 수 있나요?',
        NOW() - INTERVAL '30 minutes'
    ),
    -- 확정된 예약들
    (
        uuid_generate_v4(),
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 부산 서핑 레슨
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-18 09:00:00+09',
        1,
        65000.00,
        'confirmed',
        '서핑보드는 어떤 걸로 준비해주시나요?',
        NOW() - INTERVAL '3 days'
    ),
    (
        uuid_generate_v4(),
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 경주 문화유산 투어
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-19 13:00:00+09',
        3,
        105000.00,
        'confirmed',
        '가족 여행입니다. 아이들에게 설명도 쉽게 해주세요.',
        NOW() - INTERVAL '2 days'
    ),
    -- 취소된 예약
    (
        uuid_generate_v4(),
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 전주 한옥마을 전통체험
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-17 15:00:00+09',
        2,
        56000.00,
        'cancelled',
        '일정이 급하게 변경되어 취소합니다.',
        NOW() - INTERVAL '4 days'
    ),
    -- 완료된 예약
    (
        uuid_generate_v4(),
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        -- 한강 카약 체험
        uuid_generate_v4(),
        -- 임시 사용자 ID
        '2024-12-10 16:00:00+09',
        1,
        45000.00,
        'completed',
        NULL,
        NOW() - INTERVAL '1 week'
    );

-- 샘플 결제 데이터는 예약 ID와 함께 생성
DO $ $ DECLARE confirmed_reservations UUID [];

completed_reservations UUID [];

BEGIN -- 확정된 예약들의 ID 가져오기
SELECT
    ARRAY(
        SELECT
            id
        FROM
            reservations
        WHERE
            status = 'confirmed'
        ORDER BY
            created_at DESC
        LIMIT
            2
    ) INTO confirmed_reservations;

-- 완료된 예약들의 ID 가져오기
SELECT
    ARRAY(
        SELECT
            id
        FROM
            reservations
        WHERE
            status = 'completed'
        ORDER BY
            created_at DESC
        LIMIT
            1
    ) INTO completed_reservations;

-- 확정된 예약들에 대한 결제 데이터 삽입
IF array_length(confirmed_reservations, 1) > 0 THEN
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
SELECT
    uuid_generate_v4(),
    unnest(confirmed_reservations),
    CASE
        WHEN row_number() OVER() = 1 THEN 65000.00
        ELSE 105000.00
    END,
    'KRW',
    CASE
        WHEN row_number() OVER() = 1 THEN 'card'
        ELSE 'transfer'
    END,
    CASE
        WHEN row_number() OVER() = 1 THEN 'toss'
        ELSE 'bank'
    END,
    'payment_' || generate_random_uuid() :: text,
    'completed',
    NOW() - INTERVAL '2 days';

END IF;

-- 완료된 예약들에 대한 결제 데이터 삽입
IF array_length(completed_reservations, 1) > 0 THEN
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
SELECT
    uuid_generate_v4(),
    unnest(completed_reservations),
    45000.00,
    'KRW',
    'mobile',
    'kakaopay',
    'kakao_' || generate_random_uuid() :: text,
    'completed',
    NOW() - INTERVAL '1 week';

END IF;

END $ $;

-- 삽입된 예약 데이터 확인
SELECT
    r.id,
    r.status,
    r.user_id,
    p.title as product_title,
    r.reservation_date,
    r.participants,
    r.total_amount,
    r.created_at
FROM
    reservations r
    LEFT JOIN products p ON r.product_id = p.id
ORDER BY
    r.created_at DESC;

-- 외래키 제약조건 확인
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
    AND tc.table_name = 'reservations'
ORDER BY
    tc.table_name,
    kcu.column_name;