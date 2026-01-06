# 🚀 스마트 투자자산관리 ADMIN - 설치 및 실행 가이드

## 📦 프로젝트 구조

```
smart-invest-admin/
├── server/          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/       # Sequelize 모델
│   │   ├── routes/       # API 라우트
│   │   ├── middleware/   # 인증 미들웨어
│   │   ├── socket.js     # Socket.IO 설정
│   │   └── app.js        # 메인 앱
│   ├── .env.example
│   └── package.json
│
└── client/          # Frontend (React)
    ├── src/
    │   ├── components/   # 재사용 컴포넌트
    │   ├── pages/        # 페이지
    │   ├── contexts/     # 전역 상태
    │   └── services/     # API 호출
    ├── tailwind.config.js
    └── package.json
```

---

## 🔧 1단계: Backend 설정

### 1. 의존성 설치
```bash
cd server
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어서 다음 값들을 설정하세요:

```env
# Database (Supabase 데이터베이스 설정의 ORM 페이지)
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres


# JWT (임의의 긴 문자열)
JWT_SECRET=your-super-secret-key-here

# 카카오
KAKAO_REST_API_KEY=your_kakao_api_key

# 토스페이먼츠
TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

### 3. 데이터베이스 준비

**Supabase 무료 계정 사용 (추천):**
1. https://supabase.com 회원가입
2. 새 프로젝트 생성
3. Settings → Database에서 Connection String 복사
4. `.env`의 `DATABASE_URL`에 붙여넣기(ORM 방식)

### 4. 서버 실행
```bash
npm run dev
```

**성공 메시지:**
```
🚀 Server running on port 5000
✅ Database connected
```

### 5. 관리자 계정 생성

PowerShell 에서:
```
Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/init-simple' -Method Post
```

브라우저에서:
```
POST http://localhost:5000/api/auth/init
```

또는 터미널에서:
```bash
curl -X POST http://localhost:5000/api/auth/init
```

**기본 계정:**
- 이메일: `admin@smart-admin.com`
- 비밀번호: `admin1234`

---

## 🎨 2단계: Frontend 설정

### 1. 의존성 설치
```bash
cd ../client
npm install
```

### 2. 환경변수 설정
```bash
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### 3. Tailwind CSS 설정
```bash
npx tailwindcss init -p
```

### 4. 클라이언트 실행
```bash
npm start
```

브라우저가 자동으로 열리며 `http://localhost:3000`으로 접속됩니다.

---

## 🔑 3단계: 로그인

1. 이메일: `admin@smart-admin.com`
2. 비밀번호: `admin1234`
3. 로그인 후 **비밀번호 변경 필수!**

---

## 📊 4단계: 초기 데이터 입력

### 패키지 데이터 생성

```sql
INSERT INTO packages (name, price, features, work_days, revisions, display_order, badge, created_at, updated_at)
VALUES
  ('STANDARD', 35000, '["포트폴리오 대시보드","주식/코인 매매일지","배당금 일지","종목정보 관리","월별 투자성과"]', 1, 1, 1, NULL, NOW(), NOW()),
  ('DELUXE', 50000, '["STANDARD 모든 기능","예수금 관리","자산현황 분석 시각화","다양한 차트 제공"]', 2, 2, 2, '추천', NOW(), NOW()),
  ('PREMIUM', 100000, '["DELUXE 모든 기능","리밸런싱 자동 계산","목표달성 시뮬레이션","추가매수 수량 계산"]', 3, 3, 3, NULL, NOW(), NOW());

INSERT INTO members (id, name, email, phone, grade, kakao_id, memo, is_active, created_at, updated_at)
VALUES
  (1, '홍길동', 'hong@example.com', '010-1111-2222', 'STANDARD', 'hong_kakao', '샘플회원1', true, NOW(), NOW()),
  (2, '김철수', 'kim@example.com', '010-2222-3333', 'DELUXE', 'kim_kakao', '샘플회원2', true, NOW(), NOW()),
  (3, '이영희', 'lee@example.com', '010-3333-4444', 'PREMIUM', 'lee_kakao', '샘플회원3', true, NOW(), NOW());
  
INSERT INTO reviews (member_id, rating, content, source, admin_reply, replied_at, is_visible, created_at, updated_at)
VALUES
  (1, 5, '정확한 일정 관리와 빠른 피드백으로 만족합니다. 추천합니다!', 'KMONG', '감사합니다! 만족하셨다니 다행입니다. 앞으로도 잘 부탁드립니다.', NOW(), true, NOW(), NOW()),
  (2, 2, '기대했던 기능들이 빠져 있어 아쉬웠습니다. 개선이 필요합니다.', 'WEBSITE', NULL, NULL, true, NOW(), NOW()),
  (3, 4, '전체적으로 만족하지만 일부 UI가 직관적이지 않습니다.', 'KMONG', '피드백 감사합니다. UI 개선 검토 후 업데이트하겠습니다.', NOW(), true, NOW(), NOW());
```

---

## 🌐 5단계: 배포 (선택사항)

### Backend - Railway  (Start with a 30-day free trial with $5/$20(pro) credits, then $1 per month)
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 생성 및 배포
railway init
railway up
```

### Frontend - Vercel (Free / $20(pro) credits per month)
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

---

## 🐛 문제 해결

### DB 연결 실패
```
❌ Database connection failed
```

**해결:**
1. DATABASE_URL이 정확한지 확인
2. PostgreSQL이 실행 중인지 확인
3. 네트워크 방화벽 확인

### CORS 에러
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked
```

**해결:**
- Backend의 `app.js`에서 CORS 설정 확인
- `CLIENT_URL` 환경변수 확인

### Port 충돌
```
Error: listen EADDRINUSE: address already in use :::5000
```

**해결:**
```bash
# 5000번 포트 사용 프로세스 종료
lsof -ti:5000 | xargs kill -9

# 또는 .env에서 PORT 변경
PORT=5001
```

---

## 📝 개발 체크리스트

- [ ] Backend 서버 실행 확인
- [ ] Frontend 서버 실행 확인
- [ ] 로그인 성공 확인
- [ ] 대시보드 로딩 확인
- [ ] 실시간 채팅 작동 확인
- [ ] 데이터베이스 연결 확인

---

## 🎯 다음 단계

1. **비밀번호 변경**
2. **실제 데이터 입력 테스트**
3. **카카오 API 키 발급 및 연동**
4. **토스페이먼츠 라이브 키로 전환**
5. **도메인 구매 및 연결**

---

## 📞 문의

- 이메일: bmsystems.biz@gmail.com
- 크몽: [BMS개발자](https://kmong.com/@BMS개발자)
