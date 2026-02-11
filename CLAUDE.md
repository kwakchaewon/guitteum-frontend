# CLAUDE.md - Guitteum Frontend

## Project
AI 기반 대통령 연설문 분석 플랫폼 (귀띔) 프론트엔드.
Vue 3 + Vite + shadcn-vue + Tailwind CSS. JavaScript (no TypeScript).

## Tech Stack
- Vue 3.4.x (Composition API + `<script setup>`)
- Vite 5.x
- shadcn-vue 0.10.x (Radix Vue 기반)
- Tailwind CSS 3.4.x
- Pinia 2.x (상태관리)
- Vue Router 4.x
- Axios 1.x (HTTP)
- Apache ECharts 5.x (차트)
- lucide-vue-next (아이콘)

## Directory Structure
```
src/
  api/          # Axios 인스턴스 및 API 호출 모듈
  router/       # Vue Router 설정
  stores/       # Pinia 스토어
  views/        # 페이지 컴포넌트 (*View.vue)
  components/   # 재사용 컴포넌트 (layout/, chat/, search/, dashboard/)
  components/ui/  # shadcn-vue 컴포넌트 (수정 가능)
  composables/  # 재사용 로직 (use*.js)
  assets/css/   # Tailwind + 커스텀 CSS
  lib/          # 유틸리티 (cn() 등)
```

## Coding Conventions

### Vue Components
- `<script setup>` 사용, Options API 금지
- 컴포넌트 파일명: PascalCase (e.g. `ChatBubble.vue`)
- 페이지 파일명: `*View.vue` (e.g. `HomeView.vue`)
- props/emits 정의는 `defineProps()` / `defineEmits()` 사용

### JavaScript
- 순수 JavaScript (TypeScript 미사용)
- `const`/`let` 사용, `var` 금지
- 화살표 함수 선호
- async/await 사용 (Promise.then 지양)

### CSS / Styling
- Tailwind 유틸리티 클래스 우선, 커스텀 CSS 최소화
- 모바일 우선 설계: 기본 = 모바일, `md:` 이상에서 데스크톱 적용
- 브레이크포인트: sm(640) / md(768) / lg(1024) / xl(1280)
- shadcn-vue 컴포넌트 스타일 변경 시 `cn()` 유틸리티 사용

### Design System (Linear 스타일)
- 색상: 회색조 기반 + 포인트 컬러 `#5E6AD2`
- 폰트: Inter + Pretendard
- 카드: `border border-border hover:border-primary/30 transition-colors`
- 호버: `hover:bg-surface/50`, `hover:border-primary/50`
- 제목: `font-semibold tracking-tight`
- 본문: `text-sm`, 라벨: `text-xs text-muted-foreground`
- 다크모드 지원 (CSS 변수 기반)

### State Management (Pinia)
- 스토어 파일명: `*Store.js`
- Composition API 스타일 (`defineStore` + setup function)

### API
- `src/api/axios.js`에 공통 Axios 인스턴스 정의
- 각 도메인별 API 모듈 분리 (`speechApi.js`, `chatApi.js` 등)
- 백엔드 base URL: 환경변수 `VITE_API_BASE_URL`
- SSE 스트리밍: `EventSource` API 사용 (`composables/useSSE.js`)

### Naming
- 변수/함수: camelCase
- 상수: UPPER_SNAKE_CASE
- 컴포넌트: PascalCase
- CSS 클래스: Tailwind 유틸리티 (kebab-case 커스텀 클래스 최소화)
- 이벤트: kebab-case (e.g. `@send-message`)

## Backend API Endpoints
- `GET /api/speeches` - 연설문 목록
- `GET /api/speeches/{id}` - 연설문 상세
- `GET /api/speeches/search` - 키워드 검색
- `POST /api/chat` - 챗봇 질문 (JSON)
- `POST /api/chat/stream` - 챗봇 SSE 스트리밍
- `GET /api/stats/keywords/top` - TOP 키워드
- `GET /api/stats/speeches/monthly` - 월별 통계
- `GET /api/stats/speeches/category` - 카테고리 분포

## Commands
- `npm run dev` - 개발 서버
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 미리보기
