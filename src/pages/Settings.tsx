import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useUserStore } from "../store/userStore";
import { toast } from "sonner";

export default function Settings() {
  const { name, email, updateProfile } = useUserStore();
  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);

  const handleSave = () => {
    if (!localName.trim() || !localEmail.trim()) {
      toast.error("Name and Email cannot be empty");
      return;
    }
    updateProfile(localName, localEmail);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500">Manage your profile and application preferences.</p>
      </div>

      <Card>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</div>
              <div className="text-xs text-slate-500">Receive emails when jobs complete.</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          </div>
          <hr className="border-slate-100 dark:border-slate-800" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Auto-Delete Files</div>
              <div className="text-xs text-slate-500">Remove media files 24h after transcription.</div>
            </div>
            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}