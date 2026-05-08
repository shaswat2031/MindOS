# MindOS Pricing & Upgrade Logic

This document outlines how MindOS handles plan access, billing cycles, and prorated upgrades.

## 1. Plan Hierarchy & Pricing
MindOS operates on a 3-tier subscription model:

- **Essential (Free)**: ₹0
- **Elite**: ₹49/month
- **Growth**: ₹99/month

## 2. Feature Access Control
Features are gated based on the user's `plan` field in their profile.
- **Essential**: Limited to 3 reflections/month and basic analysis.
- **Elite**: Unlimited reflections and weekly reports.
- **Growth**: Everything in Elite + Multiple AI Mentors and Advanced Success Meter.

## 3. Prorated Upgrade Logic
When a user upgrades from a lower-priced plan to a higher-priced plan (e.g., Elite to Growth) in the middle of a billing cycle, they are only charged the **difference amount** for the remaining days of that cycle.

### Calculation Formula:
```
Difference = (Target Plan Price - Current Plan Price)
Days Left = Days remaining until nextBillingDate
Total Days = 30 (Standard billing period)

Prorated Amount = (Difference * Days Left) / Total Days
```

### Example:
- **Current Plan**: Elite (₹49)
- **Target Plan**: Growth (₹99)
- **Days Left**: 15 days
- **Calculation**: (99 - 49) * (15 / 30) = ₹25
- **Result**: The user pays ₹25 immediately, and their plan is upgraded to Growth. Their `nextBillingDate` remains the same.

## 4. Billing Cycle Management
- **Subscription Start**: Set when the user first upgrades from Free to a paid plan.
- **Renewal**: Users are automatically charged the full price of their active plan on their `nextBillingDate`.
- **Downgrades**: If a user selects a lower-priced plan, it is stored in `pendingDowngradeTo`. The downgrade only takes effect after the current `nextBillingDate` has passed, ensuring the user gets the full value of what they already paid for.
- **Immediate Upgrades**: Upgrades happen instantly, and the user pays a prorated difference for the remaining days of the current cycle.

## 5. Implementation Files
- **Backend Logic**: `src/app/api/user/upgrade/route.js`
- **Frontend Display**: `src/components/Pricing.jsx`
- **Data Model**: `src/lib/models.js` (User Profile Schema)
