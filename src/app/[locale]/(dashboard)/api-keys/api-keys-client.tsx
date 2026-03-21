"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound, Plus, Trash2, Copy, Check, Loader2, Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

interface Translations {
  title: string;
  create: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  delete: string;
  deleteConfirm: string;
  created: string;
  copyKey: string;
  never: string;
  namePlaceholder: string;
  creating: string;
  noKeys: string;
  copied: string;
  copyKeyWarning: string;
}

interface APIKeysClientProps {
  initialKeys: ApiKeyItem[];
  translations: Translations;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function APIKeysClient({ initialKeys, translations: t }: APIKeysClientProps) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ id: string; key: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed || isCreating) return;

    setIsCreating(true);
    setCreateError(null);
    setNewlyCreatedKey(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create key");
      }

      const data = await res.json();
      setNewlyCreatedKey({ id: data.id, key: data.key, name: data.name });
      setNewName("");

      // 添加到列表（只显示前缀）
      setKeys((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          keyPrefix: data.key.slice(0, 10) + "...",
          lastUsedAt: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/keys?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setKeys((prev) => prev.filter((k) => k.id !== id));
      setConfirmDeleteId(null);
      if (newlyCreatedKey?.id === id) setNewlyCreatedKey(null);
    } catch {
      // silently fail — could add toast here
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <KeyRound className="size-4" />
        </div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
      </div>

      {/* Create form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.create}</CardTitle>
          <CardDescription className="text-xs">
            {t.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.namePlaceholder}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              disabled={isCreating}
              className="flex-1"
              aria-label={t.name}
            />
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || isCreating}
              className="gap-1.5 shrink-0"
            >
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t.creating}
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  {t.create}
                </>
              )}
            </Button>
          </div>
          {createError && (
            <p className="mt-2 text-xs text-destructive">{createError}</p>
          )}
        </CardContent>
      </Card>

      {/* Newly created key — show full key once */}
      {newlyCreatedKey && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="size-4 shrink-0" />
            <span className="text-sm font-medium">{t.created}</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            {t.copyKeyWarning}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 rounded bg-amber-100 dark:bg-amber-900/40 px-3 py-2 text-xs font-mono break-all text-amber-900 dark:text-amber-200">
              {newlyCreatedKey.key}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(newlyCreatedKey.key, "new")}
              className="shrink-0 gap-1.5"
            >
              {copiedId === "new" ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  {t.copyKey}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Keys list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="size-4" />
            {t.key}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
              <KeyRound className="size-8 opacity-30" />
              <p className="text-sm">{t.noKeys}</p>
            </div>
          ) : (
            <div className="divide-y">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {k.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <code className="text-xs text-muted-foreground font-mono">
                        {k.keyPrefix}
                      </code>
                      <span className="text-xs text-muted-foreground">
                        {t.createdAt}: {formatDate(k.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.lastUsed}:{" "}
                        {k.lastUsedAt ? formatDate(k.lastUsedAt) : t.never}
                      </span>
                    </div>
                  </div>

                  {/* Delete button / confirm */}
                  {confirmDeleteId === k.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-destructive">
                        {t.deleteConfirm}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(k.id)}
                        disabled={deletingId === k.id}
                        className="h-7 text-xs"
                      >
                        {deletingId === k.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          t.delete
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDeleteId(k.id)}
                      className={cn(
                        "shrink-0 h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      )}
                      aria-label={t.delete}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
