import { describe, it, expect } from "vitest";
import { siteConfig, pricingPlans } from "./site";

describe("siteConfig", () => {
  it("has required fields", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
    expect(siteConfig.email.from).toBeTruthy();
  });
});

describe("pricingPlans", () => {
  it("has free and pro plans", () => {
    expect(pricingPlans).toHaveLength(2);
    expect(pricingPlans[0].id).toBe("free");
    expect(pricingPlans[1].id).toBe("pro");
  });

  it("free plan has zero price", () => {
    expect(pricingPlans[0].price.monthly).toBe(0);
    expect(pricingPlans[0].price.yearly).toBe(0);
  });

  it("pro plan has popular flag", () => {
    expect(pricingPlans[1].popular).toBe(true);
  });

  it("pro yearly is cheaper than 12x monthly", () => {
    const pro = pricingPlans[1];
    expect(pro.price.yearly).toBeLessThan(pro.price.monthly * 12);
  });
});
