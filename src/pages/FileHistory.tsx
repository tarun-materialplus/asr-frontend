import { useState } from "react";
import Card from "../components/ui/Card";
import JobRow from "../components/jobs/JobRow";
import { useUIStore } from "../store/uiStore";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";

export default function FileHistory() {
  const jobs = useUIStore((s) => s.jobs);
  const [filter, setFilter] = useState("");

  const filtered = jobs.filter(j => 
    j.filename?.toLowerCase().includes(filter.toLowerCase()) ||
    j.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">File History</h2>
          <p className="text-sm text-slate-500">View and manage all past transcriptions.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by filename..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <Card noPadding className="flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Search className="w-12 h-12 mb-2 opacity-20" />
              <p>No files found</p>
            </div>
          ) : (
            filtered.map((job) => (
              <JobRow key={job.session_id} job={job} onSelect={() => {}} />
            ))
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">Showing 1-{filtered.length} of {filtered.length}</span>
          <div className="flex gap-1">
            <button disabled className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}