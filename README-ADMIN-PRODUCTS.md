# 관리자 상품 관리 시스템

Supabase와 연동된 완전한 상품 관리 시스템을 구현했습니다. 관리자는 상품의 생성, 조회, 수정, 삭제(비활성화) 및 상태 토글 기능을 사용할 수 있습니다.

## 🚀 구현된 기능

### 1. 상품 목록 조회 (`/admin/products`)
- **실시간 데이터**: Supabase에서 모든 상품 조회 (활성/비활성 포함)
- **상품 정보 표시**: 상품명, 카테고리, 가격, 소요시간, 최대인원, 상태
- **상태 토글**: 클릭으로 상품 활성화/비활성화 전환
- **빠른 삭제**: 목록에서 바로 상품 삭제 (비활성화)
- **로딩 및 에러 처리**: 사용자 친화적인 피드백

### 2. 상품 등록 (`/admin/products/new`)
- **폼 검증**: 필수 필드 검증 및 실시간 에러 메시지
- **카테고리 선택**: 미리 정의된 카테고리 목록
- **데이터 타입 처리**: 가격, 소요시간, 참가자 수 자동 변환
- **활성화 상태**: 등록과 동시에 활성화 여부 설정
- **사용자 피드백**: 등록 성공/실패 알림

### 3. 상품 수정 (`/admin/products/[id]/edit`)
- **기존 데이터 로딩**: 비활성화된 상품도 수정 가능
- **실시간 검증**: 수정 중 폼 검증
- **상태 관리**: 활성화/비활성화 상태 토글
- **위험 구역**: 상품 삭제 기능 분리
- **변경사항 저장**: 부분 업데이트 지원

### 4. 상품 삭제
- **소프트 삭제**: 실제 삭제 대신 비활성화
- **확인 대화상자**: 실수 방지를 위한 확인 절차
- **되돌리기 가능**: 삭제된 상품 재활성화 가능

## 📁 파일 구조

```
src/
├── app/admin/products/
│   ├── page.js                    # 상품 목록 페이지
│   ├── new/page.js               # 상품 등록 페이지
│   └── [id]/edit/page.js         # 상품 수정 페이지
├── actions/product-actions.js     # 상품 관련 서버 액션
├── hooks/use-admin-products.js    # 관리자용 상품 관리 훅
└── database/schema.sql            # 데이터베이스 스키마
```

## 🔧 서버 액션 (Server Actions)

### 관리자 전용 함수
```javascript
// 모든 상품 조회 (활성/비활성 포함)
await getAllProductsForAdmin()

// 상품 생성
await createProduct(productData)

// 상품 수정
await updateProduct(productId, productData)

// 상품 삭제 (비활성화)
await deleteProduct(productId)

// 상품 상태 토글
await toggleProductStatus(productId, isActive)

// 관리자용 상품 상세 조회 (비활성 포함)
await getProductByIdForAdmin(productId)

// 상품 영구 삭제 (선택사항)
await permanentDeleteProduct(productId)
```

## 🎯 주요 특징

### 데이터 검증
- **클라이언트 사이드**: 실시간 폼 검증
- **서버 사이드**: 데이터 타입 변환 및 검증
- **에러 처리**: 사용자 친화적인 에러 메시지

### 사용자 경험 (UX)
- **로딩 상태**: 스피너와 메시지로 상태 표시
- **즉시 피드백**: 액션 완료 시 즉시 알림
- **상태 표시**: 진행 중인 작업 명확히 표시
- **확인 절차**: 중요한 작업 전 확인 대화상자

### 성능 최적화
- **조건부 렌더링**: 상태에 따른 효율적인 렌더링
- **최소 요청**: 필요한 경우에만 데이터 새로고침
- **로컬 상태 관리**: React hooks를 활용한 효율적인 상태 관리

## 📊 데이터 구조

### Products 테이블
```sql
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- 분 단위
    category VARCHAR(100),
    images TEXT[], -- 이미지 URL 배열
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER DEFAULT 1,
    location VARCHAR(255),
    requirements TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 지원하는 카테고리
- 수상스포츠
- 승마
- 익스트림 스포츠
- 문화체험
- 자연체험
- 요리체험
- 레저활동

## 🔐 보안 및 권한

### Row Level Security (RLS)
- **관리자 전용**: 관리자만 상품 CRUD 작업 가능
- **일반 사용자**: 활성화된 상품만 조회 가능
- **자동 필터링**: 비활성화된 상품 자동 숨김 (고객 대상)

### 데이터 검증
- **입력 검증**: 모든 사용자 입력 검증
- **타입 안전성**: TypeScript 스타일의 런타임 검증
- **SQL 인젝션 방지**: Supabase ORM 사용

## 🎨 UI/UX 디자인

### 테일윈드 CSS 활용
- **반응형 디자인**: 모바일부터 데스크톱까지 대응
- **일관된 스타일**: 전체 관리자 패널과 통일된 디자인
- **접근성**: 키보드 내비게이션 및 스크린 리더 지원

### 상태 표시
- **성공**: 녹색 배지 및 메시지
- **오류**: 빨간색 테두리 및 메시지
- **로딩**: 스피너 및 "처리 중" 메시지
- **비활성**: 회색 스타일로 구분

## 🚀 사용 방법

### 1. 상품 등록
1. "새 상품 등록" 버튼 클릭
2. 필수 정보 입력 (제목, 카테고리, 가격 등)
3. 선택 사항 입력 (이용 요건, 이미지 등)
4. "상품 등록" 버튼으로 저장

### 2. 상품 수정
1. 상품 목록에서 "수정" 링크 클릭
2. 원하는 필드 수정
3. "변경사항 저장" 버튼으로 저장

### 3. 상품 상태 관리
- **활성화/비활성화**: 상태 배지 클릭으로 토글
- **삭제**: "삭제" 버튼으로 비활성화
- **복구**: 수정 페이지에서 활성화 체크박스로 복구

## 🔍 트러블슈팅

### 일반적인 문제
1. **상품이 표시되지 않음**: 데이터베이스 연결 및 RLS 정책 확인
2. **권한 오류**: 관리자 권한 및 인증 상태 확인
3. **폼 검증 오류**: 필수 필드 및 데이터 형식 확인

### 로그 확인
- 브라우저 콘솔에서 JavaScript 오류 확인
- Supabase 대시보드에서 데이터베이스 로그 확인
- 네트워크 탭에서 API 요청/응답 확인

## 📈 향후 개선 사항

### 추가 기능
- [ ] 상품 이미지 업로드 및 관리
- [ ] 벌크 작업 (다중 선택 삭제/상태 변경)
- [ ] 상품 복제 기능
- [ ] 상품 카테고리 관리
- [ ] 상품 통계 및 분석

### 성능 개선
- [ ] 페이지네이션 구현
- [ ] 검색 및 필터링 기능
- [ ] 이미지 최적화 및 CDN 연동
- [ ] 캐싱 전략 개선

이제 관리자는 완전한 상품 관리 시스템을 통해 효율적으로 상품을 관리할 수 있습니다! 