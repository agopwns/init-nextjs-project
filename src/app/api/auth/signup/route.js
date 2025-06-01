import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { email, password, name, phone } = await request.json()

        const supabase = createServerClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone: phone || '',
                    role: 'customer'
                }
            }
        })

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
            user: {
                id: data.user.id,
                email: data.user.email,
                role: data.user.raw_user_meta_data?.role || 'customer'
            }
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: '회원가입 중 오류가 발생했습니다' },
            { status: 500 }
        )
    }
} 