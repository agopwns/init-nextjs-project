'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { X, User, Calendar, MapPin, Phone, Mail, CreditCard } from 'lucide-react'
import { updateReservationStatus } from '@/actions/reservation-actions'
import { useReservationStore } from '@/app/store/reservation-store'

export default function ReservationDetailModal({ isOpen, onClose, reservation }) {
    const [isUpdating, setIsUpdating] = useState(false)
    const updateReservationStatusInStore = useReservationStore(state => state.updateReservationStatus)

    if (!isOpen || !reservation) return null

    const handleStatusChange = async (newStatus) => {
        if (isUpdating) return

        setIsUpdating(true)
        try {
            const result = await updateReservationStatus(reservation.id, newStatus)

            if (result.success) {
                updateReservationStatusInStore(reservation.id, newStatus)
                alert(`예약이 ${newStatus === 'confirmed' ? '승인' : '거절'}되었습니다.`)
                onClose()
            } else {
                alert(result.error || '상태 변경에 실패했습니다.')
            }
        } catch (error) {
            console.error('상태 변경 오류:', error)
            alert('상태 변경 중 오류가 발생했습니다.')
        } finally {
            setIsUpdating(false)
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
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.class}`}>
                {config.label}
            </span>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">예약 상세 정보</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="p-6 space-y-8">
                    {/* 예약 정보 요약 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">예약 #{reservation.id.slice(0, 8)}</h3>
                            {getStatusBadge(reservation.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">예약일시:</span>
                                <p className="font-medium">
                                    {format(new Date(reservation.reservation_date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">참가자 수:</span>
                                <p className="font-medium">{reservation.participants}명</p>
                            </div>
                            <div>
                                <span className="text-gray-500">총 금액:</span>
                                <p className="font-medium text-lg">₩{reservation.total_amount?.toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">예약 일시:</span>
                                <p className="font-medium">
                                    {format(new Date(reservation.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 고객 정보 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                고객 정보
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center">
                                    <span className="text-gray-500 w-16">이름:</span>
                                    <span className="font-medium">{reservation.users?.name}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-500 w-14">이메일:</span>
                                    <span className="font-medium">{reservation.users?.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-500 w-14">전화:</span>
                                    <span className="font-medium">{reservation.users?.phone || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* 상품 정보 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                상품 정보
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                <div>
                                    <span className="text-gray-500">상품명:</span>
                                    <p className="font-medium">{reservation.products?.title}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">소요시간:</span>
                                    <p className="font-medium">{reservation.products?.duration}분</p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-500 w-14">위치:</span>
                                    <span className="font-medium">{reservation.products?.location}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">단가:</span>
                                    <p className="font-medium">₩{reservation.products?.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 특별 요청사항 */}
                    {reservation.special_requests && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">특별 요청사항</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{reservation.special_requests}</p>
                            </div>
                        </div>
                    )}

                    {/* 결제 정보 */}
                    {reservation.payments && reservation.payments.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                결제 정보
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                {reservation.payments.map((payment, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">결제 금액:</span>
                                            <p className="font-medium">₩{payment.amount?.toLocaleString()} {payment.currency}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">결제 방법:</span>
                                            <p className="font-medium">{payment.payment_method}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">결제 상태:</span>
                                            <p className="font-medium">{payment.status}</p>
                                        </div>
                                        {payment.paid_at && (
                                            <div>
                                                <span className="text-gray-500">결제 일시:</span>
                                                <p className="font-medium">
                                                    {format(new Date(payment.paid_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 액션 버튼 */}
                {reservation.status === 'pending' && (
                    <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                        <button
                            onClick={() => handleStatusChange('cancelled')}
                            disabled={isUpdating}
                            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUpdating ? '처리 중...' : '거절'}
                        </button>
                        <button
                            onClick={() => handleStatusChange('confirmed')}
                            disabled={isUpdating}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUpdating ? '처리 중...' : '승인'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
} 