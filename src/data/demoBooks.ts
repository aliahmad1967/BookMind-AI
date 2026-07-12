import { Book, Collection, ModelInfo, LogEntry } from "../types";

export const demoCollections: Collection[] = [
  {
    id: "philosophy",
    name: "فلسفة وعلم اجتماع",
    description: "أمهات الكتب في الاجتماع، الفلسفة، والفكر الإنساني والتحليل التاريخي.",
    color: "from-amber-500 to-orange-600",
    bookCount: 2,
  },
  {
    id: "technology",
    name: "الذكاء الاصطناعي والتقنية",
    description: "كتب وأبحاث تغطي هندسة المعرفة وأنظمة استرجاع المعلومات RAG والتقنيات الحديثة.",
    color: "from-blue-500 to-indigo-600",
    bookCount: 1,
  },
  {
    id: "science",
    name: "العلوم العامة",
    description: "منشورات ومراجع علمية عامة.",
    color: "from-emerald-500 to-teal-600",
    bookCount: 0,
  }
];

export const demoBooks: Book[] = [
  {
    id: "muqaddimah",
    title: "مقدمة ابن خلدون",
    author: "عبد الرحمن بن خلدون",
    description: "كتاب يؤسس لعلم الاجتماع البشري وفلسفة التاريخ، واصفاً قوانين العمران وتطور الدول والقبائل والطبائع الاجتماعية.",
    summary: "تعتبر مقدمة ابن خلدون عملاً تأسيسياً لعلم الاجتماع والأنثروبولوجيا وفلسفة التاريخ. يركز الكتاب على نظرية 'العصبية' ودورها في تأسيس الدول وسقوطها، مبيناً أن التطور البشري يخضع لقوانين اجتماعية مطردة وليس للصدف الفردية. كما يناقش العلوم، والصناعات، والتجارة، والزراعة، وتأثير البيئة الجغرافية على طبائع البشر.",
    language: "ar",
    pageCount: 38,
    wordCount: 12450,
    publicationYear: "1377م",
    category: "علم الاجتماع والتاريخ",
    keyThemes: ["العصبية والدول", "العمران البشري", "أطوار الدولة", "تأثير البيئة والاقاليم", "الصناعات والعلوم"],
    size: "4.2 MB",
    status: "analyzed",
    coverColor: "bg-gradient-to-br from-amber-800 to-yellow-900",
    collectionId: "philosophy",
    createdAt: "2026-07-10T12:00:00Z",
    content: `الفصل الأول: في العمران البشري على الجملة وأصنافه وبيان حصة الأرض من ذلك.
إن الاجتماع الإنساني ضروري؛ ويعبر الحكماء عن هذا بقولهم: "الإنسان مدني بالطبع" أي لا بد له من الاجتماع الذي هو المدنية في اصطلاحهم، وهو معنى العمران. وسبيله أن الله سبحانه خلق الإنسان وركبه على صورة لا يصح حياتها وبقاؤها إلا بالغذاء، وهداه إلى التماسه بغريزة ركبها فيه. إلا أن قدرة الواحد من البشر قاصرة عن تحصيل حاجته من ذلك الغذاء؛ فلو فرضنا أقل ما يمكن من الغذاء وهو قوت يوم من الحنطة مثلاً، فلا يحصل إلا بعلاج من طحن وعجن وخبز، وكل واحد من هذه الأعمال الثلاثة يحتاج إلى مواعين وآلات لا تتم إلا بصناعات متعددة من حدادة ونجارة وفخار. هب أنه يأكله حباً غير مطحون، فلا بد في تحصيله حباً من أعمال أخرى من زراعة وحصاد ودراس لتخليص الحب من غلاف التبن، وكل هذه يحتاج إلى آلات متعددة وصنائع أكثر. فلو انفرد الواحد بنفسه، لم يكن له بد من الاستعانة بغيره للحصول على بقائه.

الفصل الثاني: في العمران البدوي والأمم الوحشية والقبائل وما يعرض في ذلك من الأحوال.
اعلم أن البدو هم أصل المدن والحضر وسابقون عليهما، لأن أول مطالب الإنسان الضروري، ولا ينتهي إلى الكمال والكماليات إلا بعد إحكام الضروري. فالبدو يقتصرون على الضروري في العيش، من الأقوات والملابس والسكنى، والبلديون يعتنون بالترف والكماليات وتأنق الملابس والبيوت والأواني. والبدو أقرب إلى الخير من أهل الحضر، لأن النفس إذا كانت على الفطرة الأولى، كانت أسرع قبولاً للخير والشر، وما تسبق إليها إحداهما فتصير ملكة لها. وأهل الحضر لكثرة ما يعانون من الملاذ والترف، استولت على نفوسهم عادات السوء، وبَعُدوا عن مسالك الخير.

الفصل الثالث: في الدول العامة والملك والخلافة ومراتبها وعوارضها.
الدولة والملك لا يحصلان إلا بالعصبية والالتحام؛ ذلك أن المطالبة والمدافعة لا تكون إلا بقوة العصبية، والملك غاية العصبية وذروة سنامها. فالعصبية تكون بالقرابة أو ما في معناها من الولاء والحلف. والدول لها أعمار طبيعية كما للأشخاص، وأعمارها لا تتجاوز في الغالب ثلاثة أجيال؛ الجيل الأول يعيش في خشونة البداوة وبساطتها والمجد المشترك مع العصبية، والجيل الثاني يتحول إلى الترف والحضرة والانفراد بالملك، والجيل الثالث ينسى عهد البداوة والخشونة ويفقد العصبية بالكلية، ويدركهم الهرم والضعف فتزول الدولة وتنقرض.`
  },
  {
    id: "tahafut",
    title: "تهافت الفلاسفة",
    author: "أبو حامد الغزالي",
    description: "كتاب فلسفي ينتقد فيه الغزالي آراء الفلاسفة المسلمين الأوائل كابن سينا والفارابي في عشرين مسألة فلسفية لاهوتية.",
    summary: "يهاجم الغزالي في هذا الكتاب الفلسفة اليونانية المتأثرة بالمشائية، وبشكل خاص تكييف الفارابي وابن سينا لها. يعرض عشرين مسألة يرى أن الفلاسفة أخطؤوا فيها، معتبراً ثلاث مسائل منها تؤدي إلى الكفر (قدم العالم، عدم علم الله بالجزئيات، وإنكار حشر الأجساد). أسس هذا الكتاب لمرحلة جديدة من النقد المعرفي وحرية النقاش العقدي في الفكر الإسلامي.",
    language: "ar",
    pageCount: 24,
    wordCount: 8900,
    publicationYear: "1095م",
    category: "الفلسفة والمنطق",
    keyThemes: ["نقد الميتافيزيقا", "علاقة العقل بالوحي", "السببية والاقتران", "حدوث العالم", "علم الله بالجزئيات"],
    size: "3.1 MB",
    status: "analyzed",
    coverColor: "bg-gradient-to-br from-teal-800 to-emerald-900",
    collectionId: "philosophy",
    createdAt: "2026-07-11T09:15:00Z",
    content: `المسألة الأولى: في إبطال قولهم بقدم العالم.
إن الفلاسفة يزعمون أن العالم قديم لم يزل مع الله، وصادر عنه صدور المعلول عن العلة. ونحن نقول إن العالم حادث، خلقه الله بمشيئته الأزلية التي تعلقت بإيجاده في وقت معين بعد أن لم يكن. واحتجاجهم بأن تقديم الخلق يوجب تغيراً في ذات الباري مردود، لأن المشيئة القديمة مقتضاها إيجاد الفعل في وقته المقتضى له، فالانتقال والحدوث إنما يقع في الحادث والمخلوق وليس في الخالق عز وجل.

المسألة السابعة عشرة: في السببيات والاقتران الطبيعي.
الاقتران بين ما يعتقد في العادة سبباً وبين ما يعتقد مسبباً ليس ضرورياً عندنا، بل هو نتيجة لاقتران مقدر من الله تعالى، كالنار والاحتراق، والماء والري، والخبز والشبع. فالنار جماد لا فعل لها، بل الخالق للاحتراق والفاعل له هو الله سبحانه، إما مباشرة أو بواسطة الملائكة. ويدل على ذلك إمكانية انفكاك هذا الاقتران كما حدث في معجزة إبراهيم عليه السلام حين ألقي في النار فلم يحترق، مما يثبت أن الطبيعة مسخرة لمشيئة خالقها وليست فاعلاً ذاتياً مستقلاً عن الإرادة الإلهية.`
  },
  {
    id: "knowledge_rag",
    title: "AI Knowledge Engineering & RAG Systems",
    author: "Dr. Sarah Jenkins",
    description: "A comprehensive guide on building production Retrieval-Augmented Generation (RAG) systems with semantic search, metadata extraction, and multi-modal models.",
    summary: "This textbook covers key architectural blocks for enterprise Knowledge Management using Large Language Models. It focuses on the mechanics of chunking (token-based vs semantic), dense and sparse embedding representation, vector databases, reranking strategies, and utilizing prompt constraints to prevent hallucinations. It provides concrete case studies on implementing RAG with high precision, metadata filters, and citation lineage.",
    language: "en",
    pageCount: 32,
    wordCount: 11200,
    publicationYear: "2025",
    category: "Artificial Intelligence",
    keyThemes: ["RAG Pipelines", "Semantic Chunking", "Dense Embeddings", "Vector Search Indices", "Citation Lineage"],
    size: "5.8 MB",
    status: "analyzed",
    coverColor: "bg-gradient-to-br from-indigo-800 to-purple-900",
    collectionId: "technology",
    createdAt: "2026-07-12T05:20:00Z",
    content: `Chapter 1: The Core Architecture of Retrieval-Augmented Generation (RAG)
Enterprise knowledge systems are shifting from standard relational databases to semantic indexes. Large Language Models (LLMs) suffer from inherent limitations, such as memory decay (context windows) and hallucinations. RAG addresses this by augmenting the LLM prompt with context retrieved from verified corpora. The pipeline has three primary stages: Ingestion (document loading, OCR, chunking, and embedding creation), Retrieval (vector query, similarity scoring, and reranking), and Generation (prompt formatting and model synthesis).

Chapter 2: Semantic Chunking vs. Fixed-Size Segmentation
Traditional RAG pipelines rely on fixed character or token counts to split files. This naive approach often tears semantic sentences apart, rendering the resulting chunks incomprehensible out of context. Semantic chunking resolves this by observing changes in semantic distance between sequential sentences. By calculating embedding similarity across a sliding window of sentences, boundaries are established where topics shift. This maintains contextual coherence, which is vital for high-precision retrieval.

Chapter 3: The Importance of Metadata and Citations
A major hurdle in deploying enterprise AI search is trust. Users must be able to trace an answer's lineage directly to the source text. Capturing rich metadata (file name, author, page number, chapter title) during ingestion allows the generator to write structural footnotes and inline citations. Moreover, storing metadata enables pre-filtering queries, constraining vector search space to certain dates, languages, or security access levels.`
  }
];

