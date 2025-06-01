export default function AdminMainPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">관리자 대시보드</h1>
                <p className="text-gray-600 mb-6">환영합니다. 아래 메뉴를 통해 시스템을 관리하세요.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 대시보드 카드 */}
                    <a href="/admin/dashboard" className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                        <h3 className="font-semibold text-blue-900 mb-2">대시보드</h3>
                        <p className="text-blue-700 text-sm">전체 현황 보기</p>
                    </a>

                    {/* 상품 관리 카드 */}
                    <a href="/admin/products" className="bg-green-50 p-6 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                        <h3 className="font-semibold text-green-900 mb-2">상품 관리</h3>
                        <p className="text-green-700 text-sm">상품 생성, 수정, 삭제</p>
                    </a>

                    {/* 예약 관리 카드 */}
                    <a href="/admin/dashboard/reservations" className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                        <h3 className="font-semibold text-purple-900 mb-2">예약 관리</h3>
                        <p className="text-purple-700 text-sm">캘린더 기반 예약 관리</p>
                    </a>

                    {/* 결제 관리 카드 */}
                    <a href="/admin/dashboard/payments" className="bg-orange-50 p-6 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                        <h3 className="font-semibold text-orange-900 mb-2">결제 관리</h3>
                        <p className="text-orange-700 text-sm">결제 상태 확인 및 관리</p>
                    </a>
                </div>
            </div>
        </div>
    )
} 