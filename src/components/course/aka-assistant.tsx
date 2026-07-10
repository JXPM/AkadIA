"use client";

import { useRef, useState } from "react";
import { Bot, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Explique-moi ce concept simplement",
  "Donne-moi une analogie",
  "Crée une fiche mémo",
];

export function AkaAssistant({ context }: { context?: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis AKA, votre assistant pédagogique. Posez-moi une question sur cette leçon !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const contenu = acc;
        setMessages((m) =>
          m.map((msg, i) =>
            i === m.length - 1 ? { role: "assistant" as const, content: contenu } : msg
          )
        );
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
      }
    } catch {
      setMessages((m) =>
        m.map((msg, i) =>
          i === m.length - 1
            ? {
                role: "assistant" as const,
                content:
                  "Désolé, je suis momentanément indisponible. Réessaie dans un instant. 🙏",
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <span className="grid size-8 place-items-center rounded-lg gradient-brand text-white">
          <Bot className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">AKA</p>
          <p className="text-xs text-muted-foreground">Assistant pédagogique IA</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm",
                m.role === "user"
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {m.content || (loading && <Loader2 className="size-4 animate-spin" />)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent disabled:opacity-50"
            >
              <Sparkles className="size-3" /> {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" variant="brand" size="icon" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
