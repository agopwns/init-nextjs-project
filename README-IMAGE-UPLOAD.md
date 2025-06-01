# 상품 이미지 업로드 시스템

Supabase Storage와 연동된 완전한 이미지 업로드 및 관리 시스템을 구현했습니다. 관리자는 상품 등록/수정 시 이미지를 업로드하고 관리할 수 있습니다.

## 🚀 새로 추가된 기능

### 1. 이미지 업로드 컴포넌트 (`ImageUpload`)
- **드래그 앤 드롭**: 파일을 드래그하여 업로드
- **클릭 업로드**: 클릭하여 파일 선택 대화상자 열기
- **다중 업로드**: 한 번에 여러 이미지 선택 및 업로드
- **실시간 미리보기**: 업로드된 이미지 즉시 확인
- **이미지 삭제**: 개별 이미지 제거 기능
- **대표 이미지**: 첫 번째 이미지가 대표 이미지로 설정

### 2. 파일 검증 시스템
- **형식 제한**: JPG, PNG, WebP 파일만 허용
- **크기 제한**: 개별 파일 최대 5MB
- **개수 제한**: 상품당 최대 5개 이미지
- **실시간 검증**: 업로드 전 클라이언트 사이드 검증

### 3. Supabase Storage 연동
- **자동 파일명**: 타임스탬프 + 랜덤 문자열로 고유 파일명 생성
- **공개 URL**: 업로드 후 즉시 접근 가능한 공개 URL 생성
- **폴더 구조**: `products/` 폴더에 체계적으로 저장
- **에러 처리**: 업로드 실패 시 상세한 에러 메시지 제공

## 📁 새로 추가된 파일들

```
src/
├── actions/image-actions.js           # 이미지 업로드 서버 액션
├── components/admin/image-upload.js   # 이미지 업로드 컴포넌트
└── database/storage-setup.sql        # Supabase Storage 설정
```

## 🔧 서버 액션 (Image Actions)

### 이미지 관련 함수들
```javascript
// 단일 이미지 업로드
await uploadImage(file, folder = 'products')

// 다중 이미지 업로드
await uploadMultipleImages(files, folder = 'products')

// 이미지 삭제
await deleteImage(filePath)

// 다중 이미지 삭제
await deleteMultipleImages(filePaths)

// URL에서 파일 경로 추출
extractFilePathFromUrl(url)
```

## 🎯 주요 특징

### 사용자 경험 (UX)
- **직관적 인터페이스**: 드래그 앤 드롭과 클릭 업로드 모두 지원
- **실시간 피드백**: 업로드 진행 상태와 결과 즉시 표시
- **에러 처리**: 사용자 친화적인 에러 메시지
- **미리보기**: 업로드 즉시 이미지 확인 가능
- **순서 관리**: 첫 번째 이미지가 대표 이미지로 자동 설정

### 성능 최적화
- **병렬 업로드**: 여러 이미지 동시 업로드
- **클라이언트 검증**: 서버 요청 전 파일 검증
- **캐시 제어**: Supabase Storage 캐시 설정 (1시간)
- **지연 로딩**: 이미지 컴포넌트의 효율적인 렌더링

### 보안 기능
- **파일 타입 검증**: MIME 타입 기반 검증
- **크기 제한**: 메모리 및 저장 공간 보호
- **고유 파일명**: 파일명 충돌 방지
- **권한 제어**: 관리자만 업로드/수정/삭제 가능

## 📊 데이터 구조

### 상품 테이블 업데이트
```sql
-- images 필드는 이미지 URL 배열로 저장
images TEXT[] -- ['https://...storage.../image1.jpg', 'https://...storage.../image2.jpg']
```

### Supabase Storage 구조
```
Storage Bucket: images
├── products/
│   ├── 1640995200000_abc123def456.jpg
│   ├── 1640995201000_ghi789jkl012.png
│   └── 1640995202000_mno345pqr678.webp
```

## 🔐 보안 및 권한

