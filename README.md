# 🚀 스마트 투자자산관리 ADMIN

관리자 전용 대시보드 및 관리 시스템

## 📋 프로젝트 개요

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL (Supabase)
- **실시간**: Socket.IO (채팅)

## 🗂️ 프로젝트 구조

```
smart-invest-admin/
├── client/          # React Frontend
├── server/          # Node.js Backend
└── README.md
```

## 🚀 시작하기

### Backend 실행
```bash
cd server
npm install
npm run dev
```

### Frontend 실행
```bash
cd client
npm install
npm start
```

## 📌 주요 기능

- ✅ 대시보드 (실시간 통계)
- ✅ 회원 관리
- ✅ 수익 정산 관리
- ✅ 가격 편성 관리
- ✅ 리뷰 관리
- ✅ 고객 상담 (실시간 채팅)
- ✅ 비용 관리

## 🔑 환경 변수

### Backend (.env)
```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
KAKAO_REST_API_KEY=your_kakao_key
TOSS_CLIENT_KEY=your_toss_key
TOSS_SECRET_KEY=your_toss_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 📝 개발 로그

- 2025-12-16: 프로젝트 초기 설정
