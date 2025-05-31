export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>

            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>

                <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>

                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    )
} 