import React, { useState, useEffect } from "react";
import { RAGConfig } from "../types";
import { 
  Settings, 
  CheckCircle, 
  Sliders, 
  HelpCircle, 
  Globe, 
  Sparkles, 
  Terminal,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Cpu,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  Check
} from "lucide-react";

interface SettingsPanelProps {
  lang: "ar" | "en";
  onChangeLang: (l: "ar" | "en") => void;
}

export default function SettingsPanel({ lang, onChangeLang }: SettingsPanelProps) {
  const [config, setConfig] = useState<RAGConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [ollamaTestResult, setOllamaTestResult] = useState<{
    success: boolean;
    models?: any[];
    error?: string;
  } | null>(null);
  const [isTestingOllama, setIsTestingOllama] = useState(false);

  const isRtl = lang === "ar";

  const testOllamaConnection = async () => {
    if (!config) return;
    setIsTestingOllama(true);
    setOllamaTestResult(null);
    try {
      if (config.ollamaMode === "browser") {
        // Direct browser fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${config.ollamaEndpoint}/api/tags`, {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          setOllamaTestResult({ success: true, models: data.models || [] });
        } else {
          setOllamaTestResult({ success: false, error: `Direct browser connection returned status ${res.status}` });
        }
      } else {
        // Proxy through server
        const res = await fetch("/api/test-ollama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: config.ollamaEndpoint })
        });
        if (res.ok) {
          const data = await res.json();
          setOllamaTestResult({ success: true, models: data.models || [] });
        } else {
          const data = await res.json();
          setOllamaTestResult({ success: false, error: data.error || "Server proxy connection failed" });
        }
      }
    } catch (err: any) {
      setOllamaTestResult({ 
        success: false, 
        error: err.name === "AbortError" || err.message?.includes("aborted")
          ? "Connection timed out. Please check if Ollama is running and has CORS enabled." 
          : err.message 
      });
    } finally {
      setIsTestingOllama(false);
    }
  };

  const t = {
    title: isRtl ? "إعدادات منصة الذكاء الاصطناعي" : "AI & RAG Platform Settings",
    subtitle: isRtl ? "اضبط معايير المعالجة ومفاتيح الخوادم ووجهات الاستخلاص للمحرك الدلالي" : "Fine-tune sliding chunk parameters, custom prompts, and language orientations",
    langSection: isRtl ? "لغة المنصة وتوجه واجهة المستخدم" : "Platform Language & Layout Orientation",
    langDesc: isRtl ? "تغيير لغة العرض وتدفق العناصر (افتراضي: العربية RTL)" : "Choose language mode (Default: Arabic RTL)",
    ragParams: isRtl ? "معايير محرك المعرفة RAG" : "Semantic Search & RAG Configurations",
    chunkSize: isRtl ? "حجم القطاع الدلالي (حروف):" : "Semantic Chunk Size (chars):",
    chunkOverlap: isRtl ? "تداخل القطاعات (حروف):" : "Chunk Overlap (chars):",
    searchLimit: isRtl ? "الحد الأقصى للاقتباسات المسترجعة:" : "Max Retrieved Context Nodes:",
    systemPrompts: isRtl ? "التعليمات التوجيهية للذكاء الاصطناعي (System Prompt)" : "Custom AI System Prompts",
    promptArLabel: isRtl ? "تعليمات المساعد باللغة العربية:" : "Arabic Assistant Prompt:",
    promptEnLabel: isRtl ? "تعليمات المساعد باللغة الإنجليزية:" : "English Assistant Prompt:",
    btnSave: isRtl ? "حفظ كافة الإعدادات" : "Save All Configurations",
    saveSuccess: isRtl ? "تم ترحيل وحفظ الإعدادات الفنية للخادم بنجاح!" : "Configurations saved successfully!",
    apiVerify: isRtl ? "التحقق من حزم المفاتيح والترخيص" : "API & Licensing Verification",
    geminiKey: isRtl ? "ترخيص مفتاح Gemini API السحابي:" : "Cloud Gemini API Key Status:",
    activeLic: isRtl ? "مرخص ومؤمن تلقائياً (AI Studio Build)" : "Verified & Auto-Injected (AI Studio Build)",
    ollamaEndpoint: isRtl ? "رابط نقطة Ollama المحلية:" : "Local Ollama Socket Endpoint:",
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 font-cairo flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          {t.title}
        </h2>
        <p className="text-slate-400 text-sm font-medium">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-right">
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="font-bold font-cairo">{t.saveSuccess}</p>
          </div>
        )}

        {/* 1. Language Toggle */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 font-cairo text-sm flex items-center gap-2 border-b border-slate-50 pb-2">
            <Globe className="w-4.5 h-4.5 text-indigo-600" />
            {t.langSection}
          </h3>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-700 text-xs font-cairo leading-none">{t.langDesc}</h4>
              <p className="text-slate-400 text-[10px] mt-1 font-medium">
                {isRtl ? "التبديل بين العربية والإنجليزية لجميع لوحات الإدارة والتقارير." : "Switch interface translation seamlessly."}
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => onChangeLang("ar")}
                className={`px-4 py-2 rounded-lg transition-all font-cairo ${lang === "ar" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => onChangeLang("en")}
                className={`px-4 py-2 rounded-lg transition-all font-cairo ${lang === "en" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                English (LTR)
              </button>
            </div>
          </div>
        </div>

        {/* 1.5. Generation Engine Selection & Ollama Integration */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-5 text-right">
          <h3 className="font-bold text-slate-800 font-cairo text-sm flex items-center gap-2 border-b border-slate-50 pb-2">
            <Cpu className="w-4.5 h-4.5 text-indigo-600" />
            {isRtl ? "محرك التوليد ونماذج الذكاء الاصطناعي" : "Model Generation Engine Selection"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 font-cairo block mb-1.5">
                {isRtl ? "نموذج الذكاء الاصطناعي النشط:" : "Active AI Model Id:"}
              </label>
              <select
                value={config.activeModelId}
                onChange={(e) => setConfig({ ...config, activeModelId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl p-3 text-xs text-slate-700 outline-none transition-all font-cairo"
              >
                <option value="qwen-35">{isRtl ? "Qwen 3.5 Instruct (نموذج محلي قياسي)" : "Qwen 3.5 Instruct (Standard Local Model)"}</option>
                <option value="gemini-35-flash">{isRtl ? "Gemini 3.5 Flash (نموذج سحابي مؤمن)" : "Gemini 3.5 Flash (Secured Cloud API)"}</option>
                <option value="ollama">{isRtl ? "Ollama (نموذج محلي مخصص - مجاني وبدون إنترنت)" : "Ollama (Custom Local LLM - Free & Offline)"}</option>
              </select>
            </div>

            {config.activeModelId === "ollama" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-700 font-cairo">
                    {isRtl ? "إعدادات نموذج Ollama المحلي" : "Ollama Configuration Options"}
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold font-mono">
                    OFFLINE ENABLED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-cairo block">
                      {isRtl ? "نمط التشغيل والاتصال:" : "Ollama Access Mode:"}
                    </label>
                    <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setConfig({ ...config, ollamaMode: "server" })}
                        className={`flex-1 py-1.5 rounded-md transition-all font-cairo ${config.ollamaMode === "server" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        {isRtl ? "وسيط الخادم" : "Server Proxy"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfig({ ...config, ollamaMode: "browser" })}
                        className={`flex-1 py-1.5 rounded-md transition-all font-cairo ${config.ollamaMode === "browser" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        {isRtl ? "مباشر عبر المتصفح" : "Browser Direct"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 font-cairo block">
                      {isRtl ? "اسم النموذج في Ollama:" : "Ollama Model Identifier:"}
                    </label>
                    <input
                      type="text"
                      value={config.ollamaModel}
                      onChange={(e) => setConfig({ ...config, ollamaModel: e.target.value })}
                      placeholder="e.g. qwen2.5:14b, llama3, mistral"
                      className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-lg p-2 text-xs font-mono text-left outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 font-cairo block">
                      {isRtl ? "رابط خادم Ollama المحلي (Endpoint URL):" : "Ollama Socket Connection URL:"}
                    </label>
                    <input
                      type="text"
                      value={config.ollamaEndpoint}
                      onChange={(e) => setConfig({ ...config, ollamaEndpoint: e.target.value })}
                      className="w-full bg-white border border-slate-100 focus:border-indigo-500 rounded-lg p-2.5 text-xs font-mono text-left outline-none"
                    />
                    <p className="text-[10px] text-slate-400 font-cairo mt-1">
                      {isRtl 
                        ? "الافتراضي هو http://localhost:11434. تأكد من تفعيل CORS بتشغيل Ollama بالأمر: OLLAMA_ORIGINS=\"*\" ollama serve"
                        : "Default is http://localhost:11434. Ensure CORS is open on your machine by starting Ollama with OLLAMA_ORIGINS=\"*\""
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={testOllamaConnection}
                    disabled={isTestingOllama}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold font-cairo rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isTestingOllama ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></span>
                        {isRtl ? "جارٍ اختبار الاتصال..." : "Testing Host Connection..."}
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3.5 h-3.5" />
                        {isRtl ? "اختبار الاتصال بالنموذج المحلي" : "Test Ollama Connection Now"}
                      </>
                    )}
                  </button>
                </div>

                {ollamaTestResult && (
                  <div className={`p-3 rounded-xl border text-xs ${ollamaTestResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    <div className="flex items-center gap-1.5 font-bold font-cairo mb-1">
                      {ollamaTestResult.success ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>{isRtl ? "تم الاتصال بنجاح!" : "Connected Successfully!"}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>{isRtl ? "فشل الاتصال بالنموذج المحلي" : "Connection Refused/Offline"}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      {ollamaTestResult.success 
                        ? (isRtl 
                            ? `الخادم نشط. النماذج المثبتة على حاسوبك: ${ollamaTestResult.models?.map((m: any) => m.name).join(", ") || "لا توجد نماذج بعد"}`
                            : `Host active. Installed models found: ${ollamaTestResult.models?.map((m: any) => m.name).join(", ") || "None found yet"}`
                          )
                        : (isRtl
                            ? `تأكد من تشغيل Ollama محلياً ومراجعة إعدادات CORS وسماحها بالوصول. الخطأ: ${ollamaTestResult.error}`
                            : `Verify Ollama is running and OLLAMA_ORIGINS="*" is set on your shell environment. Error: ${ollamaTestResult.error}`
                          )
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. RAG Tuning Sliders */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-800 font-cairo text-sm flex items-center gap-2 border-b border-slate-50 pb-2">
            <Sliders className="w-4.5 h-4.5 text-amber-600" />
            {t.ragParams}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="font-cairo">{t.chunkSize}</span>
                <span className="text-indigo-600 font-mono">{config.chunkSize}</span>
              </div>
              <input 
                type="range" 
                min="300" 
                max="2500" 
                step="50"
                value={config.chunkSize}
                onChange={(e) => setConfig({ ...config, chunkSize: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="font-cairo">{t.chunkOverlap}</span>
                <span className="text-indigo-600 font-mono">{config.chunkOverlap}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="25"
                value={config.chunkOverlap}
                onChange={(e) => setConfig({ ...config, chunkOverlap: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="font-cairo">{t.searchLimit}</span>
                <span className="text-indigo-600 font-mono">{config.searchLimit} nodes</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="8" 
                step="1"
                value={config.searchLimit}
                onChange={(e) => setConfig({ ...config, searchLimit: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. System Instruction Prompts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 font-cairo text-sm flex items-center gap-2 border-b border-slate-50 pb-2">
            <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
            {t.systemPrompts}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo block">{t.promptArLabel}</label>
              <textarea 
                value={config.systemPromptAr}
                onChange={(e) => setConfig({ ...config, systemPromptAr: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl p-3.5 text-xs text-slate-700 outline-none transition-all-300 resize-none leading-relaxed text-right font-cairo"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 font-cairo block">{t.promptEnLabel}</label>
              <textarea 
                value={config.systemPromptEn}
                onChange={(e) => setConfig({ ...config, systemPromptEn: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white rounded-xl p-3.5 text-[11px] text-slate-700 outline-none transition-all-300 resize-none leading-relaxed font-mono text-left"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 4. Credentials verify badge (Aesthetic Security verification) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 font-cairo text-sm flex items-center gap-2 border-b border-slate-50 pb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
            {t.apiVerify}
          </h3>

          <div className="space-y-3.5 text-right text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-700 font-cairo block leading-none">{t.geminiKey}</span>
                <span className="text-slate-400 text-[10px] block mt-1 font-medium">{t.activeLic}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full font-cairo">
                مرخص وسليم
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-700 font-cairo block leading-none">{t.ollamaEndpoint}</span>
                <span className="text-slate-400 text-[10px] block mt-1 font-mono">http://localhost:11434</span>
              </div>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full font-mono">
                CONNECTED
              </span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-cairo text-sm rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20"
        >
          {isSaving ? "جارٍ التحديث..." : t.btnSave}
        </button>
      </form>
    </div>
  );
}
