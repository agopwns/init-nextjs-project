/**
 * 알림 데이터베이스 모델
 * Supabase에서 notifications 테이블 구조를 정의합니다.
 */

export const notificationSchema = {
    id: 'string', // UUID
    type: 'enum', // 'new_reservation' | 'payment_completed' | 'cancellation' | 'system'
    title: 'string', // 알림 제목
    message: 'string', // 알림 내용
    data: 'json', // 추가 데이터 (예: reservationId, productId 등)
    isRead: 'boolean', // 읽음 여부
    recipientId: 'string', // 수신자 ID (관리자)
    createdAt: 'datetime',
    updatedAt: 'datetime'
}

/**
 * Supabase에서 실행할 SQL 스크립트
 * 
 * CREATE TABLE notifications (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   type VARCHAR(50) NOT NULL CHECK (type IN ('new_reservation', 'payment_completed', 'cancellation', 'system')),
 *   title VARCHAR(200) NOT NULL,
 *   message TEXT NOT NULL,
 *   data JSONB,
 *   is_read BOOLEAN DEFAULT FALSE,
 *   recipient_id UUID REFERENCES users(id),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- 실시간 업데이트를 위한 RLS 정책
 * ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Enable read access for authenticated users" ON notifications
 *   FOR SELECT USING (auth.role() = 'authenticated');
 * 
 * CREATE POLICY "Enable insert for authenticated users" ON notifications
 *   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
 * 
 * CREATE POLICY "Enable update for own notifications" ON notifications
 *   FOR UPDATE USING (recipient_id = auth.uid());
 * 
 * -- 실시간 알림을 위한 트리거 함수
 * CREATE OR REPLACE FUNCTION handle_new_notification()
 * RETURNS trigger AS $$
 * BEGIN
 *   PERFORM pg_notify('new_notification', NEW.id::text);
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * CREATE TRIGGER on_notification_created
 *   AFTER INSERT ON notifications
 *   FOR EACH ROW EXECUTE PROCEDURE handle_new_notification();
 */

export const notificationTypes = {
    NEW_RESERVATION: 'new_reservation',
    PAYMENT_COMPLETED: 'payment_completed',
    CANCELLATION: 'cancellation',
    SYSTEM: 'system'
}

export const createNotification = (type, title, message, data = {}, recipientId) => {
    return {
        type,
        title,
        message,
        data,
        isRead: false,
        recipientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
} 