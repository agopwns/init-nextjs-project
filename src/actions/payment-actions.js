'use server'

import { createServerClient } from '@/lib/supabase'
import { getUsersInfo } from './user-actions'

// Portone V2 API를 통한 결제 상태 조회
export async function getPaymentStatus(paymentId) {
    try {
        if (!process.env.PORTONE_V2_API_SECRET) {
            return {
                success: false,
                error: 'Portone API 설정이 누락되었습니다.'
            }
        }

        // Portone API로 결제 상태 조회
        const response = await fetch(
            `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
            {
                headers: {
                    Authorization: `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
                },
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Portone API 오류:', errorText)
            return {
                success: false,
                error: `결제 정보 조회 실패: ${response.status}`
            }
        }

        const paymentData = await response.json()

        return {
            success: true,
            data: paymentData
        }
    } catch (error) {
        console.error('결제 상태 조회 오류:', error)
        return {
            success: false,
            error: '결제 상태 조회 중 오류가 발생했습니다.'
        }
    }
}

// Portone V2 API를 통한 환불 처리
export async function processRefund(paymentId, refundAmount, reason = '관리자 환불') {
    try {
        if (!process.env.PORTONE_V2_API_SECRET) {
            return {
                success: false,
                error: 'Portone API 설정이 누락되었습니다.'
            }
        }

        const supabase = createServerClient()

        // 1. 먼저 결제 정보 조회
        const paymentStatusResult = await getPaymentStatus(paymentId)
        if (!paymentStatusResult.success) {
            return paymentStatusResult
        }

        const paymentData = paymentStatusResult.data

        // 2. 결제 상태 확인 (완료된 결제만 환불 가능)
        if (paymentData.status !== 'PAID') {
            return {
                success: false,
                error: '완료된 결제만 환불이 가능합니다.'
            }
        }

        // 3. 환불 가능 금액 확인
        const paidAmount = paymentData.amount?.total || 0
        const currentRefundAmount = paymentData.cashReceipt?.totalAmount || 0
        const availableAmount = paidAmount - currentRefundAmount

        if (refundAmount > availableAmount) {
            return {
                success: false,
                error: `환불 가능 금액을 초과했습니다. (가능: ₩${availableAmount.toLocaleString()})`
            }
        }

        // 4. Portone API로 환불 요청
        const refundResponse = await fetch(
            `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reason: reason,
                    amount: refundAmount,
                    currency: 'KRW'
                })
            }
        )

        if (!refundResponse.ok) {
            const errorText = await refundResponse.text()
            console.error('환불 API 오류:', errorText)
            return {
                success: false,
                error: `환불 처리 실패: ${refundResponse.status}`
            }
        }

        const refundData = await refundResponse.json()

        // 5. 데이터베이스 업데이트
        // 결제 상태 업데이트
        const { error: paymentUpdateError } = await supabase
            .from('payments')
            .update({
                status: refundAmount === paidAmount ? 'refunded' : 'partially_refunded',
                updated_at: new Date().toISOString()
            })
            .eq('transaction_id', paymentId)

        if (paymentUpdateError) {
            console.error('결제 상태 업데이트 오류:', paymentUpdateError)
            // 환불은 성공했지만 DB 업데이트 실패
        }

        // 6. 예약 상태 업데이트 (전액 환불인 경우 예약 취소)
        if (refundAmount === paidAmount) {
            const { data: payment } = await supabase
                .from('payments')
                .select('reservation_id')
                .eq('transaction_id', paymentId)
                .single()

            if (payment) {
                await supabase
                    .from('reservations')
                    .update({
                        status: 'cancelled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', payment.reservation_id)
            }
        }

        return {
            success: true,
            data: refundData,
            message: `₩${refundAmount.toLocaleString()} 환불이 완료되었습니다.`
        }

    } catch (error) {
        console.error('환불 처리 오류:', error)
        return {
            success: false,
            error: '환불 처리 중 오류가 발생했습니다.'
        }
    }
}

// 결제 목록 조회 (관리자용)
export async function getPayments(filters = {}) {
    try {
        const supabase = createServerClient()

        let query = supabase
            .from('payments')
            .select(`
                *,
                reservations (
                    id,
                    reservation_date,
                    participants,
                    status,
                    user_id,
                    products (
                        title
                    )
                )
            `)
            .order('created_at', { ascending: false })

        // 필터 적용
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        if (filters.payment_method && filters.payment_method !== 'all') {
            query = query.eq('payment_method', filters.payment_method)
        }

        if (filters.date) {
            const startDate = new Date(filters.date)
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 1)

            query = query
                .gte('created_at', startDate.toISOString())
                .lt('created_at', endDate.toISOString())
        }

        if (filters.transaction_id) {
            query = query.ilike('transaction_id', `%${filters.transaction_id}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('결제 목록 조회 오류:', error)
            return {
                success: false,
                error: '결제 목록을 불러오는데 실패했습니다.'
            }
        }

        // 사용자 ID 수집
        const userIds = data
            ?.filter(payment => payment.reservations?.user_id)
            .map(payment => payment.reservations.user_id) || []

        // 사용자 정보 조회
        let usersData = {}
        if (userIds.length > 0) {
            const usersResult = await getUsersInfo(userIds)
            if (usersResult.success) {
                usersData = usersResult.data
            }
        }

        // 사용자 정보 추가
        const paymentsWithUsers = data?.map(payment => ({
            ...payment,
            reservations: payment.reservations ? {
                ...payment.reservations,
                users: usersData[payment.reservations.user_id] || {
                    name: `사용자-${payment.reservations.user_id?.slice(0, 8)}`,
                    email: `user-${payment.reservations.user_id?.slice(0, 8)}@example.com`
                }
            } : null
        })) || []

        return {
            success: true,
            data: paymentsWithUsers
        }
    } catch (error) {
        console.error('결제 목록 조회 오류:', error)
        return {
            success: false,
            error: '결제 목록 조회 중 오류가 발생했습니다.'
        }
    }
}

// 결제 통계 조회
export async function getPaymentStats() {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('payments')
            .select('status, amount')

        if (error) {
            console.error('결제 통계 조회 오류:', error)
            return {
                success: false,
                error: '결제 통계를 불러오는데 실패했습니다.'
            }
        }

        const stats = {
            total: data.length,
            completed: data.filter(p => p.status === 'completed').length,
            pending: data.filter(p => p.status === 'pending').length,
            failed: data.filter(p => p.status === 'failed').length,
            refunded: data.filter(p => p.status === 'refunded').length,
            totalAmount: data
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + (p.amount || 0), 0),
            refundedAmount: data
                .filter(p => p.status === 'refunded')
                .reduce((sum, p) => sum + (p.amount || 0), 0)
        }

        return {
            success: true,
            data: stats
        }
    } catch (error) {
        console.error('결제 통계 조회 오류:', error)
        return {
            success: false,
            error: '결제 통계 조회 중 오류가 발생했습니다.'
        }
    }
} 