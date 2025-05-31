'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/customer/product-card'
import { ProductCardSkeleton } from '@/components/customer/product-card-skeleton'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/use-products'

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('전체')
    const [sortBy, setSortBy] = useState('latest')

    const { products, categories, loading, error, refetch } = useProducts()

    const filteredProducts = products.filter(product => {
        if (selectedCategory === '전체') return true
        return product.category === selectedCategory
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'duration':
                return a.duration - b.duration
            default:
                // latest (기본값)
                return new Date(b.created_at) - new Date(a.created_at)
        }
    })

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg mb-4">오류가 발생했습니다</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <Button onClick={refetch} variant="outline">
                        다시 시도
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 헤더 섹션 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">체험 상품</h1>
                <p className="text-gray-600">다양한 체험 상품을 둘러보고 예약해보세요!</p>
            </div>

            {/* 필터 및 정렬 섹션 */}
            <div className="mb-8 space-y-4">
                {/* 카테고리 필터 */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">카테고리</h3>
                    <div className="flex flex-wrap gap-2">
                        {loading ? (
                            // 로딩 중일 때는 기본 카테고리만 표시
                            <div className="flex gap-2">
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-8 w-18 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))
                        )}
                    </div>
                </div>

                {/* 정렬 옵션 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">정렬:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="latest">최신순</option>
                            <option value="price-low">가격 낮은순</option>
                            <option value="price-high">가격 높은순</option>
                            <option value="duration">소요시간순</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500">
                        {loading ? (
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            `총 ${sortedProducts.length}개의 상품`
                        )}
                    </div>
                </div>
            </div>

            {/* 상품 그리드 */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-2">선택한 카테고리에 상품이 없습니다</div>
                    <Button
                        variant="outline"
                        onClick={() => setSelectedCategory('전체')}
                    >
                        전체 상품 보기
                    </Button>
                </div>
            )}
        </div>
    )
} 