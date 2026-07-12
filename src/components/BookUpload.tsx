import React, { useState, useRef } from "react";
import { Collection, Book } from "../types";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  X, 
  BookOpen, 
  AlertCircle, 
  Settings, 
  ListRestart, 
  ChevronRight
} from "lucide-react";

interface BookUploadProps {
  collections: Collection[];
  onUploadSuccess: (newBook: Book) => void;
  lang: "ar" | "en";
}

export default function BookUpload({ collections, onUploadSuccess, lang }: BookUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [category, setCategory] = useState("علم اجتماع والتاريخ");
  const [collectionId, setCollectionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRtl = lang === "ar";

  const t = {
    title: isRtl ? "رفع كتاب أو مستند جديد" : "Upload New Book or Document",
    subtitle: isRtl ? "أضف كتاباً (PDF، EPUB، TXT) أو الصق نصاً حراً للتحليل والاستعلام الفوري" : "Add a book (PDF, EPUB, TXT) or paste raw text for instant semantic indexing",
    dropArea: isRtl ? "اسحب الملف وأفلته هنا" : "Drag & drop files here",
    orPaste: isRtl ? "أو حدد الملف يدوياً" : "or browse files manually",
    pasteLabel: isRtl ? "أو قم بلصق نص الكتاب مباشرة هنا:" : "Or paste book text directly here:",
    pastePlaceholder: isRtl ? "القرن الرابع الهجري شهد تطوراً عظيماً في المنهج العقلي..." : "Paste your raw document text here...",
    formTitle: isRtl ? "عنوان المستند" : "Document Title",
    formAuthor: isRtl ? "الكاتب / المؤلف" : "Author",
    formLanguage: isRtl ? "لغة المستند الأساسية" : "Document Language",
    formCategory: isRtl ? "التصنيف الموضوعي" : "Subject Category",
    formCollection: isRtl ? "المجموعة المستهدفة" : "Target Collection",
    btnSubmit: isRtl ? "بدء المعالجة الذكية والميتاكتابة" : "Start Intelligent Indexing",
    step1: isRtl ? "قراءة ملف المستند وتأمين الحجم" : "Reading document bytes and validating",
    step2: isRtl ? "مسح ضوئي ذكي (DeepSeek-OCR)" : "Running Intelligent OCR Scanner",
    step3: isRtl ? "استخراج البيانات الفنية والملخص (Gemini API)" : "Extracting summary & metadata via Gemini API",
    step4: isRtl ? "تقطيع النص فواصل دلالية متوازنة" : "Structuring semantic chunks & boundaries",
    step5: isRtl ? "توليد المتجهات والفهرسة (bge-m3)" : "Generating dense embedding vectors",
    processing: isRtl ? "جارٍ معالجة المستند دلالياً..." : "Processing document semantically...",
    success: isRtl ? "تمت عملية الفهرسة وحفظ المستند بنجاح!" : "Document indexed successfully!",
    sizeLimit: isRtl ? "دعم المستندات من 1 إلى 5 كتب، بحد أقصى 20 ميجابايت." : "Ingestion support for 1 to 5 books, up to 20MB per document.",
    fillRequired: isRtl ? "يرجى تعبئة عنوان الكتاب ونص المحتوى أولاً." : "Please provide both a title and text content.",
    unclassified: isRtl ? "غير مصنف" : "Uncategorized"
  };

  const steps = [t.step1, t.step2, t.step3, t.step4, t.step5];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setTitle(droppedFile.name.split(".")[0]);
      
      // Attempt reading TXT files
      if (droppedFile.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            setPastedText(evt.target.result as string);
          }
        };
        reader.readAsText(droppedFile);
      } else {
        // Mock non-txt content
        setPastedText(`[محتوى مستخرج من ${droppedFile.name}]\n\nهذا الملف ممسوح ضوئياً ويحتوي على دراسات وبحوث متقدمة. سيتم تحليل دلالاته واستخراج معالمه الكلية والفرعية عبر خوارزميات الذكاء الاصطناعي المدمجة.`);
      }
    }
  };

  const getBase64 = (fileToRead: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileToRead);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.split(".")[0]);

      // Check both file.type and extension to be safe
      const isTxt = selectedFile.type === "text/plain" || selectedFile.name.toLowerCase().endsWith(".txt");
      if (isTxt) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            setPastedText(evt.target.result as string);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setPastedText(`[محتوى مستخرج من ${selectedFile.name}]\n\nهذا الملف ممسوح ضوئياً ويحتوي على دراسات وبحوث متقدمة. سيتم تحليل دلالاته واستخراج معالمه الكلية والفرعية عبر خوارزميات الذكاء الاصطناعي المدمجة.`);
      }
    }
  };

  const handleClear = () => {
    setFile(null);
    setPastedText("");
    setTitle("");
    setAuthor("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!pastedText && !file)) {
      setErrorMsg(t.fillRequired);
      return;
    }

    setErrorMsg("");
    setIsProcessing(true);
    setActiveStep(0);

    // Simulate multi-step enterprise RAG ingestion progress bar
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, i === 2 ? 1500 : 800)); // Gemini API takes slightly longer
      setActiveStep(i + 1);
    }

    try {
      let fileBase64 = "";
      let fileName = "";
      let fileType = "";

      if (file) {
        fileBase64 = await getBase64(file);
        fileName = file.name;
        fileType = file.type;
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          content: pastedText,
          fileBase64,
          fileName,
          fileType,
          language,
          category,
          collectionId: collectionId || undefined
        })
      });

      if (response.ok) {
        const newBook = await response.json();
        onUploadSuccess(newBook);
        handleClear();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMsg(errorData.error || (isRtl ? "فشل خادم الـ RAG في معالجة المستند. يرجى مراجعة إعدادات المحرك." : "The RAG server failed to process the document. Please check the engine settings."));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(isRtl ? "عذراً، حدث خطأ في الشبكة أثناء ترحيل بيانات المستند." : "Sorry, a network error occurred while transmitting document data.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-brand-cream-border rounded-2xl p-6 md:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center md:text-right border-b border-brand-cream-border pb-4">
        <h2 className="text-xl font-extrabold text-brand-green font-cairo flex items-center justify-center md:justify-start gap-2">
          <BookOpen className="w-5 h-5 text-brand-gold" />
          {t.title}
        </h2>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {isProcessing ? (
        <div className="py-8 space-y-6 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand-cream border-t-brand-gold animate-spin"></div>
            <Upload className="w-6 h-6 text-brand-gold absolute animate-pulse" />
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-brand-green font-cairo text-base animate-pulse">{t.processing}</h3>
            <p className="text-slate-500 text-xs font-medium">{t.sizeLimit}</p>
          </div>

          {/* Stepper Display */}
          <div className="w-full max-w-md bg-brand-cream/50 border border-brand-cream-border rounded-xl p-4 space-y-3">
            {steps.map((step, idx) => {
              const isDone = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {isDone ? (
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  ) : isCurrent ? (
                    <span className="w-5 h-5 bg-brand-gold text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">●</span>
                  ) : (
                    <span className="w-5 h-5 bg-brand-cream text-slate-400 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  )}
                  <span className={`font-cairo font-medium ${isDone ? 'text-slate-400 line-through' : isCurrent ? 'text-brand-gold font-bold' : 'text-slate-600'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Drag Area */}
          {!file && !pastedText ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive ? 'border-brand-gold bg-brand-cream/50' : 'border-brand-cream-border hover:border-brand-gold hover:bg-brand-cream/30'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".txt,.pdf,.docx,.epub" 
                className="hidden" 
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="p-4 bg-brand-cream text-brand-gold rounded-2xl">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-brand-green text-base font-cairo">{t.dropArea}</h3>
                <p className="text-slate-500 text-xs font-bold">{t.orPaste}</p>
                <p className="text-slate-400 text-[10px] pt-1">{t.sizeLimit}</p>
              </div>
            </div>
          ) : (
            <div className="bg-brand-cream border border-brand-cream-border p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-cairo leading-tight">
                    {file ? file.name : `${title || 'مستند مجهول'}.txt`}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "إدخال نص يدوي كفهرس للذكاء الاصطناعي"}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleClear}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {file && (
            <div className="bg-brand-cream border border-brand-cream-border p-4 rounded-xl text-xs text-brand-green flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-gold shrink-0" />
              <p className="font-bold font-cairo">
                {isRtl 
                  ? "تم ربط الملف المرفق بنجاح. سيقوم محرك الـ RAG بقراءة النصوص والبيانات الفنية تلقائياً عند بدء المعالجة." 
                  : "The file is successfully attached. The RAG engine will automatically read text and technical metadata when processing starts."}
              </p>
            </div>
          )}

          {/* Pasted text field (Dual Option) */}
          {!file && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 block font-cairo">{t.pasteLabel}</label>
              <textarea 
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  if (!file && !title) setTitle("مستند مخصص");
                }}
                rows={6}
                placeholder={t.pastePlaceholder}
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3.5 text-sm text-slate-700 outline-none transition-all resize-none leading-relaxed font-medium"
              ></textarea>
            </div>
          )}

          {/* Form Fields metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium text-slate-700">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo">{t.formTitle} *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo">{t.formAuthor}</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo">{t.formLanguage}</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all font-medium"
              >
                <option value="ar">العربية (Default RTL)</option>
                <option value="en">English (LTR)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo">{t.formCategory}</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all font-medium"
              >
                <option value="علم اجتماع والتاريخ">علم اجتماع والتاريخ (Sociology & History)</option>
                <option value="الفلسفة والمنطق">الفلسفة والمنطق (Philosophy & Logic)</option>
                <option value="الذكاء الاصطناعي والتقنية">الذكاء الاصطناعي والتقنية (AI & Tech)</option>
                <option value="أبحاث لاهوتية">أبحاث لاهوتية (Theology Research)</option>
                <option value="عام">{t.unclassified}</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 font-cairo">{t.formCollection}</label>
              <select 
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full bg-brand-cream border border-brand-cream-border focus:border-brand-gold focus:bg-white rounded-xl p-3 text-sm text-slate-800 outline-none transition-all font-medium"
              >
                <option value="">-- بدون مجموعة رئيسية --</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-brand-gold hover:bg-brand-gold-hover text-white font-bold font-cairo text-sm rounded-xl transition-all shadow-sm hover:shadow-brand-gold-light focus:ring-2 focus:ring-brand-gold"
          >
            {t.btnSubmit}
          </button>
        </form>
      )}
    </div>
  );
}
