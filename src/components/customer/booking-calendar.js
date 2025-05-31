'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function BookingCalendar({ onDateTimeSelect, disabled = false }) {
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    // 현재 날짜부터 3개월 후까지의 날짜 생성
    const generateAvailableDates = () => {
        const dates = []
        const today = new Date()
        const threeMonthsLater = new Date()
        threeMonthsLater.setMonth(today.getMonth() + 3)

        for (let date = new Date(today); date <= threeMonthsLater; date.setDate(date.getDate() + 1)) {
            // 오늘 이후의 날짜만 포함
            if (date > today) {
                dates.push(new Date(date))
            }
        }
        return dates
    }

    // 시간 슬롯 생성 (9시부터 18시까지)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ]

    const availableDates = generateAvailableDates()

    const handleDateSelect = (date) => {
        const dateString = date.toISOString().split('T')[0]
        setSelectedDate(dateString)
        setSelectedTime('') // 날짜 변경 시 시간 초기화
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time)
        if (selectedDate && time) {
            const dateTime = `${selectedDate}T${time}:00`
            onDateTimeSelect(dateTime)
        }
    }

    return (
        <div className="space-y-6">
            {/* 날짜 선택 */}
            <div>
                <h3 className="text-lg font-semibold mb-4">날짜 선택</h3>
                <div className="grid grid-cols-7 gap-2 max-h-60 overflow-y-auto">
                    {availableDates.map((date) => {
                        const dateString = date.toISOString().split('T')[0]
                        const isSelected = selectedDate === dateString
                        const dayOfWeek = date.getDay()
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                        return (
                            <Button
                                key={dateString}
                                type="button"
                                variant={isSelected ? 'default' : 'outline'}
                                size="sm"
                                disabled={disabled}
                                onClick={() => handleDateSelect(date)}
                                className={`
                                    h-16 flex flex-col p-1 text-xs
                                    ${isWeekend ? 'text-red-500' : ''}
                                    ${isSelected ? 'bg-blue-600 text-white' : ''}
                                `}
                            >
                                <span className="font-medium">
                                    {date.getMonth() + 1}/{date.getDate()}
                                </span>
                                <span className="text-xs opacity-75">
                                    {['일', '월', '화', '수', '목', '금', '토'][dayOfWeek]}
                                </span>
                            </Button>
                        )
                    })}
                </div>
            </div>

            {/* 시간 선택 */}
            {selectedDate && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">시간 선택</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time

                            return (
                                <Button
                                    key={time}
                                    type="button"
                                    variant={isSelected ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={disabled}
                                    onClick={() => handleTimeSelect(time)}
                                    className={isSelected ? 'bg-blue-600 text-white' : ''}
                                >
                                    {time}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* 선택된 날짜/시간 표시 */}
            {selectedDate && selectedTime && (
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">
                        선택된 일정
                    </div>
                    <div className="text-lg font-semibold text-blue-900">
                        {new Date(selectedDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                        })} {selectedTime}
                    </div>
                </div>
            )}
        </div>
    )
} 