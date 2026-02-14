# 🟣 C# Online Compiler

ایک مکمل ویب بیسڈ C# کمپائلر جو براؤزر میں ہی C# کوڈ لکھنے، کمپائل کرنے اور چلانے کی سہولت دیتا ہے۔

![C# Compiler](https://img.shields.io/badge/C%23-Online_Compiler-purple?style=for-the-badge&logo=csharp)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss)

---
bhai is readme ko english mei convert kar 



# 🟣 C# Online Compiler

ایک مکمل ویب بیسڈ C# کمپائلر جو براؤزر میں ہی C# کوڈ لکھنے، کمپائل کرنے اور چلانے کی سہولت دیتا ہے۔

![C# Compiler](https://img.shields.io/badge/C%23-Online_Compiler-purple?style=for-the-badge&logo=csharp)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 📋 پروجیکٹ کا تعارف

یہ ایک **ویب بیسڈ C# کمپائلر** ہے جو پروفیشنل IDE جیسا انٹرفیس فراہم کرتا ہے۔ اس میں:

- ✅ **Monaco Editor** — VS Code جیسا کوڈ ایڈیٹر (syntax highlighting، autocomplete)
- ✅ **Piston API** — محفوظ (sandboxed) کوڈ کمپائلیشن اور ایگزیکیوشن
- ✅ **ریئل ٹائم آؤٹ پٹ** — کمپائل ایررز اور رن ٹائم آؤٹ پٹ فوری دکھائی دیتا ہے
- ✅ **ڈارک تھیم** — پروفیشنل IDE جیسا ڈیزائن

---

## 🛠️ ٹیکنالوجیز (Tech Stack)

| ٹیکنالوجی | استعمال |
|---|---|
| **React 18** | فرنٹ اینڈ UI فریم ورک |
| **TypeScript** | ٹائپ سیفٹی اور بہتر ڈویلپمنٹ |
| **Vite** | فاسٹ بلڈ ٹول اور ڈیو سرور |
| **Tailwind CSS** | یوٹیلیٹی فرسٹ CSS فریم ورک |
| **Monaco Editor** | VS Code کا براؤزر ایڈیٹر |
| **Piston API** | C# کوڈ کمپائلیشن اور ایگزیکیوشن |
| **Lucide React** | آئیکنز |
| **shadcn/ui** | UI کمپوننٹس |

---

## 📁 کوڈ اسٹرکچر (Folder Structure)

```
src/
├── components/
│   ├── CodeEditor.tsx        # Monaco Editor کمپوننٹ — کوڈ لکھنے کا ایریا
│   ├── OutputPanel.tsx       # آؤٹ پٹ پینل — کمپائل/رن کا نتیجہ دکھاتا ہے
│   ├── NavLink.tsx           # نیویگیشن لنک کمپوننٹ
│   └── ui/                   # shadcn/ui کمپوننٹس (button, card, dialog وغیرہ)
├── lib/
│   ├── compiler.ts           # Piston API انٹیگریشن — کوڈ بھیجنا اور نتیجہ وصول کرنا
│   └── utils.ts              # یوٹیلیٹی فنکشنز
├── pages/
│   ├── Index.tsx             # مین پیج — ایڈیٹر + آؤٹ پٹ + ٹول بار
│   └── NotFound.tsx          # 404 پیج
├── hooks/                    # کسٹم React ہکس
├── test/                     # ٹیسٹ سیٹ اپ اور ٹیسٹ فائلز
├── index.css                 # گلوبل سٹائلز اور ڈیزائن ٹوکنز
├── App.tsx                   # ایپ روٹر
└── main.tsx                  # انٹری پوائنٹ
```

---

## ⚙️ کیسے کام کرتا ہے؟

```
صارف کوڈ لکھتا ہے (Monaco Editor)
        ↓
"Run" بٹن دباتا ہے
        ↓
کوڈ Piston API کو بھیجا جاتا ہے (POST request)
        ↓
API سرور پر C# کوڈ کمپائل اور ایگزیکیوٹ ہوتا ہے (sandboxed)
        ↓
نتیجہ (output یا error) واپس آتا ہے
        ↓
آؤٹ پٹ پینل میں دکھایا جاتا ہے
```

---

## 🔒 سیکیورٹی

- کوڈ **Piston API** کے ذریعے چلتا ہے جو مکمل طور پر **sandboxed** ہے
- صارف کا کوڈ سرور پر محفوظ نہیں ہوتا
- ہر ایگزیکیوشن الگ کنٹینر میں ہوتی ہے
- ٹائم لمیٹ اور میموری لمیٹ لاگو ہے

---

## 🚀 لوکل ڈویلپمنٹ

```sh
# ریپو کلون کریں
git clone <YOUR_GIT_URL>

# فولڈر میں جائیں
cd <YOUR_PROJECT_NAME>

# ڈیپنڈنسیز انسٹال کریں
npm install

# ڈیو سرور چلائیں
npm run dev
```

ایپ `http://localhost:8080` پر چلے گی۔

---

## 📌 فیچرز

| فیچر | تفصیل |
|---|---|
| 🖊️ کوڈ ایڈیٹر | Monaco Editor — syntax highlighting, autocomplete |
| ▶️ کمپائل اور رن | ایک کلک میں C# کوڈ چلائیں |
| 📊 آؤٹ پٹ پینل | success/error سٹیٹس، ایگزیکیوشن ٹائم |
| 🔄 ری سیٹ | کوڈ ڈیفالٹ پر واپس لائیں |
| 🌙 ڈارک تھیم | آنکھوں کے لیے آرام دہ |

---

## 🔮 مستقبل کے منصوبے (Scope)

- [ ] متعدد زبانوں کی سپورٹ (Python, Java, JavaScript)
- [ ] AI سے کوڈ تجاویز اور آٹو فکس
- [ ] فائل ایکسپلورر (ملٹی فائل سپورٹ)
- [ ] کوڈ شیئرنگ (لنک سے شیئر کریں)
- [ ] صارف اکاؤنٹس اور کوڈ محفوظ کرنا
- [ ] کسٹم تھیمز
- [ ] موبائل ریسپانسو ڈیزائن میں بہتری

---

## 📄 لائسنس

یہ پروجیکٹ اوپن سورس ہے۔

---

**بنایا گیا ❤️ کے ساتھ**
