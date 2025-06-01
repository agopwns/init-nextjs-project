'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useProduct } from '@/hooks/use-products'
import { useCreateReservation } from '@/hooks/use-reservations'
import { useAuth } from '@/hooks/use-auth'
import { BookingForm } from '@/components/customer/booking-form'

export default function BookingPage({ params }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const { product, loading: productLoading, error: productError } = useProduct(resolvedParams?.productId)
    const { createReservation, loading: reservationLoading, error: reservationError } = useCreateReservation()
    const { user, loading: authLoading, isAuthenticated } = useAuth()

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.')
            router.push('/auth/login')
        }
    }, [authLoading, isAuthenticated, router])

    const handleBookingSubmit = async (reservationResult) => {
        try {
            // 결제 완료 후 성공 페이지로 이동
            alert('결제가 완료되어 예약이 확정되었습니다!')
            router.push(`/booking/success?reservationId=${reservationResult.id}`)

        } catch (error) {
            console.error('예약 완료 처리 실패:', error)
            alert('예약 완료 처리 중 오류가 발생했습니다.')
        }
    }

    // 인증 로딩 중이거나 로그인하지 않은 경우
    if (authLoading || !isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-600">
                        {authLoading ? '사용자 정보를 확인 중입니다...' : '로그인 페이지로 이동 중입니다...'}
                    </div>
                </div>
            </div>
        )
    }

    if (productLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    {/* 브레드크럼 스켈레톤 */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            <span>/</span>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <span>/</span>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* 제목 스켈레톤 */}
                    <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>

                    {/* 폼 스켈레톤 */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="space-y-6">
                            <div className="h-24 bg-gray-200 rounded"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (productError || !product) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg mb-4">
                        {productError || '상품을 찾을 수 없습니다'}
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Link href="/products">
                            <Button>상품 목록으로 돌아가기</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 브레드크럼 */}
            <nav className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-700">홈</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-gray-700">상품</Link>
                    <span>/</span>
                    <Link href={`/products/${product.id}`} className="hover:text-gray-700">
                        {product.title}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">예약</span>
                </div>
            </nav>

            {/* 페이지 제목 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">예약하기</h1>
                <p className="text-gray-600">예약 정보를 입력하고 확정해주세요</p>
                {user && (
                    <div className="mt-2 text-sm text-blue-600">
                        {user.user_metadata?.name || user.email}님의 예약
                    </div>
                )}
            </div>

            {/* 예약 폼 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                {reservationError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-600 font-medium">예약 오류</div>
                        <div className="text-red-500 text-sm">{reservationError}</div>
                    </div>
                )}

                <BookingForm
                    product={product}
                    onSubmit={handleBookingSubmit}
                    loading={reservationLoading}
                />
            </div>

            {/* 하단 버튼 */}
            <div className="mt-8 text-center">
                <Link href={`/products/${product.id}`}>
                    <Button variant="outline">
                        상품 정보로 돌아가기
                    </Button>
                </Link>
            </div>
        </div>
    )
} 