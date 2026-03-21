"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Copy, Check, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Translations {
  title: string;
  inputPlaceholder: string;
  generate: string;
  generating: string;
  result: string;
  copy: string;
  copied: string;
  templates: {
    summarize: string;
    translate: string;
    rewrite: string;
  };
}

interface AIGenerateClientProps {
  translations: Translations;
}

const TEMPLATE_PROMPTS = {
  summarize: "Please summarize the following text concisely:\n\n",
  translate: "Please translate the following text to English:\n\n",
  rewrite:
    "Please rewrite the following text to make it clearer and more professional:\n\n",
};

export function AIGenerateClient({ translations: t }: AIGenerateClientProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Generation failed");
      }

      const data = await res.json();
      setResult(data.text ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function applyTemplate(key: keyof typeof TEMPLATE_PROMPTS) {
    setPrompt(TEMPLATE_PROMPTS[key]);
    setResult("");
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
        </div>
      </div>

      {/* Template chips */}
      <div className="flex flex-wrap gap-2">
        {(["summarize", "translate", "rewrite"] as const).map((key) => (
          <button
            key={key}
            onClick={() => applyTemplate(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              "hover:bg-muted hover:border-muted-foreground/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <Wand2 className="size-3" />
            {t.templates[key]}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="sr-only">Prompt input</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.inputPlaceholder}
            rows={5}
            className="resize-none"
            disabled={isLoading}
            aria-label={t.inputPlaceholder}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {t.generate}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Result Card */}
      {result && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t.result}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                aria-label={copied ? t.copied : t.copy}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-green-500" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    {t.copy}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
