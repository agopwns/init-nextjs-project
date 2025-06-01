import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
    try {
        const supabase = createServerClient()
        const { id } = params

        if (!id) {
            return Response.json({ error: '예약 ID가 필요합니다.' }, { status: 400 })
        }

        // 예약 삭제
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('예약 삭제 오류:', error)
            return Response.json({ error: '예약 삭제에 실패했습니다.' }, { status: 500 })
        }

        return Response.json({ message: '예약이 삭제되었습니다.' })

    } catch (error) {
        console.error('예약 삭제 처리 중 오류:', error)
        return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}

export async function GET(request, { params }) {
    try {
        const supabase = createServerClient()
        const { id } = params

        if (!id) {
            return Response.json({ error: '예약 ID가 필요합니다.' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('reservations')
            .select(`
                *,
                products (*),
                payments (*)
            `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('예약 조회 오류:', error)
            return Response.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
        }

        return Response.json(data)

    } catch (error) {
        console.error('예약 조회 처리 중 오류:', error)
        return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
} 