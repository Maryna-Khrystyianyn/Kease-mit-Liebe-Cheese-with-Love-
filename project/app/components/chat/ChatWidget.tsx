"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import { User } from "@/types/global";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // { role: 'user' | 'bot', text: string }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    async function loadUser() {
      const res = await fetch(`${baseUrl}/api/me`, { cache: "no-store" });
      const data = await res.json();
      setUser(data.user as User);
    }
    loadUser();
  }, [baseUrl]);

const gastNickName=`gast-${Math.floor(Math.random()*100)}`



  // автоскрол донизу
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://kease-bot-4103.fly.dev/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user_id: user?.nick_name||gastNickName,          
    message: userMessage.text 
  }),
});

      const data = await res.json();

      const botMessage: Message = {
        role: "bot",
        text: data.answer || "Entschuldigung, ich habe keine Antwort erhalten.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Fehler beim Verbinden mit dem Server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const closeChat = () => {
    setOpen(false);
    setMessages([]); // історія зникає при закритті
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] ">
      {/* Кнопка відкриття */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--orange) text-white flex items-center justify-center shadow-lg animate-bounce hover:scale-105 transition"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Модальне вікно */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-(--bg) rounded-2xl main-shadow flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-(--olive_bright) text-white">
            <div className="font-semibold">🧀 Käse mit Liebe Assistent</div>
            <button onClick={closeChat}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Повідомлення */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-(--gray)">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap $
                  ${
                    m.role === "user"
                      ? "ml-auto bg-(--olive) rounded-br-none"
                      : "mr-auto bg-(--bg) border border-(--olive_bright) rounded-bl-none"
                  }
                `}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="mr-auto flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Schreib...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-(--olive_bright) flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Schreib deine Frage..."
              className="flex-1 border border-(--olive_bright) rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-(--olive_bright) text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Senden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
