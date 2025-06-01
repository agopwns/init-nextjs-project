import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useNotificationStore = create((set, get) => ({
    // 상태
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    // 알림 목록 조회
    fetchNotifications: async () => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error

            const unreadCount = data.filter(notification => !notification.is_read).length

            set({
                notifications: data,
                unreadCount,
                isLoading: false
            })
        } catch (error) {
            console.error('Error fetching notifications:', error)
            set({ error: error.message, isLoading: false })
        }
    },

    // 새로운 알림 추가
    addNotification: (notification) => {
        const { notifications } = get()
        set({
            notifications: [notification, ...notifications],
            unreadCount: get().unreadCount + 1
        })
    },

    // 알림 읽음 처리
    markAsRead: async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, updated_at: new Date().toISOString() })
                .eq('id', notificationId)

            if (error) throw error

            const { notifications, unreadCount } = get()
            const updatedNotifications = notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, is_read: true }
                    : notification
            )

            set({
                notifications: updatedNotifications,
                unreadCount: Math.max(0, unreadCount - 1)
            })
        } catch (error) {
            console.error('Error marking notification as read:', error)
            set({ error: error.message })
        }
    },

    // 모든 알림 읽음 처리
    markAllAsRead: async () => {
        try {
            const { notifications } = get()
            const unreadIds = notifications
                .filter(notification => !notification.is_read)
                .map(notification => notification.id)

            if (unreadIds.length === 0) return

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, updated_at: new Date().toISOString() })
                .in('id', unreadIds)

            if (error) throw error

            const updatedNotifications = notifications.map(notification => ({
                ...notification,
                is_read: true
            }))

            set({
                notifications: updatedNotifications,
                unreadCount: 0
            })
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
            set({ error: error.message })
        }
    },

    // 알림 삭제
    deleteNotification: async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId)

            if (error) throw error

            const { notifications } = get()
            const notificationToDelete = notifications.find(n => n.id === notificationId)
            const updatedNotifications = notifications.filter(n => n.id !== notificationId)

            set({
                notifications: updatedNotifications,
                unreadCount: notificationToDelete && !notificationToDelete.is_read
                    ? Math.max(0, get().unreadCount - 1)
                    : get().unreadCount
            })
        } catch (error) {
            console.error('Error deleting notification:', error)
            set({ error: error.message })
        }
    },

    // 에러 초기화
    clearError: () => set({ error: null })
})) 