import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // 현재 세션 확인
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    throw error
                }

                setUser(session?.user || null)
            } catch (err) {
                setError(err.message)
                console.error('세션 확인 실패:', err)
            } finally {
                setLoading(false)
            }
        }

        getSession()

        // 인증 상태 변화 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null)
                setLoading(false)
                setError(null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user
    }
} 