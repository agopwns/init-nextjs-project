export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

                {/* 통계 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900">총 상품</h3>
                        <p className="text-3xl font-bold text-blue-600">24</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900">이번 달 예약</h3>
                        <p className="text-3xl font-bold text-green-600">156</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900">대기 중 예약</h3>
                        <p className="text-3xl font-bold text-purple-600">8</p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-orange-900">이번 달 매출</h3>
                        <p className="text-3xl font-bold text-orange-600">₩2,340,000</p>
                    </div>
                </div>

                {/* 빠른 액션 버튼들 */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">빠른 액션</h2>
                    <div className="flex flex-wrap gap-4">
                        <a href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            새 상품 등록
                        </a>
                        <a href="/admin/dashboard/reservations" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            예약 관리
                        </a>
                        <a href="/admin/dashboard/analytics" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            통계 보기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
} 