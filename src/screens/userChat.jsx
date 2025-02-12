import React, { useState } from 'react';

export default function UserChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            // Simulate bot response
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: 'This is a bot response', sender: 'bot' }]);
            }, 1000);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-1/4 bg-white shadow p-4">
                <h2 className="text-lg font-semibold">Sidebar</h2>
                {/* Add sidebar content here */}
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-white shadow">
                    <h1 className="text-xl font-semibold">Hi, I'm DeepSeek.</h1>
                    <button className="text-blue-500">New chat</button>
                </header>
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`my-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-green-100' : 'bg-gray-200'}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="flex p-2 border-t border-gray-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message DeepSeek"
                        className="flex-1 p-2 rounded-lg border border-gray-300"
                    />
                    <button onClick={handleSend} className="ml-2 p-2 rounded-lg bg-blue-500 text-white border-none">Send</button>
                    <button className="ml-2 p-2 rounded-lg bg-gray-200">Search</button>
                </div>
            </div>
        </div>
    );
}
