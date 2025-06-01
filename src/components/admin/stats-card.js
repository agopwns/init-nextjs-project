'use client'

import { TrendingUp, TrendingDown, Eye, Users, CreditCard, Calendar } from 'lucide-react'

export function StatsCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color = 'blue',
    suffix = '',
    loading = false
}) {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-900',
            value: 'text-blue-600',
            trend: 'text-blue-700'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-900',
            value: 'text-green-600',
            trend: 'text-green-700'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-900',
            value: 'text-purple-600',
            trend: 'text-purple-700'
        },
        orange: {
            bg: 'bg-orange-50',
            text: 'text-orange-900',
            value: 'text-orange-600',
            trend: 'text-orange-700'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-900',
            value: 'text-red-600',
            trend: 'text-red-700'
        }
    }

    const currentColor = colorClasses[color] || colorClasses.blue

    if (loading) {
        return (
            <div className={`${currentColor.bg} p-6 rounded-lg animate-pulse`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
                <div className="h-8 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
        )
    }

    const formatValue = (val) => {
        if (typeof val === 'number') {
            if (suffix === '₩') {
                return `₩${val.toLocaleString()}`
            }
            return val.toLocaleString()
        }
        return val
    }

    return (
        <div className={`${currentColor.bg} p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${currentColor.text}`}>{title}</h3>
                {Icon && <Icon className={`h-6 w-6 ${currentColor.value}`} />}
            </div>

            <div className={`text-3xl font-bold ${currentColor.value} mb-2`}>
                {formatValue(value)}{suffix && !suffix.includes('₩') && suffix}
            </div>

            {change !== undefined && (
                <div className={`flex items-center text-sm ${currentColor.trend}`}>
                    {changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                    ) : changeType === 'decrease' ? (
                        <TrendingDown className="h-4 w-4 mr-1" />
                    ) : null}
                    <span>
                        {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
                        {Math.abs(change)}% 전월 대비
                    </span>
                </div>
            )}
        </div>
    )
}

// 실시간 통계 대시보드
export function RealtimeStatsGrid({ stats, loading }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
                title="오늘 매출"
                value={stats?.todayRevenue || 0}
                suffix="₩"
                icon={CreditCard}
                color="blue"
                loading={loading}
            />

            <StatsCard
                title="오늘 예약"
                value={stats?.todayReservations || 0}
                suffix="건"
                icon={Calendar}
                color="green"
                loading={loading}
            />

            <StatsCard
                title="접속자 수"
                value={stats?.onlineUsers || 0}
                suffix="명"
                icon={Eye}
                color="purple"
                loading={loading}
            />

            <StatsCard
                title="대기 예약"
                value={stats?.pendingReservations || 0}
                suffix="건"
                icon={Users}
                color="orange"
                loading={loading}
            />
        </div>
    )
}

// 주요 KPI 카드 그리드
export function KPIGrid({ summary, loading }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
                title="총 매출"
                value={summary?.totalRevenue || 0}
                change={summary?.revenueGrowth}
                changeType={summary?.revenueGrowth > 0 ? 'increase' : 'decrease'}
                suffix="₩"
                icon={CreditCard}
                color="blue"
                loading={loading}
            />

            <StatsCard
                title="총 예약"
                value={summary?.totalReservations || 0}
                change={summary?.reservationGrowth}
                changeType={summary?.reservationGrowth > 0 ? 'increase' : 'decrease'}
                suffix="건"
                icon={Calendar}
                color="green"
                loading={loading}
            />

            <StatsCard
                title="평균 객단가"
                value={Math.round(summary?.averageOrderValue || 0)}
                change={summary?.orderValueGrowth}
                changeType={summary?.orderValueGrowth > 0 ? 'increase' : 'decrease'}
                suffix="₩"
                icon={TrendingUp}
                color="purple"
                loading={loading}
            />

            <StatsCard
                title="취소율"
                value={summary?.cancellationRate?.toFixed(1) || '0.0'}
                change={Math.abs(summary?.cancellationRateChange || 0)}
                changeType={summary?.cancellationRateChange < 0 ? 'decrease' : 'increase'}
                suffix="%"
                icon={TrendingDown}
                color={summary?.cancellationRateChange < 0 ? 'green' : 'red'}
                loading={loading}
            />
        </div>
    )
} 