import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useProducts() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState(['전체'])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            setLoading(true)
            setError(null)

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (error) throw error

            setProducts(data || [])

            // 카테고리 목록 추출
            const uniqueCategories = ['전체', ...new Set(data?.map(product => product.category).filter(Boolean))]
            setCategories(uniqueCategories)

        } catch (err) {
            setError(err.message)
            console.error('상품 데이터 가져오기 실패:', err)
        } finally {
            setLoading(false)
        }
    }

    return {
        products,
        categories,
        loading,
        error,
        refetch: fetchProducts
    }
}

export function useProductsByCategory(category = '전체') {
    const { products, loading, error, refetch } = useProducts()

    const filteredProducts = products.filter(product => {
        if (category === '전체') return true
        return product.category === category
    })

    return {
        products: filteredProducts,
        loading,
        error,
        refetch
    }
} 