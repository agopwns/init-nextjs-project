-- 결제 테이블의 status 필드에 부분 환불 상태 추가
ALTER TABLE
    payments DROP CONSTRAINT IF EXISTS payments_status_check;

-- 새로운 체크 제약조건 추가 (부분 환불 포함)
ALTER TABLE
    payments
ADD
    CONSTRAINT payments_status_check CHECK (
        status IN (
            'pending',
            'completed',
            'failed',
            'refunded',
            'partially_refunded'
        )
    );

-- 기존 데이터 확인 (선택사항)
SELECT
    DISTINCT status
FROM
    payments;