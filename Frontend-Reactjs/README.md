# FreshFoods Ledger — Dashboard (React + Vite)

فرونت إند React كامل بيتكلم مع الـ retail-api اللي بنيناه، شامل صفحات:
- **Login / Register**
- **Overview** — إحصائيات سريعة (عدد المنتجات، الموردين، قيمة المخزون، منتجات منخفضة المخزون...)
- **Products** — CRUD كامل
- **Suppliers** — CRUD كامل
- **Sales** — تسجيل بيع + فلترة حسب المنتج
- **Reports** — الخمس تقارير (JOIN / GROUP BY) في صفحة واحدة

## التشغيل

```bash
cd retail-frontend
npm install
cp .env.example .env   # عدّل VITE_API_BASE_URL لو الباك إند شغال على بورت مختلف
npm run dev
```

هيفتح على `http://localhost:5173`، والباك إند المفروض يكون شغال على `http://localhost:3000` (أو غيّر `VITE_API_BASE_URL`).

## ⚠️ مهم: ربط الـ Login/Register بالباك إند بتاعك

أنا مش شايف كود الـ auth اللي عملته في الباك إند، فافترضت شكل شائع للـ endpoints. **ده كله في ملف واحد بس**: `src/api/config.js`

```js
export const AUTH_ENDPOINTS = {
  login: '/auth/login',       // غيّرها لمسار الـ login عندك
  register: '/auth/register', // غيّرها لمسار الـ register عندك
};

export const AUTH_FIELDS = {
  identifier: 'username', // لو باك إندك بياخد email بدل username غيّرها هنا
  password: 'password',
};
```

الفرونت إند بيتوقع إن رد الـ login يكون فيه `token` (أو `accessToken`) في الـ response، وبيحطه في `localStorage` وبيبعته مع كل الريكوستات بعد كده كـ:
```
Authorization: Bearer <token>
```

لو باك إندك بيرجع التوكن باسم مختلف أو بيستخدم cookies بدل الـ Bearer token، غيّر منطق `login`/`register` في `src/context/AuthContext.jsx`.

## هيكل المشروع

```
src/
├── api/
│   ├── config.js      # مسارات وحقول الـ auth (المكان الوحيد المفروض تعدله)
│   ├── client.js       # axios instance + إرفاق التوكن تلقائيًا
│   └── resources.js    # دوال النداء على /products, /suppliers, /sales, /reports
├── context/
│   └── AuthContext.jsx # حالة تسجيل الدخول، login/register/logout
├── components/
│   ├── Layout.jsx        # الـ sidebar + الهيكل العام
│   ├── ProtectedRoute.jsx
│   └── Modal.jsx
└── pages/
    ├── Login.jsx, Register.jsx
    ├── Overview.jsx
    ├── Products.jsx, Suppliers.jsx, Sales.jsx
    └── Reports.jsx
```

## التصميم

هوية بصرية مخصوصة مبنية على فكرة "دفتر حسابات محل بقالة": خلفية ورقية، أخضر واجهة المحل، وكهرماني تاجات الأسعار، مع خط Fraunces للعناوين وIBM Plex Mono للأرقام والأسعار (زي طابعة الإيصالات). الـ sidebar شكله زي تذكرة مقطوعة من دفتر (perforated edge)، وكروت الإحصائيات شكلها زي التاج اللي بيتعلق على المنتج.

تم عمل `npm run build` بنجاح بدون أي أخطاء قبل التسليم.
