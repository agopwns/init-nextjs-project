import { NextResponse } from 'next/server'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

// 예제 데이터 생성 함수들
function generateAnalyticsData(period, startDate, endDate) {
    const getDaysCount = () => {
        switch (period) {
            case '7days': return 7
            case '30days': return 30
            case '3months': return 90
            case '1year': return 365
            case 'custom':
                if (startDate && endDate) {
                    return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
                }
                return 30
            default: return 30
        }
    }

    const daysCount = getDaysCount()

    // 일별 데이터 생성
    const dailyData = Array.from({ length: daysCount }, (_, i) => {
        const date = format(subDays(new Date(), daysCount - 1 - i), 'MM/dd')
        return {
            date,
            revenue: Math.floor(Math.random() * 2000000) + 500000,
            reservations: Math.floor(Math.random() * 50) + 10,
            cancellationRate: Math.floor(Math.random() * 10) + 2
        }
    })

    // 상품별 데이터
    const productData = [
        { name: '스카이다이빙 체험', revenue: 13350000, reservations: 89, share: 42.3 },
        { name: '패러글라이딩 체험', revenue: 8040000, reservations: 67, share: 25.4 },
        { name: '서핑 체험', revenue: 7280000, reservations: 91, share: 23.0 },
        { name: '번지점프 체험', revenue: 2890000, reservations: 34, share: 9.1 },
        { name: '스쿠버다이빙', revenue: 1240000, reservations: 19, share: 3.9 }
    ]

    // 월별 비교 데이터
    const monthlyData = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ].map(month => ({
        month,
        currentYear: Math.floor(Math.random() * 20000000) + 5000000,
        previousYear: Math.floor(Math.random() * 18000000) + 4000000
    }))

    // 시간대별 데이터
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}`,
        reservations: Math.floor(Math.random() * 20) + 1
    }))

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

    return {
        success: true,
        data: {
            summary,
            dailyData,
            productData,
            monthlyData,
            hourlyData,
            period: period
        }
    }
}

// GET: 분석 데이터 조회
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || '30days'
        const startDate = searchParams.get('start')
        const endDate = searchParams.get('end')

        // 실제 구현에서는 데이터베이스에서 데이터를 가져옴
        // const analyticsData = await getAnalyticsFromDB(period, startDate, endDate)

        const analyticsData = generateAnalyticsData(period, startDate, endDate)

        return NextResponse.json(analyticsData)

    } catch (error) {
        console.error('Analytics API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: '분석 데이터를 가져오는데 실패했습니다.'
            },
            { status: 500 }
        )
    }
}

// POST: 분석 데이터 내보내기
export async function POST(request) {
    try {
        const body = await request.json()
        const { period, startDate, endDate, format: exportFormat = 'csv' } = body

        // 실제 구현에서는 CSV/Excel 파일 생성
        const analyticsData = generateAnalyticsData(period, startDate, endDate)

        // CSV 형태로 데이터 변환 (예제)
        if (exportFormat === 'csv') {
            const csvData = {
                headers: ['날짜', '매출', '예약건수', '취소율'],
                rows: analyticsData.data.dailyData.map(day => [
                    day.date,
                    day.revenue,
                    day.reservations,
                    day.cancellationRate
                ])
            }

            return NextResponse.json({
                success: true,
                data: csvData,
                filename: `analytics_${period}_${new Date().toISOString().split('T')[0]}.csv`
            })
        }

        return NextResponse.json({
            success: true,
            message: '데이터 내보내기가 완료되었습니다.'
        })

    } catch (error) {
        console.error('Analytics export error:', error)
        return NextResponse.json(
            {
                success: false,
                error: '데이터 내보내기에 실패했습니다.'
            },
            { status: 500 }
        )
    }
}

// 실시간 통계 API
export async function PUT(request) {
    try {
        // 실시간 통계 데이터 생성
        const realtimeStats = {
            todayRevenue: Math.floor(Math.random() * 1000000) + 500000,
            todayReservations: Math.floor(Math.random() * 20) + 5,
            onlineUsers: Math.floor(Math.random() * 50) + 10,
            pendingReservations: Math.floor(Math.random() * 10) + 2,
            timestamp: new Date().toISOString()
        }

        return NextResponse.json({
            success: true,
            data: realtimeStats
        })

    } catch (error) {
        console.error('Realtime stats API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: '실시간 통계를 가져오는데 실패했습니다.'
            },
            { status: 500 }
        )
    }
} 