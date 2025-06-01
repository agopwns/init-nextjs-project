# 실시간 알림 시스템 가이드

이 문서는 Supabase Realtime을 활용한 실시간 알림 시스템의 설치 및 사용법을 설명합니다.

## 🚀 주요 기능

- **실시간 토스트 알림**: 결제 완료 시 관리자 페이지에 즉시 토스트 메시지 표시
- **알림 센터**: 클릭 가능한 알림 아이콘과 전체 알림 목록 페이지
- **읽음 처리**: 개별/일괄 읽음 처리 기능
- **알림 타입별 스타일링**: 결제완료, 새예약, 취소 등 타입별 색상과 아이콘
- **필터링**: 전체/읽지않음/읽음 필터 기능

## 📋 설치 단계

### 1. 패키지 설치

```bash
npm install sonner
```

### 2. Supabase 데이터베이스 설정

Supabase 대시보드의 SQL Editor에서 다음 스크립트를 실행하세요:

```sql
-- src/database/create-notifications-table.sql 파일의 내용 실행
```

**중요**: 이 시스템은 **auth.users**를 사용합니다. 관리자 사용자는 다음과 같이 설정되어야 합니다:

```sql
-- 관리자 사용자 생성 예시
-- Supabase Auth에서 사용자 생성 후, 다음과 같이 메타데이터 업데이트
UPDATE auth.users 
SET user_metadata = user_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';

-- 또는 app_metadata 사용
UPDATE auth.users 
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

### 3. Supabase Realtime 설정

Supabase 대시보드에서:
1. **Database** → **Replication** 이동
2. **Source** 테이블에서 `notifications` 테이블 활성화
3. **Insert**, **Update**, **Delete** 이벤트 모두 체크

### 4. 환경변수 확인

`.env.local` 파일에 다음 환경변수가 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🏗️ 시스템 구조

### 주요 컴포넌트

```
src/
├── database/models/notification.js          # 알림 데이터 모델
├── app/store/notification-store.js          # Zustand 상태 관리
├── hooks/use-realtime-notifications.js     # 실시간 알림 훅
├── components/admin/notification-icon.js    # 알림 아이콘 컴포넌트
├── app/admin/notifications/page.js          # 알림 목록 페이지
├── actions/notification-actions.js          # 알림 생성 서버 액션
└── app/api/notifications/route.js           # 알림 API 엔드포인트
```

### 데이터 흐름

1. **결제 완료** → `payment/complete` API 호출
2. **알림 생성** → `createPaymentCompletedNotification()` 함수 실행
3. **관리자 조회** → `auth.users`에서 관리자 역할 사용자 조회
4. **데이터베이스 저장** → `notifications` 테이블에 알림 저장
5. **Realtime 전송** → Supabase Realtime이 자동으로 구독자에게 전송
6. **클라이언트 수신** → `useRealtimeNotifications` 훅이 수신
7. **UI 업데이트** → 토스트 메시지 표시 + 스토어 업데이트

## 📱 사용법

### 관리자 페이지에서 알림 확인

1. **실시간 토스트**: 결제 완료 시 우상단에 토스트 메시지 자동 표시
2. **알림 아이콘**: 헤더의 벨 아이콘 클릭하여 알림 목록 페이지로 이동
3. **알림 뱃지**: 읽지 않은 알림 개수가 빨간 뱃지로 표시

### 알림 목록 페이지 기능

- **필터링**: 전체/읽지않음/읽음 탭으로 필터
- **읽음 처리**: 개별 알림의 체크 버튼 클릭
- **일괄 읽음**: "모두 읽음 처리" 버튼 클릭
- **삭제**: 개별 알림의 휴지통 버튼 클릭
- **상세 정보**: 알림 카드에서 예약 정보 확인

## 🔧 커스터마이징

### 새로운 알림 타입 추가

1. **알림 타입 정의** (`notification.js`):
```javascript
export const notificationTypes = {
  // 기존 타입들...
  NEW_TYPE: 'new_type'
}
```

2. **알림 생성 함수 작성** (`notification-actions.js`):
```javascript
export async function createNewTypeNotification(data) {
  // 구현
}
```

3. **토스트 메시지 스타일 추가** (`use-realtime-notifications.js`):
```javascript
case 'new_type':
  return {
    title: '새로운 타입 알림',
    description: '알림 설명'
  }
