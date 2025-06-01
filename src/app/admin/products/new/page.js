'use client'

import { useState } from 'react'
import { createProduct, getCategories } from '@/actions/product-actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/admin/image-upload'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        max_participants: '',
        location: '',
        requirements: '',
        images: [],
        is_active: true
    })

    const categories = [
        '수상스포츠',
        '승마',
        '익스트림 스포츠',
        '문화체험',
        '자연체험',
        '요리체험',
        '레저활동'
    ]

    function handleInputChange(e) {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))

        // 에러 제거
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    function handleImagesChange(newImages) {
        setFormData(prev => ({
            ...prev,
            images: newImages
        }))

        // 이미지 에러 제거
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: '' }))
        }
    }

    function validateForm() {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = '상품명을 입력해주세요.'
        }

        if (!formData.category) {
            newErrors.category = '카테고리를 선택해주세요.'
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = '올바른 가격을 입력해주세요.'
        }

        if (!formData.duration || parseInt(formData.duration) <= 0) {
            newErrors.duration = '올바른 소요시간을 입력해주세요.'
        }

        if (!formData.max_participants || parseInt(formData.max_participants) <= 0) {
            newErrors.max_participants = '올바른 최대 참가자 수를 입력해주세요.'
        }

        if (!formData.location.trim()) {
            newErrors.location = '위치를 입력해주세요.'
        }

        if (!formData.description.trim()) {
            newErrors.description = '상품 설명을 입력해주세요.'
        }

        if (formData.images.length === 0) {
            newErrors.images = '최소 1개의 상품 이미지를 업로드해주세요.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)

            const result = await createProduct({
                ...formData,
                // TODO: 실제 인증된 관리자 ID로 변경해야 함
                created_by: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
            })

            if (result.success) {
                alert('상품이 성공적으로 등록되었습니다!')
                router.push('/admin/products')
            } else {
                alert(`등록 실패: ${result.error}`)
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.')
            console.error('handleSubmit error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">새 상품 등록</h1>
                    <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">← 상품 목록으로</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                상품명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="상품명을 입력하세요"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                카테고리 <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                가격 (원) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0"
                                step="1000"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="가격을 입력하세요"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                소요시간 (분) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="소요시간을 입력하세요"
                            />
                            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                최대 참가자 수 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="max_participants"
                                value={formData.max_participants}
                                onChange={handleInputChange}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.max_participants ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="최대 참가자 수"
                            />
                            {errors.max_participants && <p className="mt-1 text-sm text-red-500">{errors.max_participants}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                위치 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="위치를 입력하세요"
                            />
                            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            상품 설명 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="상품에 대한 자세한 설명을 입력하세요"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이용 요건</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이용 요건을 입력하세요 (예: 만 12세 이상, 수영 가능자)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            상품 이미지 <span className="text-red-500">*</span>
                        </label>
                        <ImageUpload
                            images={formData.images}
                            onImagesChange={handleImagesChange}
                            maxImages={5}
                        />
                        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">상품 활성화</label>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            취소
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '등록 중...' : '상품 등록'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 