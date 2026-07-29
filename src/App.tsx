import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { scenario } from './data/scenario';
import { subtypeQuestions } from './data/subtypeQuestions';
import { MessageData } from './types';
import MarbleBackground from './components/MarbleBackground';
import ChatBubble from './components/ChatBubble';
import Controls from './components/Controls';
import TypingIndicator from './components/TypingIndicator';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { audio } from './utils/audio';

export default function App() {
  const [started, setStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // 💡 ロード用の状態を追加！
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selfId, setSelfId] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [scores, setScores] = useState({
    first: { v: 0, l: 0, e: 0, f: 0 },
    second: { v: 0, l: 0, e: 0, f: 0 },
    third: { v: 0, l: 0, e: 0, f: 0 },
    fourth: { v: 0, l: 0, e: 0, f: 0 }
  });
  const [dynamicSteps, setDynamicSteps] = useState<any[]>([]);
  const activeScenario = [...scenario, ...dynamicSteps];
  const currentStep = activeScenario[currentStepIndex];
  const [subtypeScores, setSubtypeScores] = useState<number[]>([0,0,0,0]);
  const [baseTypeString, setBaseTypeString] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [builtAvatar, setBuiltAvatar] = useState('');
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showExplanationDialog, setShowExplanationDialog] = useState(false);
  const [historyStack, setHistoryStack] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (started && currentStep?.id === 'exit') {
      const timer = setTimeout(() => {
        setStarted(false);
        setIsStarting(false);
        setCurrentStepIndex(0);
        setMessages([]);
        setHistoryStack([]);
        setDynamicSteps([]);
        setSubtypeScores([0,0,0,0]);
        setBaseTypeString("");
        setCachedImageUrl(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep?.id, started]);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (showResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showResult]);

  // 💡 ロード中(isConnecting)じゃない時だけメッセージ処理を開始する！
  useEffect(() => {
    if (started && !isConnecting && currentStep && !showResult) {
      processStepMessages();
    }
  }, [currentStepIndex, started, isConnecting]);

  const processStepMessages = async () => {
    processingRef.current = true;
    if (!currentStep) return;
    
    setIsProcessingStep(true);
    for (const msg of currentStep.messages) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, msg.delay || 1500));
      setIsTyping(false);
      setMessages(prev => [...prev, msg]);
      audio.playMessage();
    }
    const lastMsg = currentStep.messages[currentStep.messages.length - 1];
    const readTime = lastMsg ? Math.max(800, lastMsg.text.length * 50 + 500) : 800;
    await new Promise(r => setTimeout(r, readTime));
    setIsProcessingStep(false);
    processingRef.current = false;
  };

  const handlePhoneCall = (target: string) => {
    setShowPhoneDialog(false);
    let text = '';
    let sender: any = 'system';
    
    if (target === 'bug') {
      sender = '🐛';
      text = '『……今は思考中だ。用件はテキストで頼む。』(即切りされた)';
    } else if (target === 'darling') {
      sender = '🥺';
      text = '『あら、私からかけるまで待てないの？♡ ……焦る姿も可愛いけれど、今はダメ♡ 減点ね♡』(即切りされた)';
    } else if (target === 'friend') {
      sender = '💬';
      text = '『ごめん今電車！あとでかける！』(即切りされた)';
    }
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString() + '_call', sender: 'user', text: '[電話をかけた]' },
      { id: Date.now().toString() + '_reply', sender, text, delay: 0 }
    ]);
  };

  const handleAnswer = (addScores: any, text: string, metadata?: any, advanceStep: boolean = true, nextId?: string) => {
    if (advanceStep && processingRef.current) return;
    if (advanceStep) {
      processingRef.current = true;
      setHistoryStack(prev => [...prev, {
        currentStepIndex,
        messages: [...messages],
        scores: JSON.parse(JSON.stringify(scores)),
        subtypeScores: [...subtypeScores],
        dynamicSteps: [...dynamicSteps],
        baseTypeString,
        builtAvatar
      }]);
    }
    if (metadata?.avatar) {
      setBuiltAvatar(metadata.avatar);
    }
    if (text) {
      const userMsg: MessageData = { id: Date.now().toString() + Math.random(), sender: 'user', text, metadata };
      setMessages(prev => [...prev, userMsg]);
      audio.playPop();
    }
    
    if (addScores && !addScores.subtypeScore) {
      setScores(prev => ({
        first: {
          v: (prev?.first?.v || 0) + (addScores.first?.v || 0),
          l: (prev?.first?.l || 0) + (addScores.first?.l || 0),
          e: (prev?.first?.e || 0) + (addScores.first?.e || 0),
          f: (prev?.first?.f || 0) + (addScores.first?.f || 0),
        },
        second: {
          v: (prev?.second?.v || 0) + (addScores.second?.v || 0),
          l: (prev?.second?.l || 0) + (addScores.second?.l || 0),
          e: (prev?.second?.e || 0) + (addScores.second?.e || 0),
          f: (prev?.second?.f || 0) + (addScores.second?.f || 0),
        },
        third: {
          v: (prev?.third?.v || 0) + (addScores.third?.v || 0),
          l: (prev?.third?.l || 0) + (addScores.third?.l || 0),
          e: (prev?.third?.e || 0) + (addScores.third?.e || 0),
          f: (prev?.third?.f || 0) + (addScores.third?.f || 0),
        },
        fourth: {
          v: (prev?.fourth?.v || 0) + (addScores.fourth?.v || 0),
          l: (prev?.fourth?.l || 0) + (addScores.fourth?.l || 0),
          e: (prev?.fourth?.e || 0) + (addScores.fourth?.e || 0),
          f: (prev?.fourth?.f || 0) + (addScores.fourth?.f || 0),
        }
      }));
    } else if (addScores && addScores.subtypeScore) {
      setSubtypeScores(prev => {
        const next = [...prev];
        next[addScores.subtypeScore.index] = addScores.subtypeScore.score;
        return next;
      });
    }

    if (advanceStep) {
      if (nextId === 'exit') {
        setTimeout(() => {
          setStarted(false);
          setIsStarting(false);
          setCurrentStepIndex(0);
          setMessages([]);
          setHistoryStack([]);
        }, 1500);
        return;
      }

      if (nextId) {
        const targetIndex = activeScenario.findIndex(s => s.id === nextId);
        if (targetIndex !== -1) {
          setCurrentStepIndex(targetIndex);
        }
        return;
      }

      if (!nextId) {
        if (currentStepIndex >= scenario.length - 1 && dynamicSteps.length === 0) {
          const base = getBaseType(scores);
          setBaseTypeString(base);
          const funcs = base.split('');
          const newSteps = funcs.map((func, index) => {
            const pos = index + 1;
            const qData = subtypeQuestions[func][pos];
            return {
              id: `subtype_${func}_${pos}`,
              messages: [
                { id: `m_sub_${func}_1`, sender: 'system', text: `【追加診断: ${pos}${func}の強さ】`, delay: 1000 },
                { id: `m_sub_${func}_2`, sender: 'system', text: qData.q, delay: 1500 }
              ],
              inputType: 'choice',
              options: qData.options.map((opt: any) => ({
                label: opt.label,
                scores: { subtypeScore: { index, score: opt.score } }
              }))
            };
          });

          setDynamicSteps(newSteps);
          setCurrentStepIndex(scenario.length);
        } 
        else if (currentStepIndex < scenario.length + dynamicSteps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } 
        else {
          setTimeout(() => {
            const resultData = calculateResult();
            postToGAS(resultData);
            setShowResult(true);
          }, 1500);
        }
      }
    }
  };

  const handleAddDarlingMessage = (text: string) => {
    const msg: MessageData = { id: Date.now().toString(), sender: '🥺', text };
    setMessages(prev => [...prev, msg]);
  };

  const postToGAS = async (result: any) => {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzHS-qiaZwbdvyH6qjMviOyblZhV1Z-R7JjLVMS797KWVpIdRgCx3TrVhZ9lfxmU2ae/exec';
    if (GAS_URL.includes('DUMMY')) return;
    
    const payload = {
      selfType: selfId,
      resultType: result.type,
      subtype: result.subtype,
      alphabetSubtypes: result.alphabetSubtypes,
      scores: scores,
      logs: messages.map(m => ({ sender: m.sender, text: m.text }))
    };

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      console.log('GASへの送信完了！');
    } catch (e) {
      console.error('GAS送信エラー:', e);
    }
  };

  const calculateResult = () => {
    const getTop = (scoresObj: Record<string, number>, exclude: string[]) => {
      let max = -1;
      let top = '';
      for (const [k, v] of Object.entries(scoresObj || {})) {
        if (!exclude.includes(k) && v > max) {
          max = v;
          top = k;
        }
      }
      if (max === -1 || !top) {
        for (const k of ['v', 'l', 'e', 'f']) {
          if (!exclude.includes(k)) return k;
        }
      }
      return top;
    };
    const f1 = getTop(scores?.first || {}, []);
    const f2 = getTop(scores?.second || {}, [f1]);
    const f3 = getTop(scores?.third || {}, [f1, f2]);
    const f4 = getTop(scores?.fourth || {}, [f1, f2, f3]);
    
    const type = baseTypeString || `${f1.toUpperCase()}${f2.toUpperCase()}${f3.toUpperCase()}${f4.toUpperCase()}`;

    const maxScore = Math.max(...(subtypeScores || [0,0,0,0]));
    let subtype = 1;
    if (maxScore > 0 && subtypeScores) {
      subtype = subtypeScores.indexOf(maxScore) + 1;
    }

    const funcs = ['v', 'l', 'f', 'e'];
    const alphabetSubtypes: Record<string, any> = {};
    for (const f of funcs) {
      const funcScores = [
        scores?.first?.[f] || 0,
        scores?.second?.[f] || 0,
        scores?.third?.[f] || 0,
        scores?.fourth?.[f] || 0
      ];
      const total = funcScores.reduce((a, b) => a + b, 0);
      const maxFuncScore = Math.max(...funcScores);
      const topIndex = funcScores.indexOf(maxFuncScore);
      const percentages = total > 0 ? funcScores.map(s => Math.round((s / total) * 100)) : [0,0,0,0];
      
      alphabetSubtypes[f] = {
        topAttitude: topIndex + 1,
        percentages,
        rawScores: funcScores
      };
    }
    const positionPercentages: Record<string, any> = {};
    const posKeys = ['first', 'second', 'third', 'fourth'];
    posKeys.forEach(pos => {
      const funcScores = [
        scores?.[pos]?.v || 0,
        scores?.[pos]?.l || 0,
        scores?.[pos]?.f || 0,
        scores?.[pos]?.e || 0
      ];
      const total = funcScores.reduce((a, b) => a + b, 0);
      positionPercentages[pos] = total > 0 ? funcScores.map(s => Math.round((s / total) * 100)) : [0,0,0,0];
    });
    return { type, subtype, alphabetSubtypes, positionPercentages };
  };

  const copyResult = () => {
    const res = calculateResult();
    const toSuperscript = (num) => {
      const map = { '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '0': '⁰', '.': '.' };
      return num.toString().split('').map(c => map[c] || c).join('');
    };
    
    const typeArr = res.type.split('');
    const as = res.alphabetSubtypes;
    
    const attStrs = typeArr.map(fn => {
      const key = fn.toLowerCase();
      const d = as[key];
      return `${fn}${toSuperscript(d.topAttitude)}`;
    });
    const attStr = attStrs.join(' ');

    const details = typeArr.map(fn => {
      const key = fn.toLowerCase();
      const d = as[key];
      return `${fn}${toSuperscript(d.topAttitude)}(max${d.percentages[d.topAttitude - 1]}%)`;
    }).join('\n');

    const textToCopy = `AP診断結果: ${res.type}\n${attStr}\n\n【詳細】\n${details}\n\n#AP_Simulator`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setToastMessage('結果をコピーしました！📋');
      setTimeout(() => setToastMessage(''), 3000);
    }).catch(() => {
      setToastMessage('コピーに失敗しました❌');
      setTimeout(() => setToastMessage(''), 3000);
    });
  };

  const copyLog = () => {
    const logText = messages.map(m => `${m.sender}\n${m.text}`).join('\n\n');
    navigator.clipboard.writeText(logText).then(() => {
      setToastMessage('ログをコピーしました！📋');
      setTimeout(() => setToastMessage(''), 3000);
    }).catch(() => {
      setToastMessage('コピーに失敗しました❌');
      setTimeout(() => setToastMessage(''), 3000);
    });
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const generateImageData = async () => {
    if (cachedImageUrl) return cachedImageUrl;
    if (!resultRef.current) throw new Error("No ref");
    
    setIsGeneratingImage(true);
    setToastMessage('画像生成中...🎨');
    
    try {
      await toPng(resultRef.current, { cacheBust: true, pixelRatio: 2 });
      const dataUrl = await toPng(resultRef.current, { 
        backgroundColor: '#ffffff', 
        cacheBust: true,
        pixelRatio: 2,
        style: {
          fontFamily: "'Zen Maru Gothic', sans-serif",
          transform: 'scale(1)',
        }
      });
      setCachedImageUrl(dataUrl);
      setToastMessage('');
      setIsGeneratingImage(false);
      return dataUrl;
    } catch (err) {
      console.error('画像生成に失敗しました', err);
      setIsGeneratingImage(false);
      setToastMessage('画像生成に失敗しました😢');
      throw err;
    }
  };

  const handleShowImageModal = async () => {
    if (isGeneratingImage) return;
    try {
      const url = await generateImageData();
      setGeneratedImage(url);
    } catch (err) {
      console.error(err);
    }
  };

  // 💡 スマホの時はダウンロードボタンを押しても長押し保存モーダルを開くように修正！
  const handleDownloadImage = async () => {
    if (isGeneratingImage) return;

    try {
      const url = await generateImageData();
      
      // 💡 iPhoneでもダウンロード成功率を上げるため、画像データをちゃんとしたファイル(Blob)に変換！
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `ap-result-${calculateResult().type}.png`;
      link.href = blobUrl;
      
      // 念のため画面の裏側に一瞬だけリンクをくっつけてからクリックさせる
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 使い終わったURLを掃除
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error(err);
      setToastMessage('ダウンロードに失敗しました😢');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };
  
  const handleCallPerson = (person: 'friend' | 'caterpillar' | 'darling') => {
    setShowPhoneDialog(false);
    audio.playPhoneRing();
    setTimeout(() => {
      audio.playPop();
      let sender = '💬';
      let text = '『もしもし〜！今ちょっと手があいてるよ！どうしたの？』';
      if (person === 'caterpillar') {
        sender = '🐛';
        text = '『……人間、何の用だ？今は観察中だ。邪魔をしないでくれ。』';
      } else if (person === 'darling') {
        sender = '🥺';
        text = '『きゃっ！電話くれるなんて嬉しい！ねえねえ、私のこと考えてた？🥺』';
      }
      setMessages(prev => [...prev,
        { id: Date.now().toString() + '_call', sender: 'user', text: `[${person === 'friend' ? '友達' : person === 'caterpillar' ? '芋虫' : 'ダーリン'}に発信]` },
        { id: Date.now().toString() + '_reply', sender, text, delay: 0 }
      ]);
    }, 1500);
  };

  const getBaseType = (currentScores: any) => {
    const getTop = (scoresObj: any, exclude: string[]) => {
      let max = -1;
      let top = '';
      for (const [k, v] of Object.entries(scoresObj || {})) {
        if (!exclude.includes(k) && (v as number) > max) {
          max = (v as number);
          top = k;
        }
      }
      if (max === -1 || !top) {
        for (const k of ['v', 'l', 'e', 'f']) {
          if (!exclude.includes(k)) return k;
        }
      }
      return top;
    };
    const f1 = getTop(currentScores.first, []);
    const f2 = getTop(currentScores.second, [f1]);
    const f3 = getTop(currentScores.third, [f1, f2]);
    const f4 = getTop(currentScores.fourth, [f1, f2, f3]);
    return `${f1.toUpperCase()}${f2.toUpperCase()}${f3.toUpperCase()}${f4.toUpperCase()}`;
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const last = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, prev.length - 1));
    setCurrentStepIndex(last.currentStepIndex);
    setMessages(last.messages);
    setScores(last.scores);
    if (last.subtypeScores) setSubtypeScores(last.subtypeScores);
    if (last.dynamicSteps) setDynamicSteps(last.dynamicSteps);
    if (last.baseTypeString) setBaseTypeString(last.baseTypeString);
    if (last.builtAvatar !== undefined) {
      setBuiltAvatar(last.builtAvatar);
    }
    processingRef.current = false;
    audio.playPop();
  };

