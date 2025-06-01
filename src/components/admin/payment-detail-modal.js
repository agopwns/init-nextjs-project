'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { usePaymentActions } from '@/hooks/use-payments'

export default function PaymentDetailModal({
    isOpen,
    onClose,
    payment,
    onRefundSuccess
}) {
    const [paymentDetail, setPaymentDetail] = useState(null)
    const [showRefundForm, setShowRefundForm] = useState(false)
    const [refundAmount, setRefundAmount] = useState('')
    const [refundReason, setRefundReason] = useState('')
    const [detailLoading, setDetailLoading] = useState(false)

    const { loading, checkPaymentStatus, refundPayment } = usePaymentActions()

    // 결제 상세 정보 조회
    useEffect(() => {
        if (isOpen && payment?.transaction_id) {
            fetchPaymentDetail()
        }
    }, [isOpen, payment])

    const fetchPaymentDetail = async () => {
        setDetailLoading(true)
        try {
            const result = await checkPaymentStatus(payment.transaction_id)
            if (result.success) {
                setPaymentDetail(result.data)
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error('결제 상세 정보 조회 오류:', error)
            alert('결제 상세 정보를 불러오는데 실패했습니다.')
        } finally {
            setDetailLoading(false)
        }
    }

    const handleRefund = async () => {
        if (!refundAmount || !refundReason.trim()) {
            alert('환불 금액과 사유를 입력해주세요.')
            return
        }

        const amount = parseFloat(refundAmount)
        if (isNaN(amount) || amount <= 0) {
            alert('올바른 환불 금액을 입력해주세요.')
            return
        }

        if (confirm(`₩${amount.toLocaleString()}을 환불하시겠습니까?`)) {
            const result = await refundPayment(payment.transaction_id, amount, refundReason.trim())

            if (result.success) {
                alert(result.message)
                setShowRefundForm(false)
                setRefundAmount('')
                setRefundReason('')
                onRefundSuccess?.()
                fetchPaymentDetail() // 상세 정보 새로고침
            } else {
                alert(result.error)
            }
        }
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

    const getPortoneStatusBadge = (status) => {
        const statusConfig = {
            READY: { label: '결제 대기', class: 'bg-gray-100 text-gray-800' },
            PAID: { label: '결제 완료', class: 'bg-green-100 text-green-800' },
            CANCELLED: { label: '결제 취소', class: 'bg-red-100 text-red-800' },
            FAILED: { label: '결제 실패', class: 'bg-red-100 text-red-800' },
            VIRTUAL_ACCOUNT_ISSUED: { label: '가상계좌 발급', class: 'bg-blue-100 text-blue-800' }
        }

        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' }
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        )
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">결제 상세 정보</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {detailLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">결제 정보를 불러오는 중...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 기본 결제 정보 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-600">거래 ID:</span>
                                        <p className="font-medium">{payment?.transaction_id}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">예약 ID:</span>
                                        <p className="font-medium">#{payment?.reservation_id?.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">고객명:</span>
                                        <p className="font-medium">{payment?.reservations?.users?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">고객 이메일:</span>
                                        <p className="font-medium">{payment?.reservations?.users?.email || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">상품명:</span>
                                        <p className="font-medium">{payment?.reservations?.products?.title || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">결제 금액:</span>
                                        <p className="font-medium text-blue-600">₩{payment?.amount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">결제 방법:</span>
                                        <p className="font-medium">{payment?.payment_method || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">DB 상태:</span>
                                        <p>{getStatusBadge(payment?.status)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Portone 상세 정보 */}
                            {paymentDetail && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Portone 결제 정보</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-gray-600">Portone 상태:</span>
                                            <p>{getPortoneStatusBadge(paymentDetail.status)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">결제 수단:</span>
                                            <p className="font-medium">{paymentDetail.paymentMethod?.type || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">결제 시각:</span>
                                            <p className="font-medium">
                                                {paymentDetail.paidAt
                                                    ? format(new Date(paymentDetail.paidAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko })
                                                    : '-'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">주문명:</span>
                                            <p className="font-medium">{paymentDetail.orderName || '-'}</p>
                                        </div>
                                        {paymentDetail.amount && (
                                            <>
                                                <div>
                                                    <span className="text-gray-600">총 금액:</span>
                                                    <p className="font-medium">₩{paymentDetail.amount.total?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">통화:</span>
                                                    <p className="font-medium">{paymentDetail.amount.currency}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 환불 폼 */}
                            {showRefundForm && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-red-800">환불 처리</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                환불 금액 (원)
                                            </label>
                                            <input
                                                type="number"
                                                value={refundAmount}
                                                onChange={(e) => setRefundAmount(e.target.value)}
                                                placeholder="환불할 금액을 입력하세요"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                max={payment?.amount}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                최대 환불 가능 금액: ₩{payment?.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                환불 사유
                                            </label>
                                            <textarea
                                                value={refundReason}
                                                onChange={(e) => setRefundReason(e.target.value)}
                                                placeholder="환불 사유를 입력하세요"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <Button
                                                onClick={handleRefund}
                                                disabled={loading}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                {loading ? '처리 중...' : '환불 처리'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowRefundForm(false)}
                                                disabled={loading}
                                            >
                                                취소
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 액션 버튼 */}
                            <div className="flex justify-end space-x-3">
                                {payment?.status === 'completed' && paymentDetail?.status === 'PAID' && !showRefundForm && (
                                    <Button
                                        onClick={() => setShowRefundForm(true)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        환불 처리
                                    </Button>
                                )}
                                <Button
                                    onClick={fetchPaymentDetail}
                                    variant="outline"
                                    disabled={detailLoading}
                                >
                                    {detailLoading ? '새로고침 중...' : '새로고침'}
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                >
                                    닫기
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 