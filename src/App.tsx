import React, { useEffect, useState } from "react";
import { Book, Collection, LogEntry } from "./types";
import Dashboard from "./components/Dashboard";
import Library from "./components/Library";
import BookUpload from "./components/BookUpload";
import SemanticViewer from "./components/SemanticViewer";
import AIChat from "./components/AIChat";
import ModelManagement from "./components/ModelManagement";
import SettingsPanel from "./components/SettingsPanel";
import { 
  Compass, 
  BookOpen, 
  UploadCloud, 
  Search, 
  MessageSquare, 
  Cpu, 
  Settings, 
  Globe, 
  Sparkles,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Navigation & Localization
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [lang, setLang] = useState<"ar" | "en">("ar"); // Arabic default
  const [selectedChatBookId, setSelectedChatBookId] = useState<string>("all");
  
  // Responsive mobile menu state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync state helpers
  const fetchAllData = async () => {
    try {
      const [resBooks, resCols, resLogs] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/collections"),
        fetch("/api/logs")
      ]);

      if (resBooks.ok) setBooks(await resBooks.json());
      if (resCols.ok) setCollections(await resCols.json());
      if (resLogs.ok) setLogs(await resLogs.json());
    } catch (err) {
      console.error("Failed to fetch state from backend:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCollection = async (name: string, description: string, color: string) => {
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSuccess = (newBook: Book) => {
    fetchAllData();
    setActiveTab("library");
  };

  const handleNavigateToChat = (bookId: string) => {
    setSelectedChatBookId(bookId);
    setActiveTab("chat");
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const isRtl = lang === "ar";

  // Navigation Items
  const menuItems = [
    { id: "dashboard", labelAr: "لوحة التحكم", labelEn: "Dashboard", icon: Compass },
    { id: "library", labelAr: "المكتبة والملفات", labelEn: "Library", icon: BookOpen },
    { id: "upload", labelAr: "رفع واستخلاص", labelEn: "Upload Document", icon: UploadCloud },
    { id: "chunker", labelAr: "الفهرس والتقطيع", labelEn: "Semantic Index", icon: Search },
    { id: "chat", labelAr: "الدردشة الذكية RAG", labelEn: "AI Chat", icon: MessageSquare },
    { id: "models", labelAr: "إدارة النماذج", labelEn: "Model Manager", icon: Cpu },
    { id: "settings", labelAr: "الإعدادات الفنية", labelEn: "System Settings", icon: Settings }
  ];

  const currentItemLabel = menuItems.find(item => item.id === activeTab);
  const pageTitle = isRtl ? currentItemLabel?.labelAr : currentItemLabel?.labelEn;

  return (
    <div 
      dir={isRtl ? "rtl" : "ltr"} 
      className={`min-h-screen bg-brand-cream flex font-sans text-slate-800 transition-all duration-300 ${isRtl ? 'font-cairo' : ''}`}
    >
      {/* Sidebar fixed for desktop, toggleable slide-in for mobile */}
      <aside 
        className={`fixed inset-y-0 z-40 w-64 bg-brand-green border-brand-green-dark text-white p-5 flex flex-col justify-between transform transition-transform duration-300 xl:translate-x-0 ${isRtl ? 'right-0 xl:left-auto border-l' : 'left-0 xl:right-auto border-r'} ${
          isSidebarOpen 
            ? 'translate-x-0' 
            : isRtl 
              ? 'translate-x-full xl:translate-x-0' 
              : '-translate-x-full xl:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand area */}
          <div className={`flex items-center justify-between pb-4 border-b border-brand-green-light ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-gold rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight font-cairo text-white">BookMind AI</h1>
                <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                  {isRtl ? "إدارة المعرفة الدلالية" : "Enterprise RAG Portal"}
                </span>
              </div>
            </div>
            
            {/* Close Mobile Sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="xl:hidden p-1 bg-brand-green-light hover:bg-brand-green-dark rounded-lg text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                    if (item.id !== "chat") {
                      setSelectedChatBookId("all");
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold font-cairo transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-gold text-white shadow-md shadow-brand-gold/20' 
                      : 'text-slate-300 hover:text-white hover:bg-brand-green-light'
                  }`}
                >
                  <IconComp className="w-4.5 h-4.5 shrink-0 text-white" />
                  <span>{isRtl ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Foot of sidebar with Lang quick switch */}
        <div className="border-t border-brand-green-light pt-4 mt-6">
          <div className="bg-brand-green-dark p-2.5 rounded-xl border border-brand-green-light flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5 font-cairo">
              <Globe className="w-4 h-4 text-brand-gold" />
              {isRtl ? "العربية" : "English"}
            </span>
            <button 
              onClick={() => setLang(l => l === "ar" ? "en" : "ar")}
              className="text-[10px] text-brand-gold hover:text-white font-bold bg-brand-green border border-brand-green-light px-2.5 py-1 rounded-lg hover:bg-brand-gold hover:border-brand-gold transition-colors uppercase"
            >
              {isRtl ? "English" : "عربي"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isRtl ? 'xl:pr-64' : 'xl:pl-64'}`}>
        
        {/* Header Ribbon bar - Styled in Deep Brand Green with Gold elements */}
        <header className="bg-brand-green border-b border-brand-green-dark px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Mobile burger button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="xl:hidden p-2 bg-brand-green-light hover:bg-brand-green rounded-xl text-white border border-brand-green-dark"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-extrabold text-white font-cairo leading-none tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold"></span>
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Direct Tab shortcuts */}
            <div className="hidden sm:flex bg-brand-green-dark border border-brand-green-light p-1 rounded-xl gap-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg font-cairo transition-all ${activeTab === "dashboard" ? "bg-brand-gold text-white shadow-xs" : "text-slate-300 hover:text-white"}`}
              >
                {isRtl ? "الرئيسية" : "Home"}
              </button>
              <button 
                onClick={() => setActiveTab("library")}
                className={`px-3 py-1.5 rounded-lg font-cairo transition-all ${activeTab === "library" ? "bg-brand-gold text-white shadow-xs" : "text-slate-300 hover:text-white"}`}
              >
                {isRtl ? "المستندات" : "Library"}
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Canvas workspace */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <Dashboard 
              books={books} 
              logs={logs} 
              onNavigate={(tab) => {
                setActiveTab(tab);
                setSelectedChatBookId("all");
              }}
              lang={lang}
              onClearLogs={handleClearLogs}
              onRefreshData={fetchAllData}
            />
          )}

          {activeTab === "library" && (
            <Library 
              books={books} 
              collections={collections} 
              onDeleteBook={handleDeleteBook}
              onCreateCollection={handleCreateCollection}
              onNavigateToChat={handleNavigateToChat}
              lang={lang}
            />
          )}

          {activeTab === "upload" && (
            <BookUpload 
              collections={collections} 
              onUploadSuccess={handleUploadSuccess} 
              lang={lang}
            />
          )}

          {activeTab === "chunker" && (
            <SemanticViewer 
              books={books} 
              lang={lang}
            />
          )}

          {activeTab === "chat" && (
            <AIChat 
              books={books} 
              lang={lang}
              initialBookId={selectedChatBookId}
            />
          )}

          {activeTab === "models" && (
            <ModelManagement 
              lang={lang}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPanel 
              lang={lang}
              onChangeLang={(l) => setLang(l)}
            />
          )}
        </main>
      </div>

      {/* Overlay Backdrop when Mobile sidebar is visible */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs xl:hidden"
        ></div>
      )}
    </div>
  );
}
