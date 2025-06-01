'use server'

import { createServerClient } from '@/lib/supabase'

// 이미지 업로드
export async function uploadImage(file, folder = 'products') {
    try {
        const supabase = createServerClient()

        // 파일 확장자 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 가능)')
        }

        // 파일 크기 검증 (5MB 제한)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            throw new Error('이미지 크기는 5MB를 초과할 수 없습니다.')
        }

        // 고유한 파일명 생성
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()
        const fileName = `${timestamp}_${randomString}.${fileExtension}`
        const filePath = `${folder}/${fileName}`

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            throw new Error(`이미지 업로드 실패: ${error.message}`)
        }

        // 공개 URL 생성
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath)

        return {
            success: true,
            data: {
                path: filePath,
                url: publicUrl,
                fileName: fileName
            }
        }
    } catch (error) {
        console.error('uploadImage error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 여러 이미지 업로드
export async function uploadMultipleImages(files, folder = 'products') {
    try {
        const uploadPromises = Array.from(files).map(file => uploadImage(file, folder))
        const results = await Promise.all(uploadPromises)

        const successfulUploads = results.filter(result => result.success)
        const failedUploads = results.filter(result => !result.success)

        if (failedUploads.length > 0) {
            console.warn('일부 이미지 업로드 실패:', failedUploads)
        }

        return {
            success: true,
            data: {
                successful: successfulUploads.map(result => result.data),
                failed: failedUploads.map(result => result.error)
            }
        }
    } catch (error) {
        console.error('uploadMultipleImages error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 이미지 삭제
export async function deleteImage(filePath) {
    try {
        const supabase = createServerClient()

        const { error } = await supabase.storage
            .from('images')
            .remove([filePath])

        if (error) {
            throw new Error(`이미지 삭제 실패: ${error.message}`)
        }

        return {
            success: true,
            message: '이미지가 성공적으로 삭제되었습니다.'
        }
    } catch (error) {
        console.error('deleteImage error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 여러 이미지 삭제
export async function deleteMultipleImages(filePaths) {
    try {
        const supabase = createServerClient()

        const { error } = await supabase.storage
            .from('images')
            .remove(filePaths)

        if (error) {
            throw new Error(`이미지 삭제 실패: ${error.message}`)
        }

        return {
            success: true,
            message: `${filePaths.length}개의 이미지가 성공적으로 삭제되었습니다.`
        }
    } catch (error) {
        console.error('deleteMultipleImages error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

// 이미지 URL에서 파일 경로 추출
export async function extractFilePathFromUrl(url) {
    try {
        const urlParts = url.split('/storage/v1/object/public/images/')
        return urlParts[1] || null
    } catch (error) {
        console.error('extractFilePathFromUrl error:', error)
        return null
    }
} 