```

### 알림 스타일 커스터마이징

`NotificationsPage`의 `getNotificationIcon()` 및 `getNotificationStyle()` 함수를 수정하여 새로운 스타일을 추가할 수 있습니다.

## 🔑 관리자 설정

### 관리자 사용자 생성

1. **Supabase Auth에서 사용자 생성**:
   - Supabase Dashboard → Authentication → Users
   - "Add user" 버튼으로 관리자 계정 생성

2. **관리자 역할 부여**:
```sql
-- user_metadata에 role 설정
UPDATE auth.users 
SET user_metadata = user_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';

-- 또는 app_metadata에 role 설정 (더 안전함)
UPDATE auth.users 
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

3. **관리자 확인**:
```sql
-- 관리자 역할을 가진 사용자 조회
SELECT id, email, user_metadata, app_metadata 
FROM auth.users 
WHERE user_metadata->>'role' = 'admin' 
   OR app_metadata->>'role' = 'admin';
```

## 🐛 트러블슈팅

### 실시간 알림이 작동하지 않는 경우

1. **Supabase Realtime 설정 확인**:
   - 테이블이 replication에 추가되었는지 확인
   - 필요한 이벤트가 활성화되었는지 확인

2. **RLS 정책 확인**:
   - 사용자가 알림을 읽을 권한이 있는지 확인
   - `notifications` 테이블의 RLS 정책 점검

3. **콘솔 로그 확인**:
   - 브라우저 개발자 도구에서 WebSocket 연결 상태 확인
   - 네트워크 탭에서 Supabase 요청 상태 확인

### 관리자 조회 실패 시

1. **관리자 역할 확인**:
```sql
-- 관리자 사용자가 올바르게 설정되었는지 확인
SELECT id, email, user_metadata, app_metadata 
FROM auth.users 
WHERE user_metadata->>'role' = 'admin' 
   OR app_metadata->>'role' = 'admin';
```

2. **서비스 역할 키 확인**:
   - `SUPABASE_SERVICE_ROLE_KEY` 환경변수가 올바르게 설정되었는지 확인
   - 서비스 역할 키로 `auth.admin.listUsers()` 호출 권한이 있는지 확인

### 토스트가 표시되지 않는 경우

1. **Toaster 컴포넌트 확인**:
   - `AdminLayout`에 `<Toaster />` 컴포넌트가 포함되었는지 확인

2. **sonner 패키지 설치 확인**:
   ```bash
   npm list sonner
   ```

### 알림 개수가 정확하지 않은 경우

1. **스토어 상태 확인**:
   - 브라우저 개발자 도구에서 Zustand 스토어 상태 확인
   - `fetchNotifications()` 함수가 올바르게 호출되는지 확인

## 📝 API 사용법

### 수동으로 알림 생성

```javascript
// POST /api/notifications
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'payment_completed',
    title: '결제 완료',
    message: '결제가 성공적으로 완료되었습니다.',
    data: { orderId: '12345' },
    recipientId: 'admin-user-id' // auth.users의 id
  })
})
```

### 알림 목록 조회

```javascript
// GET /api/notifications?recipientId=user-id&limit=50&isRead=false
const response = await fetch('/api/notifications?recipientId=user-id&isRead=false')
const { notifications } = await response.json()
```

## 🔒 보안 고려사항

- **RLS 정책**: 사용자는 자신의 알림만 읽을 수 있음
- **관리자 권한**: 알림 생성은 서버 사이드에서만 가능 (서비스 역할 키 사용)
- **데이터 검증**: 모든 입력 데이터의 유효성 검사 수행
- **auth.users 참조**: notifications 테이블이 auth.users를 직접 참조하여 데이터 무결성 보장

## 📈 성능 최적화

- **인덱스**: 주요 쿼리에 대한 데이터베이스 인덱스 설정
- **페이지네이션**: 알림 목록의 무한 스크롤 또는 페이지네이션 구현 권장
- **캐싱**: 읽지 않은 알림 개수의 클라이언트 사이드 캐싱
- **관리자 조회 최적화**: `auth.admin.listUsers()` 결과 캐싱 고려

이제 auth.users 기반 실시간 알림 시스템이 완전히 구축되었습니다! 🎉 