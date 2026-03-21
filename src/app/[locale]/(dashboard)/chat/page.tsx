import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { ChatClient } from "./chat-client";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("ai.chat");

  const translations = {
    title: t("title"),
    placeholder: t("placeholder"),
    send: t("send"),
    clear: t("clear"),
    emptyState: t("emptyState"),
    thinking: t("thinking"),
    you: t("you"),
    assistant: t("assistant"),
  };

  return <ChatClient translations={translations} />;
}
