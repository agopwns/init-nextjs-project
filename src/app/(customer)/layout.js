import Link from 'next/link'

export default function CustomerLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">예약 플랫폼</h1>
                        </div>
                        <nav className="flex space-x-8">
                            <Link href="/" className="text-gray-500 hover:text-gray-900">홈</Link>
                            <Link href="/products" className="text-gray-500 hover:text-gray-900">상품</Link>
                            <Link href="/auth/login" className="text-gray-500 hover:text-gray-900">로그인</Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
} 