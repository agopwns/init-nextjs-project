'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useReservationStore } from '@/app/store/reservation-store'
import { useReservations } from '@/hooks/use-reservations'
import { updateReservationStatus, getReservationDetail } from '@/actions/reservation-actions'
import { getPaymentStatus } from '@/actions/payment-actions'
import ReservationDetailModal from '@/components/admin/reservation-detail-modal'
import PaymentDetailModal from '@/components/admin/payment-detail-modal'

export default function ReservationsPage() {
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(null)
    const [paymentLoading, setPaymentLoading] = useState(null)

    const {
        filters,
        setFilters,
        updateReservationStatus: updateStatusInStore
    } = useReservationStore()

    const {
        reservations,
        loading,
        error,
        reservationStats,
        refreshData,
        clearError
    } = useReservations()

    const handleFilterChange = (key, value) => {
        setFilters({ [key]: value })
    }

    const handleStatusChange = async (reservationId, newStatus) => {
        if (actionLoading === reservationId) return

        setActionLoading(reservationId)
        try {
            const result = await updateReservationStatus(reservationId, newStatus)

            if (result.success) {
                updateStatusInStore(reservationId, newStatus)
                alert(`예약이 ${newStatus === 'confirmed' ? '승인' : '거절'}되었습니다.`)
            } else {
                alert(result.error || '상태 변경에 실패했습니다.')
            }
        } catch (error) {
            console.error('상태 변경 오류:', error)
            alert('상태 변경 중 오류가 발생했습니다.')
        } finally {
            setActionLoading(null)
        }
    }

    const handleViewDetail = async (reservationId) => {
        try {
            const result = await getReservationDetail(reservationId)
            if (result.success) {
                setSelectedReservation(result.data)
                setShowDetailModal(true)
            } else {
                alert(result.error || '상세 정보를 불러오는데 실패했습니다.')
            }
        } catch (error) {
            console.error('상세 정보 로딩 오류:', error)
            alert('상세 정보를 불러오는 중 오류가 발생했습니다.')
        }
    }

    const handleViewPayment = async (reservation) => {
        if (!reservation.payments || reservation.payments.length === 0) {
            alert('결제 정보가 없습니다.')
            return
        }

        setPaymentLoading(reservation.id)
        try {
            // 결제 정보를 가져와서 모달에 표시
            const payment = reservation.payments[0] // 첫 번째 결제 정보 사용
            setSelectedPayment(payment)
            setShowPaymentModal(true)
        } catch (error) {
            console.error('결제 정보 로딩 오류:', error)
            alert('결제 정보를 불러오는 중 오류가 발생했습니다.')
        } finally {
            setPaymentLoading(null)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: '대기 중', class: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: '확정', class: 'bg-green-100 text-green-800' },
            cancelled: { label: '취소', class: 'bg-red-100 text-red-800' },
            completed: { label: '완료', class: 'bg-blue-100 text-blue-800' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        )
    }

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: '결제 대기', class: 'bg-yellow-100 text-yellow-800' },
            completed: { label: '결제 완료', class: 'bg-green-100 text-green-800' },
            failed: { label: '결제 실패', class: 'bg-red-100 text-red-800' },
            refunded: { label: '환불 완료', class: 'bg-gray-100 text-gray-800' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        )
    }

    // 달력 데이터 생성
    const generateCalendarData = () => {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay())

        const calendarDays = []
        for (let i = 0; i < 35; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i)

            // 해당 날짜의 예약 건수 계산
            const dayReservations = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.reservation_date)
                return reservationDate.toDateString() === currentDate.toDateString()
            })

            calendarDays.push({
                date: currentDate,
                reservationCount: dayReservations.length,
                isCurrentMonth: currentDate.getMonth() === today.getMonth()
            })
        }

        return calendarDays
    }

    const calendarData = generateCalendarData()

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                clearError()
                                refreshData()
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
                    <div className="flex space-x-4 text-sm">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                            <span className="text-blue-600 font-medium">전체: {reservationStats.total}건</span>
                        </div>
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                            <span className="text-yellow-600 font-medium">대기: {reservationStats.pending}건</span>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                            <span className="text-green-600 font-medium">확정: {reservationStats.confirmed}건</span>
                        </div>
                    </div>
                </div>

                {/* 필터 옵션 */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">모든 상태</option>
                        <option value="pending">대기 중</option>
                        <option value="confirmed">확정</option>
                        <option value="cancelled">취소</option>
                        <option value="completed">완료</option>
                    </select>

                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => setFilters({ status: 'all', date: '', productId: '' })}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 underline"
                    >
                        필터 초기화
                    </button>
                </div>

                {/* 캘린더 뷰 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">이번 달 예약 현황</h3>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {/* 캘린더 헤더 */}
                        <div className="font-semibold p-2">일</div>
                        <div className="font-semibold p-2">월</div>
                        <div className="font-semibold p-2">화</div>
                        <div className="font-semibold p-2">수</div>
                        <div className="font-semibold p-2">목</div>
                        <div className="font-semibold p-2">금</div>
                        <div className="font-semibold p-2">토</div>

                        {/* 캘린더 날짜들 */}
                        {calendarData.map((day, index) => (
                            <div
                                key={index}
                                className={`p-2 border border-gray-200 min-h-[80px] bg-white rounded ${!day.isCurrentMonth ? 'opacity-50' : ''
                                    }`}
                            >
                                <div className={`text-sm ${day.isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {day.date.getDate()}
                                </div>
                                {day.reservationCount > 0 && (
                                    <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mt-1">
                                        예약 {day.reservationCount}건
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 예약 목록 테이블 */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">예약 목록을 불러오는 중...</p>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            예약이 없습니다.
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        예약 ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        고객명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상품명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        예약일시
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        참가자 수
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        금액
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        예약 상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        결제 상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        액션
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{reservation.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.users?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.products?.title || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(reservation.reservation_date), 'yyyy-MM-dd HH:mm', { locale: ko })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reservation.participants}명
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₩{reservation.total_amount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(reservation.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {reservation.payments && reservation.payments.length > 0
                                                ? getPaymentStatusBadge(reservation.payments[0].status)
                                                : <span className="text-gray-400 text-xs">결제 없음</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {reservation.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                                        disabled={actionLoading === reservation.id}
                                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                    >
                                                        {actionLoading === reservation.id ? '처리 중...' : '승인'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                                        disabled={actionLoading === reservation.id}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        {actionLoading === reservation.id ? '처리 중...' : '거절'}
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleViewDetail(reservation.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                상세
                                            </button>
                                            {reservation.payments && reservation.payments.length > 0 && (
                                                <button
                                                    onClick={() => handleViewPayment(reservation)}
                                                    disabled={paymentLoading === reservation.id}
                                                    className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                                >
                                                    {paymentLoading === reservation.id ? '로딩...' : '결제/환불'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 예약 상세 정보 모달 */}
            <ReservationDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false)
                    setSelectedReservation(null)
                }}
                reservation={selectedReservation}
            />

            {/* 결제 상세 정보 모달 */}
            <PaymentDetailModal
                isOpen={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false)
                    setSelectedPayment(null)
                }}
                payment={selectedPayment}
                onRefundSuccess={() => {
                    refreshData()
                }}
            />
        </div>
    )
} 