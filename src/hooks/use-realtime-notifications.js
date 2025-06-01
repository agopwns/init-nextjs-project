'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useNotificationStore } from '@/app/store/notification-store'
import { toast } from 'sonner'

export function useRealtimeNotifications() {
    const { addNotification, fetchNotifications } = useNotificationStore()
    const channelRef = useRef(null)

    useEffect(() => {
        // 초기 알림 로드
        fetchNotifications()

        // Realtime 채널 구독
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    const newNotification = payload.new

                    // 스토어에 새 알림 추가
                    addNotification(newNotification)

                    // 토스트 메시지 표시
                    showNotificationToast(newNotification)
                }
            )
            .subscribe((status) => {
                console.log('Notification channel status:', status)
            })

        channelRef.current = channel

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
            }
        }
    }, [addNotification, fetchNotifications])

    // 토스트 메시지 표시 함수
    const showNotificationToast = (notification) => {
        const toastMessage = getToastMessage(notification)

        toast.success(toastMessage.title, {
            description: toastMessage.description,
            duration: 5000,
            action: {
                label: '확인',
                onClick: () => {
                    // 알림 페이지로 이동하거나 상세 정보 표시
                    window.location.href = '/admin/notifications'
                }
            }
        })
    }

    // 알림 타입에 따른 토스트 메시지 생성
    const getToastMessage = (notification) => {
        switch (notification.type) {
            case 'payment_completed':
                return {
                    title: '🎉 새로운 예약이 확정되었습니다!',
                    description: notification.message || '결제가 완료되어 예약이 확정되었습니다.'
                }
            case 'new_reservation':
                return {
                    title: '📅 새로운 예약이 생성되었습니다',
                    description: notification.message || '새로운 예약 요청이 들어왔습니다.'
                }
            case 'cancellation':
                return {
                    title: '❌ 예약이 취소되었습니다',
                    description: notification.message || '예약이 취소되었습니다.'
                }
            default:
                return {
                    title: notification.title || '새 알림',
                    description: notification.message || '새로운 알림이 도착했습니다.'
                }
        }
    }

    return {
        // 필요한 경우 추가 기능을 반환할 수 있습니다
    }
} 