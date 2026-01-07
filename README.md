# MediaCorp AI Platform - Frontend Documentation

## 1. Project Overview

**MediaCorp AI Platform** is a robust React-based web application designed to orchestrate and visualize complex AI processing workflows. It serves as a centralized dashboard interacting with a Python/FastAPI backend to perform advanced media analysis using Azure Cognitive Services and GPT models.

**Key Capabilities:**

*   **Video Analysis:** OCR (Optical Character Recognition), Transcription, Translation, Scene Detection, Key Frame Extraction.

*   **Audio Analysis:** Multi-language Transcription, Syntax Analysis, Emotion Tagging, Speaker Diarization.

*   **Image Analysis:** Object Detection (GPT-4 Vision), OCR on Image.

*   **Text Analysis:** Named Entity Recognition (NER), Brand Recognition, Language Detection, Parts of Speech Tagging.

---

## 2. Technical Stack

*   **Framework:** React (v18) with Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **HTTP Client:** Axios
*   **Icons:** Lucide React
*   **Build Tool:** Vite

---

## 3. Prerequisites

Before running the application, ensure the following are installed on your machine:

*   **Node.js:** Version 18.0.0 or higher.
*   **npm:** (Usually bundled with Node.js) or Yarn.
*   **Network Access:** Connectivity to the backend API server is required.

---

## 4. Installation & Setup

### Step 1: Clone the Repository

Download or clone the project files to your local machine.

### Step 2: Install Dependencies

Open your terminal in the project root directory and install the required packages:

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory to define the backend target. This ensures sensitive IP addresses are not hardcoded in the version control system.

**File:** `.env`

```env
# Replace the placeholder below with the actual Backend Server URL provided by the DevOps team
VITE_API_BASE=https://<YOUR_BACKEND_IP>:<PORT>
```

> **Note:** If no `.env` file is created, the application defaults to the fallback configuration defined in `vite.config.ts`.

---

## 5. Running the Application

### Development Mode

To start the application locally with hot-reloading:

```bash
npm run dev
```

*   **Local URL:** http://localhost:5173 (or 5174 if the port is busy).
*   **Network Access:** The terminal will display a local LAN IP if you wish to test on mobile devices connected to the same network.

### Building for Production

To create an optimized build for deployment (e.g., for Nginx or AWS S3):

```bash
npm run build
```

The output will be generated in the `dist/` folder.

---

## 6. Architecture & Proxy Configuration

To securely connect to the backend and avoid CORS (Cross-Origin Resource Sharing) issues, this application uses a **Proxy Server** configuration within Vite.

**File:** `vite.config.ts`

The frontend intercepts all HTTP requests starting with `/api` and forwards them to the backend server defined in your environment variables.

*   **Frontend Request:** `http://localhost:5174/api/video/OCR...`

*   **Proxied To:** `https://<BACKEND_IP>:<PORT>/video/OCR...`

**Key Configuration Settings:**

*   `changeOrigin: true`: Required for virtual hosted sites.
*   `secure: false`: **Crucial.** This allows the frontend to connect to the backend even if the backend uses a self-signed HTTPS certificate (common in development/staging environments).
*   `rewrite`: Automatically strips the `/api` prefix before sending the request to the backend.

---

## 7. Folder Structure

```
asr-frontend/
├── .vscode/                   # VS Code workspace settings
│   └── settings.json
├── node_modules/              # Project dependencies
├── public/                    # Static public assets
├── src/                       # Source code
│   ├── assets/                # Images and icons
│   ├── components/            # React Components
│   │   ├── details/           # Components for Job Details & SRT Results
│   │   │   ├── JobDetails.tsx
│   │   │   └── SRTPreview.tsx
│   │   ├── jobs/              # Components for the Processing Queue
│   │   │   ├── JobRow.tsx
│   │   │   ├── ProcessingJobs.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── ui/                # Reusable UI Elements (Button, Card, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── upload/            # File Upload & Staging Logic
│   │   │   ├── DragDropUpload.tsx
│   │   │   └── StagedFilesList.tsx
│   │   └── ErrorBoundary.tsx  # Global Error Handling Wrapper
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useJobs.ts         # Logic for polling job status
│   │   └── useUpload.ts       # Core logic for file uploading & API calls
│   ├── layout/                # Application Shell
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── pages/                 # Main Route Pages
│   │   ├── ApiKeys.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FileHistory.tsx
│   │   ├── Settings.tsx
│   │   └── UsageAnalytics.tsx
│   ├── services/              # API Services (Axios)
│   │   ├── api.ts             # Axios instance & interceptors
│   │   └── asr.ts             # API endpoint function definitions
│   ├── store/                 # State Management (Zustand)
│   │   ├── themeStore.ts
│   │   ├── uiStore.ts
│   │   └── userStore.ts
│   ├── types/                 # TypeScript Type Definitions
│   │   └── asr.ts
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main App Router
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Vite types
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # Linting configuration
├── index.html                 # HTML entry point
├── package.json               # Project dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── README.md                  # Project documentation
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration & Proxy setup
```

---

## 8. Troubleshooting Common Issues

### Issue: "Network Error" or "404 Not Found" on Upload

**Cause:** The backend might be sending a 307 Temporary Redirect to a URL that lacks the `/api` prefix, or the browser is blocking a direct connection to the IP due to CORS.

**Solution:**

*   Ensure `secure: false` is set in `vite.config.ts`.
*   Check `StagedFilesList.tsx`: If the backend redirects `/video/...` to `/image/...`, update the frontend endpoint to point directly to the final destination (`/image/...`) to bypass the redirect.
*   **Clear Cache:** Stop the server and run `rm -rf node_modules/.vite`, then restart.

### Issue: Code changes are not reflecting in the Browser

**Cause:** Vite aggressively caches build files, or React State is holding onto old selected values in memory.

**Solution:** Use **Hard Refresh** in the browser:

*   **Mac:** Cmd + Shift + R
*   **Windows:** Ctrl + Shift + R

### Issue: "Impure function" Warning in Console

**Cause:** Using dynamic functions like `Date.now()` directly inside JSX rendering (e.g., for download filenames).

**Solution:** This has been resolved in the codebase by using `useMemo` to generate stable values during render cycles.

---

## Development

### Available Scripts

*   `npm run dev` - Start development server
*   `npm run build` - Create production build
*   `npm run preview` - Preview production build locally
*   `npm run lint` - Run ESLint

---
