export default function MarbleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
      {/* 液体のように混ざる背景（ゆっくり動く） */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-liquid-1"></div>
      <div className="absolute top-[10%] right-[-20%] w-[80vw] h-[80vw] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-[90px] opacity-80 animate-liquid-2"></div>
      <div className="absolute bottom-[-10%] left-[0%] w-[75vw] h-[75vw] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-liquid-3"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[60vw] h-[60vw] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[70px] opacity-80 animate-liquid-4"></div>
      
      {/* 絵の具のしずく・ガラス玉 */}
      <div className="absolute top-[25%] left-[15%] w-8 h-10 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.4),2px_5px_10px_rgba(0,0,0,0.1)] opacity-80 animate-drop" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-[15%] right-[25%] w-5 h-5 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.5),2px_4px_8px_rgba(0,0,0,0.1)] opacity-70 animate-float-roll" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[35%] right-[15%] w-12 h-14 bg-gradient-to-b from-pink-300 to-pink-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.5),3px_6px_12px_rgba(0,0,0,0.1)] opacity-80 animate-drop" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute top-[50%] left-[8%] w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.5),2px_4px_8px_rgba(0,0,0,0.1)] opacity-70 animate-float-roll" style={{ animationDelay: '2.2s' }}></div>
      <div className="absolute bottom-[15%] left-[30%] w-8 h-10 bg-gradient-to-b from-purple-300 to-purple-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-3px_-3px_5px_rgba(255,255,255,0.4),2px_5px_10px_rgba(0,0,0,0.1)] opacity-80 animate-drop" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[75%] right-[35%] w-4 h-4 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.5),1px_3px_6px_rgba(0,0,0,0.1)] opacity-70 animate-float-roll" style={{ animationDelay: '1.2s' }}></div>
    </div>
  );
}
