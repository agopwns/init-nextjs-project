'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')

        // 기본 검증
        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요')
            return
        }

        startTransition(async () => {
            setError('')

            const result = await signIn(email, password)

            if (result.success) {
                // 로그인 성공 시 홈페이지로 리다이렉션
                router.push('/')
            } else {
                setError(result.error)
            }
        })
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
                <CardDescription className="text-center">
                    계정에 로그인하여 서비스를 이용하세요
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            disabled={isPending}
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 입력하세요"
                                required
                                disabled={isPending}
                                className="pr-10"
                                autoComplete="current-password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isPending}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                로그인 중...
                            </>
                        ) : (
                            '로그인'
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">아직 계정이 없으신가요? </span>
                    <a
                        href="/auth/register"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        회원가입
                    </a>
                </div>

                <div className="mt-2 text-center text-sm">
                    <a
                        href="/auth/forgot-password"
                        className="text-muted-foreground underline-offset-4 hover:underline"
                    >
                        비밀번호를 잊으셨나요?
                    </a>
                </div>
            </CardContent>
        </Card>
    )
} 