'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BookingSuccessPage() {
    const searchParams = useSearchParams()
    const reservationId = searchParams.get('reservationId')

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
                    예약이 완료되었습니다!
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    예약 요청이 성공적으로 접수되었습니다.<br />
                    곧 확인 후 연락드리겠습니다.
                </p>

                {/* 예약 번호 */}
                {reservationId && (
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
                    <h3 className="font-semibold text-gray-900 mb-3">다음 단계</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">1.</span>
                            예약 확인 및 승인 과정을 거칩니다
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">2.</span>
                            승인 후 결제 안내를 해드립니다
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">3.</span>
                            결제 완료 후 예약이 확정됩니다
                        </li>
                    </ul>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products">
                        <Button variant="outline" className="w-full sm:w-auto">
                            다른 상품 둘러보기
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="w-full sm:w-auto">
                            홈으로 가기
                        </Button>
                    </Link>
                </div>

                {/* 문의 정보 */}
                <div className="mt-12 pt-8 border-t text-sm text-gray-500">
                    <p>
                        문의사항이 있으시면
                        <a href="tel:1588-0000" className="text-blue-600 hover:text-blue-800 ml-1">
                            1588-0000
                        </a>
                        으로 연락주세요
                    </p>
                </div>
            </div>
        </div>
    )
} 