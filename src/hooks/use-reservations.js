import { useState } from 'react'

export function useCreateReservation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createReservation = async (reservationData) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '예약 생성에 실패했습니다')
            }

            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        createReservation,
        loading,
        error
    }
}

export function useReservations(userId) {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchReservations = async () => {
        if (!userId) return

        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/reservations?userId=${userId}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '예약 목록을 가져올 수 없습니다')
            }

            setReservations(data)
        } catch (err) {
            setError(err.message)
            console.error('예약 목록 가져오기 실패:', err)
        } finally {
            setLoading(false)
        }
    }

    return {
        reservations,
        loading,
        error,
        fetchReservations
    }
} 