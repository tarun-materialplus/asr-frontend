import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner';

import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import FileHistory from "./pages/FileHistory";
import UsageAnalytics from "./pages/UsageAnalytics";
import ApiKeys from "./pages/ApiKeys";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="history" element={<FileHistory />} />
            <Route path="usage" element={<UsageAnalytics />} />
            <Route path="keys" element={<ApiKeys />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}