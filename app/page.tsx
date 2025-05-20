"use client"; // šis norāda, ka app darbojas browserī un var pievienot interaktīvas komponentes (otrs variants ir No Directive, kas darbojas uz servera un ir statiskas komponenetes)

import { useState } from "react"; // importēts 'useStare' (React rīks), kas ļauj atcerēties dažādas lietas aplikācijai
import ChatMessage from "@/components/ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<number[] | null>(null);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message to chat
    const newUserMessage: Message = { role: "user", content: userMessage };
    const updatedMessages: Message[] = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          contextData: context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      // Add bot response to chat
      const botMessage: Message = { role: "assistant", content: data.response };
      setMessages([...updatedMessages, botMessage]);
      
      // Save context for the next message
      if (data.context) {
        setContext(data.context);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Logo un virsraksts */}
      <div className="flex flex-col items-center">
        <img src="/logo12.png" alt="Rīgas Dome Logo" className="h-14 mb-1" />
        <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Rīgas pašvaldības klientu atbalsta asistents
        </h1>
      </div>
  
      {/* Čata logs un forma kopā */}
      <div className="w-full max-w-5xl bg-white rounded-lg shadow p-4 flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
        {/* Čata logs */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2 mb-4">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">Uzsāc sarunu...</p>
          )}
          {messages.map((msg, i) => (
            <ChatMessage 
              key={i} 
              message={msg.content} 
              isUser={msg.role === "user"} 
            />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center mt-2">
              <div className="animate-pulse">Domāju...</div>
            </div>
          )}
        </div>
  
        {/* Forma */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Uzdod sev interesējošo jautājumu..."
            className="flex-1 p-2 rounded border border-gray-300 text-gray-900"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isLoading 
                ? "bg-blue-300 px-4 py-2 rounded cursor-not-allowed" 
                : "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            Nosūtīt
          </button>
        </form>
      </div>
  
      {/* Footer */}
      <footer className="w-full bg-gray-200 text-gray-700 px-6 py-3 text-sm mt-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          {/* Kreisā kolonna */}
          <div>
            <p className="font-semibold mb-1">Rīgas Apkaimju iedzīvotāju centrs</p>
            <p>Adrese: Brīvības iela 49–53, Centra rajons, Rīga, LV-1010</p>
            <div className="mt-2">
              <p><strong>Kontakti:</strong></p>
              <p>aic@riga.lv</p>
              <p>‪+371 80000800‬</p>
            </div>
          </div>
           {/* Labā kolonna */}
          <div>
            <p className="font-semibold mb-2">Darba laiks:</p>
            <p><strong>Pirmdiena:</strong> 08–19</p>
            <p><strong>Otrdiena:</strong> 08–18</p>
            <p><strong>Trešdiena:</strong> 08–18</p>
            <p><strong>Ceturtdiena:</strong> 08–19</p>
            <p><strong>Piektdiena:</strong> 08–17</p>
            <p><strong>Sestdiena:</strong> Slēgts</p>
            <p><strong>Svētdiena:</strong> Slēgts</p>
          </div>
        </div>
      </footer>
    </div>
  );
  

}


/*import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}*/
