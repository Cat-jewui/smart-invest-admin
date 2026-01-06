import React, { useEffect, useState, useRef } from 'react';
import { Send, User } from 'lucide-react';
import io from 'socket.io-client';
import { getChatRooms } from '../services/api';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Socket.IO 연결
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);
    
    // 실제 대화방 목록 API 호출
    getChatRooms()
      .then((res) => {
        const list = res.data?.rooms || [];
        setRooms(list);
      })
      .catch((err) => {
        console.error('Failed to load chat rooms:', err);
      });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      if (message.roomId === selectedRoom) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('previous_messages', (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off('new_message');
      socket.off('previous_messages');
    };
  }, [socket, selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (roomId) => {
    setSelectedRoom(roomId);
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !selectedRoom) return;

    socket.emit('send_message', {
      roomId: selectedRoom,
      senderType: 'ADMIN',
      senderName: 'BMS개발자',
      message: inputMessage
    });

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold mb-2">고객상담</h1>
        <p className="text-gray-400">실시간 채팅으로 고객과 소통하세요</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-80px)]">
        {/* Chat Rooms List */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-dark-card border border-dark-border rounded-xl h-full flex flex-col">
            <div className="p-4 border-b border-dark-border">
              <h3 className="text-white font-semibold">대화 목록</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  className={`p-4 border-b border-dark-border cursor-pointer transition-colors ${
                    selectedRoom === room.id 
                      ? 'bg-blue-600/20 border-l-4 border-l-blue-500' 
                      : 'hover:bg-dark-bg/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium truncate">{room.userName}</h4>
                        {room.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">{room.lastMessage}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(room.updatedAt).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-dark-card border border-dark-border rounded-xl h-full flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {rooms.find(r => r.id === selectedRoom)?.userName}
                      </h3>
                      <p className="text-green-500 text-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        온라인
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        msg.senderType === 'ADMIN' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-dark-bg text-gray-300'
                      } rounded-2xl px-4 py-3`}>
                        <p className="text-sm mb-1">{msg.message}</p>
                        <p className={`text-xs ${
                          msg.senderType === 'ADMIN' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-dark-border">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="메시지를 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
                      className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white resize-none focus:border-blue-500 focus:outline-none"
                      rows={2}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400">대화를 선택하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
