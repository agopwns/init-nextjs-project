'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookingCalendar } from './booking-calendar'

export function BookingForm({ product, onSubmit, loading = false }) {
    const [selectedDateTime, setSelectedDateTime] = useState('')
    const [participants, setParticipants] = useState(1)
    const [specialRequests, setSpecialRequests] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedDateTime) {
            alert('날짜와 시간을 선택해주세요')
            return
        }

        onSubmit({
            productId: product.id,
            reservationDate: selectedDateTime,
            participants,
            specialRequests: specialRequests.trim() || null
        })
    }

    const totalAmount = product.price * participants

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 상품 정보 요약 */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                    <img
                        src={product.images?.[0] || '/placeholder-image.jpg'}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{product.title}</h3>
                        <p className="text-gray-600">{product.category}</p>
                        <p className="text-blue-600 font-medium">₩{Number(product.price).toLocaleString()} / 인</p>
                    </div>
                </div>
            </div>

            {/* 날짜/시간 선택 */}
            <div>
                <BookingCalendar
                    onDateTimeSelect={setSelectedDateTime}
                    disabled={loading}
                />
            </div>

            {/* 인원 선택 */}
            <div>
                <h3 className="text-lg font-semibold mb-4">인원 선택</h3>
                <div className="flex items-center space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={participants <= 1 || loading}
                        onClick={() => setParticipants(participants - 1)}
                    >
                        -
                    </Button>
                    <span className="text-lg font-medium w-12 text-center">
                        {participants}명
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={participants >= product.max_participants || loading}
                        onClick={() => setParticipants(participants + 1)}
                    >
                        +
                    </Button>
                    <span className="text-sm text-gray-500 ml-4">
                        (최대 {product.max_participants}명)
                    </span>
                </div>
            </div>

            {/* 특별 요청사항 */}
            <div>
                <h3 className="text-lg font-semibold mb-4">특별 요청사항 (선택사항)</h3>
                <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="특별한 요청사항이 있으시면 작성해주세요"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>

            {/* 요약 및 결제 */}
            <div className="border-t pt-6">
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">예약 요약</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>상품:</span>
                            <span>{product.title}</span>
                        </div>
                        {selectedDateTime && (
                            <div className="flex justify-between">
                                <span>일시:</span>
                                <span>
                                    {new Date(selectedDateTime).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long'
                                    })} {new Date(selectedDateTime).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>인원:</span>
                            <span>{participants}명</span>
                        </div>
                        <div className="flex justify-between">
                            <span>단가:</span>
                            <span>₩{Number(product.price).toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>총 금액:</span>
                            <span className="text-blue-600">₩{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 text-lg"
                    disabled={!selectedDateTime || loading}
                >
                    {loading ? '예약 처리 중...' : '예약하기'}
                </Button>
            </div>
        </form>
    )
} 