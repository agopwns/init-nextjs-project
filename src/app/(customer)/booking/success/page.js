'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// useSearchParams를 사용하는 컴포넌트를 별도로 분리
function BookingSuccessContent() {
    const searchParams = useSearchParams()
    const reservationId = searchParams.get('reservationId')
    const [reservation, setReservation] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchReservationDetails = async () => {
        try {
            const response = await fetch(`/api/reservations/${reservationId}`)
            const data = await response.json()

            if (response.ok) {
                setReservation(data)
            }
        } catch (error) {
            console.error('예약 정보 조회 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (reservationId) {
            fetchReservationDetails()
        }
    }, [reservationId, fetchReservationDetails])

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                {/* 성공 아이콘 */}
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
                    <svg
                        className="h-12 w-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* 성공 메시지 */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    결제 완료 및 예약이 확정되었습니다!
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    결제가 성공적으로 완료되어 예약이 확정되었습니다.<br />
                    예약 확인서를 이메일로 발송해드렸습니다.
                </p>

                {/* 예약 정보 */}
                {loading ? (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                ) : reservation ? (
                    <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
                        <h3 className="font-semibold text-gray-900 mb-4 text-center">예약 정보</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">예약 번호:</span>
                                <span className="font-mono font-medium">{reservation.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">상품명:</span>
                                <span className="font-medium">{reservation.products?.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">예약 일시:</span>
                                <span className="font-medium">
                                    {new Date(reservation.reservation_date).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long'
                                    })} {new Date(reservation.reservation_date).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">인원:</span>
                                <span className="font-medium">{reservation.participants}명</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">총 금액:</span>
                                <span className="font-medium text-blue-600">
                                    ₩{Number(reservation.total_amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">예약 상태:</span>
                                <span className="font-medium text-green-600">
                                    {reservation.status === 'confirmed' ? '확정됨' : '대기중'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : reservationId && (
                    <div className="bg-blue-50 p-6 rounded-lg mb-8">
                        <div className="text-sm text-blue-600 font-medium mb-2">
                            예약 번호
                        </div>
                        <div className="text-lg font-mono text-blue-900">
                            {reservationId}
                        </div>
                        <div className="text-sm text-blue-600 mt-2">
                            위 번호로 예약 상태를 확인할 수 있습니다
                        </div>
                    </div>
                )}

                {/* 안내 메시지 */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">안내사항</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            결제가 완료되어 예약이 확정되었습니다
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            예약 확인서가 이메일로 발송되었습니다
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            문의사항이 있으시면 고객센터로 연락주세요
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            예약 취소는 3일 전까지 가능합니다
                        </li>
                    </ul>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                        <Button variant="outline" className="w-full sm:w-auto">
                            다른 상품 보기
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="w-full sm:w-auto">
                            홈으로 가기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// 로딩 컴포넌트
function BookingSuccessLoading() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <div className="animate-pulse">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="h-32 bg-gray-200 rounded mb-8"></div>
                </div>
            </div>
        </div>
    )
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<BookingSuccessLoading />}>
            <BookingSuccessContent />
        </Suspense>
    )
} 