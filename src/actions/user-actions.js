'use server'

import { createServerClient } from '@/lib/supabase'

// auth.users에서 사용자 정보 조회
export async function getUserInfo(userId) {
    try {
        const supabase = createServerClient()

        const { data, error } = await supabase.auth.admin.getUserById(userId)

        if (error) {
            console.error('사용자 정보 조회 오류:', error)
            return {
                success: false,
                error: '사용자 정보를 불러오는데 실패했습니다.'
            }
        }

        return {
            success: true,
            data: {
                id: data.user?.id,
                email: data.user?.email,
                name: data.user?.user_metadata?.name || data.user?.user_metadata?.full_name || '사용자',
                phone: data.user?.user_metadata?.phone,
                role: data.user?.user_metadata?.role || data.user?.app_metadata?.role || 'customer'
            }
        }
    } catch (error) {
        console.error('사용자 정보 조회 중 오류:', error)
        return {
            success: false,
            error: '서버 오류가 발생했습니다.'
        }
    }
}

// 여러 사용자 정보를 한 번에 조회
export async function getUsersInfo(userIds) {
    try {
        const supabase = createServerClient()
        const users = {}

        // 중복 제거
        const uniqueUserIds = [...new Set(userIds)]

        for (const userId of uniqueUserIds) {
            if (userId) {
                const result = await getUserInfo(userId)
                if (result.success) {
                    users[userId] = result.data
                } else {
                    // 실패한 경우 임시 정보 사용
                    users[userId] = {
                        id: userId,
                        email: `user-${userId.slice(0, 8)}@example.com`,
                        name: `사용자-${userId.slice(0, 8)}`,
                        phone: null,
                        role: 'customer'
                    }
                }
            }
        }

        return {
            success: true,
            data: users
        }
    } catch (error) {
        console.error('사용자들 정보 조회 중 오류:', error)
        return {
            success: false,
            error: '서버 오류가 발생했습니다.'
        }
    }
} 