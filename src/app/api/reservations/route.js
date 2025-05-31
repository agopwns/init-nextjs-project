import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const {
            productId,
            userId,
            reservationDate,
            participants,
            specialRequests
        } = await request.json()

        // 필수 필드 검증
        if (!productId || !userId || !reservationDate || !participants) {
            return NextResponse.json(
                { error: '필수 정보가 누락되었습니다' },
                { status: 400 }
            )
        }

        // 상품 정보 조회하여 가격 계산
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('price, max_participants')
            .eq('id', productId)
            .eq('is_active', true)
            .single()

        if (productError) {
            return NextResponse.json(
                { error: '상품 정보를 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        // 인원 수 검증
        if (participants > product.max_participants) {
            return NextResponse.json(
                { error: `최대 ${product.max_participants}명까지 예약 가능합니다` },
                { status: 400 }
            )
        }

        // 총 금액 계산
        const totalAmount = product.price * participants

        // 예약 생성
        const { data, error } = await supabase
            .from('reservations')
            .insert([
                {
                    product_id: productId,
                    user_id: userId,
                    reservation_date: reservationDate,
                    participants,
                    total_amount: totalAmount,
                    special_requests: specialRequests || null,
                    status: 'pending'
                }
            ])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('예약 생성 실패:', error)
        return NextResponse.json(
            { error: '예약 처리 중 오류가 발생했습니다' },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: '사용자 ID가 필요합니다' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('reservations')
            .select(`
        *,
        products (
          title,
          category,
          images,
          location
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('예약 목록 조회 실패:', error)
        return NextResponse.json(
            { error: '예약 목록을 가져올 수 없습니다' },
            { status: 500 }
        )
    }
} 