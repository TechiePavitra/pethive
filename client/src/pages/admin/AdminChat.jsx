import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { Send, User as UserIcon, Shield, Trash2, Bold, Italic, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConfirmModal from '../../components/ConfirmModal';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
      const res = await api.get('/admin/messages', { withCredentials: true });
      // Ideally check diff to avoid jitter, but direct set is mostly fine for text
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      await api.post('/admin/messages', { content: newMessage }, { withCredentials: true });
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
        title: 'Delete Message?',
        message: 'This action cannot be undone.',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete(`/admin/messages/${id}`, { withCredentials: true });
                fetchMessages();
            } catch(e) { alert("Failed to delete"); }
        }
    });
  };

  const handleClearAll = () => {
    setConfirmModal({
        isOpen: true,
        title: 'Clear All History?',
        message: 'This will permanently delete ALL messages for ALL users. This cannot be undone.',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete(`/admin/messages`, { withCredentials: true });
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

      <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ... existing content ... */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Customer Support Chat
        </h2>
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
            Live Updates
            </span>
            <button 
                onClick={handleClearAll}
                className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Clear Entire Chat History"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No messages yet.</div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'} group`}
            >
              <div 
                className={`max-w-[70%] rounded-2xl p-4 shadow-sm relative ${
                  msg.isAdmin 
                    ? 'bg-amber-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                {/* Delete Button (visible on hover) */}
                <button 
                    onClick={() => handleDelete(msg.id)}
                    className={`absolute -top-2 ${msg.isAdmin ? '-left-8' : '-right-8'} p-1 text-gray-300 hover:text-red-500 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 mb-1 opacity-80 text-xs">
                  {msg.isAdmin ? (
                    <span className="font-bold flex items-center gap-1">You <Shield className="w-3 h-3" /></span>
                  ) : (
                    <span className="font-bold flex items-center gap-1">
                      {msg.user?.name || 'Customer'} <UserIcon className="w-3 h-3" />
                    </span>
                  )}
                  <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-sm leading-relaxed override-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({...props}) => <p className="mb-1 last:mb-0" {...props} />,
                    a: ({...props}) => <a className="underline font-bold text-inherit" {...props} />,
                    ul: ({...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                    ol: ({...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                    strong: ({...props}) => <strong className="font-bold" {...props} />,
                    em: ({...props}) => <em className="italic" {...props} />,
                    code: ({...props}) => <code className="bg-black/20 rounded px-1 py-0.5 font-mono text-xs" {...props} />,
                  }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        {/* Toolbar */}
        <div className="flex gap-2 mb-2 px-1">
            <button type="button" onClick={() => insertFormat('**', '**')} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-amber-500" title="Bold">
                <Bold className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => insertFormat('*', '*')} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-amber-500" title="Italic">
                <Italic className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => insertFormat('`', '`')} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-amber-500" title="Code">
                <Code className="w-3 h-3" />
            </button>
        </div>

        <form onSubmit={handleSend} className="flex gap-4">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 focus:bg-white transition-all"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AdminChat;
