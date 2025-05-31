'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'

export function LogoutButton({
    variant = 'ghost',
    size = 'sm',
    className = '',
    showIcon = true,
    children
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleLogout = () => {
        startTransition(async () => {
            const result = await signOut()

            if (result.success) {
                // 로그아웃 성공 시 로그인 페이지로 리다이렉션
                router.push('/auth/login')
            }
        })
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그아웃 중...
                </>
            ) : (
                <>
                    {showIcon && <LogOut className="mr-2 h-4 w-4" />}
                    {children || '로그아웃'}
                </>
            )}
        </Button>
    )
} 