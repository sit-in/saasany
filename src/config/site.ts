export const siteConfig = {
  name: "Sassany",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description: "Build your AI SaaS product in a weekend",
  links: {
    github: "https://github.com/sassany",
    twitter: "https://twitter.com/sassany",
    discord: "https://discord.gg/sassany",
  },
  creator: "Sassany",
  keywords: [
    "AI",
    "SaaS",
    "Next.js",
    "Template",
    "Boilerplate",
    "Starter Kit",
  ],
};

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Get started for free",
    price: { monthly: 0, yearly: 0 },
    stripePriceId: { monthly: "", yearly: "" },
    features: [
      "5 AI generations per day",
      "Basic dashboard",
      "Community support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious builders",
    price: { monthly: 29, yearly: 290 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    },
    features: [
      "Unlimited AI generations",
      "Advanced dashboard",
      "Priority support",
      "API access",
      "Custom branding",
    ],
    popular: true,
  },
] as const;
