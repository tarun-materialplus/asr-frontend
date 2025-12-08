import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import FileHistory from "./pages/FileHistory";
import UsageAnalytics from "./pages/UsageAnalytics";
import ApiKeys from "./pages/ApiKeys";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<FileHistory />} />
          <Route path="usage" element={<UsageAnalytics />} />
          <Route path="keys" element={<ApiKeys />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;