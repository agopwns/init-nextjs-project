-- UUID 확장 기능 활성화 (이미 활성화되어 있다면 무시됨)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Payments 테이블 생성
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KRW' NOT NULL,
    payment_method VARCHAR(20) CHECK (
        payment_method IN ('card', 'transfer', 'mobile', 'virtual_account')
    ),
    payment_provider VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'completed', 'failed', 'refunded')
    ),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);

CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_payments_created_at ON payments(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE
    payments ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 예약과 연관된 결제 정보만 볼 수 있음
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
                auth.users
            WHERE
                auth.users.id = auth.uid()
                AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- 시스템에서만 결제 정보 삽입/수정 가능 (서비스 키 사용)
CREATE POLICY "System can manage payments" ON payments FOR ALL USING (auth.role() = 'service_role');

-- updated_at 자동 업데이트 트리거 함수 (이미 존재하는 경우 무시)
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ language 'plpgsql';

-- updated_at 트리거 적용
CREATE TRIGGER update_payments_updated_at BEFORE
UPDATE
    ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 삽입 확인을 위한 샘플 조회
-- 테이블 구조 확인
\ d payments;

-- 현재 payments 테이블의 데이터 확인
SELECT
    id,
    reservation_id,
    amount,
    currency,
    payment_method,
    payment_provider,
    transaction_id,
    status,
    paid_at,
    created_at,
    updated_at
FROM
    payments
ORDER BY
    created_at DESC
LIMIT
    5;