'use client'

import { useState, useTransition } from 'react'
import { signUp } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')
        const name = formData.get('name')
        const phone = formData.get('phone') || ''

        // 기본 검증
        if (!email || !password || !name) {
            setError('필수 정보를 모두 입력해주세요')
            return
        }

        if (password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다')
            return
        }

        if (name.length < 2) {
            setError('이름은 최소 2자 이상이어야 합니다')
            return
        }

        startTransition(async () => {
            setError('')
            setMessage('')

            const result = await signUp(email, password, name, phone)

            if (result.success) {
                setMessage('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
                // 폼 리셋
                e.target.reset()
                setShowPassword(false)
            } else {
                setError(result.error)
            }
        })
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
                <CardDescription className="text-center">
                    새 계정을 만들어 서비스를 이용해보세요
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="홍길동"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">전화번호 (선택)</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="최소 6자 이상"
                                required
                                disabled={isPending}
                                className="pr-10"
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

                    {message && (
                        <Alert>
                            <AlertDescription className="text-green-600">{message}</AlertDescription>
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
                                처리 중...
                            </>
                        ) : (
                            '회원가입'
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
                    <a
                        href="/auth/login"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        로그인
                    </a>
                </div>
            </CardContent>
        </Card>
    )
} 