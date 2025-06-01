'use client'

import { useEffect, useState } from 'react'
import { useNotificationStore } from '@/app/store/notification-store'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
    CheckCircle,
    Circle,
    Trash2,
    Bell,
    Calendar,
    CreditCard,
    X,
    CheckCheck
} from 'lucide-react'

export default function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearError
    } = useNotificationStore()

    const [filter, setFilter] = useState('all') // all, unread, read

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // 필터링된 알림 목록
    const filteredNotifications = notifications.filter(notification => {
        switch (filter) {
            case 'unread':
                return !notification.is_read
            case 'read':
                return notification.is_read
            default:
                return true
        }
    })

    // 알림 타입별 아이콘
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_completed':
                return <CreditCard className="h-5 w-5 text-green-500" />
            case 'new_reservation':
                return <Calendar className="h-5 w-5 text-blue-500" />
            case 'cancellation':
                return <X className="h-5 w-5 text-red-500" />
            default:
                return <Bell className="h-5 w-5 text-gray-500" />
        }
    }

    // 알림 타입별 스타일
    const getNotificationStyle = (type, isRead) => {
        const baseStyle = isRead ? 'opacity-60' : ''

        switch (type) {
            case 'payment_completed':
                return `border-l-4 border-green-500 ${baseStyle}`
            case 'new_reservation':
                return `border-l-4 border-blue-500 ${baseStyle}`
            case 'cancellation':
                return `border-l-4 border-red-500 ${baseStyle}`
            default:
                return `border-l-4 border-gray-300 ${baseStyle}`
        }
    }

    const handleMarkAsRead = async (notificationId) => {
        await markAsRead(notificationId)
    }

    const handleDelete = async (notificationId) => {
        if (confirm('이 알림을 삭제하시겠습니까?')) {
            await deleteNotification(notificationId)
        }
    }

    const handleMarkAllAsRead = async () => {
        await markAllAsRead()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">알림을 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">알림</h1>
                    <p className="text-gray-600 mt-1">
                        총 {notifications.length}개의 알림
                        {unreadCount > 0 && `, ${unreadCount}개 읽지 않음`}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <CheckCheck className="h-4 w-4" />
                        <span>모두 읽음 처리</span>
                    </button>
                )}
            </div>

            {/* 필터 탭 */}
            <div className="flex space-x-4 mb-6 border-b">
                {[
                    { key: 'all', label: '전체', count: notifications.length },
                    { key: 'unread', label: '읽지 않음', count: unreadCount },
                    { key: 'read', label: '읽음', count: notifications.length - unreadCount }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${filter === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* 알림 목록 */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'unread'
                                ? '모든 알림을 확인했습니다.'
                                : '새로운 알림이 오면 여기에 표시됩니다.'
                            }
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-lg shadow-sm p-6 ${getNotificationStyle(notification.type, notification.is_read)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* 아이콘 */}
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* 내용 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {notification.title}
                                            </h3>
                                            {!notification.is_read && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    새 알림
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-2">
                                            {notification.message}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                                locale: ko
                                            })}
                                        </p>

                                        {/* 추가 데이터 표시 */}
                                        {notification.data && Object.keys(notification.data).length > 0 && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">상세 정보</h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    {notification.data.productName && (
                                                        <p><span className="font-medium">상품:</span> {notification.data.productName}</p>
                                                    )}
                                                    {notification.data.customerName && (
                                                        <p><span className="font-medium">고객:</span> {notification.data.customerName}</p>
                                                    )}
                                                    {notification.data.amount && (
                                                        <p><span className="font-medium">금액:</span> {notification.data.amount.toLocaleString()}원</p>
                                                    )}
                                                    {notification.data.reservationDate && (
                                                        <p><span className="font-medium">예약일:</span> {new Date(notification.data.reservationDate).toLocaleDateString('ko-KR')}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center space-x-2 ml-4">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                            title="읽음 처리"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="삭제"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
} 