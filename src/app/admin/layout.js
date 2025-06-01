export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 관리자 네비게이션 헤더 */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">관리자 대시보드</h1>
                        <nav className="flex space-x-8">
                            <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">대시보드</a>
                            <a href="/admin/products" className="text-gray-600 hover:text-gray-900">상품 관리</a>
                            <a href="/admin/dashboard/reservations" className="text-gray-600 hover:text-gray-900">예약 관리</a>
                            <a href="/admin/dashboard/payments" className="text-gray-600 hover:text-gray-900">결제 관리</a>
                            <a href="/admin/dashboard/analytics" className="text-gray-600 hover:text-gray-900">통계</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
} 