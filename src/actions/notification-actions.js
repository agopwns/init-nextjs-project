import { createServerClient } from '@/lib/supabase'
import { notificationTypes } from '@/database/models/notification'

// 관리자 사용자 조회 함수 (auth.users 기반)
async function getAdminUsers(supabase) {
    try {
        // auth.users에서 관리자 역할을 가진 사용자들 조회
        const { data, error } = await supabase.auth.admin.listUsers()

        if (error) {
            console.error('Error fetching users:', error)
            return { success: false, error: error.message }
        }

        // 관리자 역할을 가진 사용자들 필터링
        const adminUsers = data.users.filter(user =>
            user.user_metadata?.role === 'admin' ||
            user.app_metadata?.role === 'admin'
        )

        if (adminUsers.length === 0) {
            console.warn('No admin users found')
            return { success: false, error: 'No admin users found' }
        }

        return { success: true, users: adminUsers.map(user => ({ id: user.id })) }

    } catch (error) {
        console.error('Error in getAdminUsers:', error)
        return { success: false, error: error.message }
    }
}

// 결제 완료 알림 생성
export async function createPaymentCompletedNotification(reservationData) {
    try {
        const supabase = createServerClient()

        // 관리자 사용자 조회
        const adminResult = await getAdminUsers(supabase)

        if (!adminResult.success) {
            console.error('Error fetching admin users:', adminResult.error)
            return { success: false, error: adminResult.error }
        }

        const adminUsers = adminResult.users

        // 각 관리자에게 알림 생성
        const notifications = adminUsers.map(admin => ({
            type: notificationTypes.PAYMENT_COMPLETED,
            title: '새로운 예약이 확정되었습니다!',
            message: `${reservationData.customerName}님의 "${reservationData.productName}" 예약이 결제 완료되어 확정되었습니다.`,
            data: {
                reservationId: reservationData.id,
                productId: reservationData.productId,
                productName: reservationData.productName,
                customerName: reservationData.customerName,
                customerEmail: reservationData.customerEmail,
                amount: reservationData.totalAmount,
                reservationDate: reservationData.reservationDate,
                participants: reservationData.participants
            },
            is_read: false,
            recipient_id: admin.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }))

        // 알림 일괄 저장
        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select()

        if (error) {
            console.error('Error creating notifications:', error)
            return { success: false, error: error.message }
        }

        console.log(`Created ${data.length} payment completion notifications`)
        return { success: true, notifications: data }

    } catch (error) {
        console.error('Error in createPaymentCompletedNotification:', error)
        return { success: false, error: error.message }
    }
}

// 새 예약 알림 생성
export async function createNewReservationNotification(reservationData) {
    try {
        const supabase = createServerClient()

        // 관리자 사용자 조회
        const adminResult = await getAdminUsers(supabase)

        if (!adminResult.success) {
            console.error('Error fetching admin users:', adminResult.error)
            return { success: false, error: adminResult.error }
        }

        const adminUsers = adminResult.users

        // 각 관리자에게 알림 생성
        const notifications = adminUsers.map(admin => ({
            type: notificationTypes.NEW_RESERVATION,
            title: '새로운 예약 요청이 생성되었습니다',
            message: `${reservationData.customerName}님이 "${reservationData.productName}" 예약을 요청했습니다.`,
            data: {
                reservationId: reservationData.id,
                productId: reservationData.productId,
                productName: reservationData.productName,
                customerName: reservationData.customerName,
                customerEmail: reservationData.customerEmail,
                reservationDate: reservationData.reservationDate,
                participants: reservationData.participants,
                status: reservationData.status
            },
            is_read: false,
            recipient_id: admin.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }))

        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select()

        if (error) {
            console.error('Error creating notifications:', error)
            return { success: false, error: error.message }
        }

        return { success: true, notifications: data }

    } catch (error) {
        console.error('Error in createNewReservationNotification:', error)
        return { success: false, error: error.message }
    }
}

// 예약 취소 알림 생성
export async function createReservationCancellationNotification(reservationData) {
    try {
        const supabase = createServerClient()

        // 관리자 사용자 조회
        const adminResult = await getAdminUsers(supabase)

        if (!adminResult.success) {
            console.error('Error fetching admin users:', adminResult.error)
            return { success: false, error: adminResult.error }
        }

        const adminUsers = adminResult.users

        // 각 관리자에게 알림 생성
        const notifications = adminUsers.map(admin => ({
            type: notificationTypes.CANCELLATION,
            title: '예약이 취소되었습니다',
            message: `${reservationData.customerName}님의 "${reservationData.productName}" 예약이 취소되었습니다.`,
            data: {
                reservationId: reservationData.id,
                productId: reservationData.productId,
                productName: reservationData.productName,
                customerName: reservationData.customerName,
                customerEmail: reservationData.customerEmail,
                reservationDate: reservationData.reservationDate,
                participants: reservationData.participants,
                cancelReason: reservationData.cancelReason
            },
            is_read: false,
            recipient_id: admin.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }))

        const { data, error } = await supabase
            .from('notifications')
            .insert(notifications)
            .select()

        if (error) {
            console.error('Error creating notifications:', error)
            return { success: false, error: error.message }
        }

        return { success: true, notifications: data }

    } catch (error) {
        console.error('Error in createReservationCancellationNotification:', error)
        return { success: false, error: error.message }
    }
} 