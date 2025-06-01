export default function ReservationsPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">예약 관리</h1>

                {/* 필터 옵션 */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>모든 상태</option>
                        <option>대기 중</option>
                        <option>확정</option>
                        <option>취소</option>
                        <option>완료</option>
                    </select>

                    <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>모든 상품</option>
                        <option>스카이다이빙 체험</option>
                        <option>패러글라이딩 체험</option>
                        <option>서핑 체험</option>
                    </select>
                </div>

                {/* 캘린더 뷰 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {/* 캘린더 헤더 */}
                        <div className="font-semibold p-2">일</div>
                        <div className="font-semibold p-2">월</div>
                        <div className="font-semibold p-2">화</div>
                        <div className="font-semibold p-2">수</div>
                        <div className="font-semibold p-2">목</div>
                        <div className="font-semibold p-2">금</div>
                        <div className="font-semibold p-2">토</div>

                        {/* 임시 캘린더 날짜들 */}
                        {Array.from({ length: 35 }, (_, i) => (
                            <div key={i} className="p-2 border border-gray-200 min-h-[80px] bg-white rounded">
                                <div className="text-sm text-gray-600">{i > 5 ? i - 5 : ''}</div>
                                {i === 10 && (
                                    <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mt-1">
                                        예약 3건
                                    </div>
                                )}
                                {i === 15 && (
                                    <div className="text-xs bg-green-100 text-green-800 p-1 rounded mt-1">
                                        예약 2건
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 예약 목록 테이블 */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    예약 ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    고객명
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상품명
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    예약일시
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    참가자 수
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    금액
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상태
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    액션
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* 임시 데이터 */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #RES001
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    김철수
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    스카이다이빙 체험
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-12-15 14:00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2명
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₩300,000
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                        대기 중
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="text-green-600 hover:text-green-900">승인</button>
                                    <button className="text-red-600 hover:text-red-900">거절</button>
                                    <button className="text-blue-600 hover:text-blue-900">상세</button>
                                </td>
                            </tr>

                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #RES002
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    이영희
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    패러글라이딩 체험
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    2024-12-16 10:00
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    1명
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₩120,000
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        확정
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900">상세</button>
                                    <button className="text-gray-600 hover:text-gray-900">수정</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 