### Storage 정책 (RLS)
```sql
-- 공개 읽기 허용
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- 관리자만 업로드 허용
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images' AND user_role = 'admin');

-- 관리자만 수정/삭제 허용
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE 
USING (bucket_id = 'images' AND user_role = 'admin');

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'images' AND user_role = 'admin');
```

### 클라이언트 보안
- **MIME 타입 검증**: 업로드 전 파일 형식 확인
- **파일 크기 검증**: 5MB 제한으로 서버 보호
- **확장자 검증**: 이중 검증으로 보안 강화

## 🎨 UI/UX 컴포넌트

### ImageUpload 컴포넌트 사용법
```jsx
<ImageUpload
    images={formData.images}           // 현재 이미지 URL 배열
    onImagesChange={handleImagesChange} // 이미지 변경 콜백
    maxImages={5}                      // 최대 이미지 개수
/>
```

### 컴포넌트 props
- `images`: 현재 이미지 URL 배열
- `onImagesChange`: 이미지 배열 변경 시 호출되는 함수
- `maxImages`: 업로드 가능한 최대 이미지 개수 (기본값: 5)

## 🚀 설정 방법

### 1. Supabase Storage 설정
1. Supabase 대시보드에서 Storage 섹션으로 이동
2. `storage-setup.sql` 파일의 내용을 SQL Editor에서 실행
3. `images` 버킷이 생성되고 정책이 설정됨

### 2. 환경 변수 확인
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. 의존성 설치
```bash
# 이미 설치되어 있어야 하는 패키지들
npm install @supabase/supabase-js
```

## 📝 사용 예시

### 상품 등록 시 이미지 업로드
1. "새 상품 등록" 페이지에서 상품 정보 입력
2. "상품 이미지" 섹션에서 이미지 업로드
   - 파일을 드래그하여 드롭
   - 또는 클릭하여 파일 선택
3. 업로드된 이미지 미리보기 확인
4. 필요시 개별 이미지 삭제
5. "상품 등록" 버튼으로 완료

### 상품 수정 시 이미지 관리
1. 상품 수정 페이지에서 기존 이미지 확인
2. 새 이미지 추가 또는 기존 이미지 삭제
3. 변경사항 저장

## 🔍 트러블슈팅

### 일반적인 문제들

1. **이미지가 업로드되지 않음**
   - Supabase Storage 정책 확인
   - 관리자 권한 확인
   - 네트워크 연결 상태 확인

2. **이미지가 표시되지 않음**
   - Storage 버킷의 공개 설정 확인
   - 이미지 URL 형식 확인
   - CORS 설정 확인

3. **파일 형식 오류**
   - 지원 형식: JPG, PNG, WebP
   - MIME 타입 확인
   - 파일 확장자 확인

4. **크기 제한 오류**
   - 개별 파일: 최대 5MB
   - 총 이미지 개수: 최대 5개
   - 브라우저 메모리 제한 고려

### 디버깅 방법
```javascript
// 콘솔에서 업로드 상태 확인
console.log('Upload result:', result)

// Storage 버킷 내용 확인
const { data } = await supabase.storage.from('images').list('products')

// 이미지 URL 검증
const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)
```

## 📈 향후 개선 사항

### 추가 기능
- [ ] 이미지 리사이징 및 최적화
- [ ] 이미지 순서 드래그 앤 드롭 변경
- [ ] 이미지 압축 기능
- [ ] 워터마크 추가
- [ ] 이미지 메타데이터 관리

### 성능 개선
- [ ] 이미지 CDN 연동
- [ ] 프로그레시브 이미지 로딩
- [ ] WebP 자동 변환
- [ ] 썸네일 자동 생성
- [ ] 지연 로딩 최적화

### UX 개선
- [ ] 이미지 크롭 기능
- [ ] 다중 선택 삭제
- [ ] 업로드 진행률 표시
- [ ] 이미지 미리보기 모달
- [ ] 키보드 단축키 지원

이제 관리자는 상품과 함께 이미지를 쉽게 업로드하고 관리할 수 있으며, 고객은 더 풍부한 시각적 정보로 상품을 확인할 수 있습니다! 🎉 