export const mockModels: ModelInfo[] = [
  {
    id: "ollama",
    name: "Ollama (Local & Offline LLM)",
    type: "llm",
    status: "online",
    version: "v0.1.x",
    usage: "نموذج Ollama المحلي لتوليد الإجابات بشكل مجاني وبدون الحاجة لإنترنت",
    vram: "Local Host GPU",
  },
  {
    id: "qwen-35",
    name: "Qwen 3.5 Instruct (14B)",
    type: "llm",
    status: "online",
    version: "v3.5.2",
    usage: "النموذج الرئيسي للمحادثة واستخراج البيانات المعقدة والاستنتاج البنائي",
    vram: "11.2 GB / 16 GB",
  },
  {
    id: "gemini-35-flash",
    name: "Gemini 3.5 Flash",
    type: "llm",
    status: "online",
    version: "v1.0",
    usage: "محرك السحاب الاحتياطي للمهام فائقة السرعة وتلخيص الفصول المتقدم",
    vram: "Cloud API",
  },
  {
    id: "bge-m3",
    name: "bge-m3 Multilingual",
    type: "embedding",
    status: "online",
    version: "v2.1",
    usage: "نموذج المتجهات ثنائي اللغة (عربي/إنجليزي) لبناء الفهارس الدلالية",
    vram: "2.4 GB / 4 GB",
  },
  {
    id: "deepseek-ocr",
    name: "DeepSeek-OCR Engine",
    type: "ocr",
    status: "online",
    version: "v1.5",
    usage: "نظام استخراج وتحليل النصوص من المخطوطات والملفات المصورة بدقة",
    vram: "3.1 GB / 6 GB",
  },
  {
    id: "chromadb",
    name: "ChromaDB Unified Vector Store",
    type: "vector-db",
    status: "online",
    version: "v0.5.3",
    usage: "قاعدة البيانات الدلالية المحلية لتخزين المتجهات وفهرسة المستندات",
    vram: "0.8 GB",
  }
];

export const mockLogs: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-07-12T08:00:00Z",
    level: "success",
    message: "تأسيس خادم قاعدة البيانات الدلالية ChromaDB بنجاح.",
    module: "VECTOR",
  },
  {
    id: "log-2",
    timestamp: "2026-07-12T08:01:15Z",
    level: "info",
    message: "تحميل نموذج المتجهات bge-m3 في ذاكرة الـ GPU بنجاح.",
    module: "VECTOR",
  },
  {
    id: "log-3",
    timestamp: "2026-07-12T08:02:10Z",
    level: "success",
    message: "تهيئة محرك المحادثة المحلي Qwen 3.5 بنجاح واستعداد قنوات الإدخال.",
    module: "LLM",
  },
  {
    id: "log-4",
    timestamp: "2026-07-12T08:05:32Z",
    level: "info",
    message: "فحص مكتبة DeepSeek-OCR والتحقق من مكتبات CUDA الأساسية.",
    module: "OCR",
  }
];
