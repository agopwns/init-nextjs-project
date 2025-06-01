export default function EditProductPage({ params }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">상품 수정</h1>
                    <a href="/admin/products" className="text-gray-600 hover:text-gray-900">← 상품 목록으로</a>
                </div>

                {/* 상품 수정 폼 */}
                <form className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">상품명</label>
                            <input
                                type="text"
                                defaultValue="스카이다이빙 체험"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="상품명을 입력하세요"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                            <select
                                defaultValue="익스트림 스포츠"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>카테고리 선택</option>
                                <option>익스트림 스포츠</option>
                                <option>문화 체험</option>
                                <option>자연 체험</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">가격 (원)</label>
                            <input
                                type="number"
                                defaultValue="150000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="가격을 입력하세요"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">소요시간 (분)</label>
                            <input
                                type="number"
                                defaultValue="180"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="소요시간을 입력하세요"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">최대 참가자 수</label>
                            <input
                                type="number"
                                defaultValue="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="최대 참가자 수"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">위치</label>
                            <input
                                type="text"
                                defaultValue="강원도 원주시"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="위치를 입력하세요"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">상품 설명</label>
                        <textarea
                            rows={4}
                            defaultValue="스릴 넘치는 스카이다이빙 체험을 통해 하늘을 날아보세요."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="상품에 대한 자세한 설명을 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이용 요건</label>
                        <textarea
                            rows={3}
                            defaultValue="18세 이상, 체중 40kg~100kg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이용 요건을 입력하세요"
                        />
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="text-red-800 font-medium mb-2">위험 구역</h3>
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            상품 삭제
                        </button>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <a href="/admin/products" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                            취소
                        </a>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            변경사항 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 