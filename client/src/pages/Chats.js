
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUserCircle, FaComments } from 'react-icons/fa';
import api from '../utils/api';
import { SOCKET_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';

const socket = io(SOCKET_URL);

const Chats = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.get('/chats').then((res) => {
      setChats(res.data);
      const chatIdParam = searchParams.get('chatId');
      if (chatIdParam) {
        const found = res.data.find((c) => c.id === parseInt(chatIdParam));
        if (found) openChat(found);
      }
    });
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages((prev) => {
        if (activeChat && msg.chatId === activeChat.id) {
          return [...prev, msg];
        }
        return prev;
      });
    });
    return () => socket.off('newMessage');
    // eslint-disable-next-line
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (chat) => {
    setActiveChat(chat);
    socket.emit('joinChat', chat.id);
    const res = await api.get('/chats/' + chat.id + '/messages');
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!text.trim() || !activeChat) return;
    socket.emit('sendMessage', { chatId: activeChat.id, senderId: user.id, content: text });
    setText('');
  };

  const getOtherUser = (chat) => (chat.user1Id === user.id ? chat.user2 : chat.user1);

  if (!user) {
    return <p className="text-center py-24 text-gray-500">Please log in to view your messages.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-dark mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
        <div className="card overflow-y-auto md:col-span-1">
          {chats.length === 0 && (
            <div className="text-center py-16 px-4">
              <FaComments size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No conversations yet. Message a seller to start chatting.</p>
            </div>
          )}
          {chats.map((chat) => {
            const other = getOtherUser(chat);
            return (
              <motion.button
                key={chat.id}
                whileHover={{ backgroundColor: '#f8fafc' }}
                onClick={() => openChat(chat)}
                className={'w-full text-left p-4 flex items-center gap-3 border-b border-gray-100 transition ' +
                  (activeChat?.id === chat.id ? 'bg-primary-50' : '')}
              >
                <FaUserCircle size={32} className="text-gray-400" />
                <span className="font-medium text-gray-700">{other?.name || 'User'}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="card md:col-span-2 flex flex-col">
          {activeChat ? (
            <>
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={'max-w-xs px-4 py-2 rounded-lg text-sm ' +
                        (msg.senderId === user.id
                          ? 'bg-primary-500 text-white ml-auto'
                          : 'bg-gray-100 text-gray-800')}
                    >
                      {msg.content}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-100 p-3 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="input-field flex-grow"
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage} className="btn-primary px-4">
                  <FaPaperPlane />
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-400 flex-col gap-2">
              <FaComments size={32} className="text-gray-300" />
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
