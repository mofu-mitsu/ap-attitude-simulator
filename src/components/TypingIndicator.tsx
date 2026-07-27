import { motion } from 'motion/react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex w-full mb-4 justify-start"
    >
      <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-xl shadow-sm mr-3 text-gray-400">
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="glass bg-white/70 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
        <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
        <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
        <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
      </div>
    </motion.div>
  );
}
