import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { Send, User as UserIcon, Shield, Trash2, Bold, Italic, Code, Loader2, MessageSquare, History, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConfirmModal from '../../components/ConfirmModal';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      await api.post('/admin/messages', { content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    onConfirm: () => {}, 
    title: '', 
    message: '',
    isDanger: false 
  });

  const handleDelete = (id) => {
    setConfirmModal({
        isOpen: true,
        title: 'Expunge Message?',
        message: 'This message will be permanently removed from the record.',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete(`/admin/messages/${id}`);
                fetchMessages();
            } catch(e) { alert("Failed to delete"); }
        }
    });
  };

  const handleClearAll = () => {
    setConfirmModal({
        isOpen: true,
        title: 'Wipe Chat History?',
        message: 'This will purge ALL communication records for ALL users. This action is irreversible.',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete(`/admin/messages/clear`);
                fetchMessages();
            } catch(e) { alert("Failed to clear chat"); }
        }
    });
  };

  const insertFormat = (prefix, suffix) => {
    const textarea = inputRef.current;
    if (!textarea) return;
    setNewMessage(prev => prev + `${prefix}text${suffix}`);
    textarea.focus();
  };

  if (initialLoading) return (
    <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
       <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
    </div>
  );

  return (
    <>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDanger={confirmModal.isDanger}
      />

      <div className="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Support Console</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Channel</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-100"
                  title="Purge History"
              >
                  <History className="w-4 h-4" />
                  Wipe History
              </button>
          </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Clear Channels</h3>
                <p className="font-bold text-slate-400">Waiting for incoming signals...</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-4 duration-300`}
              >
                <div className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  {/* Sender Info */}
                  <div className="flex items-center gap-2 mb-2 px-2">
                    {msg.isAdmin ? (
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                        System Admin <Shield className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                        {msg.user?.name || 'Customer Signal'} <UserIcon className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-300">• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Bubble */}
                  <div 
                    className={`relative p-5 rounded-[1.8rem] shadow-sm transition-all group-hover:shadow-md ${
                      msg.isAdmin 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {/* Tiny delete button */}
                    <button 
                        onClick={() => handleDelete(msg.id)}
                        className={`absolute -top-3 ${msg.isAdmin ? '-left-8' : '-right-8'} p-2 bg-white text-slate-300 hover:text-rose-500 border border-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm active:scale-90`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="text-sm leading-relaxed prose prose-invert overflow-hidden">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        a: ({node, ...props}) => <a className="underline font-bold text-amber-400 hover:text-amber-300" {...props} />,
                        code: ({node, ...props}) => <code className="bg-white/10 rounded px-1.5 py-0.5 font-mono text-[10px] border border-white/5" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      }}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Dock */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <form onSubmit={handleSend} className="space-y-4">
             {/* Text Area Wrap */}
             <div className="relative group">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Transmit message to customer..."
                  className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-6 pr-24 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 min-h-[100px] shadow-sm resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                
                {/* Float Actions */}
                <div className="absolute right-6 bottom-6 flex items-center gap-2">
                   <button 
                    type="submit" 
                    disabled={!newMessage.trim() || loading}
                    className="w-12 h-12 bg-slate-900 border-4 border-white hover:bg-amber-500 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 group/btn"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />}
                  </button>
                </div>
                
                {/* Formatting Bar */}
                <div className="absolute left-8 bottom-6 flex items-center gap-1">
                    <button type="button" onClick={() => insertFormat('**', '**')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-indigo-500 transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('*', '*')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-indigo-500 transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('`', '`')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-indigo-500 transition-colors" title="Code"><Code className="w-3.5 h-3.5" /></button>
                </div>
             </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminChat;
