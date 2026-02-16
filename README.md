# 🟣 C# Online Compiler

A complete web-based C# compiler that allows you to write, compile, and run C# code directly in your browser.

![C# Compiler](https://img.shields.io/badge/C%23-Online_Compiler-purple?style=for-the-badge&logo=csharp)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 📋 Project Overview

This is a **web-based C# compiler** that provides a professional IDE-like interface with:

- ✅ **Monaco Editor** — VS Code-like code editor (syntax highlighting, autocomplete)
- ✅ **Piston API** — Secure sandboxed code compilation and execution
- ✅ **Real-time Output** — Instant display of compile errors and runtime output
- ✅ **Dark Theme** — Professional IDE-style design

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **React 18** | Frontend UI framework |
| **TypeScript** | Type safety and better development experience |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Monaco Editor** | VS Code's browser-based editor |
| **Piston API** | C# code compilation and execution |
| **Lucide React** | Icons |
| **shadcn/ui** | UI components |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CodeEditor.tsx        # Monaco Editor component — Code editing area
│   ├── OutputPanel.tsx       # Output panel — Displays compile/run results
│   ├── NavLink.tsx           # Navigation link component
│   └── ui/                   # shadcn/ui components (button, card, dialog, etc.)
├── lib/
│   ├── compiler.ts           # Piston API integration — Send code and receive results
│   └── utils.ts              # Utility functions
├── pages/
│   ├── Index.tsx             # Main page — Editor + Output + Toolbar
│   └── NotFound.tsx          # 404 page
├── hooks/                    # Custom React hooks
├── test/                     # Test setup and test files
├── index.css                 # Global styles and design tokens
├── App.tsx                   # App router
└── main.tsx                  # Entry point
```

---

## ⚙️ How It Works

```
User writes code (Monaco Editor)
        ↓
Clicks "Run" button
        ↓
Code is sent to Piston API (POST request)
        ↓
API compiles and executes C# code on server (sandboxed)
        ↓
Result (output or error) is returned
        ↓
Displayed in output panel
```

---

## 🔒 Security

- Code runs through **Piston API**, which is fully **sandboxed**
- User code is not stored on the server
- Each execution happens in an isolated container
- Time limits and memory limits are enforced

---

## 🚀 Local Development

```sh
# Clone the repository
git clone https://github.com/weedu230/csharp-live-compiler.git

# Navigate to folder
cd csharp-live-compiler

# Install dependencies
npm install

# Run dev server
npm run dev
```

The app will run at `http://localhost:8080`.

---

## 📌 Features

| Feature | Description |
|---|---|
| 🖊️ Code Editor | Monaco Editor — syntax highlighting, autocomplete |
| ▶️ Compile &amp; Run | Execute C# code with one click |
| 📊 Output Panel | success/error status, execution time |
| 🔄 Reset | Reset code to default |
| 🌙 Dark Theme | Easy on the eyes |

---

## 🔮 Future Enhancements

- [ ] Support for multiple languages (Python, Java, JavaScript)
- [ ] AI-powered code suggestions and auto-fix
- [ ] File explorer (multi-file support)
- [ ] Code sharing (share via link)
- [ ] User accounts and code saving
- [ ] Custom themes
- [ ] Improved mobile responsive design

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weedu230/csharp-live-compiler)

**Steps:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

Vercel will automatically detect this is a Vite project and configure everything!

---

## 📄 License

This project is open source.

---

**Made with ❤️**