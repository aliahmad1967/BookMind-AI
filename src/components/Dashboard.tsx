import React, { useEffect, useState } from "react";
import { Book, LogEntry } from "../types";
import { 
  FileText, 
  Layers, 
  FolderKanban, 
  MessageSquare, 
  Terminal, 
  UploadCloud, 
  Search, 
  Cpu, 
  Compass, 
  TrendingUp, 
  RefreshCw,
  Trash2
} from "lucide-react";

interface DashboardProps {
  books: Book[];
  logs: LogEntry[];
  onNavigate: (tab: string) => void;
  lang: "ar" | "en";
  onClearLogs: () => void;
  onRefreshData: () => Promise<void>;
}

export default function Dashboard({ 
  books, 
  logs, 
  onNavigate, 
  lang,
  onClearLogs,
  onRefreshData
}: DashboardProps) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    arBooks: 0,
    enBooks: 0,
    totalCollections: 0,
    totalChunks: 0,
    totalQueries: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [books]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    await fetchStats();
    setIsRefreshing(false);
  };

  const isRtl = lang === "ar";

  const t = {
    welcome: isRtl ? "مرحباً بك في منصة BookMind AI" : "Welcome to BookMind AI",
    subtitle: isRtl ? "النظام المؤسسي المتكامل لإدارة المعرفة الدلالية والبحث المستند للذكاء الاصطناعي" : "The enterprise-grade platform for semantic knowledge & AI search",
    quickStats: isRtl ? "إحصائيات المكتبة الفورية" : "Real-time Library Statistics",
    totalBooks: isRtl ? "إجمالي المستندات" : "Total Documents",
    totalChunks: isRtl ? "القطاعات الدلالية" : "Semantic Chunks",
    totalCollections: isRtl ? "المجموعات النشطة" : "Active Collections",
    totalQueries: isRtl ? "الاستعلامات المنفذة" : "Queries Executed",
    recentLogs: isRtl ? "سجل عمليات المحرك المحلي (Ollama/Qwen)" : "Local Engine Operations Log (Ollama/Qwen)",
    engineStatus: isRtl ? "حالة البنية التحتية" : "Infrastructure Health Status",
    quickActions: isRtl ? "إجراءات سريعة" : "Quick Actions",
    uploadBook: isRtl ? "رفع كتاب جديد" : "Upload New Book",
    uploadBookSub: isRtl ? "دعم PDF, EPUB, TXT" : "Supports PDF, EPUB, TXT",
    startChat: isRtl ? "محادثة دلالية RAG" : "Start Semantic Chat (RAG)",
    startChatSub: isRtl ? "اسأل مكتبتك مباشرة" : "Query your library instantly",
    viewIndex: isRtl ? "تصفح الفهرس الدلالي" : "Explore Semantic Index",
    viewIndexSub: isRtl ? "معاينة القطاعات والمتجهات" : "Preview chunks and vectors",
    hardwareUsage: isRtl ? "استهلاك الموارد (GPU / CPU)" : "Hardware Resource Usage (GPU / CPU)",
    languageDistribution: isRtl ? "توزيع لغة الكتب" : "Book Language Distribution",
    arabic: isRtl ? "عربي" : "Arabic",
    english: isRtl ? "إنجليزي" : "English",
    noLogs: isRtl ? "لا توجد سجلات حالياً." : "No operations logged yet.",
    clearLogs: isRtl ? "مسح السجل" : "Clear Logs",
    refresh: isRtl ? "تحديث البيانات" : "Refresh Stats",
    activeStatus: isRtl ? "نشط ومستقر" : "Active & Stable"
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Styled in Deep Brand Green and Gold */}
      <div className="relative overflow-hidden bg-brand-green text-white rounded-2xl p-6 md:p-8 border border-brand-green-dark shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-brand-green-dark/80 border border-brand-gold/30 text-brand-gold text-xs px-3 py-1 rounded-full font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></span>
              {t.activeStatus}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-cairo tracking-tight text-white">{t.welcome}</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-brand-green-dark hover:bg-brand-green-light border border-brand-green-light text-brand-gold hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold font-cairo transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t.refresh}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs hover:border-brand-gold hover:shadow-sm transition-all duration-200 flex items-center gap-4">
          <div className="p-3 bg-brand-cream text-brand-gold rounded-xl">
            <FileText className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold font-cairo">{t.totalBooks}</p>
            <h3 className="text-2xl font-bold text-brand-green">{stats.totalBooks}</h3>
          </div>
        </div>

        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs hover:border-brand-gold hover:shadow-sm transition-all duration-200 flex items-center gap-4">
          <div className="p-3 bg-brand-cream text-brand-green rounded-xl">
            <Layers className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold font-cairo">{t.totalChunks}</p>
            <h3 className="text-2xl font-bold text-brand-green">{stats.totalChunks}</h3>
          </div>
        </div>

        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs hover:border-brand-gold hover:shadow-sm transition-all duration-200 flex items-center gap-4">
          <div className="p-3 bg-brand-cream text-brand-gold rounded-xl">
            <FolderKanban className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold font-cairo">{t.totalCollections}</p>
            <h3 className="text-2xl font-bold text-brand-green">{stats.totalCollections}</h3>
          </div>
        </div>

        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs hover:border-brand-gold hover:shadow-sm transition-all duration-200 flex items-center gap-4">
          <div className="p-3 bg-brand-cream text-brand-green rounded-xl">
            <MessageSquare className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold font-cairo">{t.totalQueries}</p>
            <h3 className="text-2xl font-bold text-brand-green">{stats.totalQueries}</h3>
          </div>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-brand-cream-border rounded-2xl p-6 shadow-xs">
            <h3 className="text-brand-green font-extrabold font-cairo mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-gold" />
              {t.quickActions}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => onNavigate("library")}
                className="group flex flex-col items-start p-4 bg-white hover:bg-brand-cream-light border border-brand-cream-border hover:border-brand-gold rounded-xl text-right transition-all duration-200 w-full"
              >
                <div className="p-2.5 bg-brand-cream text-brand-green rounded-lg mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5 text-brand-green" />
                </div>
                <h4 className="text-brand-green font-extrabold font-cairo text-sm mb-1">{t.uploadBook}</h4>
                <p className="text-slate-400 text-xs font-cairo">{t.uploadBookSub}</p>
              </button>

              <button 
                onClick={() => onNavigate("chat")}
                className="group flex flex-col items-start p-4 bg-white hover:bg-brand-cream-light border border-brand-cream-border hover:border-brand-gold rounded-xl text-right transition-all duration-200 w-full"
              >
                <div className="p-2.5 bg-brand-cream text-brand-gold rounded-lg mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-brand-gold" />
                </div>
                <h4 className="text-brand-green font-extrabold font-cairo text-sm mb-1">{t.startChat}</h4>
                <p className="text-slate-400 text-xs font-cairo">{t.startChatSub}</p>
              </button>

              <button 
                onClick={() => onNavigate("chunker")}
                className="group flex flex-col items-start p-4 bg-white hover:bg-brand-cream-light border border-brand-cream-border hover:border-brand-gold rounded-xl text-right transition-all duration-200 w-full"
              >
                <div className="p-2.5 bg-brand-cream text-brand-green rounded-lg mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-brand-green" />
                </div>
                <h4 className="text-brand-green font-extrabold font-cairo text-sm mb-1">{t.viewIndex}</h4>
                <p className="text-slate-400 text-xs font-cairo">{t.viewIndexSub}</p>
              </button>
            </div>
          </div>

          {/* Graphical Analytics (Language & Resources) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <div className="bg-white border border-brand-cream-border rounded-2xl p-6 shadow-xs flex flex-col">
              <h3 className="text-brand-green font-extrabold font-cairo mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
                {t.languageDistribution}
              </h3>
              
              <div className="flex-1 flex flex-col justify-center space-y-4 py-3">
                <div className="flex justify-between text-xs font-bold text-slate-500 font-cairo">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-gold"></span>{t.arabic}</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-green-light"></span>{t.english}</span>
                </div>
                
                {/* Horizontal custom bar distribution */}
                <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${(stats.arBooks / (stats.totalBooks || 1)) * 100}%` }}
                    className="bg-brand-gold h-full transition-all duration-500"
                    title={`عربي: ${stats.arBooks}`}
                  ></div>
                  <div 
                    style={{ width: `${(stats.enBooks / (stats.totalBooks || 1)) * 100}%` }}
                    className="bg-brand-green-light h-full transition-all duration-500"
                    title={`إنجليزي: ${stats.enBooks}`}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-brand-cream p-2.5 rounded-xl border border-brand-cream-border/50">
                    <p className="text-xs text-slate-500 font-bold font-cairo">{t.arabic}</p>
                    <p className="text-lg font-bold text-brand-green">{stats.arBooks} {isRtl ? "كتب" : "books"}</p>
                  </div>
                  <div className="bg-brand-cream p-2.5 rounded-xl border border-brand-cream-border/50">
                    <p className="text-xs text-slate-500 font-bold font-cairo">{t.english}</p>
                    <p className="text-lg font-bold text-brand-green">{stats.enBooks} {isRtl ? "كتب" : "books"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Hardware Status Dials */}
            <div className="bg-white border border-brand-cream-border rounded-2xl p-6 shadow-xs">
              <h3 className="text-brand-green font-extrabold font-cairo mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-green" />
                {t.hardwareUsage}
              </h3>

              <div className="space-y-4">
                {/* CPU Threading */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-cairo">
                    <span className="text-slate-600">Ollama CPU Threads (8x)</span>
                    <span className="text-brand-green font-bold">34%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-green h-full w-[34%] rounded-full"></div>
                  </div>
                </div>

                {/* VRAM usage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-cairo">
                    <span className="text-slate-600">GPU VRAM (RTX 4090)</span>
                    <span className="text-brand-gold font-bold">14.3 GB / 24 GB</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-gold h-full w-[59%] rounded-full"></div>
                  </div>
                </div>

                {/* DB index cache */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-cairo">
                    <span className="text-slate-600">ChromaDB Cache Hit Rate</span>
                    <span className="text-brand-gold-hover font-bold">94.2%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-brand-gold-hover h-full w-[94%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Terminal Column */}
        <div className="bg-brand-green-dark text-slate-300 border border-brand-green-light rounded-2xl p-5 shadow-xl flex flex-col h-[400px] lg:h-auto">
          <div className="flex items-center justify-between border-b border-brand-green-light pb-3 mb-3">
            <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2 font-cairo">
              <Terminal className="w-4 h-4 text-brand-gold" />
              {t.recentLogs}
            </h3>
            <button 
              onClick={onClearLogs}
              title={t.clearLogs}
              className="p-1.5 hover:bg-brand-green-light rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px] pr-1">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center py-10 font-cairo">{t.noLogs}</p>
            ) : (
              logs.map((log) => {
                const badgeColor = 
                  log.level === "success" ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/50" :
                  log.level === "warning" ? "text-brand-gold bg-brand-gold-light/10 border-brand-gold/30" :
                  log.level === "error" ? "text-red-400 bg-red-950/40 border-red-900/50" :
                  "text-sky-400 bg-sky-950/40 border-sky-900/50";

                return (
                  <div key={log.id} className="p-2 border border-brand-green border-brand-green-light/20 bg-brand-green/30 rounded-lg hover:bg-brand-green/50 transition-colors">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span className={`px-1.5 py-0.5 rounded border ${badgeColor} uppercase text-[9px]`}>
                        {log.module}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">{log.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
