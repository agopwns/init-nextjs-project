'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center">shadcn/ui 설치 완료!</h1>
        <div className="flex gap-4 justify-center">
          <Button>기본 버튼</Button>
          <Button variant="outline">아웃라인 버튼</Button>
          <Button variant="destructive">삭제 버튼</Button>
        </div>
      </div>
    </div>
  );
}
