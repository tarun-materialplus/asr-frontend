import Card from "../components/ui/Card";
import { Clock, HardDrive, DollarSign, TrendingUp, type LucideIcon } from "lucide-react";

export default function UsageAnalytics() {
  const weeklyUsage = [45, 120, 80, 160, 90, 30, 10];
  const maxVal = Math.max(...weeklyUsage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Usage Analytics</h2>
        <p className="text-sm text-slate-500">Track your transcription minutes and storage costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Minutes" value="1,240" sub="+12% from last month" icon={Clock} color="blue" />
        <StatsCard title="Storage Used" value="4.2 GB" sub="85% of 5GB quota" icon={HardDrive} color="purple" />
        <StatsCard title="Est. Cost" value="$14.20" sub="Next invoice: Dec 01" icon={DollarSign} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">Daily Transcription Volume</h3>
            <select className="text-sm border-none bg-transparent text-slate-500 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 px-2">
            {weeklyUsage.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                <div
                  className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative transition-all duration-500 hover:bg-blue-500 group-hover:dark:bg-blue-500"
                  style={{ height: `${(val / maxVal) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}m
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Current Plan</h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">Pro Plan</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">ACTIVE</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">$29<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-green-500" /> 5,000 minutes / month
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-green-500" /> Priority Processing
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-green-500" /> Speaker Diarization
            </li>
          </ul>
          <button className="w-full py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Manage Subscription
          </button>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green";
}

function StatsCard({ title, value, sub, icon: Icon, color }: StatsCardProps) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
    green: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20",
  };

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </Card>
  );
}