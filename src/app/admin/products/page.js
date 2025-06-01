'use client'

import { useState, useEffect } from 'react'
import { getAllProductsForAdmin, deleteProduct, toggleProductStatus } from '@/actions/product-actions'
import Link from 'next/link'

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [togglingId, setTogglingId] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            setLoading(true)
            setError(null)

            const result = await getAllProductsForAdmin()

            if (result.success) {
                setProducts(result.data)
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('상품 목록을 불러오는데 실패했습니다.')
            console.error('fetchProducts error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(productId) {
        if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            return
        }

        try {
            setDeletingId(productId)
            const result = await deleteProduct(productId)

            if (result.success) {
                await fetchProducts() // 목록 새로고침
                alert('상품이 성공적으로 삭제되었습니다.')
            } else {
                alert(`삭제 실패: ${result.error}`)
            }
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.')
            console.error('handleDelete error:', error)
        } finally {
            setDeletingId(null)
        }
    }

    async function handleToggleStatus(productId, currentStatus) {
        try {
            setTogglingId(productId)
            const result = await toggleProductStatus(productId, !currentStatus)

            if (result.success) {
                await fetchProducts() // 목록 새로고침
                alert(`상품이 ${!currentStatus ? '활성화' : '비활성화'}되었습니다.`)
            } else {
                alert(`상태 변경 실패: ${result.error}`)
            }
        } catch (error) {
            alert('상태 변경 중 오류가 발생했습니다.')
            console.error('handleToggleStatus error:', error)
        } finally {
            setTogglingId(null)
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price)
    }

    function formatDuration(duration) {
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60

        if (hours > 0 && minutes > 0) {
            return `${hours}시간 ${minutes}분`
        } else if (hours > 0) {
            return `${hours}시간`
        } else {
            return `${minutes}분`
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
                        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            새 상품 등록
                        </Link>
                    </div>
                    <div className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-2 text-gray-600">상품 목록을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
                        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            새 상품 등록
                        </Link>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
                    <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        새 상품 등록
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">등록된 상품이 없습니다.</p>
                        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            첫 번째 상품 등록하기
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상품명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        카테고리
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        가격
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        소요시간
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        최대인원
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
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {product.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDuration(product.duration)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.max_participants}명
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(product.id, product.is_active)}
                                                disabled={togglingId === product.id}
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${product.is_active
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    } transition-colors disabled:opacity-50`}
                                            >
                                                {togglingId === product.id ? '변경중...' : (product.is_active ? '활성' : '비활성')}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                수정
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                {deletingId === product.id ? '삭제중...' : '삭제'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
} 