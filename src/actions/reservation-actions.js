'use server'

import { createServerClient } from '@/lib/supabase'
import { getUsersInfo, getUserInfo } from './user-actions'

// 예약 목록 조회 (관리자용)
export async function getReservations(filters = {}) {
    try {
        const supabase = createServerClient()

        let query = supabase
            .from('reservations')
            .select(`
        id,
        reservation_date,
        participants,
        total_amount,
        status,
        special_requests,
        created_at,
        updated_at,
        product_id,
        user_id,
        products (
          title,
          price,
          duration,
          location
        ),
        payments (
          id,
          amount,
          currency,
          payment_method,
          payment_provider,
          transaction_id,
          status,
          paid_at,
          created_at
        )
      `)
            .order('created_at', { ascending: false })

        // 상태별 필터링
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        // 날짜별 필터링
        if (filters.date) {
            const startDate = new Date(filters.date)
            const endDate = new Date(filters.date)
            endDate.setDate(endDate.getDate() + 1)

            query = query
                .gte('reservation_date', startDate.toISOString())
                .lt('reservation_date', endDate.toISOString())
        }

        // 상품별 필터링
        if (filters.productId) {
            query = query.eq('product_id', filters.productId)
        }

        const { data: reservations, error } = await query

        if (error) {
            console.error('예약 목록 조회 오류:', error)
            return { success: false, error: '예약 목록을 불러오는데 실패했습니다.' }
        }

        // 사용자 ID 수집
        const userIds = reservations
            ?.filter(reservation => reservation.user_id)
            .map(reservation => reservation.user_id) || []

        // 사용자 정보 조회
        let usersData = {}
        if (userIds.length > 0) {
            const usersResult = await getUsersInfo(userIds)
            if (usersResult.success) {
                usersData = usersResult.data
            }
        }

        // 사용자 정보 추가
        const reservationsWithUsers = reservations.map(reservation => ({
            ...reservation,
            users: usersData[reservation.user_id] || {
                email: `user-${reservation.user_id.slice(0, 8)}@example.com`,
                name: `사용자-${reservation.user_id.slice(0, 8)}`,
                phone: null
            }
        }))

        return { success: true, data: reservationsWithUsers }
    } catch (error) {
        console.error('예약 목록 조회 중 오류:', error)
        return { success: false, error: '서버 오류가 발생했습니다.' }
    }
}

// 예약 상세 정보 조회
export async function getReservationDetail(reservationId) {
    try {
        const supabase = createServerClient()

        const { data: reservation, error } = await supabase
            .from('reservations')
            .select(`
        id,
        reservation_date,
        participants,
        total_amount,
        status,
        special_requests,
        created_at,
        updated_at,
        product_id,
        user_id,
        products (
          title,
          description,
          price,
          duration,
          location,
          requirements,
          images
        ),
        payments (
          id,
          amount,
          currency,
          payment_method,
          payment_provider,
          transaction_id,
          status,
          paid_at,
          created_at
        )
      `)
            .eq('id', reservationId)
            .single()

        if (error) {
            console.error('예약 상세 정보 조회 오류:', error)
            return { success: false, error: '예약 정보를 불러오는데 실패했습니다.' }
        }

        // 사용자 정보 조회
        let userData = {
            email: `user-${reservation.user_id.slice(0, 8)}@example.com`,
            name: `사용자-${reservation.user_id.slice(0, 8)}`,
            phone: null
        }

        if (reservation.user_id) {
            const userResult = await getUserInfo(reservation.user_id)
            if (userResult.success) {
                userData = userResult.data
            }
        }

        // 사용자 정보 추가
        const reservationWithUser = {
            ...reservation,
            users: userData
        }

        return { success: true, data: reservationWithUser }
    } catch (error) {
        console.error('예약 상세 정보 조회 중 오류:', error)
        return { success: false, error: '서버 오류가 발생했습니다.' }
    }
}

// 예약 상태 변경 (승낙/거절)
export async function updateReservationStatus(reservationId, status, reason = '') {
    try {
        const supabase = createServerClient()

        // 유효한 상태 값 검증
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if (!validStatuses.includes(status)) {
            return { success: false, error: '유효하지 않은 상태값입니다.' }
        }

        const { data, error } = await supabase
            .from('reservations')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', reservationId)
            .select()

        if (error) {
            console.error('예약 상태 변경 오류:', error)
            return { success: false, error: '예약 상태 변경에 실패했습니다.' }
        }

        return { success: true, data: data[0] }
    } catch (error) {
        console.error('예약 상태 변경 중 오류:', error)
        return { success: false, error: '서버 오류가 발생했습니다.' }
    }
}

// 예약 통계 조회 (대시보드용)
export async function getReservationStats() {
    try {
        const supabase = createServerClient()

        // 전체 예약 수 및 상태별 통계
        const { data: statusStats, error: statusError } = await supabase
            .from('reservations')
            .select('status')

        if (statusError) {
            console.error('예약 통계 조회 오류:', statusError)
            return { success: false, error: '통계 정보를 불러오는데 실패했습니다.' }
        }

        // 상태별 카운트 계산
        const stats = statusStats.reduce((acc, reservation) => {
            acc[reservation.status] = (acc[reservation.status] || 0) + 1
            return acc
        }, {})

        // 이번 달 예약 수
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const { count: monthlyReservations, error: monthlyError } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', monthStart.toISOString())
            .lte('created_at', monthEnd.toISOString())

        if (monthlyError) {
            console.error('월별 예약 통계 오류:', monthlyError)
        }

        return {
            success: true,
            data: {
                total: statusStats.length,
                pending: stats.pending || 0,
                confirmed: stats.confirmed || 0,
                cancelled: stats.cancelled || 0,
                completed: stats.completed || 0,
                monthlyReservations: monthlyReservations || 0
            }
        }
    } catch (error) {
        console.error('예약 통계 조회 중 오류:', error)
        return { success: false, error: '서버 오류가 발생했습니다.' }
    }
}

// 날짜별 예약 현황 조회 (캘린더용)
export async function getReservationsByDateRange(startDate, endDate) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('reservations')
            .select(`
        id,
        reservation_date,
        participants,
        status,
        products (title)
      `)
            .gte('reservation_date', startDate)
            .lte('reservation_date', endDate)
            .order('reservation_date', { ascending: true })

        if (error) {
            console.error('날짜별 예약 조회 오류:', error)
            return { success: false, error: '날짜별 예약을 불러오는데 실패했습니다.' }
        }

        return { success: true, data }
    } catch (error) {
        console.error('날짜별 예약 조회 중 오류:', error)
        return { success: false, error: '서버 오류가 발생했습니다.' }
    }
}

// 예약 생성
export async function createReservation(reservationData) {
    try {
        const supabase = createServerClient()

        // 예약 데이터 검증
        if (!reservationData.productId || !reservationData.userId || !reservationData.reservationDate) {
            return {
                success: false,
                error: '필수 정보가 누락되었습니다.'
            }
        }

        const { data, error } = await supabase
            .from('reservations')
            .insert([
                {
                    product_id: reservationData.productId,
                    user_id: reservationData.userId,
                    reservation_date: reservationData.reservationDate,
                    participants: reservationData.participants || 1,
                    total_amount: reservationData.totalAmount,
                    special_requests: reservationData.specialRequests,
                    status: 'pending'
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('예약 생성 오류:', error)
            return {
                success: false,
                error: '예약 생성에 실패했습니다.'
            }
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('예약 생성 중 오류:', error)
        return {
            success: false,
            error: '서버 오류가 발생했습니다.'
        }
    }
} 