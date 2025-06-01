'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react'
import {
    RevenueLineChart,
    ReservationBarChart,
    ProductRevenuePieChart,
    RevenueReservationComboChart,
    MonthlyComparisonChart,
    HourlyReservationChart,
    CancellationRateChart
} from '@/components/admin/analytics-chart'
import { KPIGrid, RealtimeStatsGrid } from '@/components/admin/stats-card'
import {
    useAnalytics,
    useRealtimeStats,
    useProductPerformance,
    useCustomerAnalytics
} from '@/hooks/use-analytics'

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('30days')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // 데이터 가져오기
    const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics(period, startDate, endDate)
    const { stats: realtimeStats, loading: realtimeLoading } = useRealtimeStats()
    const { data: productPerformance, loading: productLoading } = useProductPerformance(period)
    const { data: customerData, loading: customerLoading } = useCustomerAnalytics()

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod)
        setStartDate('')
        setEndDate('')
    }

    const handleCustomDateRange = () => {
        if (startDate && endDate) {
            setPeriod('custom')
        }
    }

    const exportData = () => {
        console.log('Exporting analytics data...')
        // 실제 구현에서는 CSV/Excel 파일로 내보내기
    }

    const getPeriodLabel = () => {
        switch (period) {
            case '7days': return '최근 7일'
            case '30days': return '최근 30일'
            case '3months': return '최근 3개월'
            case '1year': return '최근 1년'
            case 'custom': return '사용자 지정'
            default: return '최근 30일'
        }
    }

    if (analyticsError) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="text-red-800 font-medium">데이터 로드 오류</div>
                    <div className="text-red-600 text-sm mt-1">{analyticsError}</div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                        variant="outline"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 시도
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">매출 및 예약 통계</h1>
                        <p className="text-gray-600">실시간 비즈니스 성과를 모니터링하세요</p>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                        <Button onClick={exportData} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            내보내기
                        </Button>
                    </div>
                </div>

                {/* 기간 선택 */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex gap-2">
                        {[
                            { value: '7days', label: '최근 7일' },
                            { value: '30days', label: '최근 30일' },
                            { value: '3months', label: '최근 3개월' },
                            { value: '1year', label: '최근 1년' }
                        ].map((option) => (
                            <Button
                                key={option.value}
                                onClick={() => handlePeriodChange(option.value)}
                                variant={period === option.value ? 'default' : 'outline'}
                                size="sm"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-2 items-center">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <span className="text-gray-500">~</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Button
                            onClick={handleCustomDateRange}
                            variant="outline"
                            size="sm"
                            disabled={!startDate || !endDate}
                        >
                            적용
                        </Button>
                    </div>
                </div>

                {/* 실시간 통계 */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">실시간 현황</h2>
                    <RealtimeStatsGrid stats={realtimeStats} loading={realtimeLoading} />
                </div>

                {/* 주요 KPI */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        주요 지표 ({getPeriodLabel()})
                    </h2>
                    <KPIGrid summary={analyticsData.summary} loading={analyticsLoading} />
                </div>
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 매출 추이 */}
                <RevenueLineChart
                    data={analyticsData.dailyData}
                    period={getPeriodLabel()}
                />

                {/* 예약 건수 */}
                <ReservationBarChart
                    data={analyticsData.dailyData}
                    period={getPeriodLabel()}
                />
            </div>

            {/* 복합 차트 */}
            <RevenueReservationComboChart
                data={analyticsData.dailyData}
                period={getPeriodLabel()}
            />

            {/* 상품 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 상품별 매출 분포 */}
                <ProductRevenuePieChart data={analyticsData.productData} />

                {/* 시간대별 예약 */}
                <HourlyReservationChart data={analyticsData.hourlyData} />
            </div>

            {/* 추가 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 월별 비교 */}
                <MonthlyComparisonChart data={analyticsData.monthlyData} />

                {/* 취소율 추이 */}
                <CancellationRateChart
                    data={analyticsData.dailyData}
                    period={getPeriodLabel()}
                />
            </div>

            {/* 상품별 성과 테이블 */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">상품별 성과 분석</h3>
                {productLoading ? (
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상품명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        매출
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        예약 건수
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        성장률
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        평점
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        전환율
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productPerformance.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₩{product.revenue.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.reservations}건
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.growth > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.growth > 0 ? '+' : ''}{product.growth}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ⭐ {product.rating}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.conversionRate}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 고객 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 연령대별 분석 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">연령대별 고객 분포</h3>
                    {customerLoading ? (
                        <div className="animate-pulse space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-8 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {customerData.ageGroups?.map((group, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 w-20">{group.name}</span>
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${group.value}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-900 w-12 text-right">{group.value}%</span>
                                        <span className="text-xs text-gray-500 w-12 text-right">({group.count}명)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 결제 방법별 분석 */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">결제 방법별 분포</h3>
                    {customerLoading ? (
                        <div className="animate-pulse space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-8 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {customerData.paymentMethods?.map((method, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 w-24">{method.name}</span>
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${method.value}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-900 w-12 text-right">{method.value}%</span>
                                        <span className="text-xs text-gray-500 w-12 text-right">({method.count}건)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 