import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                        상세보기 및 예약
                    </Button>
                </Link>
            </div>
        </div>
    )
} 