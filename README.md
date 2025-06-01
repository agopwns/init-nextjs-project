This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Next.js 예약 플랫폼

## 환경 변수 설정

### Portone (결제) 설정

Portone SDK v2를 사용한 결제 및 환불 기능을 위해 다음 환경변수를 설정해주세요:

```env
# Portone V2 설정
NEXT_PUBLIC_PORTONE_STORE_ID=your_store_id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your_channel_key
PORTONE_V2_API_SECRET=your_api_secret
```

### Portone 설정 방법

1. [Portone 관리자 콘솔](https://admin.portone.io)에 로그인
2. 상점 설정에서 Store ID 확인
3. 결제 연동 설정에서 Channel Key 확인  
4. API & Webhook 설정에서 V2 API Secret 생성

### 결제 기능

- ✅ 카드 결제
- ✅ 가상계좌 결제
- ✅ 결제 상태 실시간 조회
- ✅ 전액/부분 환불 처리
- ✅ 환불 내역 관리

### 관리자 기능

- **결제 관리 페이지**: `/admin/dashboard/payments`
  - 결제 목록 조회 및 필터링
  - Portone API를 통한 실시간 결제 상태 확인
  - 환불 처리 (전액/부분)
  - 결제 통계 및 매출 현황

- **예약 관리 페이지**: `/admin/dashboard/reservations`
  - 예약과 연결된 결제 정보 확인
  - 예약 페이지에서 직접 환불 처리 가능

### 개발 가이드

#### 결제 상태 조회
```javascript
import { getPaymentStatus } from '@/actions/payment-actions'

const result = await getPaymentStatus(paymentId)
if (result.success) {
  console.log('결제 상태:', result.data.status)
}
```

#### 환불 처리
```javascript
import { processRefund } from '@/actions/payment-actions'

const result = await processRefund(paymentId, refundAmount, '환불 사유')
if (result.success) {
  console.log('환불 완료:', result.message)
}
```

## 설치 및 실행

```bash
npm install
npm run dev
```

## 기술 스택

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **결제**: Portone SDK v2
- **데이터베이스**: Supabase
- **상태 관리**: Zustand
- **UI 컴포넌트**: shadcn/ui
