import { createServerClient } from '@/lib/supabase'
import { notificationTypes } from '@/database/models/notification'
import { NextResponse } from 'next/server'

// 알림 생성 API
export async function POST(request) {
    try {
        const supabase = createServerClient()
        const { type, title, message, data, recipientId } = await request.json()

        // 유효성 검사
        if (!type || !title || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: type, title, message' },
                { status: 400 }
            )
        }

        // 알림 데이터 생성
        const notificationData = {
            type,
            title,
            message,
            data: data || {},
            is_read: false,
            recipient_id: recipientId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        // 데이터베이스에 알림 저장
        const { data: notification, error } = await supabase
            .from('notifications')
            .insert([notificationData])
            .select()
            .single()

        if (error) {
            console.error('Error creating notification:', error)
            return NextResponse.json(
                { error: 'Failed to create notification' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            notification
        })

    } catch (error) {
        console.error('Error in notification API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// 알림 목록 조회 API
export async function GET(request) {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const recipientId = searchParams.get('recipientId')
        const limit = parseInt(searchParams.get('limit')) || 50
        const isRead = searchParams.get('isRead')

        let query = supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        // 수신자 필터
        if (recipientId) {
            query = query.eq('recipient_id', recipientId)
        }

        // 읽음 상태 필터
        if (isRead !== null) {
            query = query.eq('is_read', isRead === 'true')
        }

        const { data: notifications, error } = await query

        if (error) {
            console.error('Error fetching notifications:', error)
            return NextResponse.json(
                { error: 'Failed to fetch notifications' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            notifications
        })

    } catch (error) {
        console.error('Error in notification API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 