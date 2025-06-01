import { useState, useEffect } from 'react'
import { getAllProductsForAdmin, deleteProduct, toggleProductStatus } from '@/actions/product-actions'

export function useAdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    async function handleDeleteProduct(productId) {
        try {
            const result = await deleteProduct(productId)

            if (result.success) {
                await fetchProducts() // 목록 새로고침
                return { success: true }
            } else {
                return { success: false, error: result.error }
            }
        } catch (error) {
            console.error('handleDeleteProduct error:', error)
            return { success: false, error: '삭제 중 오류가 발생했습니다.' }
        }
    }

    async function handleToggleProductStatus(productId, currentStatus) {
        try {
            const result = await toggleProductStatus(productId, !currentStatus)

            if (result.success) {
                await fetchProducts() // 목록 새로고침
                return { success: true }
            } else {
                return { success: false, error: result.error }
            }
        } catch (error) {
            console.error('handleToggleProductStatus error:', error)
            return { success: false, error: '상태 변경 중 오류가 발생했습니다.' }
        }
    }

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        deleteProduct: handleDeleteProduct,
        toggleProductStatus: handleToggleProductStatus
    }
} 