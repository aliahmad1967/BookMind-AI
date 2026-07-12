import React, { useState, useEffect } from "react";
import { ModelInfo } from "../types";
import { 
  Cpu, 
  Database, 
  Zap, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Info, 
  Sliders, 
  RefreshCw,
  HardDrive
} from "lucide-react";

interface ModelManagementProps {
  lang: "ar" | "en";
}

export default function ModelManagement({ lang }: ModelManagementProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isRtl = lang === "ar";

  const t = {
    title: isRtl ? "إدارة النماذج والبنية التحتية" : "Local Model & Infrastructure Manager",
    subtitle: isRtl ? "مراقبة وتهيئة نماذج الذكاء الاصطناعي المحلية ونظم الفهرسة في خادمك الرئيسي" : "Monitor, configure, and manage active LLMs, embedding models, and local vector indices",
    hardwareStats: isRtl ? "إحصائيات الخادم الفورية (Ollama Host)" : "Ollama Host Performance Metrics",
    modelName: isRtl ? "اسم النموذج" : "Model Name",
    modelType: isRtl ? "النوع" : "Type",
    modelStatus: isRtl ? "الحالة" : "Status",
    modelUsage: isRtl ? "الاستخدام ومجال العمل المخصص" : "Primary Task Allocation",
    activeVram: isRtl ? "استهلاك VRAM:" : "VRAM Footprint:",
    btnToggle: isRtl ? "تغيير الحالة" : "Toggle Status",
    btnRefresh: isRtl ? "إعادة فحص الاتصال" : "Refresh Connections",
    gpuTemp: isRtl ? "درجة حرارة الـ GPU:" : "GPU Temperature:",
    latency: isRtl ? "متوسط سرعة الاستجابة:" : "Average Latency:",
    tokensPerSec: isRtl ? "سرعة التوليد:" : "Generation Rate:"
  };

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/models");
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggleStatus = (id: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        const newStatus = m.status === "online" ? "offline" : "online";
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-cairo flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            {t.title}
          </h2>
          <p className="text-slate-400 text-sm font-medium">{t.subtitle}</p>
        </div>

        <button
          onClick={fetchModels}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold font-cairo transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {t.btnRefresh}
        </button>
      </div>

      {/* Hardware metrics section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
        <h3 className="font-bold font-cairo text-sm mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          {t.hardwareStats}
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-right">
          <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block font-cairo">{t.gpuTemp}</span>
            <span className="text-2xl font-bold font-mono text-amber-500">68°C</span>
            <p className="text-[10px] text-slate-500 font-cairo">GPU Fan Speed: 42%</p>
          </div>

          <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block font-cairo">{t.latency}</span>
            <span className="text-2xl font-bold font-mono text-indigo-400">18.5 ms</span>
            <p className="text-[10px] text-slate-500 font-cairo">Embedding pipeline: 4.2ms</p>
          </div>

          <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block font-cairo">{t.tokensPerSec}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">42 t/s</span>
            <p className="text-[10px] text-slate-500 font-cairo">Quantized via Int8 GGUF</p>
          </div>

          <div className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block font-cairo">CUDA Driver VRAM</span>
            <span className="text-2xl font-bold font-mono text-blue-400">17.5 / 24 GB</span>
            <p className="text-[10px] text-slate-500 font-cairo">System Shared: 1.2 GB</p>
          </div>
        </div>
      </div>

      {/* Model inventory grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map(model => {
          const isOnline = model.status === "online";
          
          return (
            <div 
              key={model.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${isOnline ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {model.type === "vector-db" ? <Database className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm font-cairo leading-tight">{model.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">v{model.version} • {model.type.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-cairo">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ONLINE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full font-cairo">
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-500 text-xs font-medium leading-relaxed font-cairo">
                  {model.usage}
                </p>
              </div>

              <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-xs">
                {model.vram && (
                  <span className="font-mono text-slate-500 font-semibold flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    VRAM: {model.vram}
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={() => handleToggleStatus(model.id)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-cairo transition-colors ${isOnline ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}
                >
                  {t.btnToggle}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
