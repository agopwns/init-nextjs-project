import { RegisterForm } from '@/components/auth/register-form'
import { Suspense } from 'react'

export const metadata = {
    title: '회원가입',
    description: '새 계정을 만들어 서비스를 이용하세요'
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                }>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
} 