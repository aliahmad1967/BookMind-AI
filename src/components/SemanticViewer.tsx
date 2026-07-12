import React, { useState, useEffect } from "react";
import { Book, Chunk } from "../types";
import { 
  Layers, 
  Search, 
  Binary, 
  Compass, 
  CheckCircle, 
  HelpCircle, 
  Sliders, 
  Cpu, 
  LineChart,
  Eye,
  ScanText
} from "lucide-react";

interface SemanticViewerProps {
  books: Book[];
  lang: "ar" | "en";
}

export default function SemanticViewer({ books, lang }: SemanticViewerProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Chunk[]>([]);
  const [bookChunks, setBookChunks] = useState<Chunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingChunks, setIsLoadingChunks] = useState(false);
  
  // Custom slider visualization state
  const [similarityThreshold, setSimilarityThreshold] = useState(0.72);

  const isRtl = lang === "ar";

  const t = {
    title: isRtl ? "معاين الاسترجاع والفهرس الدلالي" : "Semantic Chunking & Retrieval Indexer",
    subtitle: isRtl ? "تتبع فواصل الجمل، استخلص أبعاد المتجهات الهندسية، واختبر دقة فهارس الاسترجاع RAG" : "Analyze boundary splitting, inspect dense embedding vectors, and test vector search",
    selectBook: isRtl ? "اختر كتاباً لمعاينة قطاعاته:" : "Select a document to inspect:",
    selectPlaceholder: isRtl ? "-- اختر من المكتبة --" : "-- Choose from library --",
    thresholdLabel: isRtl ? "مؤشر حساسية الفواصل الدلالية (التحمل):" : "Semantic boundary split sensitivity:",
    searchTitle: isRtl ? "محاكاة الاستعلام الدلالي في فضاء المتجهات" : "Vector Space Search Sandbox",
    searchPlaceholder: isRtl ? "اكتب استعلاماً لفحص المتجهات المطابقة (مثال: أهمية علم الاجتماع)..." : "Query index (e.g. AI systems, social structure)...",
    btnSearch: isRtl ? "استرجاع المتجهات" : "Retrieve Chunks",
    resultsTitle: isRtl ? "القطاعات المسترجعة (المتجهات الأكثر قرباً)" : "Matched Chunks (Nearest Neighbors)",
    score: isRtl ? "نسبة التطابق الدلالي:" : "Semantic Similarity:",
    allChunks: isRtl ? "قائمة القطاعات المفهرسة لهذا الكتاب" : "Indexed Chunks in Selected Document",
    chunkId: isRtl ? "معرف القطاع:" : "Chunk ID:",
    page: isRtl ? "الصفحة:" : "Page:",
    vectorsTitle: isRtl ? "تجسيد أبعاد المتجه الكثيف (bge-m3):" : "Dense Vector Projection (bge-m3):",
    searching: isRtl ? "جارٍ مقارنة مصفوفات المتجهات..." : "Scanning high-dimensional space...",
    noResults: isRtl ? "لم يتم العثور على قطاعات دلالية مطابقة." : "No semantic chunks match your query.",
    noBookSelected: isRtl ? "يرجى اختيار كتاب لعرض هيكلة التقطيع الدلالي الخاص به." : "Select a book from the library dropdown to inspect chunks.",
    simModel: isRtl ? "نموذج التشابه:" : "Similarity Metric:",
    cosine: isRtl ? "جيب التمام Cosine" : "Cosine Similarity",
    chunkSizeLabel: isRtl ? "حجم القطاع:" : "Chunk Character Size:"
  };

  // Fetch book chunks when selection shifts
  const fetchBookChunks = async (bookId: string) => {
    if (!bookId) {
      setBookChunks([]);
      return;
    }
    setIsLoadingChunks(true);
    try {
      // We can query the search endpoint with empty query but specifying bookId to retrieve all its chunks
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "*", bookId })
      });
      if (res.ok) {
        const data = await res.json();
        setBookChunks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingChunks(false);
    }
  };

  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
      fetchBookChunks(books[0].id);
    }
  }, [books]);

  const handleBookChange = (id: string) => {
    setSelectedBookId(id);
    fetchBookChunks(id);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: searchQuery,
          bookId: selectedBookId || undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search and Parameter adjustment Panel */}
      <div className="space-y-6 lg:col-span-1">
        {/* Document selector and Config */}
        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-extrabold text-brand-green font-cairo text-sm flex items-center gap-2 border-b border-brand-cream-border pb-2">
            <Sliders className="w-4.5 h-4.5 text-brand-gold" />
            {isRtl ? "إعدادات الفضاء الدلالي" : "Semantic Configuration"}
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 font-cairo block">{t.selectBook}</label>
            <select
              value={selectedBookId}
              onChange={(e) => handleBookChange(e.target.value)}
              className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-cairo font-medium"
            >
              <option value="">{t.selectPlaceholder}</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} ({b.language.toUpperCase()})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span className="font-cairo">{t.thresholdLabel}</span>
              <span className="text-brand-gold font-mono">{similarityThreshold}</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="0.95" 
              step="0.01"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full accent-brand-gold h-1 bg-brand-cream rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed font-cairo">
              {isRtl ? "القيم المرتفعة تزيد من حساسية الحدود الدلالية وتنتج فواصل أصغر حجماً وأكثر تركيزاً." : "Higher values increase split sensitivity, generating shorter, highly cohesive contextual segments."}
            </p>
          </div>

          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-cairo">{t.simModel}</span>
              <span className="text-slate-700 font-bold font-cairo flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                {t.cosine}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-cairo">{t.chunkSizeLabel}</span>
              <span className="text-slate-700 font-bold font-mono">800 chars</span>
            </div>
          </div>
        </div>

        {/* Vector Search Sandbox Box */}
        <div className="bg-white border border-brand-cream-border p-5 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-extrabold text-brand-green font-cairo text-sm flex items-center gap-2 border-b border-brand-cream-border pb-2">
            <Compass className="w-4.5 h-4.5 text-brand-gold" />
            {t.searchTitle}
          </h3>

          <form onSubmit={handleSearch} className="space-y-3">
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all-300 font-medium"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-white font-bold font-cairo text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Binary className="w-4 h-4" />
              {t.btnSearch}
            </button>
          </form>

          {/* Quick Sandbox explanation */}
          <div className="p-3 bg-brand-cream border border-brand-cream-border rounded-xl text-[10px] text-slate-500 leading-relaxed font-cairo font-medium">
            {isRtl ? "يقوم الرمل الدلالي بمقارنة الكلمات المفتاحية والأوزان الترددية بمتجهات bge-m3 المدمجة لاسترجاع القطاعات الأكثر تطابقاً مع استعلامك المباشر." : "This interactive sandbox compares semantic intersection models against bge-m3 vectors to return top nearest segments."}
          </div>
        </div>
      </div>

      {/* Chunks Visualization Workspace */}
      <div className="lg:col-span-2 space-y-6">
        {/* Matched Search Results if searching */}
        {searchResults.length > 0 && searchQuery && (
          <div className="bg-amber-50/20 border border-amber-200/50 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-amber-900 font-cairo text-sm flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
              {t.resultsTitle}
            </h3>

            <div className="space-y-3">
              {searchResults.map((chunk, i) => (
                <div key={chunk.id} className="bg-white border border-brand-cream-border p-4 rounded-xl shadow-2xs space-y-3 hover:border-brand-gold transition-colors">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span className="font-mono text-brand-green bg-brand-cream px-2 py-0.5 rounded border border-brand-cream-border">
                      {chunk.id}
                    </span>
                    <span className="font-cairo">
                      {t.page} {chunk.pageNumber} • <strong>{chunk.bookTitle}</strong>
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {chunk.text}
                  </p>

                  {/* Dense vector micro-visualizer */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold font-cairo uppercase">{t.vectorsTitle}</p>
                    <div className="flex items-center gap-1 h-3">
                      {chunk.vector.map((val, idx) => {
                        const pct = Math.floor(Math.abs(val) * 100);
                        const isNeg = val < 0;
                        const barColor = isNeg ? "bg-rose-400" : "bg-emerald-400";
                        return (
                          <div 
                            key={idx} 
                            style={{ height: `${pct}%` }}
                            className={`flex-1 ${barColor} rounded-xs`}
                            title={`Dim ${idx+1}: ${val.toFixed(3)}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Document Chunks list */}
        <div className="bg-white border border-brand-cream-border rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-brand-green font-cairo text-sm flex items-center gap-2 border-b border-brand-cream-border pb-2">
            <ScanText className="w-4.5 h-4.5 text-brand-gold" />
            {t.allChunks}
          </h3>

          {isLoadingChunks ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-brand-cream border-t-brand-gold animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-cairo">{isRtl ? "تحميل جرد الفهرس الدلالي..." : "Reconstructing index structures..."}</p>
            </div>
          ) : bookChunks.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium font-cairo text-xs">
              {t.noBookSelected}
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
              {bookChunks.map((chunk) => (
                <div key={chunk.id} className="bg-brand-cream/20 hover:bg-brand-cream/40 border border-brand-cream-border p-4 rounded-xl space-y-3 transition-colors">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                    <span className="font-mono text-brand-green bg-brand-cream border border-brand-cream-border px-1.5 py-0.5 rounded">
                      {chunk.id}
                    </span>
                    <span className="font-cairo">
                      {t.page} {chunk.pageNumber}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {chunk.text}
                  </p>

                  {/* Dense vector micro-visualizer */}
                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-brand-cream-border">
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                      <span>{t.vectorsTitle}</span>
                      <span className="font-mono text-[8px] text-brand-gold">1024-D</span>
                    </div>
                    <div className="flex items-center gap-1 h-3">
                      {chunk.vector.map((val, idx) => {
                        const pct = Math.floor(Math.abs(val) * 100);
                        const isNeg = val < 0;
                        const barColor = isNeg ? "bg-rose-400" : "bg-emerald-400";
                        return (
                          <div 
                            key={idx} 
                            style={{ height: `${pct}%` }}
                            className={`flex-1 ${barColor} rounded-xs`}
                            title={`Dim ${idx+1}: ${val.toFixed(3)}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
