import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Leaf,
  MessageSquare,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  UploadCloud,
  User,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const LAYOUT_SPRING = { type: 'spring', bounce: 0.2, duration: 0.6 };
const MotionDiv = motion.div;
const ANALYSIS_STAGES = ['Analyzing texture...', 'Identifying infestation...', 'Confidence stabilizing...'];

function normalizeTreatmentMarkdown(value, pest) {
  const sectionTitles = {
    immediate_action: 'Immediate Action',
    immediate: 'Immediate Action',
    action_now: 'Immediate Action',
    action_24h: '24-Hour Action',
    next_24_hours: '24-Hour Action',
    day_1: '24-Hour Action',
    day7_recovery: '7-Day Recovery',
    recovery: '7-Day Recovery',
    next_7_days: '7-Day Recovery',
    prevention: 'Future Prevention',
    future_prevention: 'Future Prevention',
    preventive: 'Future Prevention',
  };

  const prettifyKey = (key) =>
    key
      .replace(/[_-]+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const stripCodeFence = (text) => {
    const trimmed = String(text || '').trim();
    const match = trimmed.match(/^```(?:json|markdown|md|txt)?\s*([\s\S]*?)\s*```$/i);
    return match ? match[1].trim() : trimmed;
  };

  const coerceLines = (input) => {
    if (Array.isArray(input)) {
      return input
        .flatMap((item) => coerceLines(item))
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (typeof input === 'string') {
      const text = stripCodeFence(input);
      if (!text) return [];
      const decoded = text.includes('\\n') && !text.includes('\n') ? text.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : text;
      return decoded
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (input && typeof input === 'object') {
      return Object.entries(input).flatMap(([key, nestedValue]) =>
        coerceLines(nestedValue).map((line) => `${prettifyKey(key)}: ${line}`),
      );
    }
    return [];
  };

  const objectToMarkdown = (obj) => {
    const directMarkdown = [obj.markdown, obj.treatment, obj.plan, obj.response].find((item) => typeof item === 'string' && item.trim());
    if (directMarkdown) {
      return normalizeTreatmentMarkdown(directMarkdown, pest);
    }

    const lines = [`### Recommended Treatment for ${pest}`, ''];
    let hasSections = false;

    Object.entries(obj).forEach(([rawKey, rawValue]) => {
      const key = rawKey.toLowerCase();
      const items = coerceLines(rawValue);
      if (!items.length) return;
      const section = sectionTitles[key] || prettifyKey(rawKey);
      lines.push(`#### ${section}`);
      lines.push(...items.map((item) => `- ${item}`), '');
      hasSections = true;
    });

    return hasSections ? lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() : '';
  };

  if (typeof value === 'string') {
    const raw = stripCodeFence(value);
    if (!raw) return '';

    const maybeJson = raw.trim();
    if ((maybeJson.startsWith('{') && maybeJson.endsWith('}')) || (maybeJson.startsWith('[') && maybeJson.endsWith(']'))) {
      try {
        return normalizeTreatmentMarkdown(JSON.parse(maybeJson), pest);
      } catch {
        // Fall through to plain markdown rendering.
      }
    }
    if (maybeJson.startsWith('"') && maybeJson.endsWith('"')) {
      try {
        const parsedString = JSON.parse(maybeJson);
        if (typeof parsedString === 'string') {
          return normalizeTreatmentMarkdown(parsedString, pest);
        }
      } catch {
        // Fall through to plain markdown rendering.
      }
    }

    const decoded = raw.includes('\\n') && !raw.includes('\n') ? raw.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : raw;
    const hasHeading = /^#{1,4}\s+/m.test(decoded);
    const hasList = /^\s*([-*+]|(\d+[.)]))\s+/m.test(decoded);
    if (hasHeading || hasList) return decoded.trim();
    const plainLines = decoded
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    return `### Recommended Treatment for ${pest}\n\n${plainLines.map((line) => `- ${line}`).join('\n')}`;
  }

  if (Array.isArray(value)) {
    const lines = coerceLines(value);
    return `### Recommended Treatment for ${pest}\n\n${lines.map((step) => `- ${step}`).join('\n')}`;
  }

  if (value && typeof value === 'object') {
    return objectToMarkdown(value);
  }

  return '';
}

function inferCrop(pest = '') {
  const text = pest.toLowerCase();
  const riceTerms = ['rice', 'hopper', 'gall midge', 'hispa', 'stemborer', 'leaf folder', 'thrips'];
  const wheatTerms = ['wheat', 'aphid', 'armyworm', 'mite', 'beetle', 'worm'];

  if (riceTerms.some((term) => text.includes(term))) return 'Likely in rice ecosystem';
  if (wheatTerms.some((term) => text.includes(term))) return 'Likely in wheat ecosystem';
  return 'Mixed crop exposure';
}

function buildDetectionSignals(pest = '') {
  const text = pest.toLowerCase();

  if (text.includes('hopper')) {
    return ['Clustered hopper-like body pattern near stems.', 'Sap-feeding stress marks on leaf tissue.', 'Patchy yellowing around active feeding zones.'];
  }
  if (text.includes('aphid')) {
    return ['Dense soft-bodied colonies around tender growth.', 'Curling leaves with honeydew-like residue.', 'Localized chlorosis near infestation points.'];
  }
  if (text.includes('worm') || text.includes('army')) {
    return ['Chewing signatures with irregular leaf edges.', 'Larval feeding pattern across contiguous foliage.', 'Rapid canopy damage progression indicators.'];
  }
  if (text.includes('thrips')) {
    return ['Silvery streaking and fine scarring on leaf surface.', 'Needle-like feeding marks near veins.', 'Tissue bronzing around hotspots.'];
  }
  return ['Texture and lesion pattern match known pest signatures.', 'Damage distribution aligns with expected infestation behavior.', 'Visual stress markers are consistent with class prediction.'];
}

function stripMarkdownPrefix(line) {
  return line
    .replace(/^[-*+•●▪◦–—]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .replace(/^>\s+/, '')
    .trim();
}

function stripInlineMarkdown(line) {
  return line
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function extractTreatmentItems(markdown = '') {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('```'))
    .map(stripMarkdownPrefix)
    .map(stripInlineMarkdown)
    .filter(Boolean);

  return lines.length ? lines : ['Detailed guidance will appear here as treatment steps are generated.'];
}

function MarkdownBlock({ content, compact = false }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold mb-3 text-on-surface font-manrope">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-on-surface font-manrope">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mb-2 text-on-surface font-manrope">{children}</h3>,
        p: ({ children }) => <p className={`text-on-surface leading-relaxed ${compact ? 'text-sm mb-3' : 'mb-4'}`}>{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-on-surface">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-on-surface">{children}</ol>,
        li: ({ children }) => <li className={compact ? 'text-sm' : ''}>{children}</li>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/20 pl-4 italic text-on-surface-variant mb-4 bg-primary/5 py-2 rounded-r-lg">{children}</blockquote>,
        code: ({ children }) => <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs">{children}</code>,
        strong: ({ children }) => <strong className="font-bold text-on-surface">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function DetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingTreatment, setIsGeneratingTreatment] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [result, setResult] = useState(null);
  const [treatmentMarkdown, setTreatmentMarkdown] = useState('');
  const [chatSessionId, setChatSessionId] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);

  const visibleMessages = useMemo(() => chatMessages.slice(-20), [chatMessages]);
  const hiddenCount = Math.max(0, chatMessages.length - visibleMessages.length);
  const detectionSignals = useMemo(() => buildDetectionSignals(result?.pest), [result?.pest]);
  const treatmentItems = useMemo(() => extractTreatmentItems(treatmentMarkdown), [treatmentMarkdown]);

  useEffect(() => {
    if (!isAnalyzing) {
      setAnalysisStage(0);
      return;
    }
    const timer = setInterval(() => {
      setAnalysisStage((prev) => (prev + 1) % ANALYSIS_STAGES.length);
    }, 1100);
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  useEffect(() => {
    if (!result) {
      setRevealStep(0);
      return;
    }
    setRevealStep(0);
    const timers = [250, 700, 1150].map((delay, idx) =>
      setTimeout(() => {
        setRevealStep(idx + 1);
      }, delay),
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [result]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const resetConversation = () => {
    setTreatmentMarkdown('');
    setChatSessionId('');
    setChatOpen(false);
    setChatMessages([]);
    setChatInput('');
  };

  const handleFile = (file) => {
    if (!file) return;

    setError(null);
    setResult(null);
    resetConversation();

    if (!file.type.match('image/(jpeg|jpg|png)')) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch(`${API_BASE_URL}/api/v1/inference`, {
        method: 'POST',
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || 'Failed to analyze image. Please try again.');
      }

      setResult(payload);
      resetConversation();
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetTreatment = async () => {
    if (!result || isGeneratingTreatment) return;
    setIsGeneratingTreatment(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/treatment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pest: result.pest, confidence: result.confidence }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || 'Failed to generate treatment. Please try again.');
      }

      setTreatmentMarkdown(normalizeTreatmentMarkdown(payload.treatment, result.pest));
      setChatSessionId(payload.chat_session_id || '');
      setChatMessages([]);
      setChatInput('');
    } catch (err) {
      setError(err.message || 'Failed to generate treatment. Please try again.');
    } finally {
      setIsGeneratingTreatment(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !chatSessionId || isSendingChat) return;
    setIsSendingChat(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: chatSessionId, message: chatInput.trim() }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || 'Failed to continue chat. Please try again.');
      }

      setChatInput('');
      setChatMessages(Array.isArray(payload.messages) ? payload.messages : []);
    } catch (err) {
      setError(err.message || 'Failed to continue chat. Please try again.');
    } finally {
      setIsSendingChat(false);
    }
  };

  const resetAll = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setIsGeneratingTreatment(false);
    setIsSendingChat(false);
    setRevealStep(0);
    resetConversation();
  };

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden flex flex-col bg-gray-50 font-sans">
      {/* Header Area */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detection Workspace</h1>
            <p className="text-sm text-gray-600">Reveal pest intelligence and generate treatment strategies</p>
          </div>
          {previewUrl && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Workspace
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Split Grid */}
      <div className="flex-1 overflow-hidden p-6 grid lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Upload & Insights */}
        <div className="flex flex-col gap-6 overflow-hidden min-h-0">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="font-bold text-gray-800">1. Sample Upload</h2>
            </div>

            <label
              htmlFor="detection-file-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`block rounded-xl border-2 border-dashed p-1 cursor-pointer transition-all ${
                isDragging
                  ? 'border-green-600 bg-green-50'
                  : error
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-green-500'
              }`}
            >
              <div className="rounded-[calc(0.75rem-4px)] overflow-hidden h-64 flex flex-col items-center justify-center relative bg-gray-50">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Uploaded sample" className="w-full h-full object-contain relative z-10" />
                    <div className="absolute inset-0 bg-gray-100 z-0" />
                    {isAnalyzing && (
                      <motion.div
                        aria-hidden
                        initial={{ y: '-10%' }}
                        animate={{ y: ['0%', '95%', '0%'] }}
                        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-4 right-4 h-1 rounded-full bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-20"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm text-xs font-bold text-gray-700">
                        Replace Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      <Leaf className="w-7 h-7 text-green-600" />
                    </div>
                    <p className="font-bold text-gray-800">Drop leaf image here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse JPG/PNG</p>
                  </div>
                )}
              </div>
              <input
                id="detection-file-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
              />
            </label>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className={`rounded-xl px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 ${
                  !selectedImage || isAnalyzing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>

              <button
                type="button"
                onClick={handleGetTreatment}
                disabled={!result || isGeneratingTreatment}
                className={`rounded-xl px-4 py-3 font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                  !result || isGeneratingTreatment
                    ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                <Bot className="w-4 h-4" />
                {isGeneratingTreatment ? 'Building...' : 'Treatment'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-xs text-red-700 flex items-start gap-2 border border-red-100">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Insights Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm uppercase font-extrabold tracking-widest text-green-600 mb-2">Intelligence Reveal</p>
                      <h3 className="text-4xl font-black text-gray-900 leading-none">{result.pest}</h3>
                    </div>
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-base font-black shadow-sm">
                      {Number(result.confidence).toFixed(0)}% Match
                    </div>
                  </div>

                  <div className="space-y-6">
                    {revealStep >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 rounded-xl bg-gray-50 border border-gray-200 italic text-gray-800 text-base leading-relaxed font-medium"
                      >
                        Visual feeding signatures and tissue stress patterns align with known {result.pest} infestations.
                      </motion.div>
                    )}

                    {revealStep >= 3 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-500 uppercase flex items-center gap-2 tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          Detection Signals
                        </h4>
                        <div className="grid gap-3">
                          {detectionSignals.map((signal, idx) => (
                            <motion.div 
                              key={signal}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-base"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
                              <span className="text-gray-900 font-bold">{signal}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-600">No Intelligence Yet</h3>
                  <p className="text-sm text-gray-500 max-w-[200px]">Analyze an image to reveal pest profile and signals.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Treatment & Chat */}
        <div className="flex flex-col gap-6 overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {treatmentMarkdown ? (
              <motion.div
                key="workspace-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6 h-full overflow-hidden"
              >
                {/* Treatment Card */}
                <div className={`${chatOpen ? 'h-1/3' : 'flex-1'} transition-all duration-500 overflow-hidden flex flex-col`}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">2. Treatment Strategy</h3>
                      </div>
                      {!chatOpen && (
                        <button
                          onClick={() => setChatOpen(true)}
                          className="text-sm font-black text-green-600 hover:text-green-700 underline underline-offset-4 decoration-2"
                        >
                          Consult Expert
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {treatmentItems.map((item, idx) => (
                        <div key={item} className="flex gap-5 p-5 rounded-xl bg-gray-50 border border-gray-200 group hover:border-green-300 transition-colors">
                          <span className="font-black text-green-600 text-2xl leading-none">{idx + 1}</span>
                          <span className="text-base text-gray-900 font-bold leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chat Card */}
                <div className={`${chatOpen ? 'flex-1' : 'h-24'} transition-all duration-500 overflow-hidden`}>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className={`px-8 py-5 border-b border-gray-200 flex items-center justify-between gap-4 shrink-0 ${chatOpen ? 'bg-green-600 text-white' : 'bg-white'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${chatOpen ? 'bg-white/20' : 'bg-green-100'}`}>
                          <Bot className={`w-6 h-6 ${chatOpen ? 'text-white' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <h4 className={`font-black text-base tracking-tight ${chatOpen ? 'text-white' : 'text-gray-900'}`}>AI Agronomist</h4>
                          {chatOpen && <p className="text-xs text-green-50 font-extrabold uppercase tracking-widest mt-0.5">Session Active</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className={`p-2.5 rounded-xl transition-all ${chatOpen ? 'hover:bg-white/10' : 'hover:bg-gray-100 text-gray-400'}`}
                      >
                        {chatOpen ? <RotateCcw className="w-5 h-5 rotate-45" /> : <MessageSquare className="w-6 h-6" />}
                      </button>
                    </div>

                    {chatOpen && (
                      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                          {visibleMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-30">
                              <MessageSquare className="w-14 h-14 mb-4" />
                              <p className="text-lg font-black max-w-[280px]">Start a consultation about this treatment.</p>
                            </div>
                          ) : (
                            visibleMessages.map((msg, idx) => (
                              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[88%] p-5 rounded-2xl text-base font-bold shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-50 border border-gray-200 text-gray-900 rounded-tl-none'}`}>
                                  <MarkdownBlock content={msg.content || ''} compact />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                          <div className="flex gap-3">
                            <input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                              placeholder="Ask a follow-up..."
                              className="flex-1 bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-base font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all placeholder:text-gray-400"
                            />
                            <button
                              onClick={handleSendChat}
                              disabled={!chatInput.trim() || isSendingChat}
                              className="px-6 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-300 transition-all shadow-md active:scale-95 flex items-center justify-center"
                            >
                              <SendHorizontal className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-gray-300 shadow-sm">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-500">Workspace Pending</h3>
                <p className="text-sm text-gray-400 max-w-[240px]">Analyze and generate treatment to unlock the strategy dashboard and AI chat.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DetectionPage;

