'use server'

import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// 회원가입 스키마 정의
const signUpSchema = z.object({
    email: z.string().email('올바른 이메일 주소를 입력해주세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
    phone: z.string().min(10, '올바른 전화번호를 입력해주세요').optional()
})

// 로그인 스키마 정의
const signInSchema = z.object({
    email: z.string().email('올바른 이메일 주소를 입력해주세요'),
    password: z.string().min(1, '비밀번호를 입력해주세요')
})

export async function signUpAction(formData) {
    try {
        // FormData에서 데이터 추출
        const rawFormData = {
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
            phone: formData.get('phone')
        }

        // 데이터 검증
        const validatedData = signUpSchema.parse(rawFormData)

        // Supabase 서버 클라이언트 생성
        const supabase = createServerClient()

        // 사용자 회원가입
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    name: validatedData.name,
                    phone: validatedData.phone || ''
                }
            }
        })

        if (authError) {
            console.error('Auth error:', authError)
            return {
                success: false,
                error: authError.message === 'User already registered'
                    ? '이미 등록된 이메일입니다'
                    : '회원가입 중 오류가 발생했습니다'
            }
        }

        // 회원가입 성공
        if (authData.user) {
            return {
                success: true,
                message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.'
            }
        }

    } catch (error) {
        console.error('Signup error:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message
            }
        }

        return {
            success: false,
            error: '예상치 못한 오류가 발생했습니다'
        }
    }
}

export async function signInAction(formData) {
    try {
        // FormData에서 데이터 추출
        const rawFormData = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        // 데이터 검증
        const validatedData = signInSchema.parse(rawFormData)

        // Supabase 서버 클라이언트 생성
        const supabase = createServerClient()

        // 사용자 로그인
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password
        })

        if (authError) {
            console.error('Login error:', authError)

            if (authError.message.includes('Invalid login credentials')) {
                return {
                    success: false,
                    error: '이메일 또는 비밀번호가 올바르지 않습니다'
                }
            }

            if (authError.message.includes('Email not confirmed')) {
                return {
                    success: false,
                    error: '이메일 인증이 필요합니다. 이메일을 확인해주세요'
                }
            }

            return {
                success: false,
                error: '로그인 중 오류가 발생했습니다'
            }
        }

        // 로그인 성공 - redirect 제거하고 성공 상태만 반환
        if (authData.user) {
            return {
                success: true,
                message: '로그인이 완료되었습니다'
            }
        }

    } catch (error) {
        console.error('Login error:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message
            }
        }

        return {
            success: false,
            error: '예상치 못한 오류가 발생했습니다'
        }
    }
}

export async function signOutAction() {
    try {
        const supabase = createServerClient()

        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Logout error:', error)
            return {
                success: false,
                error: '로그아웃 중 오류가 발생했습니다'
            }
        }

        // 로그아웃 성공 - redirect 제거하고 성공 상태만 반환
        return {
            success: true,
            message: '로그아웃이 완료되었습니다'
        }

    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            error: '예상치 못한 오류가 발생했습니다'
        }
    }
}

export async function checkEmailAvailability(email) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase
            .from('auth.users')
            .select('email')
            .eq('email', email)
            .single()

        if (error && error.code !== 'PGRST116') {
            return { available: false, error: '이메일 확인 중 오류가 발생했습니다' }
        }

        return { available: !data }
    } catch (error) {
        console.error('Email check error:', error)
        return { available: false, error: '이메일 확인 중 오류가 발생했습니다' }
    }
} 