const handleStart = () => {
    // 💡 待たずに即座に画面を切り替えてローディングを開始！
    setStarted(true);
    setIsConnecting(true);
    
    // サウンド初期化（タップ直後じゃないとSafariでブロックされるため）
    try {
      audio.init();
      audio.toggleMute(false);
    } catch (e) {
      console.error(e);
    }
    setIsMuted(false);

    const isMobileDevice = navigator.maxTouchPoints > 0;

    // 💡 画面が切り替わった直後に紙吹雪を飛ばす
    setTimeout(() => {
      if (!isMobileDevice) {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
      } else {
        confetti({ particleCount: 15, spread: 50, origin: { y: 0.6 } });
      }
    }, 50);

    // 💡 1.2秒後にロードを解除してチャット開始
    setTimeout(() => {
      setIsConnecting(false);
    }, 1200);
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
        <MarbleBackground />
        <AnimatePresence>
          {!isStarting && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              className="glass-panel p-8 rounded-[2rem] max-w-sm w-full text-center border-2 border-white/80 relative overflow-hidden bg-white/60 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:mix-blend-overlay before:pointer-events-none shadow-[0_8px_32px_rgba(255,192,203,0.2)]"
            >
              <button onClick={handleReset} className="absolute top-4 left-4 text-slate-400 z-10 hover:text-pink-500 transition-colors text-xs font-bold bg-white/50 px-2 py-1 rounded-full"><i className="fa-solid fa-rotate-right"></i></button>
              
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2 border border-white">
                🐛 1件の未読
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              </div>

              <div className="text-6xl mb-4 drop-shadow-md animate-bounce mt-4">🦋</div>
              <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 relative inline-block">
                AP Sim
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full mix-blend-multiply blur-xl opacity-50 -z-10 animate-pulse"></div>
              </h1>
              <p className="text-slate-500 mb-4 font-bold text-sm tracking-widest">ATTITUDE LAB</p>
              <a href="https://mofu-mitsu.github.io/lab.html" className="inline-flex items-center relative z-10 gap-1 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors mb-4"><i className="fa-solid fa-flask"></i> labへ戻る</a>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-6 text-left border border-white text-xs text-slate-700 leading-relaxed shadow-inner">
                <p className="font-bold mb-1 text-pink-500">📖 AP（Attitudinal Psyche）とは？</p>
                <p className="mb-2">
                  本家サイコソフィア（PY）が「能力」や「自己評価」にも焦点を当てるのに対し、APは純粋に<strong>「その側面に対する態度（Attitude）」</strong>に絞って1〜4番目の機能を判定します。
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>V (Volition):</strong> 意志・責任・方向性</li>
                  <li><strong>L (Logic):</strong> 論理・理由・理解</li>
                  <li><strong>E (Emotion):</strong> 感情・表現・関係</li>
                  <li><strong>F (Physics / Foundation):</strong> 身体・現実・環境</li> {/* 💡 修正 */}
                </ul>
              </div>

              <div className="mb-6 text-left relative z-10">
                <label className="block text-xs font-bold text-slate-500 mb-1 pl-2">あなたの自認タイプ（任意）</label>
                <input 
                  type="text" 
                  value={selfId} 
                  onChange={e => setSelfId(e.target.value)} 
                  placeholder="例: LVFE、1Lなど" 
                  className="w-full bg-white/70 border border-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all font-bold text-slate-700 shadow-inner"
                />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full relative z-10 group overflow-hidden bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white py-4 rounded-full font-bold shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all text-lg"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  START <i className="fa-solid fa-paper-plane text-sm"></i>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isStarting && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-slate-500/80 font-bold tracking-widest text-sm flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50"
          >
            <i className="fa-solid fa-comment-dots"></i> 0/12 Messages
          </motion.div>
        )}
      </div>
    );
  }

  if (showResult) {
    const { type: resultType, subtype } = calculateResult();
    return (
      <div className="min-h-screen flex items-center justify-center relative px-4 py-8 overflow-y-auto">
        <MarbleBackground />
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-sm tracking-widest border border-slate-700/50"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {showExplanationDialog && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-3xl text-left max-w-md w-full border border-white max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
                APとサブタイプについて
              </h3>

              <div className="text-sm text-slate-600 space-y-4 font-medium mb-6">
                <p>
                  <strong>Attitudinal Psyche（AP）</strong>とは、
                  人が様々な側面に対して「どのような態度を取りやすいか」を分析する類型論です。
                </p>

                <p>
                  能力や得意・不得意ではなく、
                  「自然と自信を持ちやすい」「人と共有しやすい」
                  「気になりやすい」「あまり意識しない」といった
                  <strong>態度（スタンス）</strong>に注目します。
                </p>

                <hr className="border-slate-200" />

                <p><strong>4つの側面</strong></p>

                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>L（Logic）</strong>：論理・知識・分析・考え方</li>
                  <li><strong>V（Volition）</strong>：意志・目標・責任・決断</li>
                  <li><strong>F（Physics / Foundation）</strong>：身体・健康・生活・お金・物・快適さ</li>
                  <li><strong>E（Emotion）</strong>：感情・共感・雰囲気・感情表現</li>
                </ul>

                <hr className="border-slate-200" />

                <p><strong>4つの態度</strong></p>

                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>1番目</strong>：自信があり、自分の基準を持ちやすい</li>
                  <li><strong>2番目</strong>：柔軟で、人と共有・協力しやすい</li>
                  <li><strong>3番目</strong>：気になりやすく、不安や葛藤を感じやすい</li>
                  <li><strong>4番目</strong>：執着が少なく、自然と他人に任せやすい</li>
                </ul>

                <p>
                  よく「4番目＝無関心だから気にならない」と説明されますが、
                  APでは<strong>「重要ではないので意識しない」「無意識に避けやすい」</strong>
                  という意味合いも含まれます。
                </p>

                <p>
                  そのため、第4機能は「何も感じない」のではなく、
                  深く向き合うこと自体を避けることで自然体を保っている場合があります。
                </p>

                <hr className="border-slate-200" />

                <p><strong>Subtype（サブタイプ）とは？</strong></p>

                <p>
                  同じ「LVFE」でも、
                  人によってどの機能が一番色濃く表れるかは少しずつ異なります。
                </p>

                <p>
                  その違いを表したものが<strong>サブタイプ</strong>です。
                </p>

                <p>
                  例えば
                  <strong>LVFE-3</strong>は、
                  「LVFEの中でも3F（物理）の特徴が特に強く表れやすい」
                  ことを意味します。
                </p>

                <p>
                  これはタイプ（LVFE）が変わるという意味ではありません。
                  あくまで<strong>同じタイプの中で、どの態度が最も濃く現れているか</strong>を表しています。
                </p>

                <p>
                  この診断では各機能ごとの回答傾向を分析し、
                  最も強く現れた態度をサブタイプとして表示しています。
                </p>
              </div>

              <button
                onClick={() => setShowExplanationDialog(false)}
                className="w-full bg-slate-800 text-white py-3 rounded-full font-bold"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-white font-bold text-sm bg-pink-500/80 px-4 py-2 rounded-full shadow-lg">
                📱 画像を長押しして保存してください
              </p>
              <button
                onClick={() => setGeneratedImage(null)}
                className="ml-3 flex-shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 flex flex-col items-center">
              <img src={generatedImage} alt="診断結果" className="w-full max-w-sm rounded-[2rem] shadow-2xl border-4 border-white/50 mx-4" />
              <button
                onClick={() => setGeneratedImage(null)}
                className="mt-6 mb-8 text-white/70 hover:text-white font-bold px-8 py-3 rounded-full border border-white/30 hover:bg-white/10 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

          <motion.div 
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-[2rem] w-full text-center border-2 border-white/80 relative"
          >
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-pink-300/40 rounded-full blur-[30px] pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-cyan-300/40 rounded-full blur-[30px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Your Attitude Type</h2>
              <button onClick={handleReset} className="text-slate-400 hover:text-pink-500 transition-colors text-xs font-bold bg-white/50 px-3 py-1.5 rounded-full shadow-sm border border-white flex-shrink-0"><i className="fa-solid fa-rotate-right mr-1"></i>RESTART</button>
            </div>
            
            <div className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-wider drop-shadow-sm leading-none py-2">
              {resultType}
            </div>
            
            <div className="flex flex-col gap-2 mb-6 w-full font-bold">
              <div className="glass p-3 rounded-2xl flex justify-between items-center px-6 border-t border-l border-white bg-white/60">
                <div className="flex flex-col items-start flex-shrink-0">
                  <span className="text-slate-400 text-[10px] tracking-widest leading-tight whitespace-nowrap">1ST FUNCTION</span>
                  <span className="text-slate-600 text-xs font-bold whitespace-nowrap">Confident</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-slate-700 font-black">{resultType[0]}</span>
                </div>
              </div>
              <div className="glass p-3 rounded-2xl flex justify-between items-center px-6 border-t border-l border-white bg-white/40">
                <div className="flex flex-col items-start flex-shrink-0">
                  <span className="text-slate-400 text-[10px] tracking-widest leading-tight whitespace-nowrap">2ND FUNCTION</span>
                  <span className="text-slate-600 text-xs font-bold whitespace-nowrap">Flexible</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-slate-700 font-black">{resultType[1]}</span>
                </div>
              </div>
              <div className="glass p-3 rounded-2xl flex justify-between items-center px-6 border-t border-l border-white bg-white/20">
                <div className="flex flex-col items-start flex-shrink-0">
                  <span className="text-slate-400 text-[10px] tracking-widest leading-tight whitespace-nowrap">3RD FUNCTION</span>
                  <span className="text-slate-600 text-xs font-bold whitespace-nowrap">Insecure</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-slate-700 font-black">{resultType[2]}</span>
                </div>
              </div>
              <div className="glass p-3 rounded-2xl flex justify-between items-center px-6 border-t border-l border-white bg-white/10">
                <div className="flex flex-col items-start flex-shrink-0">
                  <span className="text-slate-400 text-[10px] tracking-widest leading-tight whitespace-nowrap">4TH FUNCTION</span>
                  <span className="text-slate-600 text-xs font-bold whitespace-nowrap">Unbothered</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-slate-700 font-black">{resultType[3]}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center font-bold text-slate-700 text-lg mb-4 bg-white/50 py-2 rounded-xl shadow-sm border border-white">
              Subtype: <span className="text-pink-500 tracking-widest">{resultType}-{subtype}</span>
            </div>

            {(() => {
              const toSup = (n: number) => ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'][n] ?? String(n);
              const res = calculateResult();
              const as = res.alphabetSubtypes;
              const typeArr = res.type.split('');
              return (
                <div className="flex justify-center gap-3 mb-4 flex-wrap">
                  {typeArr.map(fn => {
                    const key = fn.toLowerCase() as 'l'|'v'|'f'|'e';
                    const d = as[key];
                    return (
                      <div key={fn} className="bg-white/70 rounded-xl px-3 py-2 text-center shadow-sm border border-white min-w-[52px]">
                        <div className="text-xl font-black text-slate-700">{fn}{toSup(d.topAttitude)}</div>
                        <div className="text-[10px] font-bold text-slate-400">{d.percentages[d.topAttitude-1]}%</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="mt-4 flex flex-col gap-3 text-left">
              <h3 className="font-bold text-slate-700 text-sm border-b pb-1 mb-1">各順位での機能の強さ</h3>
              
              {['first', 'second', 'third', 'fourth'].map((pos, idx) => {
                const data = calculateResult().positionPercentages[pos];
                if (!data) return null;
                const funcs = ['V', 'L', 'F', 'E'];
                const titles = ['1st Function', '2nd Function', '3rd Function', '4th Function'];
                const subtitles = ['Confident', 'Flexible', 'Insecure', 'Unbothered'];
                return (
                  <div key={pos} className="bg-white/60 p-3 rounded-xl border border-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{titles[idx]}</span>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{subtitles[idx]}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      {funcs.map((func, i) => {
                        const pct = data[i];
                        return (
                          <div key={func} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <span className="w-4 flex-shrink-0">{func}</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden mx-1">
                              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="w-8 text-right flex-shrink-0">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-slate-500 text-[10px] leading-relaxed font-medium mt-4 mb-2">
              ※本家サイコソフィア（PY）が能力や自己評価に焦点を当てるのに対し、APは純粋に「その側面に対する態度（Attitude）」にフォーカスしています。この割合は各機能へのスタンスのブレを表します。
            </p>
          </motion.div>
          
          <div className="flex gap-4 w-full mt-4">
               <button onClick={copyResult} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold shadow-md hover:bg-slate-700">📋 結果をコピー</button>
               <button onClick={handleShowImageModal} disabled={isGeneratingImage} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-pink-600 flex items-center justify-center">
                 {isGeneratingImage ? <span className="animate-pulse">生成中...🎨</span> : "📸 長押しで保存"}
               </button>
            </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full glass-panel p-4 rounded-3xl max-h-[40vh] overflow-y-auto hide-scrollbar shadow-inner"
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 rounded-full border border-white/50 flex items-center justify-between px-4 py-2 mb-4">
              <h3 className="font-black text-slate-600 tracking-widest text-sm">💬 YOUR CHAT LOG</h3>
              <button onClick={copyLog} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors text-xs font-bold flex items-center gap-1">
                <i className="fa-solid fa-copy"></i> COPY
              </button>
            </div>
            <div className="flex flex-col">
              {messages.map((msg, index) => (
                <ChatBubble key={`${msg.id}-${index}`} message={msg} />
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExplanationDialog(true)}
              className="w-full glass py-4 rounded-full font-bold text-slate-700 shadow-sm border-2 border-white flex items-center justify-center hover:bg-white/50"
            >
              <i className="fa-solid fa-book-open mr-2 text-blue-500"></i>
              各機能の詳しい解説を見る
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className={`w-full glass py-4 rounded-full font-bold text-slate-700 shadow-sm border-2 border-white flex items-center justify-center ${isGeneratingImage ? 'opacity-50' : 'hover:bg-white/50'}`}
            >
              <i className="fa-solid fa-download mr-2 text-blue-500"></i>
              画像を直接ダウンロード
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: 'AP Simulator',
                      text: `私の対人態度タイプは【${resultType}】でした！🦋 #APSimulator`,
                      url: window.location.href,
                    });
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  alert('シェア機能がサポートされていません');
                }
              }}
              className="w-full glass py-4 rounded-full font-bold text-slate-700 shadow-sm border-2 border-white flex items-center justify-center hover:bg-white/50"
            >
              <i className="fa-solid fa-share-nodes mr-2 text-pink-500"></i>
              結果をシェアする
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()} 
              className="w-full py-4 text-slate-500 font-bold hover:underline mt-2"
            >
              <i className="fa-solid fa-rotate-right mr-2"></i>
              最初からやり直す
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const isWaitingForInput = !isProcessingStep && !isTyping && messages.length > 0 && messages[messages.length - 1].sender !== 'user';

  return (
    <div className="min-h-screen flex justify-center relative bg-slate-50">
      <MarbleBackground />
      
      {showPhoneDialog && (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="glass-panel p-6 rounded-3xl text-center max-w-sm w-full border border-white">
      <h3 className="text-xl font-bold text-slate-700 mb-1">📞 発信先を選択</h3>
      <p className="text-slate-500 mb-6 text-xs font-bold">誰に電話をかけますか？</p>
      
      <div className="space-y-3 mb-6">
        <button onClick={() => handleCallPerson('friend')} className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          💬 友達に電話をかける
        </button>
        <button onClick={() => handleCallPerson('caterpillar')} className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          🐛 芋虫に電話をかける
        </button>
        <button onClick={() => handleCallPerson('darling')} className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          🥺 ダーリンに電話をかける
        </button>
      </div>

      <button onClick={() => setShowPhoneDialog(false)} className="w-full bg-slate-200 text-slate-700 py-3 rounded-full font-bold text-sm hover:bg-slate-300 transition-colors">キャンセル</button>
    </div>
  </div>
)}

{showExplanationDialog && (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="glass-panel p-6 rounded-3xl text-left max-w-md w-full border border-white max-h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">
        APとサブタイプについて
      </h3>

      <div className="text-sm text-slate-600 space-y-4 font-medium mb-6">
        <p>
          <strong>Attitudinal Psyche（AP）</strong>とは、
          人が様々な側面に対して「どのような態度を取りやすいか」を分析する類型論です。
        </p>

        <p>
          能力や得意・不得意ではなく、
          「自然と自信を持ちやすい」「人と共有しやすい」
          「気になりやすい」「あまり意識しない」といった
          <strong>態度（スタンス）</strong>に注目します。
        </p>

        <hr className="border-slate-200" />

        <p><strong>4つの側面</strong></p>

        <ul className="list-disc pl-5 space-y-1">
          <li><strong>L（Logic）</strong>：論理・知識・分析・考え方</li>
          <li><strong>V（Volition）</strong>：意志・目標・責任・決断</li>
          <li><strong>F（Physics / Foundation）</strong>：身体・健康・生活・お金・物・快適さ</li>
          <li><strong>E（Emotion）</strong>：感情・共感・雰囲気・感情表現</li>
        </ul>

        <hr className="border-slate-200" />

        <p><strong>4つの態度</strong></p>

        <ul className="list-disc pl-5 space-y-1">
          <li><strong>1番目</strong>：自信があり、自分の基準を持ちやすい</li>
          <li><strong>2番目</strong>：柔軟で、人と共有・協力しやすい</li>
          <li><strong>3番目</strong>：気になりやすく、不安や葛藤を感じやすい</li>
          <li><strong>4番目</strong>：執着が少なく、自然と他人に任せやすい</li>
        </ul>

        <p>
          よく「4番目＝無関心だから気にならない」と説明されますが、
          APでは<strong>「重要ではないので意識しない」「無意識に避けやすい」</strong>
          という意味合いも含まれます。
        </p>

        <p>
          そのため、第4機能は「何も感じない」のではなく、
          深く向き合うこと自体を避けることで自然体を保っている場合があります。
        </p>

        <hr className="border-slate-200" />

        <p><strong>Subtype（サブタイプ）とは？</strong></p>

        <p>
          同じ「LVFE」でも、
          人によってどの機能が一番色濃く表れるかは少しずつ異なります。
        </p>

        <p>
          その違いを表したものが<strong>サブタイプ</strong>です。
        </p>

        <p>
          例えば
          <strong>LVFE-3</strong>は、
          「LVFEの中でも3F（物理）の特徴が特に強く表れやすい」
          ことを意味します。
        </p>

        <p>
          これはタイプ（LVFE）が変わるという意味ではありません。
          あくまで<strong>同じタイプの中で、どの態度が最も濃く現れているか</strong>を表しています。
        </p>

        <p>
          この診断では各機能ごとの回答傾向を分析し、
          最も強く現れた態度をサブタイプとして表示しています。
        </p>
      </div>

      <button
        onClick={() => setShowExplanationDialog(false)}
        className="w-full bg-slate-800 text-white py-3 rounded-full font-bold"
      >
        閉じる
      </button>
    </div>
  </div>
)}

{generatedImage && (
  <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4">
    <p className="text-white font-bold mb-4 bg-pink-500/80 px-4 py-2 rounded-full shadow-lg">画像を長押しして保存してください</p>
    <img src={generatedImage} alt="診断結果" className="w-full max-w-sm rounded-[2rem] shadow-2xl border-4 border-white/50" />
    <button onClick={() => setGeneratedImage(null)} className="mt-8 text-white/70 hover:text-white font-bold px-6 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors">
      閉じる
    </button>
  </div>
)}

<div className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-xl border-x border-white/50 relative flex flex-col min-h-screen">
<header className="glass-panel px-4 py-3 sticky top-0 z-20 flex justify-between items-center border-b border-white/60">
  <div className="flex flex-col">
    <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 tracking-wide text-lg leading-tight">
      AP Simulator
    </span>
  </div>
  <div className="flex gap-3 text-slate-400 text-lg items-center">
    {historyStack.length > 0 && (
      <button 
        onClick={handleUndo} 
        title="1つ前に戻る"
        className="flex items-center gap-1 text-xs font-bold bg-pink-100 text-pink-600 px-2.5 py-1 rounded-full shadow-sm hover:bg-pink-200 transition-all border border-pink-200"
      >
        <i className="fa-solid fa-rotate-left"></i>
        <span>戻る</span>
      </button>
    )}
    <i className="fa-solid fa-circle-info cursor-pointer hover:text-blue-500 transition-colors" onClick={() => setShowExplanationDialog(true)}></i>
    <i 
      className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} cursor-pointer hover:text-blue-500 transition-colors`} 
      onClick={() => { setIsMuted(!isMuted); audio.toggleMute(!isMuted); }}
    ></i>
    <i className="fa-solid fa-phone cursor-pointer hover:text-pink-500 transition-colors" onClick={() => setShowPhoneDialog(true)}></i>
    <i className="fa-solid fa-bars cursor-pointer hover:text-blue-500 transition-colors"></i>
  </div>
</header>

        {/* 💡 ロード中の画面 */}
        {isConnecting ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-pink-400 opacity-80"></i>
            <p className="font-bold text-sm tracking-widest animate-pulse">システム起動中...</p>
          </div>
        ) : (
          <>
            <div className="flex-1 px-4 py-6 relative">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <ChatBubble key={`${msg.id}-${index}`} message={msg} />
                ))}
                {isTyping && <TypingIndicator key="typing" />}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-4" />
            </div>

            <div className="p-4 relative z-20 pb-8 bg-gradient-to-t from-white/90 via-white/70 to-transparent pt-8">
              {isWaitingForInput && currentStep ? (
                <Controls 
                  key={currentStep.id}
                  step={currentStep} 
                  onAnswer={handleAnswer} 
                  onAddDarlingMessage={handleAddDarlingMessage}
                  builtAvatar={builtAvatar}
                />
              ) : currentStep?.id === 'exit' ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <button 
                      onClick={() => { setStarted(false); setCurrentStepIndex(0); setMessages([]); setHistoryStack([]); }}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg text-center hover:opacity-90 transition-opacity animate-bounce"
                    >
                      <i className="fa-solid fa-house mr-2"></i> タイトル画面へ戻る
                    </button>
                  </div>
                ) : (
                  <div className="glass py-3 px-5 rounded-full flex items-center text-slate-400 opacity-70 border-white">
                    <i className="fa-regular fa-face-smile mr-3 text-lg"></i>
                    <span className="text-sm font-medium">相手からの返信を待っています...</span>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}