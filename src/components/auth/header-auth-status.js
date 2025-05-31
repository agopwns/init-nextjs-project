'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function HeaderAuthStatus() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

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

    const handleLogout = async () => {
        const result = await signOut()
        if (result.success) {
            router.push('/auth/login')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </div>
        )
    }

    if (user) {
        // 사용자 이름의 첫 글자 (아바타용)
        const getInitials = (name) => {
            if (!name) return user.email?.charAt(0)?.toUpperCase() || 'U'
            return name.charAt(0).toUpperCase()
        }

        const userName = user.user_metadata?.name || user.email

        return (
            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(user.user_metadata?.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user.user_metadata?.name || '사용자'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>프로필</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>설정</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>로그아웃</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <div className="flex items-center space-x-2">
            <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                    로그인
                </Button>
            </Link>
            <Link href="/auth/register">
                <Button size="sm">
                    회원가입
                </Button>
            </Link>
        </div>
    )
} 