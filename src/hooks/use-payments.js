'use client'

import { useState, useEffect } from 'react'
import { getPayments, getPaymentStats, getPaymentStatus, processRefund } from '@/actions/payment-actions'

export function usePayments(initialFilters = {}) {
    const [payments, setPayments] = useState([])
    const [paymentStats, setPaymentStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
        totalAmount: 0,
        refundedAmount: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        status: 'all',
        payment_method: 'all',
        date: '',
        transaction_id: '',
        ...initialFilters
    })

    const fetchPayments = async () => {
        try {
            setLoading(true)
            setError(null)

            // 결제 목록과 통계를 병렬로 조회
            const [paymentsResult, statsResult] = await Promise.all([
                getPayments(filters),
                getPaymentStats()
            ])

            if (paymentsResult.success) {
                setPayments(paymentsResult.data)
            } else {
                setError(paymentsResult.error)
            }

            if (statsResult.success) {
                setPaymentStats(statsResult.data)
            }

        } catch (error) {
            console.error('결제 데이터 조회 오류:', error)
            setError('결제 데이터를 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const refreshData = () => {
        fetchPayments()
    }

    const clearError = () => {
        setError(null)
    }

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    // 필터가 변경될 때마다 데이터 새로고침
    useEffect(() => {
        fetchPayments()
    }, [filters])

    return {
        payments,
        paymentStats,
        loading,
        error,
        filters,
        setFilters: updateFilters,
        refreshData,
        clearError
    }
}

export function usePaymentActions() {
    const [loading, setLoading] = useState(false)

    const checkPaymentStatus = async (paymentId) => {
        setLoading(true)
        try {
            const result = await getPaymentStatus(paymentId)
            return result
        } catch (error) {
            console.error('결제 상태 조회 오류:', error)
            return {
                success: false,
                error: '결제 상태 조회 중 오류가 발생했습니다.'
            }
        } finally {
            setLoading(false)
        }
    }

    const refundPayment = async (paymentId, refundAmount, reason) => {
        setLoading(true)
        try {
            const result = await processRefund(paymentId, refundAmount, reason)
            return result
        } catch (error) {
            console.error('환불 처리 오류:', error)
            return {
                success: false,
                error: '환불 처리 중 오류가 발생했습니다.'
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        checkPaymentStatus,
        refundPayment
    }
} 