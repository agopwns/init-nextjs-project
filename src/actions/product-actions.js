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