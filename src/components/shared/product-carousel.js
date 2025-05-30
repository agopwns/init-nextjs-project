'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { dummyProducts } from '@/lib/dummy-data'

export function ProductCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: "start",
            loop: true,
            dragFree: false,
            containScroll: "trimSnaps"
        }
    )

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        const autoSlide = setInterval(() => {
            scrollNext()
        }, 4000) // 4초마다 자동 슬라이드

        return () => clearInterval(autoSlide)
    }, [emblaApi, scrollNext])

    return (
        <div className="w-full max-w-6xl mx-auto px-4">

            <Carousel
                ref={emblaRef}
                className="w-full"
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: false,
                }}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {dummyProducts.slice(0, 6).map((product) => (
                        <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 bg-gray-200">
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm text-gray-500">
                                            <span>📍 {product.location}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span>⏱️ {product.duration}분</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-gray-500">
                                            <span>👥 최대 {product.maxParticipants}명</span>
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            ₩{product.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <Link href={`/products/${product.id}`}>
                                        <Button className="w-full">
                                            상세보기
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </div>
    )
} 