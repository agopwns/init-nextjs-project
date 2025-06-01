'use client'

import { Bell } from 'lucide-react'
import { useNotificationStore } from '@/app/store/notification-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NotificationIcon({ className }) {
    const { unreadCount } = useNotificationStore()
    const router = useRouter()

    const handleClick = () => {
        router.push('/admin/notifications')
    }

    return (
        <button
            onClick={handleClick}
            className={cn(
                'relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                className
            )}
            aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개의 읽지 않은 알림)` : ''}`}
        >
            <Bell className="h-6 w-6 text-gray-600" />

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    )
} 