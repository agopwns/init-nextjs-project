'use client'

import { useState, useRef } from 'react'
import { uploadMultipleImages } from '@/actions/image-actions'

export function ImageUpload({ images = [], onImagesChange, maxImages = 5 }) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (files) => {
        if (!files || files.length === 0) return

        // 최대 이미지 개수 확인
        if (images.length + files.length > maxImages) {
            alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
            return
        }

        try {
            setUploading(true)

            const result = await uploadMultipleImages(files, 'products')

            if (result.success) {
                const newImages = [...images, ...result.data.successful.map(img => img.url)]
                onImagesChange(newImages)

                if (result.data.failed.length > 0) {
                    alert(`일부 이미지 업로드에 실패했습니다: ${result.data.failed.join(', ')}`)
                }
            } else {
                alert(`업로드 실패: ${result.error}`)
            }
        } catch (error) {
            alert('이미지 업로드 중 오류가 발생했습니다.')
            console.error('handleFileSelect error:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files)
        handleFileSelect(files)
        e.target.value = '' // 같은 파일 재선택 허용
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length === 0) {
            alert('이미지 파일만 업로드할 수 있습니다.')
            return
        }

        handleFileSelect(files)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-4">
            {/* 파일 입력 */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* 드래그 앤 드롭 영역 */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={openFileDialog}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {uploading ? (
                    <div className="space-y-2">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                        <p className="text-gray-600">이미지 업로드 중...</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                            <p className="text-gray-600">
                                <span className="font-medium text-blue-600">클릭하여 파일 선택</span>
                                {' '}또는 드래그하여 업로드
                            </p>
                            <p className="text-sm text-gray-500">
                                PNG, JPG, WebP (최대 5MB, {maxImages}개까지)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                        업로드된 이미지 ({images.length}/{maxImages})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                                    <img
                                        src={imageUrl}
                                        alt={`상품 이미지 ${index + 1}`}
                                        className="h-full w-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.png'
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    title="이미지 삭제"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        대표 이미지
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">
                        첫 번째 이미지가 대표 이미지로 사용됩니다. 드래그하여 순서를 변경할 수 있습니다.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageUpload 