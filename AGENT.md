# AGENT.md — Hisab Kitab (PoP Thekedar Labour Management PWA)

> Is file ko repo ke root me rakho. Copilot Agent ko har task se pehle yeh file padhni hai.
> **Rule #0: Jo is file me nahi likha, usse assume mat karo. Shak ho to code likhne se pehle sawal pucho.**

---

## 1. Project Summary

Ek mobile-first website + PWA jo ek **PoP (Plaster of Paris) false-ceiling thekedar** ke liye hai.
Thekedar apne **mistri aur labour** ka hisab rakhta hai.

Problem jo solve karni hai:
1. Roz ki **attendance** lagana.
2. Kisne **kitne paise liye** (advance/payment) + saath me **chhota note**.
3. **Khoraki**: site par 3–4 mistri/labour apna khana alag banate hain, uske liye paise lete hain. Isko "khoraki" me likhte hain.

Do users / do dashboards:
| Role | Kya kar sakta hai |
|---|---|
| `contractor` (Thekedar) | Worker add/edit, attendance lagana, payment likhna, khoraki likhna, sab report dekhna |
| `worker` (Mistri/Labour) | **Sirf apna data dekhna (read-only)**: attendance, payments, khoraki, balance |

Worker kabhi bhi koi data create/update/delete nahi kar sakta. Yeh rule **backend me bhi enforce** hona chahiye, sirf UI hide karna kaafi nahi.

---

## 2. Non-Negotiable Requirements

1. **Mobile-first, fully responsive** (pehle 360px width design karo, phir tablet/desktop).
2. **Language toggle** app ke top (header) me hamesha dikhe: **Hindi ⇄ English**. Default Hindi. Choice `localStorage` me save ho.
3. **PWA**: installable (manifest + service worker), offline me app shell khule.
4. **Auth**: Register, Login (phone + password), aur **6-digit PIN login**.
5. **Do dashboards**: Contractor dashboard aur Worker dashboard.
6. **Code alag folders me**: `frontend/` aur `backend/`.
7. **Frontend 4-layer architecture** (section 4) strictly follow karo.
8. Saari UI text translation files se aaye. **Hardcoded Hindi/English string component me mat likho.**

---

## 3. Tech Stack (FIXED — koi aur library mat lao bina poochhe)

### Frontend (`/frontend`)
- React 18 + Vite (JavaScript, TypeScript nahi)
- React Router v6
- Tailwind CSS
- Zustand (state layer)
- Axios (api layer)
- react-i18next + i18next (language)
- vite-plugin-pwa (PWA)
- date-fns (date handling)

### Backend (`/backend`)
- Node.js 20 + Express
- MongoDB + Mongoose
- jsonwebtoken (JWT), bcryptjs (password/PIN hashing)
- zod (request validation)
- cors, helmet, express-rate-limit, dotenv

Naya package add karna ho to pehle reason batao aur permission lo.

---

## 4. Frontend 4-Layer Architecture

Dependency direction (upar se neeche, ulta kabhi nahi):

```
UI layer  →  Hook layer  →  State layer
                  ↓
              API layer
```

| Layer | Folder | Kaam | Kya NAHI karna |
|---|---|---|---|
| **UI** | `src/ui/` | Pages, components, layouts. Sirf render + user events. | API call, axios import, business logic, store direct use |
| **Hook** | `src/hooks/` | Custom hooks (`useAuth`, `useWorkers`, `useAttendance`...). UI aur data ke beech ka bridge. API + State ko jodte hain, loading/error handle karte hain. | JSX return karna |
| **State** | `src/state/` | Zustand stores. Sirf data + simple setters. | API call, JSX |
| **API** | `src/api/` | Axios instance + har resource ke plain async functions. | State/store use, JSX, hooks |

**Rules**
- UI sirf **hooks** import karega. UI kabhi `api/` ya `state/` direct import nahi karega.
- API layer pure functions hain, `{ data }` return karte hain.
- Har feature ke liye in 4 layers me alag file banao (naming niche).
- Naya feature = pehle API → State → Hook → UI ke order me banao.

### Frontend Folder Structure

```
frontend/
├─ public/
│  ├─ icons/                # PWA icons 192, 512, maskable
│  └─ locales/
│     ├─ hi/translation.json
│     └─ en/translation.json
├─ src/
│  ├─ api/
│  │  ├─ axiosClient.js     # baseURL, token interceptor, 401 handling
│  │  ├─ auth.api.js
│  │  ├─ workers.api.js
│  │  ├─ attendance.api.js
│  │  ├─ payments.api.js
│  │  ├─ khoraki.api.js
│  │  └─ summary.api.js
│  ├─ state/
│  │  ├─ auth.store.js
│  │  ├─ workers.store.js
│  │  ├─ attendance.store.js
│  │  ├─ payments.store.js
│  │  ├─ khoraki.store.js
│  │  └─ ui.store.js        # language, theme, toasts
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useWorkers.js
│  │  ├─ useAttendance.js
│  │  ├─ usePayments.js
│  │  ├─ useKhoraki.js
│  │  ├─ useSummary.js
│  │  └─ useLanguage.js
│  ├─ ui/
│  │  ├─ layouts/           # AppHeader (language toggle yahin), BottomNav
│  │  ├─ components/        # Button, Input, PinInput, Modal, Card, EmptyState, Loader
│  │  ├─ pages/
│  │  │  ├─ auth/           # Login, Register, PinLogin
│  │  │  ├─ contractor/     # Dashboard, Workers, Attendance, Payments, Khoraki, WorkerDetail
│  │  │  └─ worker/         # Dashboard (read-only)
│  │  └─ routes/            # AppRoutes, ProtectedRoute, RoleRoute
│  ├─ i18n/index.js
│  ├─ utils/                # formatCurrency, formatDate (pure helpers)
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ vite.config.js           # vite-plugin-pwa yahin
├─ tailwind.config.js
└─ package.json
```

### Naming
- Files: `camelCase.js` for api/state/hooks, `PascalCase.jsx` for UI components/pages.
- Hooks `use` se start. Stores `xxx.store.js`. API files `xxx.api.js`.

---

## 5. Backend Architecture

Backend me bhi layered rakho (frontend jaisa strict 4-layer nahi, par separation zaroori):

`routes → controllers → services → models`

```
backend/
├─ src/
│  ├─ config/          # env.js, db.js
│  ├─ models/          # Mongoose schemas
│  ├─ routes/          # sirf path + middleware + controller mapping
│  ├─ controllers/     # req/res handle, service call
│  ├─ services/        # business logic (balance calculation yahin)
│  ├─ middlewares/     # auth.js, requireRole.js, validate.js, errorHandler.js, rateLimit.js
│  ├─ validators/      # zod schemas
│  ├─ utils/           # token.js, asyncHandler.js, ApiError.js
│  ├─ app.js
│  └─ server.js
├─ .env.example
└─ package.json
```

Rules:
- Controller me DB query nahi. Service me hi Mongoose use ho.
- Har request body `zod` se validate ho.
- Saare errors `ApiError` + central `errorHandler` se jayein.
- Response format hamesha: `{ success: true, data }` ya `{ success: false, message }`.

---

## 6. Data Models (sirf yahi fields, extra mat banao)

**User** (contractor aur worker dono)
- `name` String, required
- `phone` String, required, unique (10 digit)
- `passwordHash` String (contractor ke liye required; worker ke liye optional)
- `pinHash` String (6-digit PIN ka bcrypt hash; kabhi plain store nahi)
- `role` enum: `contractor` | `worker`
- `contractorId` ObjectId (worker ke liye: kis thekedar ka hai)
- `workerType` enum: `mistri` | `labour` (sirf worker)
- `dailyWage` Number (sirf worker, ₹ per din)
- `isActive` Boolean default true
- `failedPinAttempts` Number, `lockUntil` Date
- timestamps

**Attendance**
- `workerId`, `contractorId`, `date` (YYYY-MM-DD string), `status` enum: `present` | `half` | `oneAndHalf` | `double` | `absent`, `note` String optional
- Unique index: `(workerId, date)` — ek worker ki ek din me ek hi entry; dobara lagane par update.

**Payment** (kisne kitne paise liye)
- `workerId`, `contractorId`, `amount` Number > 0, `date`, `note` String optional (max 200 chars)

**Khoraki**
- `workerId`, `contractorId`, `amount` Number > 0, `date`, `note` String optional (max 200 chars)

**Khoraki Group**
- `name` String, required
- `contractorId` ObjectId
- `workerIds` array of worker ObjectIds, required, non-empty
- `entries` array of `{ amount, date }` records; amount > 0, date YYYY-MM-DD
- `amount` Number > 0 (sum of entries)
- `date` YYYY-MM-DD string (first entry date, retained for older group records)
- `dividedDate` YYYY-MM-DD string (date the combined total was divided, optional until closed)
- `note` String optional (max 200 chars)
- `status` enum: `active` | `closed`
- timestamps

Delete: soft delete nahi, simple delete chalega, par sirf contractor kar sakta hai aur sirf apne workers ka.

---

## 7. Business Rules (Balance Calculation)

- `present` = 1 din, `half` = 0.5 din, `oneAndHalf` = 1.5 din, `double` = 2 din, `absent` = 0.
- `earned = (total days) × dailyWage`
- `totalPayments = sum(Payment.amount)`
- `totalKhoraki = sum(Khoraki.amount)`
- `balance = earned − totalPayments − totalKhoraki`

> ⚠️ **ASSUMPTION — thekedar se confirm karna hai:** yahan khoraki ko "diya hua paisa" maan kar balance me se minus kiya gaya hai. Agar khoraki alag se hisab me nahi katni, to sirf ek jagah (`summary.service.js`) formula badalna hai. **Agent ko yeh formula khud change nahi karna; sirf ek hi function me rakho.**

Calculation sirf **backend service** me ho, frontend sirf dikhaye.

---

## 8. Authentication (VERY IMPORTANT)

### Flows
1. **Register** (sirf contractor): `name`, `phone`, `password` (min 6 char), optional PIN set karna baad me.
2. **Login with Password**: `phone` + `password` → JWT.
3. **Login with 6-digit PIN**: `phone` + `pin` (exactly 6 digits) → JWT.
4. **Worker**: khud register nahi karta. Contractor worker add karte waqt `name`, `phone`, `workerType`, `dailyWage`, aur **initial 6-digit PIN** set karta hai. Worker `phone + PIN` se login karega.
5. **PIN set/change**: logged-in user Settings se apna PIN set/badal sakta hai (purana PIN/password verify karke). Contractor worker ka PIN reset kar sakta hai.

### Security rules
- Password aur PIN dono **bcrypt hash** (salt rounds 10) me store. Plain text kabhi nahi, log me bhi nahi.
- PIN sirf digits, length exactly 6. Validation frontend + backend dono me.
- **Lockout**: 5 galat PIN/password attempts → 15 minute ke liye lock (`lockUntil`). Successful login par counter reset.
- Login endpoints par `express-rate-limit`.
- JWT expiry 30 din. Token `Authorization: Bearer <token>` header me.
- Middleware: `auth` (token verify) → `requireRole('contractor')` write routes par.
- Contractor sirf **apne** workers ka data dekhe/badle. Worker sirf **apna** data dekhe. Har query me `contractorId` / `workerId` ownership check karo.
- Error message generic rakho: "Phone ya PIN galat hai" (batao mat ki phone exist karta hai ya nahi).

### Frontend auth
- Login screen par tab/toggle: **Password** | **PIN**.
- PIN input: 6 alag boxes, numeric keypad (`inputmode="numeric"`), auto-focus next, paste support.
- Token `auth.store` me + `localStorage` me persist.
- 401 aaye to auto logout.
- Login ke baad `role` ke hisaab se redirect: `contractor` → `/contractor`, `worker` → `/worker`.

---

## 9. API Endpoints (base: `/api`)

| Method | Path | Role | Kaam |
|---|---|---|---|
| POST | `/auth/register` | public | Contractor register |
| POST | `/auth/login` | public | Phone + password |
| POST | `/auth/login-pin` | public | Phone + 6-digit PIN |
| GET | `/auth/me` | any | Current user |
| PUT | `/auth/pin` | any | Apna PIN set/change |
| GET | `/workers` | contractor | Saare workers |
| POST | `/workers` | contractor | Worker add (PIN ke saath) |
| PUT | `/workers/:id` | contractor | Worker edit |
| PUT | `/workers/:id/pin` | contractor | Worker PIN reset |
| DELETE | `/workers/:id` | contractor | Worker deactivate/delete |
| GET | `/attendance?date=YYYY-MM-DD` | contractor | Us din ki attendance |
| PUT | `/attendance` | contractor | Attendance upsert `{workerId,date,status,note}` |
| GET | `/payments?workerId=&from=&to=` | contractor | Payments list |
| POST | `/payments` | contractor | Payment add (amount, note) |
| DELETE | `/payments/:id` | contractor | Payment delete |
| GET | `/khoraki?workerId=&from=&to=` | contractor | Khoraki list |
| POST | `/khoraki` | contractor | Khoraki add (amount, note) |
| DELETE | `/khoraki/:id` | contractor | Khoraki delete |
| POST | `/khoraki/groups` | contractor | Group khoraki banaao with one or more dated amount entries |
| GET | `/khoraki/groups` | contractor | Contractor ke active/closed khoraki groups |
| POST | `/khoraki/groups/:id/entries` | contractor | Active group me another dated amount entry add karo |
| POST | `/khoraki/groups/:id/divide` | contractor | Active group ka combined amount request date par members me barabar divide karke individual Khoraki entries banaao, phir group `closed` |
| GET | `/summary/workers` | contractor | Har worker ka days/earned/paid/khoraki/balance |
| GET | `/me/summary?from=&to=` | worker | Apna attendance, payments, khoraki, balance (read-only) |

Naya endpoint banana ho to pehle is table me add karo.

---

## 10. Screens

### Common
- **AppHeader**: app naam (left), **Language toggle HI/EN (right, hamesha visible)**, logout menu.
- **Settings**: language toggle, logout, light/dark theme (`hk_theme` me persist), aur available hone par PWA install option.

### Contractor (bottom navigation)
1. **Dashboard**: aaj kitne present, aaj ka total khoraki, total baaki balance, quick buttons.
2. **Attendance**: date picker (default aaj), worker list, har worker ke saamne tap karke Present / Half / Absent, optional note. Ek tap me save.
3. **Payments**: worker chuno → amount + small note → save. Neeche list.
4. **Khoraki**: worker chuno → amount + note → save. Neeche list.
5. **Workers**: add/edit, PIN reset, worker par tap → `WorkerDetail` (mahine ka attendance, payments, khoraki, balance).

### Worker (read-only, bottom nav: Home, Attendance, Paise, Khoraki, Chart)
- Sirf dekhna. Koi add/edit/delete button nahi.
- Month filter, total din, kamai, liye hue paise, khoraki, **baaki balance**.
- Chart screen par selected month ka worker name, total dehadi, date-wise attendance aur payments dikhte hain.

### UX rules (thekedar kam padha-likha / jaldi me ho sakta hai)
- Bade buttons (min 44px touch target), bada font, high contrast.
- Amount field par numeric keyboard.
- Har save par clear success/error toast (translated).
- Empty state aur loading state har list me.
- Currency `₹` Indian format (`1,23,456`). Date `DD/MM/YYYY`.

---

## 11. Internationalization (Hindi ⇄ English)

- `react-i18next`, files: `public/locales/hi/translation.json` aur `en/translation.json`.
- Default `hi`. Fallback `en`.
- Toggle `useLanguage` hook se, state `ui.store` me, `localStorage` key: `hk_lang`.
- Naye har text ke liye **dono files me key add karo**. Ek me bhi missing nahi hona chahiye.
- Keys namespaced: `auth.login`, `attendance.present`, `khoraki.title`, etc.
- Hindi font: system font ya `Noto Sans Devanagari` (self-host ya Google Fonts).

---

## 12. PWA Requirements

- `vite-plugin-pwa` se manifest: name "Hisab Kitab", short_name "Hisab", `display: standalone`, `start_url: /`, theme color, icons 192/512 + maskable.
- Service worker: app shell precache. API calls **network-first**.
- Install prompt button optional (Settings me).
- Offline hone par banner dikhao ("Internet nahi hai"). **Offline write queue abhi nahi banana** (Phase 2 me, tab tak write ke liye internet zaroori).
- HTTPS par hi test/deploy.

---

## 13. Environment Variables

`backend/.env.example`
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=30d
CLIENT_ORIGIN=http://localhost:5173
```
`frontend/.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Secrets kabhi commit mat karo. `.env` `.gitignore` me ho.

---

## 14. Build Order (isi sequence me kaam karo, ek ke baad ek)

1. Repo scaffold: `frontend/` + `backend/`, lint/prettier, `.gitignore`.
2. Backend: config, DB connect, error handler, User model, auth (register/login/login-pin/me/pin) + lockout.
3. Frontend: i18n + AppHeader language toggle + routing + Login/Register/PIN login (4 layers ke saath).
4. Backend + Frontend: Workers CRUD.
5. Attendance (backend → api → state → hook → UI).
6. Payments aur Khoraki.
7. Summary/balance + Contractor dashboard.
8. Worker read-only dashboard + `/me/summary`.
9. PWA setup + offline banner.
10. Responsive polish + testing checklist (section 16).

Har step ke baad chalne wali cheez dikhao, fir agla step.

---

## 15. Agent Behaviour Rules (Anti-Hallucination)

1. Is file me jo stack/field/endpoint likha hai **sirf wahi use karo**. Naya invent mat karo.
2. Library ka koi function/option pakka na pata ho to **guess mat karo** — official docs padho ya poochho.
3. Ek baar me **ek feature** karo. Bina maange extra feature (reports PDF, charts, notifications, payment gateway, etc.) mat jodo.
4. Sirf required files badlo. Unrelated file refactor mat karo.
5. Layer rules todna mana hai (UI me axios, API me store, etc.). Shortcut mat lo.
6. Business formula (section 7) ek hi jagah rakho.
7. Code me placeholder/TODO/fake data chhodkar "done" mat bolo. Adhoora ho to saaf batao kya baaki hai.
8. Har kaam ke end me batao: kaunsi files bani/badli, kaise run/test karna hai.
9. Commands jo chalayi unka output dekho; error ho to fix karke hi aage badho.
10. Agar requirement unclear hai (jaise khoraki ka formula) — **pucho, assume mat karo.**
11. Security shortcuts mana: plain password/PIN, hardcoded secret, `*` CORS production me.

---

## 16. Definition of Done / Testing Checklist

- [ ] 360px width par saare screens bina horizontal scroll ke chalte hain.
- [ ] Language toggle har page par top me hai; poora UI Hindi aur English dono me badalta hai; refresh ke baad bhi yaad rehta hai.
- [ ] Register, Password login, PIN login teeno kaam karte hain; 5 galat attempt par lockout.
- [ ] Worker kisi bhi write API ko call kare to `403` mile (Postman se test).
- [ ] Contractor dusre contractor ke worker ka data nahi dekh sakta.
- [ ] Attendance ek din me ek worker ki ek hi entry (dobara = update).
- [ ] Payment aur Khoraki me note save + display hota hai.
- [ ] Balance formula sahi (manual example se verify).
- [ ] PWA Lighthouse "Installable" pass; phone par Add to Home Screen chalta hai.
- [ ] Koi hardcoded UI string nahi, koi hardcoded secret nahi.
- [ ] 4-layer rule: `ui/` me `axios`/`api/`/`state/` ka import nahi.

---

## 17. Out of Scope (abhi nahi banana)

Multi-site management, PDF/Excel export, push notifications, online payment, offline write sync, admin super-panel, image upload.
