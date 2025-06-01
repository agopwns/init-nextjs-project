'use client'

import { useState, useEffect } from 'react'
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns'

// 예제 데이터 생성 함수들
const generateDailyData = (days) => {
    return Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - 1 - i), 'MM/dd')
        return {
            date,
            revenue: Math.floor(Math.random() * 2000000) + 500000,
            reservations: Math.floor(Math.random() * 50) + 10,
            cancellationRate: Math.floor(Math.random() * 10) + 2
        }
    })
}

const generateProductData = () => {
    return [
        { name: '스카이다이빙 체험', revenue: 13350000, reservations: 89, share: 42.3 },
        { name: '패러글라이딩 체험', revenue: 8040000, reservations: 67, share: 25.4 },
        { name: '서핑 체험', revenue: 7280000, reservations: 91, share: 23.0 },
        { name: '번지점프 체험', revenue: 2890000, reservations: 34, share: 9.1 },
        { name: '스쿠버다이빙', revenue: 1240000, reservations: 19, share: 3.9 }
    ]
}

const generateMonthlyData = () => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    return months.map(month => ({
        month,
        currentYear: Math.floor(Math.random() * 20000000) + 5000000,
        previousYear: Math.floor(Math.random() * 18000000) + 4000000
    }))
}

const generateHourlyData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}`,
        reservations: Math.floor(Math.random() * 20) + 1
    }))
}

// Analytics 훅
export function useAnalytics(period = '7days', startDate = null, endDate = null) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        summary: null,
        dailyData: [],
        productData: [],
        monthlyData: [],
        hourlyData: []
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true)
                setError(null)

                // 실제 API 호출 대신 예제 데이터 사용
                // const response = await fetch(`/api/analytics?period=${period}&start=${startDate}&end=${endDate}`)
                // const result = await response.json()

                // 예제 데이터 생성
                const getDaysCount = () => {
                    switch (period) {
                        case '7days': return 7
                        case '30days': return 30
                        case '3months': return 90
                        case '1year': return 365
                        default: return 7
                    }
                }

                const dailyData = generateDailyData(getDaysCount())
                const productData = generateProductData()
                const monthlyData = generateMonthlyData()
                const hourlyData = generateHourlyData()

                // 요약 통계 계산
                const totalRevenue = dailyData.reduce((sum, day) => sum + day.revenue, 0)
                const totalReservations = dailyData.reduce((sum, day) => sum + day.reservations, 0)
                const averageOrderValue = totalRevenue / totalReservations
                const averageCancellationRate = dailyData.reduce((sum, day) => sum + day.cancellationRate, 0) / dailyData.length

                const summary = {
                    totalRevenue,
                    totalReservations,
                    averageOrderValue,
                    cancellationRate: averageCancellationRate,
                    revenueGrowth: 12.5,
                    reservationGrowth: 8.3,
                    orderValueGrowth: 3.7,
                    cancellationRateChange: -1.1
                }

                setData({
                    summary,
                    dailyData,
                    productData,
                    monthlyData,
                    hourlyData
                })

            } catch (err) {
                console.error('Analytics data fetch failed:', err)
                setError('통계 데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalyticsData()
    }, [period, startDate, endDate])

    return { data, loading, error }
}

// 실시간 통계 훅
export function useRealtimeStats() {
    const [stats, setStats] = useState({
        todayRevenue: 0,
        todayReservations: 0,
        onlineUsers: 0,
        pendingReservations: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRealtimeStats = async () => {
            try {
                // 실제 API 호출 대신 예제 데이터
                setStats({
                    todayRevenue: Math.floor(Math.random() * 1000000) + 500000,
                    todayReservations: Math.floor(Math.random() * 20) + 5,
                    onlineUsers: Math.floor(Math.random() * 50) + 10,
                    pendingReservations: Math.floor(Math.random() * 10) + 2
                })
                setLoading(false)
            } catch (err) {
                console.error('Realtime stats fetch failed:', err)
                setLoading(false)
            }
        }

        fetchRealtimeStats()

        // 30초마다 업데이트
        const interval = setInterval(fetchRealtimeStats, 30000)

        return () => clearInterval(interval)
    }, [])

    return { stats, loading }
}

// 상품별 성과 훅
export function useProductPerformance(period = '30days') {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProductPerformance = async () => {
            try {
                setLoading(true)
                setError(null)

                // 실제 API 호출 대신 예제 데이터
                const productPerformance = [
                    {
                        id: '1',
                        name: '스카이다이빙 체험',
                        revenue: 13350000,
                        reservations: 89,
                        growth: 15.3,
                        rating: 4.8,
                        conversionRate: 12.4
                    },
                    {
                        id: '2',
                        name: '패러글라이딩 체험',
                        revenue: 8040000,
                        reservations: 67,
                        growth: -2.1,
                        rating: 4.6,
                        conversionRate: 9.8
                    },
                    {
                        id: '3',
                        name: '서핑 체험',
                        revenue: 7280000,
                        reservations: 91,
                        growth: 8.7,
                        rating: 4.7,
                        conversionRate: 11.2
                    }
                ]

                setData(productPerformance)
            } catch (err) {
                console.error('Product performance fetch failed:', err)
                setError('상품 성과 데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchProductPerformance()
    }, [period])

    return { data, loading, error }
}

// 고객 분석 훅
export function useCustomerAnalytics() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        ageGroups: [],
        paymentMethods: [],
        customerRetention: [],
        topCustomers: []
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCustomerAnalytics = async () => {
            try {
                setLoading(true)
                setError(null)

                const customerData = {
                    ageGroups: [
                        { name: '20대', value: 35, count: 86 },
                        { name: '30대', value: 42, count: 103 },
                        { name: '40대', value: 18, count: 44 },
                        { name: '50대 이상', value: 5, count: 12 }
                    ],
                    paymentMethods: [
                        { name: '카드 결제', value: 68, count: 167 },
                        { name: '계좌이체', value: 22, count: 54 },
                        { name: '모바일 결제', value: 10, count: 24 }
                    ],
                    customerRetention: [
                        { month: '1월', newCustomers: 45, returningCustomers: 23 },
                        { month: '2월', newCustomers: 52, returningCustomers: 31 },
                        { month: '3월', newCustomers: 38, returningCustomers: 28 }
                    ],
                    topCustomers: [
                        { name: '김○○', reservations: 12, revenue: 1800000 },
                        { name: '이○○', reservations: 8, revenue: 1200000 },
                        { name: '박○○', reservations: 6, revenue: 950000 }
                    ]
                }

                setData(customerData)
            } catch (err) {
                console.error('Customer analytics fetch failed:', err)
                setError('고객 분석 데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchCustomerAnalytics()
    }, [])

    return { data, loading, error }
} 