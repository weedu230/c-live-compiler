# 🟣 C# Online Compiler

ایک مکمل ویب بیسڈ C# کمپائلر جو براؤزر میں ہی C# کوڈ لکھنے، کمپائل کرنے اور چلانے کی سہولت دیتا ہے۔

![C# Compiler](https://img.shields.io/badge/C%23-Online_Compiler-purple?style=for-the-badge&logo=csharp)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=for-the-badge&logo=tailwindcss)

---
📋 Project Overview

This is a web-based C# compiler providing a professional IDE-like interface. It includes:

✅ Monaco Editor — VS Code-like code editor (syntax highlighting, autocomplete)

✅ Piston API — secure (sandboxed) code compilation and execution

✅ Real-time Output — compile errors and runtime output displayed instantly

✅ Dark Theme — professional IDE-like design

🛠️ Tech Stack
Technology	Usage
React 18	Frontend UI framework
TypeScript	Type safety and better development experience
Vite	Fast build tool and dev server
Tailwind CSS	Utility-first CSS framework
Monaco Editor	VS Code browser editor
Piston API	C# code compilation and execution
Lucide React	Icons
shadcn/ui	UI components
📁 Folder Structure
src/
├── components/
│   ├── CodeEditor.tsx        # Monaco Editor component — code editing area
│   ├── OutputPanel.tsx       # Output panel — shows compile/run results
│   ├── NavLink.tsx           # Navigation link component
│   └── ui/                   # shadcn/ui components (button, card, dialog, etc.)
├── lib/
│   ├── compiler.ts           # Piston API integration — send code & receive result
│   └── utils.ts              # Utility functions
├── pages/
│   ├── Index.tsx             # Main page — editor + output + toolbar
│   └── NotFound.tsx          # 404 page
├── hooks/                    # Custom React hooks
├── test/                     # Test setup and test files
├── index.css                 # Global styles and design tokens
├── App.tsx                   # App router
└── main.tsx                  # Entry point

⚙️ How It Works
User writes code (Monaco Editor)
        ↓
Presses "Run" button
        ↓
Code is sent to Piston API (POST request)
        ↓
API compiles and executes C# code on server (sandboxed)
        ↓
Result (output or error) is returned
        ↓
Displayed in the output panel

🔒 Security

Code runs via Piston API, fully sandboxed

User code is not stored on the server

Each execution runs in a separate container

Time and memory limits are applied

🚀 Local Development
# Clone the repo
git clone <YOUR_GIT_URL>

# Navigate into the folder
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Run dev server
npm run dev


App will run at http://localhost:8080.

📌 Features
Feature	Description
🖊️ Code Editor	Monaco Editor — syntax highlighting, autocomplete
▶️ Compile & Run	Run C# code with a single click
📊 Output Panel	Shows success/error status, execution time
🔄 Reset	Reset code to default
🌙 Dark Theme	Easy on the eyes
🔮 Future Scope

 Multi-language support (Python, Java, JavaScript)

 AI-based code suggestions and auto-fix

 File explorer (multi-file support)

 Code sharing (share via link)

 User accounts and saving code

 Custom themes

 Improved mobile responsive design

📄 License

This project is open-source.

Made with ❤️
