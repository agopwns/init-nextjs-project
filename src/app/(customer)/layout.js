import Link from 'next/link'
import { HeaderAuthStatus } from '@/components/auth/header-auth-status'

export default function CustomerLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                                수파 스페이스
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8">
                            <nav className="flex space-x-8">
                                <Link href="/" className="text-gray-500 hover:text-gray-900">홈</Link>
                                <Link href="/products" className="text-gray-500 hover:text-gray-900">상품</Link>
                            </nav>

                            {/* 인증 상태 컴포넌트 */}
                            <HeaderAuthStatus />
                        </div>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
} 