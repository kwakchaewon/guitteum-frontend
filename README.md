# 귀띔 (Guitteum) Frontend

AI 기반 대통령 연설문 분석 플랫폼의 프론트엔드 애플리케이션입니다.

연설문 검색, AI 챗봇 질의응답, 키워드 트렌드 시각화 등의 기능을 제공합니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Vue 3.5 (Composition API, `<script setup>`) |
| Build | Vite 5 |
| UI 컴포넌트 | shadcn-vue (Radix Vue 기반) |
| 스타일링 | Tailwind CSS 3.4 |
| 상태관리 | Pinia 2 |
| 라우팅 | Vue Router 4 |
| HTTP | Axios |
| 차트 | Apache ECharts 5 + echarts-wordcloud |
| 아이콘 | lucide-vue-next |

## 주요 기능

### 대시보드 (홈)
- AI 질문 입력 히어로 섹션
- 통계 요약 카드 (총 연설문, 주요 키워드, AI 질문 수, 평균 응답 시간)
- TOP 키워드 워드클라우드
- 월별 연설문 추이 라인 차트 (6개월/1년 토글)
- 카테고리별 분포 파이 차트
- 최근 연설문 목록

### AI 챗봇
- SSE 스트리밍 기반 실시간 응답 (POST 방식)
- 타이핑 효과 및 스트리밍 중지 기능
- 출처 연설문 카드 표시
- 대화 히스토리 관리 (localStorage 저장)

### 연설문 검색
- 키워드 기반 연설문 검색
- 카테고리/기간 필터
- 페이지네이션
- 키워드 하이라이팅

### 연설문 상세
- 연설문 본문 뷰어
- 메타데이터 표시 (일시, 행사명, 카테고리)

### 통계 대시보드
- TOP 20 키워드 워드클라우드 (전체 너비)
- 월별 연설문 추이 차트
- 카테고리별 분포 차트
- 반응형 레이아웃 및 터치 제스처 지원

## 프로젝트 구조

```
src/
├── api/                # API 모듈
│   ├── axios.js        # Axios 인스턴스 (인터셉터, 에러 처리)
│   ├── chatApi.js      # 챗봇 API
│   ├── searchApi.js    # 검색 API
│   ├── speechApi.js    # 연설문 API
│   └── statsApi.js     # 통계 API
├── assets/css/         # Tailwind + 커스텀 CSS
├── components/
│   ├── chat/           # 챗봇 컴포넌트
│   │   ├── ChatBubble.vue
│   │   ├── ChatHistory.vue
│   │   ├── ChatInput.vue
│   │   └── SourceCard.vue
│   ├── dashboard/      # 대시보드 차트 컴포넌트
│   │   ├── LineChart.vue
│   │   ├── PieChart.vue
│   │   ├── StatCard.vue
│   │   └── WordCloud.vue
│   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── AppHeader.vue
│   │   ├── LoadingBar.vue
│   │   └── MobileMenu.vue
│   ├── search/         # 검색 컴포넌트
│   │   ├── SearchBar.vue
│   │   ├── SearchFilter.vue
│   │   └── SearchResult.vue
│   └── ui/             # shadcn-vue UI 컴포넌트
├── composables/        # 재사용 로직
│   ├── useSSE.js       # POST SSE 스트리밍
│   └── useToast.js     # 토스트 알림
├── lib/                # 유틸리티 (cn() 등)
├── router/             # Vue Router 설정
├── stores/             # Pinia 스토어
│   ├── chatStore.js
│   ├── speechStore.js
│   └── statsStore.js
└── views/              # 페이지 컴포넌트
    ├── HomeView.vue
    ├── ChatView.vue
    ├── SearchView.vue
    ├── SpeechDetailView.vue
    └── StatsView.vue
```

## 시작하기

### 요구사항

- Node.js 18 이상
- npm

### 설치

```bash
git clone <repository-url>
cd guitteum-frontend
npm install
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=/api
```

### 개발 서버

```bash
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행되며, `/api` 경로는 백엔드(`http://localhost:8080`)로 프록시됩니다.

### 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

## 백엔드 API

이 프론트엔드는 다음 백엔드 API와 연동됩니다.

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/speeches` | 연설문 목록 |
| GET | `/api/speeches/{id}` | 연설문 상세 |
| GET | `/api/speeches/search` | 키워드 검색 |
| POST | `/api/chat` | 챗봇 질문 (JSON) |
| POST | `/api/chat/stream` | 챗봇 SSE 스트리밍 |
| GET | `/api/stats/keywords/top` | TOP 키워드 |
| GET | `/api/stats/speeches/monthly` | 월별 통계 |
| GET | `/api/stats/speeches/category` | 카테고리 분포 |
| GET | `/api/stats/summary` | 통계 요약 |

## 디자인

Linear 앱 스타일의 미니멀 디자인을 채택하였습니다.

- 회색조 기반 + 포인트 컬러 `#5E6AD2`
- Inter + Pretendard 폰트
- CSS 변수 기반 다크모드 지원
- 모바일 우선 반응형 레이아웃
