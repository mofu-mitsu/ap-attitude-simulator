import React from 'react';
import { motion } from 'motion/react';
import { MessageData } from '../types';

interface ChatBubbleProps {
  message: MessageData;
  key?: React.Key;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="h-10 min-w-[2.5rem] px-2 rounded-full glass flex items-center justify-center text-sm font-bold shadow-sm mr-3 flex-shrink-0 text-slate-600">
          {message.sender === 'system' ? '💻' : message.sender}
        </div>
      )}
      
      <div className={`max-w-[75%] ${message.metadata?.isStamp ? '' : 'px-4 py-3 shadow-sm'} ${
        message.metadata?.isStamp
          ? 'bg-transparent text-6xl drop-shadow-md'
          : isUser 
            ? 'bg-blue-500 text-white rounded-2xl rounded-tr-sm' 
            : 'glass bg-white/70 text-slate-800 rounded-2xl rounded-tl-sm'
      }`}>
        {message.metadata?.isStamp ? (
          <div className="animate-bounce">{message.text}</div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {message.text}
          </p>
        )}
      </div>
    </motion.div>
  );
}
