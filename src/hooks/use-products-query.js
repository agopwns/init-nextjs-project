import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Supabase에서 상품 데이터를 가져오는 함수
async function fetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`상품 조회 실패: ${error.message}`)
    }

    return data || []
}

// 카테고리 목록을 가져오는 함수
async function fetchCategories() {
    const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)

    if (error) {
        throw new Error(`카테고리 조회 실패: ${error.message}`)
    }

    const uniqueCategories = ['전체', ...new Set(data?.map(item => item.category).filter(Boolean))]
    return uniqueCategories
}

// React Query를 사용한 상품 데이터 훅
export function useProductsQuery() {
    const {
        data: products = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
        cacheTime: 10 * 60 * 1000, // 10분 동안 캐시 보관
        retry: 2, // 실패시 2번 재시도
        onError: (error) => {
            console.error('상품 데이터 가져오기 실패:', error)
        }
    })

    return {
        products,
        loading: isLoading,
        error: error?.message,
        refetch
    }
}

// React Query를 사용한 카테고리 데이터 훅
export function useCategoriesQuery() {
    const {
        data: categories = ['전체'],
        isLoading,
        error
    } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
        cacheTime: 30 * 60 * 1000, // 30분 동안 캐시 보관
        retry: 2,
        onError: (error) => {
            console.error('카테고리 데이터 가져오기 실패:', error)
        }
    })

    return {
        categories,
        loading: isLoading,
        error: error?.message
    }
}

// 상품과 카테고리를 함께 가져오는 훅
export function useProductsWithCategories() {
    const productsQuery = useProductsQuery()
    const categoriesQuery = useCategoriesQuery()

    return {
        products: productsQuery.products,
        categories: categoriesQuery.categories,
        loading: productsQuery.loading || categoriesQuery.loading,
        error: productsQuery.error || categoriesQuery.error,
        refetch: () => {
            productsQuery.refetch()
            categoriesQuery.refetch()
        }
    }
}

// 특정 카테고리의 상품을 필터링하는 훅
export function useProductsByCategory(category = '전체') {
    const { products, loading, error, refetch } = useProductsQuery()

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