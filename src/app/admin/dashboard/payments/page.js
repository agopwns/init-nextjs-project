'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { usePayments } from '@/hooks/use-payments'
import PaymentDetailModal from '@/components/admin/payment-detail-modal'

export default function PaymentsPage() {
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const {
        payments,
        paymentStats,
        loading,
        error,
        filters,
        setFilters,
        refreshData,
        clearError
    } = usePayments()

    const handleFilterChange = (key, value) => {
        setFilters({ [key]: value })
    }

    const handleViewDetail = (payment) => {
        setSelectedPayment(payment)
        setShowDetailModal(true)
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: '대기 중', class: 'bg-yellow-100 text-yellow-800' },
            completed: { label: '완료', class: 'bg-green-100 text-green-800' },
            failed: { label: '실패', class: 'bg-red-100 text-red-800' },
            refunded: { label: '환불 완료', class: 'bg-gray-100 text-gray-800' },
            partially_refunded: { label: '부분 환불', class: 'bg-orange-100 text-orange-800' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        )
    }

    const getPaymentMethodLabel = (method) => {
        const methodLabels = {
            card: '카드',
            transfer: '계좌이체',
            mobile: '모바일',
            virtual_account: '가상계좌'
        }
        return methodLabels[method] || method
    }

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
                    <h1 className="text-2xl font-bold text-gray-900">결제 관리</h1>
                    <div className="flex space-x-4 text-sm">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                            <span className="text-blue-600 font-medium">
                                전체: {paymentStats.total}건
                            </span>
                        </div>
                        <div className="bg-green-50 px-3 py-2 rounded-lg">
                            <span className="text-green-600 font-medium">
                                완료: {paymentStats.completed}건
                            </span>
                        </div>
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                            <span className="text-yellow-600 font-medium">
                                대기: {paymentStats.pending}건
                            </span>
                        </div>
                        <div className="bg-red-50 px-3 py-2 rounded-lg">
                            <span className="text-red-600 font-medium">
                                실패: {paymentStats.failed}건
                            </span>
                        </div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-gray-600 font-medium">
                                환불: {paymentStats.refunded}건
                            </span>
                        </div>
                    </div>
                </div>

                {/* 매출 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">총 매출</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ₩{paymentStats.totalAmount?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">환불 금액</h3>
                        <p className="text-2xl font-bold text-red-600">
                            ₩{paymentStats.refundedAmount?.toLocaleString()}
                        </p>
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
                        <option value="completed">완료</option>
                        <option value="failed">실패</option>
                        <option value="refunded">환불 완료</option>
                        <option value="partially_refunded">부분 환불</option>
                    </select>

                    <select
                        value={filters.payment_method}
                        onChange={(e) => handleFilterChange('payment_method', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">모든 결제 방법</option>
                        <option value="card">카드</option>
                        <option value="transfer">계좌이체</option>
                        <option value="mobile">모바일</option>
                        <option value="virtual_account">가상계좌</option>
                    </select>

                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="거래 ID 검색"
                        value={filters.transaction_id}
                        onChange={(e) => handleFilterChange('transaction_id', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => setFilters({
                            status: 'all',
                            payment_method: 'all',
                            date: '',
                            transaction_id: ''
                        })}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 underline"
                    >
                        필터 초기화
                    </button>
                </div>

                {/* 결제 목록 테이블 */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">결제 목록을 불러오는 중...</p>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            결제 내역이 없습니다.
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        거래 ID
                                    </th>
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
                                        결제 금액
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        결제 방법
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        결제일시
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        액션
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{payment.transaction_id?.slice(0, 12)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            #{payment.reservation_id?.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.reservations?.users?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.reservations?.products?.title || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₩{payment.amount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getPaymentMethodLabel(payment.payment_method)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.paid_at
                                                ? format(new Date(payment.paid_at), 'yyyy-MM-dd HH:mm', { locale: ko })
                                                : format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm', { locale: ko })
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetail(payment)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                상세 / 환불
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 결제 상세 정보 모달 */}
            <PaymentDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false)
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