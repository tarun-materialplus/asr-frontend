import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Copy, Trash2, Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function ApiKeys() {
  const [keys] = useState([
    { id: "1", name: "Production Key", prefix: "sk_live_", created: "2023-10-01", lastUsed: "2 mins ago" },
    { id: "2", name: "Test Server", prefix: "sk_test_", created: "2023-11-15", lastUsed: "Never" },
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">API Keys</h2>
          <p className="text-sm text-slate-500">Manage API tokens for external integrations.</p>
        </div>
        <Button onClick={() => alert("Backend integration needed to create keys.")}>
          <Plus className="w-4 h-4" /> Generate New Key
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-medium pl-2">Name</th>
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium">Last Used</th>
                <th className="pb-3 font-medium text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {keys.map((k) => (
                <tr key={k.id} className="group">
                  <td className="py-4 font-medium text-slate-900 dark:text-white pl-2">{k.name}</td>
                  <td className="py-4 font-mono text-slate-500">
                    {k.prefix}................4x9s
                  </td>
                  <td className="py-4 text-slate-500">{k.created}</td>
                  <td className="py-4 text-slate-500">{k.lastUsed}</td>
                  <td className="py-4 text-right pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500" title="Copy Key">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500" title="Revoke">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 flex gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-800 dark:text-amber-500 text-sm">Security Notice</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Your API keys grant full access to your account. Never share them in client-side code (browsers) or public repositories.
          </p>
        </div>
      </div>
    </div>
  );
}