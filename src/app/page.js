'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">예약 플랫폼에 오신 것을 환영합니다!</h1>
          <p className="text-lg text-gray-600">다양한 체험 상품을 둘러보고 예약해보세요</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">
              상품 둘러보기
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
