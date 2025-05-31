'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { LogoutButton } from './logout-button'
import Link from 'next/link'

export function AuthStatus() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 현재 세션 확인
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
            setLoading(false)
        }

        getSession()

        // 인증 상태 변화 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="flex gap-4">
                <Button variant="outline" size="lg" disabled>
                    로딩 중...
                </Button>
            </div>
        )
    }

    if (user) {
        return (
            <div className="flex gap-4 items-center">
                <span className="text-gray-600">
                    안녕하세요, {user.user_metadata?.name || user.email}님!
                </span>
                <LogoutButton variant="outline" size="lg" />
            </div>
        )
    }

    return (
        <div className="flex gap-4">
            <Link href="/auth/login">
                <Button variant="outline" size="lg">
                    로그인
                </Button>
            </Link>
            <Link href="/auth/register">
                <Button size="lg">
                    회원가입
                </Button>
            </Link>
        </div>
    )
} 