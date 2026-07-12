import React, { useState, useEffect, useRef } from "react";
import { Book, ChatMessage, Citation } from "../types";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  Compass, 
  Cpu, 
  Layers,
  AlertCircle
} from "lucide-react";

interface AIChatProps {
  books: Book[];
  lang: "ar" | "en";
  initialBookId?: string;
}

export default function AIChat({ books, lang, initialBookId }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(initialBookId || "all");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStep, setTypingStep] = useState<"none" | "retrieving" | "ranking" | "generating">("none");
  const [errorMsg, setErrorMsg] = useState("");

  // Expandable citations trackers
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRtl = lang === "ar";

  const getSuggestedPrompts = () => {
    if (selectedBookId === "all") {
      return [
        isRtl 
          ? "لماذا الاجتماع الإنساني ضروري وكيف يتحقق قوت يوم من الحنطة؟" 
          : "Why is human social organization necessary and how is daily food produced?",
        isRtl 
          ? "هل الاقتران بين ما يعتقد سبباً ومسبباً ضروري وماذا حدث لإبراهيم في النار؟" 
          : "Is the correlation between cause and effect necessary, and what happened to Abraham?",
        isRtl 
          ? "How does semantic chunking resolve the issues of fixed-size segmentation in RAG?" 
          : "How does semantic chunking resolve the issues of fixed-size segmentation in RAG?"
      ];
    }

    if (selectedBookId === "muqaddimah") {
      return [
        isRtl 
          ? "لماذا الاجتماع الإنساني ضروري وبماذا يعبر الحكماء عن ذلك؟" 
          : "Why is human social organization necessary and how do scholars express it?",
        isRtl 
          ? "ما الفرق بين البدو وأهل الحضر ومن منهم أقرب إلى الخير؟" 
          : "What is the difference between Bedouins and urban citizens, and who is closer to good?",
        isRtl 
          ? "ما هي أعمار الدول الطبيعية وما مميزات الأجيال الثلاثة؟" 
          : "What are the natural lifespans of states and the characteristics of the three generations?"
      ];
    }

    if (selectedBookId === "tahafut") {
      return [
        isRtl 
          ? "كيف أبطال الغزالي قول الفلاسفة بقدم العالم وإثبات حدوثه؟" 
          : "How is the philosophers' claim of the pre-eternity of the world refuted?",
        isRtl 
          ? "لماذا لا يعتبر الاقتران بين السبب والمسبب ضرورياً ومن الفاعل الحقيقي للاحتراق؟" 
          : "Why is cause-and-effect correlation not necessary and who is the actual agent of burning?",
        isRtl 
          ? "كيف يدل عدم احتراق إبراهيم في النار على تسخير الطبيعة للمشيئة؟" 
          : "How does Abraham not burning in the fire prove nature is subjected to divine will?"
      ];
    }

    if (selectedBookId === "knowledge_rag") {
      return [
        isRtl 
          ? "What are the three primary stages of a Retrieval-Augmented Generation (RAG) pipeline?" 
          : "What are the three primary stages of a Retrieval-Augmented Generation (RAG) pipeline?",
        isRtl 
          ? "How does semantic chunking calculate sentence boundaries to maintain contextual coherence?" 
          : "How does semantic chunking calculate sentence boundaries to maintain contextual coherence?",
        isRtl 
          ? "Why is capturing rich metadata and citations crucial for enterprise AI search trust?" 
          : "Why is capturing rich metadata and citations crucial for enterprise AI search trust?"
      ];
    }

    // For user-uploaded books, generate dynamically
    const currentBook = books.find(b => b.id === selectedBookId);
    if (currentBook) {
      const themes = currentBook.keyThemes || [];
      const prompts = [];
      if (themes.length > 0) {
        prompts.push(
          isRtl 
            ? `ما هي أبرز الأفكار والمفاهيم المطروحة حول موضوع "${themes[0]}"؟` 
            : `What are the primary concepts discussed regarding "${themes[0]}"?`
        );
      }
      if (themes.length > 1) {
        prompts.push(
          isRtl 
            ? `كيف يوضح هذا المستند أبعاد قضية "${themes[1]}"؟` 
            : `How does this document explain the dimensions of "${themes[1]}"?`
        );
      } else {
        prompts.push(
          isRtl 
            ? "اعطني تفصيلاً دقيقاً لمحتويات هذا الكتاب وأهدافه الرئيسية." 
            : "Give me a detailed breakdown of this book's content and primary objectives."
        );
      }
      prompts.push(
        isRtl 
          ? `لخص لي أهم النتائج المستخلصة من كتاب "${currentBook.title}".` 
          : `Summarize the most important takeaways from "${currentBook.title}".`
      );
      return prompts;
    }

    return [];
  };

  const t = {
    chatTitle: isRtl ? "مساعد المعرفة الرقمي" : "AI Knowledge Assistant",
    chatSub: isRtl ? "اسأل مكتبتك، ابحث في بطون المجلدات باللغتين العربية والإنجليزية مدعوماً بالاقتباس الدقيق" : "Chat with your library and query dense documents with inline citations",
    scopeLabel: isRtl ? "نطاق الاستعلام:" : "Query Scope:",
    allBooks: isRtl ? "جميع كتب المكتبة (بحث عام)" : "All Library Books (Global Search)",
    placeholder: isRtl ? "اسأل مكتبتك عن نظرية العصبية، أو أنظمة RAG..." : "Ask your library about social dynamics, RAG systems...",
    clearHistory: isRtl ? "مسح الجلسة" : "Clear History",
    welcomeTitle: isRtl ? "أهلاً بك في فضاء الحوار المعرفي" : "Welcome to the Knowledge Sandbox",
    welcomeSub: isRtl ? "حدد نطاق البحث واكتب استفسارك، وسيتكفل مساعد BookMind AI باستخراج الإجابة وتوثيقها." : "Select your query scope, write a question, and let BookMind AI extract cited answers.",
    citationHeader: isRtl ? "المستندات والمصادر المرجعية (Citations)" : "Verification Sources (Citations)",
    page: isRtl ? "صفحة" : "Page",
    score: isRtl ? "مطابقة دلالية:" : "Match Score:",
    promptTitle: isRtl ? "اقتراحات الأسئلة الشائعة:" : "Suggested Questions:",
    retrieving: isRtl ? "1. جرد فضاء المتجهات واسترجاع النصوص المطابقة..." : "1. Searching vector space index in ChromaDB...",
    ranking: isRtl ? "2. إعادة ترتيب وترشيح العقد المعرفية وتصفيتها..." : "2. Filtering and ranking document contexts...",
    generating: isRtl ? "3. صياغة الإجابة المنهجية المدعومة بالبراهين..." : "3. Synthesizing structured response with Gemini API...",
  };

  useEffect(() => {
    if (initialBookId) {
      setSelectedBookId(initialBookId);
    }
  }, [initialBookId]);

  // Handle auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, typingStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    setErrorMsg("");
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // Simulate pipeline steps
    setTypingStep("retrieving");
    await new Promise(r => setTimeout(r, 600));
    setTypingStep("ranking");
    await new Promise(r => setTimeout(r, 500));
    setTypingStep("generating");

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          bookId: selectedBookId === "all" ? undefined : selectedBookId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: data.id,
          role: "assistant",
          content: data.content,
          timestamp: data.timestamp,
          citations: data.citations
        }]);
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "فشل محرك الـ RAG في الاتصال بمساعد الذكاء الاصطناعي.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("خطأ في الاتصال بالشبكة. يرجى مراجعة حالة الخادم.");
    } finally {
      setIsTyping(false);
      setTypingStep("none");
    }
  };

  const handleClear = () => {
    setMessages([]);
    setErrorMsg("");
  };

  const selectSuggestedPrompt = (text: string) => {
    setInput(text);
  };

  return (
    <div className="bg-white border border-brand-cream-border rounded-2xl shadow-xs overflow-hidden h-[640px] flex flex-col justify-between">
      {/* Scope Selector Header */}
      <div className="bg-brand-cream border-b border-brand-cream-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-gold" />
          <div>
            <h3 className="font-extrabold text-brand-green font-cairo text-sm leading-tight">{t.chatTitle}</h3>
            <p className="text-slate-500 text-[11px] font-medium hidden md:block">{t.chatSub}</p>
          </div>
        </div>

        {/* Scope dropdown selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 font-cairo shrink-0">{t.scopeLabel}</span>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="bg-white border border-brand-cream-border focus:border-brand-gold rounded-lg p-2 font-bold font-cairo outline-none text-slate-700"
          >
            <option value="all">{t.allBooks}</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title} ({book.language.toUpperCase()})</option>
            ))}
          </select>

          <button 
            onClick={handleClear}
            title={t.clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Sandbox Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-50/30">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="font-medium font-cairo">{errorMsg}</p>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center max-w-xl mx-auto text-center space-y-6 py-10">
            <div className="p-4 bg-brand-cream text-brand-gold rounded-3xl animate-pulse border border-brand-cream-border">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-brand-green font-cairo text-base">{t.welcomeTitle}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-bold">{t.welcomeSub}</p>
            </div>

            {/* Suggested prompts cards */}
            <div className="w-full space-y-2 text-right">
              <p className="text-[10px] font-bold text-brand-gold font-cairo uppercase tracking-wider">{t.promptTitle}</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {getSuggestedPrompts().map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestedPrompt(promptText)}
                    className="p-3 bg-white border border-brand-cream-border hover:border-brand-gold hover:bg-brand-cream/40 rounded-xl text-right font-semibold text-slate-600 hover:text-brand-green transition-all duration-200 w-full font-cairo"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Name/Avatar */}
                  <span className="text-[10px] text-slate-400 font-bold mb-1 font-cairo px-1">
                    {isUser ? "المستعلم" : "BookMind AI"}
                  </span>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl max-w-2xl text-sm leading-relaxed shadow-2xs ${isUser ? 'bg-brand-green text-white rounded-tr-none' : 'bg-white border border-brand-cream-border text-slate-800 rounded-tl-none font-medium'}`}>
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Citations Expose Block (RAG Highlight) */}
                    {!isUser && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-brand-cream-border space-y-2">
                        <h5 className="text-[10px] font-bold text-brand-gold uppercase flex items-center gap-1.5 font-cairo">
                          <Compass className="w-3.5 h-3.5 text-brand-gold" />
                          {t.citationHeader}
                        </h5>

                        <div className="space-y-1.5">
                          {msg.citations.map((cite, cIdx) => {
                            const isExpanded = expandedCitationId === `${msg.id}-${cIdx}`;

                            return (
                              <div 
                                key={cIdx} 
                                className="bg-brand-cream border border-brand-cream-border rounded-xl p-2.5 space-y-1.5 text-slate-600 text-xs"
                              >
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                                  <span className="font-cairo flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 text-brand-gold" />
                                    <strong className="text-brand-green">{cite.bookTitle}</strong> (صفحة {cite.pageNumber})
                                  </span>
                                  <span className="text-emerald-600 font-bold font-mono">
                                    {cite.matchScore}%
                                  </span>
                                </div>

                                {/* Expand/Collapse Excerpt detail */}
                                <button 
                                  type="button"
                                  onClick={() => setExpandedCitationId(isExpanded ? null : `${msg.id}-${cIdx}`)}
                                  className="text-[10px] text-brand-gold hover:text-brand-gold-hover font-bold flex items-center gap-1 font-cairo outline-none"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3 h-3" />
                                      {isRtl ? "إخفاء النص المقتبس" : "Hide Cited Passage"}
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3" />
                                      {isRtl ? "عرض النص المقتبس الكامل" : "Show Cited Passage"}
                                    </>
                                  )}
                                </button>

                                {isExpanded && (
                                  <p className="p-2 bg-white border border-brand-cream-border rounded-lg text-[11px] text-slate-500 leading-relaxed font-sans italic relative pr-5">
                                    <Quote className="w-3 h-3 text-brand-gold/40 absolute right-1.5 top-1.5 shrink-0" />
                                    {cite.text}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Typing/Pipeline status tracker */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-slate-400 font-bold mb-1 font-cairo px-1">BookMind AI</span>
            <div className="bg-white border border-brand-cream-border p-4 rounded-2xl rounded-tl-none text-xs space-y-2 max-w-sm shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="font-bold font-cairo text-slate-500">
                {typingStep === "retrieving" && t.retrieving}
                {typingStep === "ranking" && t.ranking}
                {typingStep === "generating" && t.generating}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="border-t border-brand-cream-border p-3.5 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          disabled={isTyping}
          className="flex-1 bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl px-4 py-3.5 text-xs text-slate-800 outline-none transition-all font-medium"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="p-3.5 bg-brand-gold hover:bg-brand-gold-hover disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0 focus:ring-2 focus:ring-brand-gold"
        >
          <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </form>
    </div>
  );
}
