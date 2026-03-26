"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(authError.message ?? tCommon("error"));
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGitHubSignIn() {
    setError(null);
    setIsGitHubLoading(true);

    const { error: authError } = await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(authError.message ?? tCommon("error"));
      setIsGitHubLoading(false);
    }
    // OAuth 会重定向，不需要手动 push
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* GitHub OAuth */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGitHubSignIn}
          disabled={isGitHubLoading || isLoading}
        >
          {isGitHubLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Github className="size-4" />
          )}
          {t("continueWithGitHub")}
        </Button>

        {/* 分割线 */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            {t("orContinueWith")}
          </span>
          <Separator className="flex-1" />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 邮箱密码表单 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="mt-1 w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("signingIn")}
              </>
            ) : (
              t("signIn")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        {t("noAccount")}&nbsp;
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {t("signUp")}
        </Link>
      </CardFooter>
    </Card>
  );
}
