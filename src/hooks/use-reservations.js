'use client'

import { useEffect, useCallback, useState } from 'react'
import { useReservationStore } from '@/app/store/reservation-store'
import {
    getReservations,
    getReservationDetail,
    getReservationStats,
    createReservation
} from '@/actions/reservation-actions'

export function useReservations() {
    const {
        reservations,
        filters,
        loading,
        error,
        reservationStats,
        setReservations,
        setLoading,
        setError,
        setReservationStats,
        clearError
    } = useReservationStore()

    // 예약 목록 로드
    const loadReservations = useCallback(async (customFilters = null) => {
        setLoading(true)
        clearError()

        try {
            const filterToUse = customFilters || filters
            const result = await getReservations(filterToUse)

            if (result.success) {
                setReservations(result.data)
            } else {
                setError(result.error)
            }
        } catch (error) {
            console.error('예약 목록 로딩 오류:', error)
            setError('예약 목록을 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }, [filters, setReservations, setLoading, setError, clearError])

    // 예약 통계 로드
    const loadReservationStats = useCallback(async () => {
        try {
            const result = await getReservationStats()

            if (result.success) {
                setReservationStats(result.data)
            } else {
                console.error('통계 로딩 오류:', result.error)
            }
        } catch (error) {
            console.error('통계 로딩 중 오류:', error)
        }
    }, [setReservationStats])

    // 예약 상세 정보 로드
    const loadReservationDetail = useCallback(async (reservationId) => {
        try {
            const result = await getReservationDetail(reservationId)

            if (result.success) {
                return result.data
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('예약 상세 정보 로딩 오류:', error)
            throw error
        }
    }, [])

    // 데이터 새로고침
    const refreshData = useCallback(() => {
        loadReservations()
        loadReservationStats()
    }, [loadReservations, loadReservationStats])

    // 필터 변경 시 자동 로드
    useEffect(() => {
        loadReservations()
    }, [filters.status, filters.date, filters.productId])

    // 초기 로드
    useEffect(() => {
        loadReservationStats()
    }, [loadReservationStats])

    return {
        reservations,
        loading,
        error,
        reservationStats,
        loadReservations,
        loadReservationDetail,
        refreshData,
        clearError
    }
}

export function useReservationDetail(reservationId) {
    const { loadReservationDetail } = useReservations()

    const getDetail = useCallback(async () => {
        if (!reservationId) return null
        return await loadReservationDetail(reservationId)
    }, [reservationId, loadReservationDetail])

    return { getDetail }
}

export function useCreateReservation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createReservationHandler = useCallback(async (reservationData) => {
        setLoading(true)
        setError(null)

        try {
            const result = await createReservation(reservationData)

            if (result.success) {
                return result.data
            } else {
                setError(result.error)
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('예약 생성 오류:', error)
            setError(error.message || '예약 생성 중 오류가 발생했습니다.')
            throw error
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        createReservation: createReservationHandler,
        loading,
        error,
        clearError: () => setError(null)
    }
} 