# Supabase 연동 상품 리스트 페이지 구현

더미데이터로 작동하던 상품 리스트 페이지를 Supabase와 연동하여 실제 데이터베이스에서 데이터를 가져오도록 변경했습니다.

## 🚀 구현된 기능

### 1. 데이터베이스 연동
- **Supabase 클라이언트 설정**: `src/lib/supabase.js`
- **데이터베이스 스키마**: `src/database/schema.sql`
- **테스트 데이터**: `src/database/seed-data.sql`

### 2. Custom Hooks
두 가지 버전의 훅을 제공합니다:

#### 기본 useState/useEffect 버전
- **파일**: `src/hooks/use-products.js`
- **기능**: 
  - `useProducts()`: 모든 상품과 카테고리 가져오기
  - `useProductsByCategory()`: 특정 카테고리 상품 필터링

#### React Query 버전 (추천)
- **파일**: `src/hooks/use-products-query.js`
- **기능**:
  - `useProductsQuery()`: 상품 데이터 (캐싱, 재시도 포함)
  - `useCategoriesQuery()`: 카테고리 데이터
  - `useProductsWithCategories()`: 상품과 카테고리 함께
  - `useProductsByCategory()`: 카테고리별 필터링

### 3. Server Actions
- **파일**: `src/actions/product-actions.js`
- **기능**:
  - `getProducts()`: 모든 활성 상품 조회
  - `getProductsByCategory()`: 카테고리별 상품 조회
  - `getCategories()`: 카테고리 목록 조회
  - `getProductById()`: 특정 상품 상세 조회

### 4. UI 컴포넌트
- **상품 카드**: `src/components/customer/product-card.js`
  - Supabase 데이터 구조에 맞게 수정 (`max_participants`, snake_case 필드명)
  - 이미지 fallback 처리
- **스켈레톤 로딩**: `src/components/customer/product-card-skeleton.js`
  - 로딩 상태에서 보여지는 플레이스홀더

### 5. 상품 리스트 페이지
- **파일**: `src/app/(customer)/products/page.js`
- **기능**:
  - 실시간 데이터 로딩
  - 카테고리별 필터링
  - 정렬 기능 (최신순, 가격순, 소요시간순)
  - 로딩 상태 표시 (스켈레톤 UI)
  - 에러 처리 및 재시도

## 📦 설치된 패키지

```bash
npm install @tanstack/react-query
```

## 🔧 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🗄️ 데이터베이스 설정

### 1. 스키마 생성
`src/database/schema.sql` 파일의 내용을 Supabase SQL 에디터에서 실행합니다.

### 2. 테스트 데이터 삽입
`src/database/seed-data.sql` 파일의 내용을 실행하여 테스트 상품을 생성합니다.

## 🎯 주요 변경사항

### Before (더미데이터)
```javascript
import { dummyProducts, categories } from '@/lib/dummy-data'

// 정적 데이터 사용
const filteredProducts = dummyProducts.filter(...)
```

### After (Supabase 연동)
```javascript
import { useProducts } from '@/hooks/use-products'

// 실시간 데이터 사용
const { products, categories, loading, error, refetch } = useProducts()
```

## 🌟 React Query 버전 사용하기

더 나은 성능과 캐싱을 위해 React Query 버전을 사용하는 것을 권장합니다:

```javascript
// pages/page.js에서 import 변경
import { useProductsWithCategories } from '@/hooks/use-products-query'

export default function ProductsPage() {
    const { products, categories, loading, error, refetch } = useProductsWithCategories()
    // ...
}
```

## 📋 데이터 구조

### Products 테이블 필드
- `id`: UUID (Primary Key)
- `title`: 상품명
- `description`: 상품 설명
- `price`: 가격 (DECIMAL)
- `duration`: 소요시간 (분)
- `category`: 카테고리
- `images`: 이미지 URL 배열
- `is_active`: 활성화 상태
- `max_participants`: 최대 참여자 수
- `location`: 위치
- `requirements`: 참가 요건
- `created_by`: 생성자 ID
- `created_at`: 생성일시
- `updated_at`: 수정일시

## 🔍 특징

### 성능 최적화
- **캐싱**: React Query로 데이터 캐싱
- **스켈레톤 UI**: 로딩 상태 개선
- **지연 로딩**: 이미지 lazy loading 지원

### 에러 처리
- **네트워크 오류**: 재시도 메커니즘
- **사용자 친화적**: 에러 메시지 표시
- **Fallback**: 기본 이미지 처리

### 접근성
- **키보드 내비게이션**: 필터 버튼 지원
- **스크린 리더**: 의미있는 라벨 제공
- **로딩 상태**: 명확한 상태 표시

## 🚀 다음 단계

1. **React Query Provider 설정**: app layout에 QueryClient 설정
2. **상품 상세 페이지**: 개별 상품 페이지 연동
3. **검색 기능**: 텍스트 검색 구현
4. **페이지네이션**: 대량 데이터 처리
5. **이미지 최적화**: Next.js Image 컴포넌트 적용

## 📝 사용 예시

```javascript
// 기본 사용법
const { products, categories, loading, error } = useProducts()

// 카테고리별 필터링
const { products } = useProductsByCategory('수상스포츠')

// React Query 버전
const { products, categories, loading, error } = useProductsWithCategories()
```

이제 상품 리스트 페이지가 실제 Supabase 데이터베이스와 연동되어 동작합니다! 