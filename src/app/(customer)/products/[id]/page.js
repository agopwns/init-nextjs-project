'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useProduct } from '@/hooks/use-products'

export default function ProductDetailPage({ params }) {
    const resolvedParams = use(params)
    const { product, loading, error, refetch } = useProduct(resolvedParams?.id)

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    {/* 브레드크럼 스켈레톤 */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            <span>/</span>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <span>/</span>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* 상품 상세 스켈레톤 */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 이미지 스켈레톤 */}
                            <div className="h-96 bg-gray-200 rounded-lg"></div>

                            {/* 정보 스켈레톤 */}
                            <div className="space-y-4">
                                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="space-y-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex">
                                            <div className="h-4 w-20 bg-gray-200 rounded mr-4"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-6">
                                    <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg mb-4">오류가 발생했습니다</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <div className="flex justify-center space-x-4">
                        <Button onClick={refetch} variant="outline">
                            다시 시도
                        </Button>
                        <Link href="/products">
                            <Button>상품 목록으로 돌아가기</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
                    <Link href="/products">
                        <Button>상품 목록으로 돌아가기</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 브레드크럼 */}
            <nav className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-700">홈</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-gray-700">상품</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.title}</span>
                </div>
            </nav>

            {/* 상품 상세 정보 */}
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 이미지 섹션 */}
                    <div>
                        <img
                            src={product.images?.[0] || '/placeholder-image.jpg'}
                            alt={product.title}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* 정보 섹션 */}
                    <div>
                        <div className="mb-4">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                        <p className="text-gray-600 mb-6">{product.description}</p>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center flex-nowrap">
                                <span className="text-gray-500 w-32 flex-shrink-0">📍 위치:</span>
                                <span className="text-gray-900">{product.location}</span>
                            </div>
                            <div className="flex items-center flex-nowrap">
                                <span className="text-gray-500 w-32 flex-shrink-0">⏱️ 소요시간:</span>
                                <span className="text-gray-900">{product.duration}분</span>
                            </div>
                            <div className="flex items-center flex-nowrap">
                                <span className="text-gray-500 w-32 flex-shrink-0">👥 최대인원:</span>
                                <span className="text-gray-900">{product.max_participants}명</span>
                            </div>
                            <div className="flex items-center flex-nowrap">
                                <span className="text-gray-500 w-32 flex-shrink-0">📋 요구사항:</span>
                                <span className="text-gray-900">{product.requirements}</span>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ₩{Number(product.price).toLocaleString()}
                            </div>

                            <div className="space-y-3">
                                <Link href={`/booking/${product.id}`}>
                                    <Button className="w-full" size="lg">
                                        예약하기
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button variant="outline" className="w-full">
                                        상품 목록으로 돌아가기
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 