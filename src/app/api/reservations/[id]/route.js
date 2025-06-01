import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
    try {
        const { id } = params

        // 예약 삭제
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: '예약이 삭제되었습니다.'
        })

    } catch (error) {
        console.error('예약 삭제 실패:', error)
        return NextResponse.json(
            { error: error.message || '예약 삭제에 실패했습니다.' },
            { status: 500 }
        )
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params

        const { data, error } = await supabase
            .from('reservations')
            .select(`
                *,
                products (
                    title,
                    category,
                    images,
                    location,
                    price
                ),
                payments (
                    *
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error) {
        console.error('예약 조회 실패:', error)
        return NextResponse.json(
            { error: error.message || '예약 정보를 가져올 수 없습니다.' },
            { status: 500 }
        )
    }
} 