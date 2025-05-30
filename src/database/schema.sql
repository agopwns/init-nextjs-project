-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users 테이블
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products 테이블
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    -- minutes
    category VARCHAR(100),
    images TEXT [],
    -- array of image URLs
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER DEFAULT 1,
    location VARCHAR(255),
    requirements TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations 테이블
CREATE TABLE reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reservation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    participants INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'cancelled', 'completed')
    ),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments 테이블
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KRW',
    payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'transfer', 'mobile')),
    payment_provider VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'completed', 'failed', 'refunded')
    ),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability 테이블
CREATE TABLE availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slots TEXT [],
    -- available time slots
    max_bookings INTEGER DEFAULT 1,
    current_bookings INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, date)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_products_is_active ON products(is_active);

CREATE INDEX idx_reservations_date ON reservations(reservation_date);

CREATE INDEX idx_reservations_status ON reservations(status);

CREATE INDEX idx_availability_date ON availability(date);

-- RLS (Row Level Security) 활성화
ALTER TABLE
    users ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    products ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    reservations ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    availability ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- Users 정책: 사용자는 자신의 정보만 볼 수 있음
CREATE POLICY "Users can view own profile" ON users FOR
SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE
    USING (auth.uid() = id);

-- Products 정책: 모든 사용자가 활성화된 상품을 볼 수 있음
CREATE POLICY "Anyone can view active products" ON products FOR
SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
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

-- Reservations 정책: 사용자는 자신의 예약만 볼 수 있음
CREATE POLICY "Users can view own reservations" ON reservations FOR
SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON reservations FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

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

-- Payments 정책: 사용자는 자신의 결제 정보만 볼 수 있음
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

-- Availability 정책: 모든 사용자가 가용성을 볼 수 있음
CREATE POLICY "Anyone can view availability" ON availability FOR
SELECT
    USING (true);

-- Trigger functions for updated_at
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE
UPDATE
    ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE
UPDATE
    ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE
UPDATE
    ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE
UPDATE
    ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();