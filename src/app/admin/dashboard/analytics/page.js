export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">매출 및 예약 통계</h1>

                {/* 기간 선택 */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>최근 7일</option>
                        <option>최근 30일</option>
                        <option>최근 3개월</option>
                        <option>최근 1년</option>
                    </select>

                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="flex items-center text-gray-500">~</span>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* 주요 지표 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900">총 매출</h3>
                        <p className="text-3xl font-bold text-blue-600">₩15,840,000</p>
                        <p className="text-sm text-blue-700">+12.5% 전월 대비</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900">총 예약</h3>
                        <p className="text-3xl font-bold text-green-600">247건</p>
                        <p className="text-sm text-green-700">+8.3% 전월 대비</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900">평균 객단가</h3>
                        <p className="text-3xl font-bold text-purple-600">₩64,170</p>
                        <p className="text-sm text-purple-700">+3.7% 전월 대비</p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-orange-900">취소율</h3>
                        <p className="text-3xl font-bold text-orange-600">4.2%</p>
                        <p className="text-sm text-orange-700">-1.1% 전월 대비</p>
                    </div>
                </div>

                {/* 차트 영역 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* 매출 추이 차트 */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">일별 매출 추이</h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {/* 임시 바 차트 */}
                            {Array.from({ length: 7 }, (_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        className="bg-blue-500 w-8 rounded-t"
                                        style={{ height: `${Math.random() * 200 + 50}px` }}
                                    />
                                    <span className="text-xs text-gray-600 mt-2">
                                        12/{8 + i}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 예약 추이 차트 */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">일별 예약 건수</h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {/* 임시 바 차트 */}
                            {Array.from({ length: 7 }, (_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        className="bg-green-500 w-8 rounded-t"
                                        style={{ height: `${Math.random() * 200 + 50}px` }}
                                    />
                                    <span className="text-xs text-gray-600 mt-2">
                                        12/{8 + i}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 상품별 통계 */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">상품별 매출 순위</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        순위
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상품명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        예약 건수
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        매출
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        점유율
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">스카이다이빙 체험</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89건</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₩13,350,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42.3%</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">패러글라이딩 체험</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">67건</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₩8,040,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25.4%</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">서핑 체험</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">91건</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₩7,280,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23.0%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 고객 분석 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 연령대별 분석 */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">연령대별 예약 분포</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">20대</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">35%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">30대</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">42%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">40대</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">18%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">50대 이상</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">5%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 결제 방법별 분석 */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">결제 방법별 분포</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">카드 결제</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">68%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">계좌이체</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">22%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">모바일 결제</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">10%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 