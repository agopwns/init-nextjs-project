import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params
        const productId = resolvedParams.id

        if (!productId) {
            return NextResponse.json(
                { error: '상품 ID가 필요합니다' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .eq('is_active', true)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: '상품을 찾을 수 없습니다' },
                    { status: 404 }
                )
            }
            throw error
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('상품 상세 정보 가져오기 실패:', error)
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다' },
            { status: 500 }
        )
    }
} 