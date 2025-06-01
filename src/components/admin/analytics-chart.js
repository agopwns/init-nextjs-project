'use client'

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'

// 매출 추이 라인 차트
export function RevenueLineChart({ data, period }) {
    const formatCurrency = (value) => `₩${value.toLocaleString()}`

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                매출 추이 ({period})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value) => [formatCurrency(value), '매출']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

// 예약 건수 바 차트
export function ReservationBarChart({ data, period }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                예약 건수 ({period})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}건`, '예약 건수']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Bar
                        dataKey="reservations"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// 상품별 매출 파이 차트
export function ProductRevenuePieChart({ data }) {
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

    const formatCurrency = (value) => `₩${value.toLocaleString()}`

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    // 데이터가 없는 경우 처리
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">상품별 매출 분포</h3>
                <div className="h-300 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <div className="text-lg font-medium">데이터가 없습니다</div>
                        <div className="text-sm">상품 판매 후 데이터가 표시됩니다</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">상품별 매출 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [formatCurrency(value), '매출']}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

// 매출 및 예약 복합 차트
export function RevenueReservationComboChart({ data, period }) {
    const formatCurrency = (value) => `₩${value.toLocaleString()}`

    const customTooltipFormatter = (value, name) => {
        if (name === 'revenue') {
            return [formatCurrency(value), '매출']
        } else if (name === 'reservations') {
            return [`${value}건`, '예약 건수']
        }
        return [value, name]
    }

    // 데이터가 없는 경우 처리
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    매출 & 예약 추이 ({period})
                </h3>
                <div className="h-400 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <div className="text-lg font-medium">데이터가 없습니다</div>
                        <div className="text-sm">예약 발생 후 추이가 표시됩니다</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                매출 & 예약 추이 ({period})
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        yAxisId="left"
                        tickFormatter={formatCurrency}
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={customTooltipFormatter}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="revenue"
                    />
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="reservations"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorReservations)"
                        name="reservations"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// 월별 비교 차트
export function MonthlyComparisonChart({ data }) {
    const formatCurrency = (value) => `₩${value.toLocaleString()}`

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">월별 비교</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        tickFormatter={formatCurrency}
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value) => [formatCurrency(value), '매출']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="currentYear"
                        fill="#3B82F6"
                        name="올해"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="previousYear"
                        fill="#E5E7EB"
                        name="작년"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// 시간대별 예약 히트맵
export function HourlyReservationChart({ data }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">시간대별 예약 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="hour"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}건`, '예약 건수']}
                        labelFormatter={(value) => `${value}시`}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Bar
                        dataKey="reservations"
                        fill="#8B5CF6"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// 취소율 추이 차트
export function CancellationRateChart({ data, period }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                취소율 추이 ({period})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}%`}
                        fontSize={12}
                        tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}%`, '취소율']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="cancellationRate"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
} 