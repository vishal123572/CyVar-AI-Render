import { API_URL } from "../api";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  IndianRupee,
  BrainCircuit,
} from "lucide-react";

function Copilot() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! I'm CyVar Copilot. Ask me about your current cyber risk, vulnerabilities, financial exposure, ML predictions, security controls, or general cybersecurity questions.",
    },
  ]);

  const bottomRef = useRef(null);

  // ==================================================
  // AUTO SCROLL
  // ==================================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  // ==================================================
  // SEND MESSAGE TO OLLAMA THROUGH FASTAPI
  // ==================================================

  const sendMessage = async (text = input) => {
    const question = text.trim();

    if (!question || sending) {
      return;
    }

    // Show user message immediately
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setSending(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/copilot`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Copilot API returned ${response.status}`
        );
      }

      const result = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            result.answer ||
            "I couldn't generate a response.",
          model: result.model,
          provider: result.provider,
        },
      ]);
    } catch (err) {
      console.error("CyVar Copilot error:", err);

      setError(
        "Unable to connect to CyVar Copilot. Make sure FastAPI and Ollama are running."
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            "I couldn't connect to the CyVar AI service. Please make sure the backend and Ollama are running.",
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // ==================================================
  // SUGGESTED QUESTIONS
  // ==================================================

  const suggestions = [
    {
      text: "What is our biggest financial risk?",
      icon: ShieldAlert,
    },
    {
      text: "What is our Expected Annual Loss?",
      icon: IndianRupee,
    },
    {
      text: "Why is WEB-001 risky?",
      icon: TrendingUp,
    },
    {
      text: "How can we reduce our cyber risk?",
      icon: Sparkles,
    },
  ];

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">

      {/* HEADER */}

      <div className="mb-5">
        <p className="text-sm text-cyan-400 font-medium">
          AI CYBER RISK ASSISTANT
        </p>

        <h1 className="text-3xl font-bold mt-1">
          CyVar Copilot
        </h1>

        <p className="text-slate-400 mt-2">
          Ask questions about cyber risk, vulnerabilities,
          financial exposure, ML predictions and security
          recommendations.
        </p>
      </div>

      {/* STATUS BAR */}

      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-4">

        <div className="flex items-center gap-3">

          <div className="relative">

            <Bot
              size={22}
              className="text-cyan-400"
            />

            <span className="absolute -right-1 -bottom-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900" />

          </div>

          <div>

            <p className="text-sm font-medium">
              CyVar AI Risk Assistant
            </p>

            <p className="text-xs text-slate-500">
              Ollama • llama3.2:3b • Local AI
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <BrainCircuit
            size={16}
            className="text-purple-400"
          />

          <span className="text-xs text-purple-300 bg-purple-950/30 border border-purple-900/50 px-3 py-1 rounded-full">
            AI ACTIVE
          </span>

        </div>

      </div>

      {/* CHAT CONTAINER */}

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">

        {/* MESSAGE AREA */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* SUGGESTIONS */}

          {messages.length === 1 && (
            <div className="mb-7">

              <p className="text-xs text-slate-500 mb-3">
                SUGGESTED QUESTIONS
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {suggestions.map(
                  ({ text, icon: Icon }) => (

                    <button
                      key={text}
                      onClick={() =>
                        sendMessage(text)
                      }
                      disabled={sending}
                      className="text-left bg-slate-950 border border-slate-800 hover:border-cyan-800 rounded-lg p-4 transition disabled:opacity-50"
                    >

                      <Icon
                        size={17}
                        className="text-cyan-400 mb-3"
                      />

                      <p className="text-sm">
                        {text}
                      </p>

                    </button>

                  )
                )}

              </div>

            </div>
          )}

          {/* MESSAGES */}

          <div className="space-y-5">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {/* ASSISTANT ICON */}

                {message.role === "assistant" && (

                  <div className="w-9 h-9 shrink-0 rounded-lg bg-cyan-950/50 flex items-center justify-center">

                    <Bot
                      size={18}
                      className="text-cyan-400"
                    />

                  </div>

                )}

                {/* MESSAGE */}

                <div
                  className={`max-w-[75%] rounded-xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-cyan-500 text-slate-950"
                      : message.error
                      ? "bg-red-950/30 border border-red-900 text-red-200"
                      : "bg-slate-950 border border-slate-800 text-slate-300"
                  }`}
                >

                  <p className="text-sm leading-6 whitespace-pre-wrap">
                    {message.text}
                  </p>

                  {/* MODEL INFORMATION */}

                  {message.role === "assistant" &&
                    message.model && (

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">

                        <BrainCircuit
                          size={13}
                          className="text-purple-400"
                        />

                        <span className="text-[10px] text-slate-600">
                          {message.provider} •{" "}
                          {message.model}
                        </span>

                      </div>

                    )}

                </div>

                {/* USER ICON */}

                {message.role === "user" && (

                  <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center">

                    <User
                      size={17}
                      className="text-slate-300"
                    />

                  </div>

                )}

              </div>

            ))}

            {/* AI THINKING */}

            {sending && (

              <div className="flex gap-3 justify-start">

                <div className="w-9 h-9 shrink-0 rounded-lg bg-cyan-950/50 flex items-center justify-center">

                  <Bot
                    size={18}
                    className="text-cyan-400"
                  />

                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex gap-1">

                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />

                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:150ms]" />

                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />

                    </div>

                    <span className="text-xs text-slate-500">
                      CyVar Copilot is analyzing...
                    </span>

                  </div>

                </div>

              </div>

            )}

            <div ref={bottomRef} />

          </div>

        </div>

        {/* INPUT AREA */}

        <div className="border-t border-slate-800 p-4">

          {error && (

            <p className="text-xs text-red-400 mb-3">
              {error}
            </p>

          )}

          <div className="flex gap-3">

            <input
              type="text"
              value={input}
              disabled={sending}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !sending
                ) {
                  sendMessage();
                }

              }}
              placeholder={
                sending
                  ? "CyVar Copilot is thinking..."
                  : "Ask CyVar anything about cybersecurity..."
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-cyan-500 disabled:opacity-60"
            />

            <button
              onClick={() => sendMessage()}
              disabled={
                sending ||
                input.trim() === ""
              }
              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 px-5 rounded-lg transition"
            >

              <Send size={19} />

            </button>

          </div>

          <div className="flex items-center justify-between mt-3">

            <p className="text-[11px] text-slate-600">
              Powered locally by Ollama • Grounded in
              current CyVar risk data
            </p>

            <p className="text-[11px] text-slate-600">
              Prototype AI Assistant
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Copilot;