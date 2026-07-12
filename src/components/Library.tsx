import React, { useState } from "react";
import { Book, Collection } from "../types";
import { 
  Folder, 
  BookOpen, 
  User, 
  Trash2, 
  Plus, 
  Layers, 
  X, 
  ArrowLeftRight, 
  MessageSquare, 
  Calendar,
  Grid,
  Sparkles,
  Search,
  Filter
} from "lucide-react";

interface LibraryProps {
  books: Book[];
  collections: Collection[];
  onDeleteBook: (id: string) => Promise<void>;
  onCreateCollection: (name: string, description: string, color: string) => Promise<void>;
  onNavigateToChat: (bookId: string) => void;
  lang: "ar" | "en";
}

export default function Library({ 
  books, 
  collections, 
  onDeleteBook, 
  onCreateCollection,
  onNavigateToChat,
  lang 
}: LibraryProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [selectedLangFilter, setSelectedLangFilter] = useState<"all" | "ar" | "en">("all");
  
  // Create collection modal state
  const [showModal, setShowModal] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [newColColor, setNewColColor] = useState("from-blue-500 to-indigo-600");

  const isRtl = lang === "ar";

  const t = {
    collectionsTitle: isRtl ? "المجموعات المعرفية" : "Knowledge Collections",
    addCol: isRtl ? "إنشاء مجموعة" : "Create Collection",
    booksTitle: isRtl ? "المكتبة والملفات المعالجة دلالياً" : "Library & Indexed Materials",
    searchPlaceholder: isRtl ? "ابحث في عناوين الكتب، المؤلفين أو التصنيفات..." : "Search book titles, authors, or categories...",
    all: isRtl ? "الكل" : "All",
    filterLang: isRtl ? "تصفية حسب اللغة:" : "Filter by Language:",
    allLangs: isRtl ? "جميع اللغات" : "All Languages",
    arOnly: isRtl ? "العربية فقط" : "Arabic Only",
    enOnly: isRtl ? "الإنجليزية فقط" : "English Only",
    pages: isRtl ? "صفحة" : "pages",
    words: isRtl ? "كلمة" : "words",
    noBooks: isRtl ? "لم يتم العثور على كتب تطابق البحث." : "No documents matched your query.",
    btnDetails: isRtl ? "خصائص وتفاصيل" : "Metadata & Details",
    btnChat: isRtl ? "اسأل هذا المستند" : "Query This Document",
    btnDelete: isRtl ? "حذف" : "Delete",
    themes: isRtl ? "الموضوعات والمفاتيح الرئيسية" : "Key Themes & Concepts",
    summary: isRtl ? "الملخص التحليلي المستخلص بالذكاء الاصطناعي" : "AI-Extracted Executive Summary",
    author: isRtl ? "المؤلف:" : "Author:",
    year: isRtl ? "تاريخ النشر:" : "Published:",
    category: isRtl ? "التصنيف:" : "Category:",
    size: isRtl ? "الحجم المالي:" : "File Size:",
    status: isRtl ? "حالة الفهرسة:" : "Index Status:",
    analyzed: isRtl ? "محلل دلالياً بالكامل" : "Fully Analyzed",
    processing: isRtl ? "جارٍ التقطيع واستخلاص السمات" : "Extracting semantic attributes",
    uploaded: isRtl ? "تم الرفع في الانتظار" : "Pending processing",
    modalTitle: isRtl ? "إنشاء مجموعة معرفية جديدة" : "Create New Knowledge Collection",
    modalName: isRtl ? "اسم المجموعة" : "Collection Name",
    modalDesc: isRtl ? "وصف دلالي مختصر" : "Short Description",
    modalColor: isRtl ? "سمة اللون" : "Gradient Theme",
    btnSave: isRtl ? "حفظ المجموعة" : "Save Collection",
    btnCancel: isRtl ? "إلغاء" : "Cancel",
    bookCount: isRtl ? "مستندات" : "documents"
  };

  const handleCreateCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName) return;
    await onCreateCollection(newColName, newColDesc, newColColor);
    setNewColName("");
    setNewColDesc("");
    setShowModal(false);
  };

  // Filtering Logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCollection = 
      selectedCollectionId === "all" || 
      book.collectionId === selectedCollectionId;
    
    const matchesLang = 
      selectedLangFilter === "all" || 
      book.language === selectedLangFilter;

    return matchesSearch && matchesCollection && matchesLang;
  });

  return (
    <div className="space-y-8">
      {/* 1. Collections Dashboard Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-brand-green font-cairo flex items-center gap-2">
            <Folder className="w-5 h-5 text-brand-gold" />
            {t.collectionsTitle}
          </h2>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold font-cairo px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.addCol}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Default 'All' Card */}
          <div 
            onClick={() => setSelectedCollectionId("all")}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${selectedCollectionId === "all" ? "bg-brand-green text-white border-brand-green-dark shadow-md scale-[1.02]" : "bg-white text-slate-800 border-brand-cream-border hover:border-brand-gold hover:shadow-xs"}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl ${selectedCollectionId === "all" ? "bg-brand-green-light text-brand-gold" : "bg-brand-cream text-brand-green"}`}>
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-green-dark/20 text-brand-gold rounded-full">
                {books.length} {t.bookCount}
              </span>
            </div>
            <h3 className="font-extrabold text-sm font-cairo">{isRtl ? "جميع مستندات المكتبة" : "All Library Materials"}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              {isRtl ? "عرض فهرس البحث الدلالي لكامل أرفف وكتب المكتبة." : "Browse the entire indexed corpus in BookMind AI."}
            </p>
          </div>

          {/* User Collections */}
          {collections.map(col => {
            const isSelected = selectedCollectionId === col.id;
            return (
              <div 
                key={col.id}
                onClick={() => setSelectedCollectionId(col.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${isSelected ? "bg-brand-green text-white border-brand-green-dark shadow-md scale-[1.02]" : "bg-white text-slate-800 border-brand-cream-border hover:border-brand-gold hover:shadow-xs"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${col.color} text-white`}>
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100/10 text-slate-400 rounded-full">
                    {col.bookCount} {t.bookCount}
                  </span>
                </div>
                <h3 className="font-bold text-sm font-cairo">{col.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{col.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Books Ingestion grid */}
      <div className="space-y-5 border-t border-brand-cream-border pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-brand-green font-cairo flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-gold" />
            {t.booksTitle}
          </h2>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language filter toggles */}
            <div className="flex items-center gap-1.5 bg-white border border-brand-cream-border p-1 rounded-xl text-xs font-semibold">
              <button 
                onClick={() => setSelectedLangFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all font-cairo ${selectedLangFilter === "all" ? "bg-brand-gold text-white shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t.allLangs}
              </button>
              <button 
                onClick={() => setSelectedLangFilter("ar")}
                className={`px-3 py-1.5 rounded-lg transition-all font-cairo ${selectedLangFilter === "ar" ? "bg-brand-gold text-white shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t.arOnly}
              </button>
              <button 
                onClick={() => setSelectedLangFilter("en")}
                className={`px-3 py-1.5 rounded-lg transition-all font-cairo ${selectedLangFilter === "en" ? "bg-brand-gold text-white shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t.enOnly}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-cream-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl pr-10 pl-4 py-3 text-sm text-slate-800 outline-none transition-all-300"
          />
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/50 border border-slate-100 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium font-cairo text-sm">{t.noBooks}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                className="bg-white border border-brand-cream-border hover:border-brand-gold rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Visual Book Cover Representation */}
                <div className={`w-full aspect-16/10 ${book.coverColor} rounded-xl p-4 text-white relative mb-4 flex flex-col justify-between overflow-hidden shadow-xs group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-white/10 backdrop-blur-md rounded border border-white/15">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-black/20 backdrop-blur-md rounded border border-black/10 text-amber-300">
                      {book.language.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm font-cairo leading-snug line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium border-b border-brand-cream-border pb-2">
                    <span>{book.pageCount} {t.pages}</span>
                    <span>{book.size}</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button 
                      onClick={() => setSelectedBook(book)}
                      className="py-2 bg-brand-cream hover:bg-brand-gold-light/40 text-brand-green font-bold font-cairo text-xs rounded-lg transition-colors border border-brand-cream-border"
                    >
                      {t.btnDetails}
                    </button>
                    <button 
                      onClick={() => onNavigateToChat(book.id)}
                      className="py-2 bg-brand-gold hover:bg-brand-gold-hover text-white font-bold font-cairo text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      {t.btnChat}
                    </button>
                  </div>

                  <button 
                    onClick={() => onDeleteBook(book.id)}
                    className="w-full py-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md text-xs font-semibold font-cairo transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.btnDelete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Book Details Drawer / Side Panel */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 right-5 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 flex-1">
              {/* Cover & Title */}
              <div className="flex gap-4 items-start border-b border-slate-100 pb-5">
                <div className={`w-24 h-32 rounded-xl shrink-0 ${selectedBook.coverColor} p-3 text-white flex flex-col justify-between overflow-hidden shadow-sm`}>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded border border-white/15 w-fit">
                    {selectedBook.language.toUpperCase()}
                  </span>
                  <p className="font-bold text-[10px] font-cairo line-clamp-3 leading-snug">{selectedBook.title}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-brand-green font-cairo leading-snug">{selectedBook.title}</h3>
                  <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {selectedBook.author}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-cream border border-brand-cream-border text-brand-green text-xs rounded-full font-bold font-cairo">
                    <Sparkles className="w-3 h-3 text-brand-gold" />
                    {selectedBook.category}
                  </div>
                </div>
              </div>

              {/* Specifications Block */}
              <div className="grid grid-cols-2 gap-4 bg-brand-cream border border-brand-cream-border p-4 rounded-xl text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">{t.year}</span>
                    <span className="text-slate-700 font-bold">{selectedBook.publicationYear || "مستند مستخلص تلقائياً"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">{t.size}</span>
                    <span className="text-slate-700 font-bold">{selectedBook.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">{t.status}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {selectedBook.status === "analyzed" ? t.analyzed : selectedBook.status === "processing" ? t.processing : t.uploaded}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">{isRtl ? "عدد الكلمات:" : "Word Count:"}</span>
                    <span className="text-slate-700 font-bold">{selectedBook.wordCount} {t.words}</span>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-brand-green text-xs font-cairo uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  {t.summary}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-brand-cream border border-brand-cream-border p-4 rounded-xl font-medium">
                  {selectedBook.summary || "تم معالجة المستند ويجري صياغة الفهرس..."}
                </p>
              </div>

              {/* Key Themes tags */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-brand-gold text-xs font-cairo uppercase tracking-wider">
                  {t.themes}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.keyThemes.map((theme, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 bg-brand-cream border border-brand-cream-border text-brand-green text-xs rounded-xl font-bold font-cairo"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-brand-cream-border pt-5 mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedBook(null)}
                className="py-3 bg-brand-cream hover:bg-brand-cream-light text-slate-700 font-bold font-cairo text-sm rounded-xl transition-colors border border-brand-cream-border"
              >
                {t.btnCancel}
              </button>
              <button 
                onClick={() => {
                  onNavigateToChat(selectedBook.id);
                  setSelectedBook(null);
                }}
                className="py-3 bg-brand-gold hover:bg-brand-gold-hover text-white font-bold font-cairo text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {t.btnChat}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-brand-green font-cairo mb-4 flex items-center gap-1.5">
              <Folder className="w-5 h-5 text-brand-gold" />
              {t.modalTitle}
            </h3>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 font-cairo block">{t.modalName}</label>
                <input 
                  type="text" 
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  required
                  placeholder="مثال: الفلسفة الإسلامية، تكنولوجيا الذكاء..."
                  className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all text-right font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 font-cairo block">{t.modalDesc}</label>
                <textarea 
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  rows={3}
                  placeholder="مجموعة تركز على توثيق الأبحاث..."
                  className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all resize-none text-right font-medium"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 font-cairo block">{t.modalColor}</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: "from-blue-500 to-indigo-600", label: "أزرق" },
                    { color: "from-emerald-500 to-teal-600", label: "أخضر" },
                    { color: "from-amber-500 to-orange-600", label: "ذهبي" },
                    { color: "from-rose-500 to-red-600", label: "أحمر" }
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewColColor(preset.color)}
                      className={`h-9 rounded-lg bg-gradient-to-br ${preset.color} relative border-2 ${newColColor === preset.color ? 'border-indigo-600 scale-105' : 'border-transparent'} transition-transform`}
                      title={preset.label}
                    >
                      {newColColor === preset.color && <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white"></span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-cream-border">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="py-2.5 bg-brand-cream hover:bg-brand-cream-light text-slate-700 font-bold font-cairo text-xs rounded-xl transition-colors border border-brand-cream-border"
                >
                  {t.btnCancel}
                </button>
                <button 
                  type="submit"
                  className="py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-white font-bold font-cairo text-xs rounded-xl transition-colors shadow-xs"
                >
                  {t.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
