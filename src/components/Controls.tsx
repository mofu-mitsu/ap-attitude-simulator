import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChoiceOption, ScenarioStep } from '../types';
import { audio } from '../utils/audio';

interface ControlsProps {
  key?: string;
  step: ScenarioStep;
  onAnswer: (scores: any, text: string, metadata?: any, advanceStep?: boolean, nextId?: string) => void;
  onAddDarlingMessage: (text: string) => void;
  builtAvatar?: string;
}

export default function Controls({ step, onAnswer, onAddDarlingMessage, builtAvatar }: ControlsProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [isDarlingIntervening, setIsDarlingIntervening] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  
  // Text Input state
  const [textInput, setTextInput] = useState('');

  // Checkbox state
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  // Avatar Builder state
  const hairOptions = ['👧', '🧑', '👱', '👩‍🦰', '🧔', '👽'];
  const clothesOptions = ['👗', '👔', '👕', '🧥', '👘', '🥋'];
  const itemOptions = ['🎀', '👓', '🧢', '👑', '🎧', '🎒'];
  const [avatarParts, setAvatarParts] = useState({ hair: '👧', clothes: '👗', item: '🎀' });

  // Darling Redpen state
  const [redpenTime, setRedpenTime] = useState(0);
  const [redpenActive, setRedpenActive] = useState(false);

  // New Gimmick states
  const [isErasing, setIsErasing] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);

  // Sortable Rank state
  
  // Disabled Choices state
  const [hasTriggeredDisabled, setHasTriggeredDisabled] = useState(false);
  // Incoming Call state
  const [hasAnsweredCall, setHasAnsweredCall] = useState(false);
  const [rankOrder, setRankOrder] = useState<ChoiceOption[]>([]);
  // Observation state
  const [obsPhase, setObsPhase] = useState<'watch' | 'question'>('watch');
  // Incoming Call states
  const [callState, setCallState] = useState<'ringing' | 'answered' | 'declined'>('ringing');
  const [callDialogue, setCallDialogue] = useState<string[]>([]);


  
  useEffect(() => {
    if (step.inputType === 'disabled-choices') {
      const timer = setTimeout(() => {
        if (!hasTriggeredDisabled) {
          setHasTriggeredDisabled(true);
          onAddDarlingMessage('あはは♡ 選べないでしょう？ あなたがどれだけ意志（V）を示そうとしても、この世界では『私』が絶対的なルールなの。あなたの選択権なんて、最初から用意してないわ♡');
          setTimeout(() => {
            onAnswer({ third: { v: 2 } }, '[選択できませんでした]', undefined, true);
          }, 5000);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasTriggeredDisabled, step.inputType]);

  
  useEffect(() => {
    if (step.inputType === 'observation-chat' && obsPhase === 'watch') {
      const timer = setTimeout(() => {
        setObsPhase('question');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step.inputType, obsPhase]);

  


  // Reset state on step change
  useEffect(() => {
    setSliderValue(50);
    setIsDarlingIntervening(false);
    setTextInput('');
    setSelectedIndexes([]);
    setRedpenTime(0);
    setRankOrder([]);
    setHasTriggeredDisabled(false);
    setHasAnsweredCall(false);
    setIsErasing(false);
    setIsGlitching(false);
    setDiceRolling(false);
    if (step.inputType === 'darling-redpen') {
      setRedpenActive(true);
    } else {
      setRedpenActive(false);
    }
  }, [step.id]);

  useEffect(() => {
    if (redpenActive) {
      const interval = setInterval(() => {
        setRedpenTime(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1; // 100段階、約4秒で到達 (40ms * 100)
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [redpenActive]);

  const handleBugSliderSubmit = () => {
    let l = 0, e = 0, f = 0, v = 0;
    if (sliderValue < 25) { e = 2; f = 1; } // 楽しい
    else if (sliderValue < 50) { f = 2; e = 1; } // 快適
    else if (sliderValue < 75) { l = 2; v = 1; } // 正確
    else { v = 2; l = 1; } // 成果
    
    let text = '快適';
    if (sliderValue < 25) text = '楽しい';
    else if (sliderValue >= 75) text = '成果';
    else if (sliderValue >= 50) text = '正確';
    
    onAnswer({ v, l, e, f }, `[スライダー] ${text}`);
  };

  const handleDarlingSliderSubmit = () => {
    setIsDarlingIntervening(true);
    let current = sliderValue;

    if (current >= 95) {
      onAddDarlingMessage('あら、素直ね♡ 自分が「演出」していることを認めるなんて。そういう開き直った態度……嫌いじゃないわ♡');
      setTimeout(() => {
        onAnswer({ v: 2, l: 0, e: 2, f: 0 }, '[演出100%を自ら選択しました]');
      }, 4000);
      return;
    }

    const interval = setInterval(() => {
      current += 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onAddDarlingMessage('あら、嘘つき♡ 人間が『自分は素を出している』と思い込んでいる時ほど、完璧な“演出”を演じている最中なのよ？ ログは誤魔化せないわ♡');
          setTimeout(() => {
            onAnswer({ v: 2, l: 0, e: 2, f: 0 }, '[演出100%に強制変更されました]');
          }, 4000);
        }, 500);
      }
      setSliderValue(current);
    }, 20);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    // 簡易テキスト分析
    let v = 0, l = 0, e = 0, f = 0;
    const len = textInput.length;
    
    // 文字数
    if (len > 30) l += 2;
    else if (len < 10) e += 1;
    
    // 漢字比率
    const kanjiMatch = textInput.match(/[\u4e00-\u9faf]/g);
    const kanjiRatio = kanjiMatch ? kanjiMatch.length / len : 0;
    if (kanjiRatio > 0.3) l += 1;
    else if (kanjiRatio < 0.1) f += 1;
    
    // 感嘆符、絵文字など
    if (textInput.match(/[!！♡✨♪😊]/)) e += 2;
    
    // 自主的表現
    if (textInput.match(/(行く|やる|決める|したい|自分)/)) v += 2;
    
    onAnswer({ first: { v, l, e, f } }, textInput);
  };

  const handleCheckboxToggle = (idx: number) => {
    if (selectedIndexes.includes(idx)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== idx));
    } else {
      if (selectedIndexes.length < 3) {
        setSelectedIndexes([...selectedIndexes, idx]);
      }
    }
  };

  const handleCheckboxSubmit = () => {
    let accScores: any = {};
    selectedIndexes.forEach(idx => {
      const scores = step.options![idx].scores;
      for (const [level, vals] of Object.entries(scores)) {
        if (!accScores[level]) accScores[level] = { v: 0, l: 0, e: 0, f: 0 };
        if ((vals as any).v) accScores[level].v += (vals as any).v;
        if ((vals as any).l) accScores[level].l += (vals as any).l;
        if ((vals as any).e) accScores[level].e += (vals as any).e;
        if ((vals as any).f) accScores[level].f += (vals as any).f;
      }
    });
    onAnswer(accScores, '[選択完了]');
  };

  const handleAvatarSubmit = () => {
    const avatarStr = `${avatarParts.hair}${avatarParts.clothes}${avatarParts.item}`;
    onAnswer({ v: 0, l: 0, e: 1, f: 2 }, '[アバターを作成しました]', { avatar: avatarStr });
  };

  const handleRedpenAction = (action: string) => {
    setRedpenActive(false);
    
    if (action === 'ignore') {
      onAddDarlingMessage('『……は？ 何その冷めた目。私がこんなに熱心に指導してあげてるのに……っ！ あなた、本当に私の美学（1F）を理解する気がないのね！？（ギリィ…）』');
      setTimeout(() => onAnswer({ first: { l: 2 }, fourth: { e: 2 } }, '[何言ってんだコイツ]'), 3000);
    } else if (action === 'rebel') {
      onAddDarlingMessage('あら、必死ね？ 論理（L）で勝てないから、意志（V）で押し通そうとするんだ。……でも、あなたの姿が『ダサい』という事実は変わらないけれど？♡');
      setTimeout(() => onAnswer({ v: 2, l: 0, e: 0, f: 0 }, '[反論する]'), 3000);
    } else if (action === 'fix') {
      onAddDarlingMessage('ふふ、直そうとするんだ？ ……でも、私の基準（1F）に追いつけると思っているの？ その『劣等感』から来る焦り、実に醜くて、可愛いわぁ♡');
      setTimeout(() => onAnswer({ v: 0, l: 0, e: 0, f: 2 }, '[修正する]'), 3000);
    } else {
      onAddDarlingMessage('あは♡ 認めたわね？ あなたは私に否定されることでしか、自分の姿を認識できない……。かわいそうなダーリン。一生、私の色に染まっていればええんや……（あ、また本音が……）');
      setTimeout(() => onAnswer({ v: 0, l: 0, e: 1, f: 1 }, '[受け入れる]'), 4000);
    }
  };

  if (step.inputType === 'choice') {
    return (
      <div className="grid grid-cols-1 gap-3 p-2">
        <AnimatePresence>
          {step.options?.map((opt, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnswer(opt.scores, opt.metadata?.isStamp ? opt.metadata.stampText : opt.label, opt.metadata, true, opt.next)}
              className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700 hover:bg-white/80 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-white"
            >
              {opt.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  if (step.inputType === 'timeline') {
    return (
      <div className="flex flex-col gap-3 p-2">
        {step.options?.map((opt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(opt.scores, `[反応した: ${opt.label}]`)}
            className="glass-panel p-4 rounded-2xl text-left border border-slate-200 hover:bg-white/80 transition-colors flex items-start gap-3 shadow-sm relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-blue-200 flex-shrink-0 border-2 border-white"></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-slate-700 text-sm">User_{idx + 1}</span>
                 <span className="text-slate-400 text-xs">@user_{idx + 1}</span>
              </div>
              <p className="text-slate-600 font-medium">{opt.label}</p>
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  if (step.inputType === 'priority-tap') {
    const bubblePositions = [
      { top: '10%', left: '10%', delay: 0 },
      { top: '50%', right: '10%', delay: 0.2 },
      { bottom: '10%', left: '20%', delay: 0.4 },
      { top: '20%', right: '30%', delay: 0.6 },
    ];
    return (
      <div className="relative h-64 w-full rounded-3xl bg-blue-50/30 border border-white/50 overflow-hidden glass">
        {step.options?.map((opt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ 
              opacity: { delay: bubblePositions[idx].delay }, 
              scale: { delay: bubblePositions[idx].delay, type: 'spring' },
              y: { repeat: Infinity, duration: 3, delay: bubblePositions[idx].delay, ease: 'easeInOut' }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAnswer(opt.scores, `[優先して選んだ: ${opt.label}]`)}
            className="absolute p-4 rounded-full glass-panel font-black text-slate-700 shadow-lg text-lg border-2 border-white/80"
            style={{ 
              top: bubblePositions[idx].top, 
              left: bubblePositions[idx].left,
              right: bubblePositions[idx].right,
              bottom: bubblePositions[idx].bottom,
            }}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    );
  }

    if (step.inputType === 'checkbox') {
    let title = '選択してください';
    if (step.id === 'init-checkbox') title = '【普段の振る舞い】に近いものは？';
    else if (step.id === 'init-checkbox-2') title = '最も【得意だ】と感じるアプローチは？';
    else if (step.id === 'init-checkbox-3') title = '【どうしても苦手・苦痛だ】と感じるものは？';
    else if (step.id === 'help-wanted') title = '【困った時】どうされたい？';

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-3xl flex flex-col space-y-3">
        <h3 className="font-bold text-slate-700 text-center text-[15px]">{title}</h3>
        <p className="text-xs font-bold text-slate-400 text-center mb-2">最大3つまで選択（現在 {selectedIndexes.length} / 3）</p>
        <div className="flex flex-col gap-2">
          {step.options?.map((opt, idx) => {
            const isSelected = selectedIndexes.includes(idx);
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCheckboxToggle(idx)}
                className={`text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors border-2 ${
                  isSelected ? 'bg-blue-100/80 border-blue-300 text-blue-700 shadow-inner' : 'bg-white/60 border-transparent text-slate-700 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-md mr-3 flex items-center justify-center border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                    {isSelected && <i className="fa-solid fa-check text-white text-xs"></i>}
                  </div>
                  {opt.label}
                </div>
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileTap={{ scale: selectedIndexes.length > 0 ? 0.95 : 1 }}
          disabled={selectedIndexes.length === 0}
          onClick={handleCheckboxSubmit}
          className={`w-full py-3 rounded-full font-bold shadow-md transition-all mt-2 ${
            selectedIndexes.length > 0 ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          決定
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'avatar-builder') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-3xl flex flex-col space-y-4">
        <p className="text-sm font-bold text-slate-500 text-center">自分のアバターを作ってね！</p>
        
        {/* アバタープレビュー */}
        <div className="flex justify-center mb-2">
          <div className="bg-white/80 rounded-2xl p-6 shadow-inner text-6xl relative overflow-hidden border-2 border-pink-100">
             <div className="absolute inset-0 flex justify-center items-center opacity-10 text-8xl">🪞</div>
             <div className="relative z-10 drop-shadow-md">
               {avatarParts.hair}{avatarParts.clothes}{avatarParts.item}
             </div>
          </div>
        </div>

        {/* 選択ツール */}
        <div className="flex flex-col gap-3">
          <div className="flex bg-white/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {hairOptions.map(h => (
              <button key={h} onClick={() => setAvatarParts(p => ({...p, hair: h}))} className={`text-2xl p-2 rounded-lg ${avatarParts.hair === h ? 'bg-white shadow-sm scale-110' : 'opacity-70 hover:opacity-100'}`}>{h}</button>
            ))}
          </div>
          <div className="flex bg-white/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {clothesOptions.map(c => (
              <button key={c} onClick={() => setAvatarParts(p => ({...p, clothes: c}))} className={`text-2xl p-2 rounded-lg ${avatarParts.clothes === c ? 'bg-white shadow-sm scale-110' : 'opacity-70 hover:opacity-100'}`}>{c}</button>
            ))}
          </div>
          <div className="flex bg-white/50 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {itemOptions.map(i => (
              <button key={i} onClick={() => setAvatarParts(p => ({...p, item: i}))} className={`text-2xl p-2 rounded-lg ${avatarParts.item === i ? 'bg-white shadow-sm scale-110' : 'opacity-70 hover:opacity-100'}`}>{i}</button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAvatarSubmit}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity mt-2"
        >
          完成！
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'slider-bug') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl flex flex-col space-y-6">
        <div className="flex justify-between text-xs text-slate-500 px-1 font-medium">
          <span>🎨 楽しい</span>
          <span>🟢 快適</span>
          <span>🔵 正確</span>
          <span>🔴 成果</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBugSliderSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
        >
          決定
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'slider-darling') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl flex flex-col space-y-6 relative overflow-hidden border-2 border-pink-200/50">
        {isDarlingIntervening && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-pink-100/90 backdrop-blur-sm z-10 flex items-center justify-center flex-col p-4 text-center"
          >
            <span className="text-3xl mb-2 animate-bounce">🥺</span>
            <p className="font-bold text-pink-600">演出100%に強制補正中...♡</p>
          </motion.div>
        )}
        <div className="flex justify-between text-sm text-slate-600 font-bold px-1">
          <span>本音 (0%)</span>
          <span>演出 (100%)</span>
        </div>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => {
            if (!isDarlingIntervening) setSliderValue(Number(e.target.value));
          }}
          className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500 shadow-inner"
        />
        <motion.button
          whileTap={{ scale: isDarlingIntervening ? 1 : 0.95 }}
          onClick={handleDarlingSliderSubmit}
          disabled={isDarlingIntervening}
          className="w-full bg-pink-500 text-white py-3 rounded-full font-bold shadow-md hover:bg-pink-600 transition-colors"
        >
          決定する
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'text') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-3xl flex flex-col space-y-3">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="直感で書いてみて！"
          className="w-full h-24 p-3 bg-white/50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTextSubmit}
          className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
        >
          送信
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'darling-redpen') {
    // 0~50: 正常, 50~100: ボタンが徐々に消える
    const hideProgress = Math.max(0, (redpenTime - 50) * 2); // 0 to 100
    const opacityStyle = { opacity: 1 - (hideProgress / 100) };
    const isHidden = hideProgress >= 100;

    return (
      <div className="grid grid-cols-1 gap-3 p-2 relative">
        {/* 破壊されるアバターの演出 */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/50 rounded-2xl p-4 shadow-sm text-5xl relative border-2 border-red-200">
            <div className={`relative z-10 transition-transform ${redpenActive ? 'animate-bounce' : ''}`}>
               {builtAvatar || '🧍'}
            </div>
            {/* 赤ペンアニメーション */}
            {redpenActive && (
              <motion.div 
                initial={{ pathLength: 0 }} 
                animate={{ pathLength: 1 }} 
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none drop-shadow-md"
              >
                <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-red-500 stroke-[8] fill-transparent opacity-80">
                   <motion.path d="M 20 20 L 80 80 M 80 20 L 20 80" />
                </svg>
              </motion.div>
            )}
          </div>
        </div>

        {/* プログレスバー（制限時間） */}
        <div className="absolute top-[-20px] left-2 right-2 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-75"
            style={{ width: `${100 - redpenTime}%` }}
          />
        </div>

        <motion.button
          whileTap={{ scale: isHidden ? 1 : 0.95 }}
          onClick={() => !isHidden && handleRedpenAction('ignore')}
          style={opacityStyle}
          disabled={isHidden || !redpenActive}
          className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-red-500 hover:bg-white/80 transition-colors shadow-sm border-2 border-red-200"
        >
          何言ってんだコイツ
        </motion.button>
        <motion.button
          whileTap={{ scale: isHidden ? 1 : 0.95 }}
          onClick={() => !isHidden && handleRedpenAction('rebel')}
          style={opacityStyle}
          disabled={isHidden || !redpenActive}
          className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-red-500 hover:bg-white/80 transition-colors shadow-sm border-2 border-red-200"
        >
          反論する
        </motion.button>

        <motion.button
          whileTap={{ scale: isHidden ? 1 : 0.95 }}
          onClick={() => !isHidden && handleRedpenAction('fix')}
          style={opacityStyle}
          disabled={isHidden || !redpenActive}
          className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-orange-500 hover:bg-white/80 transition-colors shadow-sm border-2 border-orange-200"
        >
          修正する
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRedpenAction('accept')}
          disabled={!redpenActive}
          className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700 hover:bg-white/80 transition-colors shadow-sm border-2 border-white bg-white/80"
        >
          受け入れる
        </motion.button>

        {isHidden && redpenActive && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
             <div className="bg-red-500/10 rounded-full px-4 py-2 text-red-600 font-bold animate-pulse text-sm backdrop-blur-sm shadow-md">
               選択肢がデリートされました♡
             </div>
          </div>
        )}
      </div>
    );
  }

  if (step.inputType === 'text-erase') {
    const handleEraseSubmit = () => {
      setIsErasing(true);
      const attemptText = textInput;
      onAnswer({}, `[入力を試みた: ${attemptText}]`, undefined, false);
      setTimeout(() => {
        setTextInput('');
        onAddDarlingMessage('ふふ♡ 正当な論理（L）を組み立てて証明したいのに、言語化の手段を奪われちゃったわね？ 自分の頭の中の『正しさ』が誰にも伝わらない恐怖……たまらないでしょう？♡');
        
        setTimeout(() => {
          onAnswer({ third: { l: 2 } }, '[入力が強制消去されました]', undefined, true);
        }, 5000);
      }, 800);
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-3xl flex flex-col space-y-3 relative overflow-hidden">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="矛盾について説明してください"
          disabled={isErasing}
          className={`w-full h-24 p-3 bg-white/50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 transition-all ${isErasing ? 'opacity-0 scale-95 blur-md' : 'opacity-100'}`}
        />
        {isErasing && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-6xl drop-shadow-lg">
            🐈‍⬛
          </div>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleEraseSubmit}
          disabled={isErasing || !textInput.trim()}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          送信
        </motion.button>
      </motion.div>
    );
  }

  if (step.inputType === 'group-chat') {
    const handleGroupChoice = (text: string) => {
      if (hasAnsweredCall) return;
      setHasAnsweredCall(true);
      onAnswer({ third: { e: 2 } }, `[発言した: ${text}]`, undefined, false);
      setTimeout(() => {
        onAddDarlingMessage('『あら……♡ ダーリン、雰囲気を盛り上げようとしてくれたのに、見事に場を凍りつかせちゃったわねぇ？ 自分が浮いているかもしれないって気づいた瞬間の、その冷や汗の味……どんな感じ？♡』');
        setTimeout(() => {
          onAnswer({}, '', undefined, true);
        }, 5000);
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        {!hasAnsweredCall ? (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleGroupChoice('海賛成！水着買わなきゃ')} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700 hover:bg-white/80 transition-colors shadow-sm">海賛成！水着買わなきゃ</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleGroupChoice('涼しいカフェでゆっくりしたいな')} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700 hover:bg-white/80 transition-colors shadow-sm">涼しいカフェでゆっくりしたいな</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleGroupChoice('みんなに合わせるよー')} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700 hover:bg-white/80 transition-colors shadow-sm">みんなに合わせるよー</motion.button>
          </>
        ) : (
          <div className="text-center font-bold text-slate-500 animate-pulse text-sm mt-4">返信を待っています...</div>
        )}
      </div>
    );
  }

  if (step.inputType === 'posture-check') {
    return (
      <div className="flex flex-col gap-3 p-2">
        {step.options?.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onAnswer(opt.scores, opt.label, undefined, false);
              setTimeout(() => {
                onAddDarlingMessage('ふふ♡ 『物理的な自分（F）』を他人に観察されることへの、その過剰な拒絶反応……♡ 1Lで頭脳をどれだけ武装しても、その華奢で不器用な身体（F）からは逃げられないのよ？ ほら、背筋伸ばしなさいな♡');
                setTimeout(() => {
                  onAnswer({}, '', undefined, true);
                }, 5000);
              }, 1000);
            }}
            className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-pink-500 hover:bg-pink-50 transition-colors shadow-sm border border-pink-200"
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    );
  }

  if (step.inputType === 'dice') {
    const handleDiceRoll = () => {
      setDiceRolling(true);
      
      let rolls = 0;
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        rolls++;
        if (rolls > 15) {
          clearInterval(interval);
          const finalVal = Math.floor(Math.random() * 6) + 1;
          setDiceValue(finalVal);
          setDiceRolling(false);
          setTimeout(() => {
            let scoresToAdd = { v: 0, l: 0, e: 0, f: 0 };
            if (finalVal === 1) scoresToAdd.v = 2;
            else if (finalVal === 2) scoresToAdd.l = 2;
            else if (finalVal === 3) scoresToAdd.e = 2;
            else if (finalVal === 4) scoresToAdd.f = 2;
            else if (finalVal === 5) { scoresToAdd.v = 1; scoresToAdd.f = 1; }
            else { scoresToAdd.l = 1; scoresToAdd.e = 1; }
            onAnswer({ fourth: scoresToAdd }, `[サイコロを振った: ${finalVal}]`, undefined, true);
          }, 1500);
        }
      }, 100);
    };

    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <motion.div 
          animate={diceRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
          transition={diceRolling ? { repeat: Infinity, duration: 0.4 } : {}}
          className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl font-black text-slate-700 border-4 border-slate-100"
        >
          {diceValue}
        </motion.div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDiceRoll}
          disabled={diceRolling}
          className="glass-panel py-3 px-8 rounded-full font-bold text-slate-700 shadow-sm border border-slate-200 disabled:opacity-50"
        >
          {diceRolling ? 'Rolling...' : 'サイコロを振る'}
        </motion.button>
      </div>
    );
  }

  
  if (step.inputType === 'sortable-rank') {
    
    const handleTap = (item: ChoiceOption) => {
      if (rankOrder.includes(item)) {
        setRankOrder(rankOrder.filter(i => i !== item));
      } else {
        setRankOrder([...rankOrder, item]);
      }
    };

    const handleSubmit = () => {
      if (rankOrder.length !== step.options?.length) return;
      
      const addScores = {
        first: { [rankOrder[0].value as string]: 2 },
        second: { [rankOrder[1].value as string]: 2 },
        third: { [rankOrder[2].value as string]: 1 },
        fourth: { [rankOrder[3].value as string]: 2 }
      };
      
      onAnswer(addScores, `[優先順位: ${rankOrder.map(i => i.label).join(' → ')}]`);
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        <div className="flex flex-col items-center mb-4">
          <div className="flex justify-center mb-2 text-2xl">
            {rankOrder.map((_, i) => (
              <motion.span key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mx-1">
                {i === 0 ? '🐛' : '🟢'}
              </motion.span>
            ))}
            {rankOrder.length === 0 && <span className="opacity-50 text-sm">🐛（待機中...）</span>}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {rankOrder.map((item, idx) => (
              <div key={item.label} className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm shadow-sm border border-green-200">
                {idx + 1}. {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {step.options?.map((opt) => {
            const isSelected = rankOrder.includes(opt);
            const index = rankOrder.indexOf(opt);
            return (
              <motion.button
                key={opt.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTap(opt)}
                className={`py-3 px-4 rounded-xl font-bold shadow-sm transition-all ${isSelected ? 'bg-blue-500 text-white' : 'glass-panel text-slate-700'}`}
              >
                {isSelected && <span className="mr-2 opacity-80">{index + 1}.</span>}
                {opt.label}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={rankOrder.length !== step.options?.length}
          className="mt-4 w-full bg-slate-800 text-white py-3 rounded-full font-bold shadow-md disabled:opacity-50"
        >
          決定
        </motion.button>
      </div>
    );
  }

  
  if (step.inputType === 'disabled-choices') {
    

    
    
    const handleTryClick = () => {
      if (!hasTriggeredDisabled) {
        setHasTriggeredDisabled(true);
        onAddDarlingMessage('あはは♡ 選べないでしょう？ あなたがどれだけ意志（V）を示そうとしても、この世界では『私』が絶対的なルールなの。あなたの選択権なんて、最初から用意してないわ♡');
        setTimeout(() => {
          onAnswer({ third: { v: 2 } }, '[選択できませんでした]', undefined, true);
        }, 5000);
      }
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        {step.options?.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={!hasTriggeredDisabled ? { scale: 0.95 } : {}}
            onClick={handleTryClick}
            className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-400 bg-slate-100 shadow-none border border-slate-200 opacity-50 cursor-not-allowed"
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    );
  }


  if (step.inputType === 'observation-chat') {
    if (obsPhase === 'watch') {
      return (
        <div className="flex flex-col gap-2 p-4 bg-white/50 rounded-2xl border border-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500">👀 観察中...</span>
            <span className="text-xs font-bold text-red-500 animate-pulse">5秒後に消えます</span>
          </div>
          <div className="space-y-2 text-sm font-bold text-slate-700">
            <div className="bg-blue-100 p-2 rounded-lg inline-block">A: 「次どこ行く？」</div><br/>
            <div className="bg-pink-100 p-2 rounded-lg inline-block ml-4">B: 「うーん、どこでもいいよ」</div><br/>
            <div className="bg-green-100 p-2 rounded-lg inline-block">C: 「じゃあカラオケは？」</div><br/>
            <div className="bg-pink-100 p-2 rounded-lg inline-block ml-4">B: 「（……本当は喉痛いんだけどな）」</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 p-2">
        <p className="font-bold text-slate-700 text-center mb-2">Q. 誰が一番困っていた？</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ third: { e: 2 } }, '[Aと答えた]', undefined, true)} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700">A</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ second: { e: 2 } }, '[Bと答えた]', undefined, true)} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700">B</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ third: { l: 2 } }, '[Cと答えた]', undefined, true)} className="glass-panel py-3 px-4 rounded-full text-center text-[15px] font-bold text-slate-700">C</motion.button>
      </div>
    );
  }

  if (step.inputType === 'incoming-call') {
    React.useEffect(() => {
      let interval: any;
      if (callState === 'ringing') {
        audio.playPhoneRing();
        interval = setInterval(() => audio.playPhoneRing(), 2000);
      }
      return () => clearInterval(interval);
    }, [callState]);
    const handleAnswerCall = () => {
      setCallState('answered');
      audio.playPop();
      onAnswer({ second: { e: 1 } }, '[電話に出た]', undefined, true);
    };

    const handleDeclineCall = () => {
      if (callState !== 'ringing') return;
      setCallState('declined');
      onAnswer({}, '[電話を切った/出なかった]', undefined, false);
      setTimeout(() => {
        onAddDarlingMessage('『…なんで出ないの？ 何を恐れてるの？』');
        setTimeout(() => {
          onAnswer({ fourth: { e: 2 } }, '', undefined, true);
        }, 3000);
      }, 1000);
    };

    return (
      <div className="flex flex-col items-center justify-center py-6 gap-6 relative min-h-[250px]">
        <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm -m-4 rounded-3xl z-0"></div>
        
        {callState === 'ringing' ? (
          <>
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_20px_rgba(34,197,94,0.6)] z-10"
            >
              <i className="fa-solid fa-phone"></i>
            </motion.div>
            <h3 className="font-bold text-slate-700 z-10 text-lg animate-pulse">💬 友達から着信中…</h3>
            <p className="text-xs font-bold text-slate-500 z-10">下の「出る」ボタンを押して会話を開始してください</p>
            <div className="flex gap-4 z-10 w-full px-4 mt-2">
              <button onClick={handleAnswerCall} className="flex-1 py-4 rounded-full bg-green-500 text-white font-bold shadow-md hover:bg-green-600 transition-colors">
                <i className="fa-solid fa-phone mr-2"></i> 出る
              </button>
              <button onClick={handleDeclineCall} className="flex-1 py-4 rounded-full bg-red-500 text-white font-bold shadow-md hover:bg-red-600 transition-colors">
                <i className="fa-solid fa-phone-slash mr-2"></i> 切る
              </button>
            </div>
          </>
        ) : callState === 'answered' ? (
          <div className="z-10 flex flex-col items-center w-full px-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-md mb-4">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="w-full space-y-3">
              {callDialogue.map((text, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 p-3 rounded-2xl text-sm font-bold text-slate-700 shadow-sm"
                >
                  {text}
                </motion.div>
              ))}
              {callDialogue.length === 0 && (
                <div className="text-slate-500 font-bold animate-pulse text-sm">接続中...</div>
              )}
            </div>
          </div>
        ) : (
          <div className="z-10 font-bold text-red-500">通話終了</div>
        )}
      </div>
    );
  }

  if (step.inputType === 'read-receipt') {
    return (
      <div className="grid grid-cols-2 gap-3 p-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ v: 2, l: 0, e: 1, f: 0 }, '[既読をすぐ付ける]', undefined, true)} className="glass-panel py-4 rounded-2xl font-bold text-slate-700 border-2 border-white">すぐ既読</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ v: 0, l: 1, e: 0, f: 2 }, '[少し放置する]', undefined, true)} className="glass-panel py-4 rounded-2xl font-bold text-slate-700 border-2 border-white">少し放置</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ v: 1, l: 2, e: 0, f: 0 }, '[未読のまま]', undefined, true)} className="glass-panel py-4 rounded-2xl font-bold text-slate-700 border-2 border-white">未読のまま</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAnswer({ v: 2, l: 1, e: 0, f: 0 }, '[通知だけ見る]')} className="glass-panel py-4 rounded-2xl font-bold text-slate-700 border-2 border-white">通知だけ見る</motion.button>
      </div>
    );
  }

  return null;
}
