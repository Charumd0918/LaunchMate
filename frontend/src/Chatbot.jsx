import { useState, useRef, useEffect } from "react";
import api from "./api";
import { motion, AnimatePresence } from "framer-motion";

function Chatbot({ idea }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await api.post("/chat", {
        idea: idea,
        message: inputValue,
        history: messages
      });

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: response.data.reply }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Strategic Node Offline. Please retry analysis." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Network interruption in strategy core." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-[9999]">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center text-2xl border border-purple-400/30"
          >
            🤖
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[350px] h-[520px] flex flex-col glass-card rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600/30 via-indigo-900/10 to-transparent border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow"></span>
                  Strategic Co-Founder
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Active Audit: {idea?.substring(0,25)}...</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([])}
                  title="Clear Conversation"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-500 transition-colors"
                >
                  🔄
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#05000a] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent)]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-4">📜</div>
                  <h4 className="text-white font-bold text-sm mb-2">Audit Intelligence Activated</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Ask me for data-driven insights, tactical pivots, or market feedback regarding your venture.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-sm shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
                        : "glass-panel text-gray-300 rounded-tl-sm border-white/10"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass-panel text-gray-500 text-[11px] p-4 rounded-2xl font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-200"></span>
                    ANALYZING DATA...
                  </div>
                </motion.div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/60 border-t border-white/5 backdrop-blur-md">
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="w-full bg-white/[0.05] text-white border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 pr-16 transition-all placeholder:text-gray-600"
                  placeholder="Direct strategic query..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !inputValue.trim()}
                  className="absolute right-2 p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all disabled:opacity-30 flex items-center justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chatbot;
