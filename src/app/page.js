'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/shared/product-carousel';
import { AuthStatus } from '@/components/auth/auth-status';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 환영 섹션 */}
      <div className="flex items-center justify-center h-screen py-16">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">수파 스페이스에 오신 것을 환영합니다!</h1>
            <p className="text-lg text-gray-600">다양한 체험 상품을 둘러보고 예약해보세요</p>
          </div>

          {/* 상품 Carousel 섹션 */}
          <ProductCarousel />

          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">
                상품 둘러보기
              </Button>
            </Link>

            {/* 인증 상태에 따른 버튼 표시 */}
            <AuthStatus />
          </div>
        </div>
      </div>


    </div>
  );
}
