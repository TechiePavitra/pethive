import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Trash2, Edit2, MoreVertical, Bold, Italic, Code, Terminal } from 'lucide-react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Poll for messages when open
  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  // Auto-scroll
  useEffect(() => {
    // Only scroll if not editing to avoid jumping
    if (!editingId) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, editingId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      // Only update if changes to avoid re-renders interrupting edit?
      // For simplicity in this demo, strict update.
      setMessages(res.data);
    } catch (error) {
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/messages/${editingId}`, { content: newMessage });
        setEditingId(null);
      } else {
        await api.post('/messages', { content: newMessage });
      }
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send');
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

  const handleClear = () => {
    setConfirmModal({
        isOpen: true,
        title: 'Clear Chat History?',
        message: 'This will delete all your messages. This cannot be undone.',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete('/messages');
                setMessages([]);
            } catch(e) { alert('Failed to clear'); }
        }
    });
  };

  const handleDelete = (id) => {
    setConfirmModal({
        isOpen: true,
        title: 'Delete Message?',
        message: 'Are you sure you want to delete this message?',
        isDanger: true,
        onConfirm: async () => {
            try {
                await api.delete(`/messages/${id}`);
                fetchMessages();
            } catch(e) {}
        }
    });
  };

  const handleEdit = (msg) => {
      setEditingId(msg.id);
      setNewMessage(msg.content);
      inputRef.current?.focus();
  };

  const insertFormat = (prefix, suffix) => {
      const textarea = inputRef.current; 
      if (!textarea) return;
      setNewMessage(prev => prev + `${prefix}text${suffix}`);
      textarea.focus();
  };
   
  if (!user || user.role === 'admin') return null; 

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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* ... (rest of ChatWidget content) ... */}
        {isOpen && (
          <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <div className="flex flex-col">
                    <span className="font-bold leading-tight">Support Chat</span>
                    <span className="text-[10px] opacity-80">Markdown Supported</span>
                </div>
              </div>
              <div className="flex gap-2">
                  <button onClick={handleClear} className="hover:bg-white/20 p-1 rounded-lg" title="Clear All">
                      <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                      <Minimize2 className="w-4 h-4" />
                  </button>
              </div>
            </div>
  
            <div className="h-80 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
               {messages.length === 0 ? (
                   <div className="text-center text-gray-400 mt-10 text-sm">
                       <p>👋 Hi {user.name}!</p>
                       <p>How can we help you today?</p>
                   </div>
               ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${!msg.isAdmin ? 'justify-end' : 'justify-start'} group max-w-full`}>
                      <div className="flex items-end gap-2 max-w-[85%]">
                          {!msg.isAdmin && (
                              <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                                  <button onClick={() => handleEdit(msg)} className="text-gray-400 hover:text-amber-500"><Edit2 className="w-3 h-3" /></button>
                                  <button onClick={() => handleDelete(msg.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                          )}
                          <div 
                          className={`rounded-2xl p-3 text-sm shadow-sm break-words overflow-hidden w-full ${
                              !msg.isAdmin 
                              ? 'bg-amber-500 text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          }`}
                          >
                          {/* Explicit styles for markdown elements because Tailwind reset clears them */}
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                              p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                              a: ({node, ...props}) => <a className="underline font-bold text-inherit" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                              em: ({node, ...props}) => <em className="italic" {...props} />,
                              code: ({node, ...props}) => <code className="bg-black/20 rounded px-1 py-0.5 font-mono text-xs" {...props} />,
                          }}>
                              {msg.content}
                          </ReactMarkdown>
                          <div className={`text-[10px] mt-1 ${!msg.isAdmin ? 'text-amber-100' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          </div>
                      </div>
                    </div>
                  ))
               )}
               <div ref={bottomRef} />
            </div>
  
            <div className="p-3 bg-white border-t border-gray-100">
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
              
              <form onSubmit={handleSend} className="flex gap-2">
                <div className="flex-1 relative">
                  <input 
                      ref={inputRef}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={loading}
                  />
                  {editingId && (
                      <button 
                          type="button" 
                          onClick={() => { setEditingId(null); setNewMessage(''); }} 
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded-full text-gray-600"
                      >
                          Cancel
                      </button>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || loading}
                  className={`text-white p-2 rounded-xl transition-colors ${editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600 disabled:opacity-50'}`}
                >
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        )}
  
        {/* Floating Button */}
        {!isOpen && (
            <button 
              onClick={() => setIsOpen(true)}
              className="bg-amber-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-amber-600 transition-all hover:scale-110 active:scale-95 group"
            >
              <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
