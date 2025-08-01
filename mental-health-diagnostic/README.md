# Mental Health Diagnostic Tool

A professional, medical-grade mental health diagnostic web application built with React, TypeScript, Zustand, and TailwindCSS. This tool is designed for clinicians and researchers to assess, monitor, and analyze mental health conditions with real-time risk alerts and AI integration capabilities.

---

## 🚀 Features
- **Patient Intake**: Collects demographic and clinical information.
- **Dynamic Assessment Flow**: Presents questions, records answers, and tracks progress.
- **Real-Time Probability Panel**: Displays diagnostic probabilities and supporting evidence.
- **Risk Alerts**: Immediate alerts for high-risk (e.g., suicide risk) scenarios.
- **Comprehensive Results Page**: Summarizes assessment outcomes and clinical observations.
- **Medical-Grade UI**: Custom color palette, responsive, and accessible design.
- **State Management**: Centralized with Zustand for reliability and scalability.
- **TypeScript Safety**: Strongly typed data models for all clinical entities.
- **Easy Dify Integration**: Ready for AI-powered workflows and LLM-based diagnostics.

---

## 🏗️ Project Structure

```
mental-health-diagnostic/
├── public/                # Static assets
├── src/
│   ├── components/        # React UI components
│   ├── stores/            # Zustand state management
│   ├── services/          # API (Dify integration)
│   ├── types/             # TypeScript interfaces/enums
│   ├── index.css          # TailwindCSS + custom styles
│   ├── App.tsx            # Main app logic
│   └── main.tsx           # Entry point
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind theme config
├── postcss.config.js      # PostCSS config
└── ... (other config files)
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (v7+)

### Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd mental-health-diagnostic
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

---

## 🗂️ State Management
- Uses [Zustand](https://zustand-demo.pmnd.rs/) for global state (patient info, questions, answers, risk, results, etc.).
- Store logic is in `src/stores/assessmentStore.ts`.
- Components subscribe to only the state slices they need for efficient re-renders.

---

## 🤖 Dify Integration (AI/LLM)
- API functions for Dify integration should be placed in `src/services/difyApi.ts`.
- Update Zustand store actions to call Dify endpoints for:
  - Real-time diagnostic probabilities
  - Risk assessment
  - AI-generated recommendations
- Handle loading and error states in the store and UI.
- Ensure TypeScript types match Dify API responses.

---

## 🎨 Styling
- [TailwindCSS](https://tailwindcss.com/) with a custom medical-grade palette and typography.
- Additional custom classes in `src/index.css`.

---

## 🧑‍💻 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License
This project is for educational and research purposes. For clinical use, ensure compliance with all relevant regulations and obtain appropriate approvals.

---

## 🙏 Acknowledgements
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TailwindCSS](https://tailwindcss.com/)
- [Dify](https://dify.ai/) (for AI/LLM integration)
