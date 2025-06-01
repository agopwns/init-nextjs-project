import { create } from 'zustand'

export const useReservationStore = create((set, get) => ({
    // 상태
    reservations: [],
    selectedReservation: null,
    filters: {
        status: 'all',
        date: '',
        productId: ''
    },
    loading: false,
    error: null,
    reservationStats: {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
        monthlyReservations: 0
    },

    // 액션
    setReservations: (reservations) => set({ reservations }),

    setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),

    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    setReservationStats: (stats) => set({ reservationStats: stats }),

    // 예약 목록 초기화
    clearReservations: () => set({ reservations: [] }),

    // 예약 상태 업데이트 (로컬 상태)
    updateReservationStatus: (reservationId, status) => set((state) => ({
        reservations: state.reservations.map(reservation =>
            reservation.id === reservationId
                ? { ...reservation, status, updated_at: new Date().toISOString() }
                : reservation
        )
    })),

    // 필터 리셋
    resetFilters: () => set({
        filters: {
            status: 'all',
            date: '',
            productId: ''
        }
    }),

    // 에러 초기화
    clearError: () => set({ error: null }),

    // 선택된 예약 초기화
    clearSelectedReservation: () => set({ selectedReservation: null })
})) 