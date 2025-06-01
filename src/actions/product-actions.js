'use server'

import { createServerClient } from '@/lib/supabase'

export async function getProducts() {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`상품 조회 실패: ${error.message}`)
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('getProducts error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export async function getProductsByCategory(category) {
    try {
        const supabase = createServerClient()

        let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (category && category !== '전체') {
            query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`카테고리별 상품 조회 실패: ${error.message}`)
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('getProductsByCategory error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export async function getCategories() {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .select('category')
            .eq('is_active', true)

        if (error) {
            throw new Error(`카테고리 조회 실패: ${error.message}`)
        }

        // 중복 제거하여 유니크한 카테고리만 반환
        const uniqueCategories = ['전체', ...new Set(data?.map(item => item.category).filter(Boolean))]

        return {
            success: true,
            data: uniqueCategories
        }
    } catch (error) {
        console.error('getCategories error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export async function getProductById(id) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (error) {
            throw new Error(`상품 상세 조회 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('getProductById error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 관리자용 상품 조회 (모든 상품 포함)
export async function getAllProductsForAdmin() {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`관리자 상품 조회 실패: ${error.message}`)
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('getAllProductsForAdmin error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 상품 생성
export async function createProduct(productData) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .insert([{
                title: productData.title,
                description: productData.description,
                price: parseFloat(productData.price),
                duration: parseInt(productData.duration),
                category: productData.category,
                images: productData.images || [],
                is_active: productData.is_active ?? true,
                max_participants: parseInt(productData.max_participants) || 1,
                location: productData.location,
                requirements: productData.requirements,
                created_by: productData.created_by
            }])
            .select()
            .single()

        if (error) {
            throw new Error(`상품 생성 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('createProduct error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 상품 수정
export async function updateProduct(productId, productData) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .update({
                title: productData.title,
                description: productData.description,
                price: parseFloat(productData.price),
                duration: parseInt(productData.duration),
                category: productData.category,
                images: productData.images || [],
                is_active: productData.is_active,
                max_participants: parseInt(productData.max_participants) || 1,
                location: productData.location,
                requirements: productData.requirements,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single()

        if (error) {
            throw new Error(`상품 수정 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('updateProduct error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 상품 삭제 (실제로는 비활성화)
export async function deleteProduct(productId) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .update({
                is_active: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single()

        if (error) {
            throw new Error(`상품 삭제 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('deleteProduct error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 상품 완전 삭제 (실제 데이터베이스에서 제거)
export async function permanentDeleteProduct(productId) {
    try {
        const supabase = createServerClient()

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) {
            throw new Error(`상품 완전 삭제 실패: ${error.message}`)
        }

        return {
            success: true
        }
    } catch (error) {
        console.error('permanentDeleteProduct error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 상품 활성화/비활성화 토글
export async function toggleProductStatus(productId, isActive) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select()
            .single()

        if (error) {
            throw new Error(`상품 상태 변경 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('toggleProductStatus error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 관리자용 상품 상세 조회 (비활성화된 상품도 포함)
export async function getProductByIdForAdmin(id) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            throw new Error(`관리자 상품 상세 조회 실패: ${error.message}`)
        }

        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('getProductByIdForAdmin error:', error)
        return {
            success: false,
            error: error.message
        }
    }
} 