import { supabase } from './supabase'

// 회원가입
export async function signUp(email, password, name, phone = '') {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone
                }
            }
        })

        if (error) {
            if (error.message === 'User already registered') {
                throw new Error('이미 등록된 이메일입니다')
            }
            throw new Error('회원가입 중 오류가 발생했습니다')
        }

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// 로그인
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('이메일 또는 비밀번호가 올바르지 않습니다')
            }
            if (error.message.includes('Email not confirmed')) {
                throw new Error('이메일 인증이 필요합니다. 이메일을 확인해주세요')
            }
            throw new Error('로그인 중 오류가 발생했습니다')
        }

        return { success: true, data }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// 로그아웃
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) {
            throw new Error('로그아웃 중 오류가 발생했습니다')
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            throw new Error('사용자 정보를 가져올 수 없습니다')
        }

        return { success: true, user }
    } catch (error) {
        return { success: false, error: error.message }
    }
} 