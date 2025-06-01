'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useCreateReservation } from '@/hooks/use-reservations'
import * as PortOne from '@portone/browser-sdk/v2'

export function ReservationPayment({
    product,
    reservationData,
    totalAmount,
    onSuccess,
    onCancel
}) {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const { createReservation } = useCreateReservation()
    const router = useRouter()

    const handlePayment = async () => {
        setIsLoading(true)
        try {
            // 1. 먼저 예약을 생성합니다 (pending 상태)
            const fullReservationData = {
                productId: reservationData.productId,
                userId: user.id,
                reservationDate: reservationData.reservationDate,
                participants: reservationData.participants,
                totalAmount: totalAmount,
                specialRequests: reservationData.specialRequests
            }

            const reservation = await createReservation(fullReservationData)

            // 2. 결제 요청
            const paymentId = `payment-${crypto.randomUUID()}`
            const response = await PortOne.requestPayment({
                storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
                channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
                paymentId,
                orderName: `${product.title} 예약`,
                totalAmount,
                currency: 'CURRENCY_KRW',
                payMethod: 'CARD',
                customer: {
                    fullName: user.user_metadata?.name || user.email,
                    email: user.email,
                }
            })

            console.log('결제 응답:', response)

            // 3. 결제 상태 확인
            if (response.transactionType !== 'PAYMENT') {
                // 결제 실패 시 예약 삭제
                await fetch(`/api/reservations/${reservation.id}`, {
                    method: 'DELETE'
                })
                alert('결제가 실패했습니다. 다시 시도해주세요.')
                return
            }

            // 4. 결제 성공 시 서버에서 결제 확인 및 예약 확정
            const completeResponse = await fetch('/api/payment/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentId: response.paymentId,
                    reservationId: reservation.id,
                    order: {
                        name: `${product.title} 예약`,
                        amount: totalAmount
                    }
                })
            })

            const completeData = await completeResponse.json()

            if (!completeResponse.ok) {
                throw new Error(completeData.error || '결제 확인 중 오류가 발생했습니다')
            }

            // 5. 성공 시 부모 컴포넌트에 알림
            onSuccess({
                ...reservation,
                status: 'confirmed',
                paymentId: response.paymentId
            })

        } catch (error) {
            console.error('결제 처리 중 오류:', error)
            alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* 예약 정보 확인 */}
            <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">예약 정보 확인</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">상품명:</span>
                        <span className="font-medium">{product.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">예약 일시:</span>
                        <span className="font-medium">
                            {new Date(reservationData.reservationDate).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            })} {new Date(reservationData.reservationDate).toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">인원:</span>
                        <span className="font-medium">{reservationData.participants}명</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">단가:</span>
                        <span className="font-medium">₩{Number(product.price).toLocaleString()}</span>
                    </div>
                    {reservationData.specialRequests && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">특별 요청:</span>
                            <span className="font-medium">{reservationData.specialRequests}</span>
                        </div>
                    )}
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>총 결제 금액:</span>
                        <span className="text-blue-600">₩{totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* 결제 안내 */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">결제 안내</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 결제 완료 즉시 예약이 확정됩니다.</li>
                    <li>• 결제는 안전한 포트원 결제 시스템을 통해 처리됩니다.</li>
                    <li>• 결제 후 취소는 고객센터를 통해 문의해주세요.</li>
                    <li>• 예약 확정 후 이메일로 예약 확인서를 보내드립니다.</li>
                </ul>
            </div>

            {/* 결제 버튼 */}
            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    이전 단계로
                </Button>
                <Button
                    className="flex-1 h-12 text-lg"
                    onClick={handlePayment}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            결제 처리 중...
                        </>
                    ) : (
                        `₩${totalAmount.toLocaleString()} 결제하기`
                    )}
                </Button>
            </div>
        </div>
    )
} 