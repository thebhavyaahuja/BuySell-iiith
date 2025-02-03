import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from "../Header.jsx";

export default function Support() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Send user query to backend
    async function handleSend() {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages([...messages, userMsg]);
        setInput('');
        
        try {
            const { data } = await axios.post('/chatbot', 
                {messages: [...messages, userMsg]},
                { withCredentials: true }
            );
            // data.reply represents AI response
            setMessages([...messages, userMsg, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error(error);
            alert('Chat request failed!');
        }
    }

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-blue-900">How can I help you today? :)</h1>
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4">
                    <div className="border border-gray-200 border-4 p-4 h-80 overflow-y-auto mb-4 rounded-lg" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-2 flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`px-2 py-1 ${msg.role === 'assistant' ? 'bg-gray-200 text-black rounded-lg' : 'rounded-lg bg-blue-800 text-white'}`}>
                                    {msg.content.replace(/\*/g, '\n')}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="border border-gray-200 border-4 flex-1 p-2 rounded-full"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-900 transition duration-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}