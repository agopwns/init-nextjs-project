'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUserRole = async (currentUser) => {
            try {
                // 로그인되지 않은 경우
                if (!currentUser) {
                    router.push('/auth/login')
                    return
                }

                // role 확인
                const role = currentUser.user_metadata?.role || 'customer'

                // 관리자가 아닌 경우
                if (role !== 'admin') {
                    router.push('/')
                    return
                }

                setUser(currentUser)
            } catch (error) {
                console.error('Error checking user role:', error)
                router.push('/auth/login')
            } finally {
                setLoading(false)
            }
        }

        // 초기 사용자 상태 확인
        const getInitialUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            await checkUserRole(user)
        }

        getInitialUser()

        // 실시간 인증 상태 변화 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || !session?.user) {
                    setUser(null)
                    router.push('/auth/login')
                } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await checkUserRole(session.user)
                }
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [router])

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">권한을 확인하는 중...</p>
                </div>
            </div>
        )
    }

    // 사용자 정보가 없으면 아무것도 렌더링하지 않음 (리다이렉트 진행 중)
    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 관리자 네비게이션 헤더 */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">관리자 대시보드</h1>
                        <nav className="flex space-x-8">
                            <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">대시보드</a>
                            <a href="/admin/products" className="text-gray-600 hover:text-gray-900">상품 관리</a>
                            <a href="/admin/dashboard/reservations" className="text-gray-600 hover:text-gray-900">예약 관리</a>
                            <a href="/admin/dashboard/payments" className="text-gray-600 hover:text-gray-900">결제 관리</a>
                            <a href="/admin/dashboard/analytics" className="text-gray-600 hover:text-gray-900">통계</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
} 