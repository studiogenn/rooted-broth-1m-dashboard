import { useState, useEffect, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  green: "#3D4A18", cream: "#F5EDD8", gold: "#C9961A", charcoal: "#1A1A1A",
  red: "#C23B22", orange: "#E8772E", blue: "#4A7C9B", purple: "#7B5EA7",
  teal: "#2A7A6E", pink: "#B5436B",
  bg: "#F9F7F4", card: "#fff", border: "#E8E4DE", soft: "#EEEBE6",
  muted: "#888", lightGreen: "#EEF2E6", lightRed: "#FEF0EE",
  lightOrange: "#FDF3EC", lightBlue: "#EAF1F7", lightPurple: "#F3EFF8",
  lightTeal: "#E8F5F2", lightPink: "#FBF0F4", lightGold: "#FDF6E7",
};

const DEPTS = {
  legal: { icon: "\u2696\uFE0F", label: "Legal", color: C.purple, bg: C.lightPurple },
  finance: { icon: "\uD83D\uDCCA", label: "Finance", color: C.blue, bg: C.lightBlue },
  product: { icon: "\uD83E\uDDEA", label: "Product", color: C.orange, bg: C.lightOrange },
  website: { icon: "\uD83C\uDF10", label: "Website", color: C.teal, bg: C.lightTeal },
  email: { icon: "\uD83D\uDCE7", label: "Email/SMS", color: C.gold, bg: C.lightGold },
  content: { icon: "\uD83D\uDCF1", label: "Content", color: C.red, bg: C.lightRed },
  paid: { icon: "\uD83D\uDCB0", label: "Paid Ads", color: C.pink, bg: C.lightPink },
  wholesale: { icon: "\uD83C\uDFEA", label: "Wholesale", color: C.green, bg: C.lightGreen },
  tiktok: { icon: "\uD83C\uDFB5", label: "TikTok Shop", color: C.charcoal, bg: "#F0F0F0" },
  auto: { icon: "\u2699\uFE0F", label: "Automations", color: C.blue, bg: C.lightBlue },
  growth: { icon: "\uD83D\uDE80", label: "Growth", color: C.purple, bg: C.lightPurple },
  pr: { icon: "\uD83D\uDCF0", label: "PR/Press", color: C.gold, bg: C.lightGold },
  grants: { icon: "\uD83C\uDFC6", label: "Grants", color: C.orange, bg: C.lightOrange },
  team: { icon: "\uD83D\uDC65", label: "Team", color: C.green, bg: C.lightGreen },
  amazon: { icon: "\uD83D\uDCE6", label: "Amazon", color: C.orange, bg: C.lightOrange },
  retail: { icon: "\uD83D\uDED2", label: "Retail", color: C.teal, bg: C.lightTeal },
  cx: { icon: "\uD83D\uDCAC", label: "CX", color: C.green, bg: C.lightGreen },
  brand: { icon: "\u2728", label: "Brand", color: C.pink, bg: C.lightPink },
};

const OWNERS = {
  D: { label: "Danielle", short: "D", color: C.red, bg: C.lightRed },
  H: { label: "Hire", short: "H", color: C.green, bg: C.lightGreen },
  B: { label: "Both", short: "B", color: C.orange, bg: C.lightOrange },
};

const PRIORITY = {
  critical: { label: "REVENUE CRITICAL", color: "#fff", bg: C.red },
  high: { label: "HIGH IMPACT", color: "#fff", bg: C.orange },
  medium: { label: "IMPORTANT", color: "#fff", bg: C.blue },
  low: { label: "FOUNDATION", color: "#fff", bg: C.purple },
};

// ─── HOLIDAY / SALES CALENDAR ───────────────────────────────────────────────
const HOLIDAYS = [
  // APRIL
  { date: "2026-04-01", name: "April Fools Day", type: "social", action: "Fun TikTok content: 'We made bone broth flavored ice cream' prank -> reveal real product", dept: "content" },
  { date: "2026-04-06", name: "National Broth Day", type: "major", action: "MAJOR SALES EVENT: 20% off sitewide, email blast, SMS blast, TikTok LIVE, affiliate push, all ads point here. This is YOUR holiday.", dept: "email" },
  { date: "2026-04-12", name: "Easter", type: "cultural", action: "Easter brunch angle: 'Start your Easter with a ritual.' Gift basket bundles. Family-size variety pack promo", dept: "email" },
  { date: "2026-04-22", name: "Earth Day", type: "values", action: "Sustainability angle: highlight eco packaging, Action Against Hunger partnership. Donate $1/order to AAH. PR pitch to sustainability outlets", dept: "brand" },
  { date: "2026-04-28", name: "National Superhero Day", type: "social", action: "'Superfoods for superhumans' content series. Highlight protein + collagen as superpowers", dept: "content" },
  // MAY
  { date: "2026-05-01", name: "May Day / Asian Heritage Month Starts", type: "cultural", action: "Spotlight Umami Miso SKU all month. Partner with Asian food creators. Cultural broth traditions content series", dept: "content" },
  { date: "2026-05-04", name: "Star Wars Day", type: "social", action: "'May the Broth Be With You' — fun TikTok content, limited themed packaging insert", dept: "content" },
  { date: "2026-05-05", name: "Cinco de Mayo", type: "cultural", action: "Mexican caldo/broth culture content. Recipe: bone broth tortilla soup. Cross-cultural storytelling", dept: "content" },
  { date: "2026-05-10", name: "Mother's Day", type: "major", action: "MAJOR SALES EVENT: 'The Gift of Ritual' campaign. Gift bundles. Gift card push. Postpartum angle. Email sequence: 3 emails (teaser, gift guide, last chance). SMS blast. Dedicated landing page. Influencer 'gifts for wellness moms' content", dept: "email" },
  { date: "2026-05-25", name: "Memorial Day Weekend", type: "major", action: "Memorial Day Sale: 15% off sitewide. 'Summer wellness starts now.' Bundle deals. 3-email + 2-SMS sequence. Scale ads 2x for weekend", dept: "paid" },
  { date: "2026-05-28", name: "National Hamburger Day", type: "social", action: "'The OG Beef Broth' angle — Beefy Boost content. Recipe pairing content", dept: "content" },
  // JUNE
  { date: "2026-06-01", name: "Pride Month Starts", type: "cultural", action: "Show up authentically: highlight diverse team/community. Partner with LGBTQ+ wellness creators", dept: "brand" },
  { date: "2026-06-15", name: "National Protein Day", type: "major", action: "KEY EVENT: '10g complete protein' messaging blitz. Comparison content vs protein shakes. Gym/fitness creator push. Flash sale on protein-focused bundles", dept: "content" },
  { date: "2026-06-21", name: "Father's Day", type: "major", action: "Gift campaign: 'For the dad who has everything — give him a ritual.' Grilling/BBQ broth angle. Gift bundles. Email + SMS sequence", dept: "email" },
  { date: "2026-06-21", name: "Summer Solstice", type: "social", action: "Cold brew bone broth recipe launch. 'Summer Ritual' content. Iced broth recipe videos", dept: "content" },
  { date: "2026-06-28", name: "Fancy Food Show NYC", type: "major", action: "ALL HANDS: Trade show. Pitch every buyer. Film everything for content. Pre-schedule buyer meetings. This is the most important networking event of the year", dept: "retail" },
  // JULY
  { date: "2026-07-04", name: "4th of July", type: "major", action: "Independence Day Sale: 'Freedom from boring protein.' 20% off. Red/white/blue themed content. BBQ broth recipe. Heavy ad spend Thu-Sun", dept: "paid" },
  { date: "2026-07-06", name: "National Fried Chicken Day", type: "social", action: "Cozy Chick spotlight. Recipe: bone broth fried chicken batter. TikTok recipe content", dept: "content" },
  { date: "2026-07-11", name: "National Mojito Day", type: "social", action: "Fun crossover: 'Bone broth mocktail' recipe content. Unexpected content performs", dept: "content" },
  { date: "2026-07-17", name: "National Tattoo Day", type: "social", action: "Collagen for skin health angle. 'What if your skin could heal like this?' UGC content", dept: "content" },
  { date: "2026-07-24", name: "National Tequila Day", type: "social", action: "'Hangover recovery' angle: bone broth as hangover cure. This content ALWAYS goes viral", dept: "content" },
  { date: "2026-07-29", name: "National Chicken Wing Day", type: "social", action: "Cozy Chick content: 'Made from the same bones.' Recipe + product tie-in", dept: "content" },
  // AUGUST
  { date: "2026-08-01", name: "National Wellness Month", type: "major", action: "MONTH-LONG CAMPAIGN: 'The Wellness Ritual Challenge.' 30-day bone broth ritual. Daily content. UGC challenge. Subscription push. Partner with 20 wellness creators", dept: "growth" },
  { date: "2026-08-10", name: "National S'mores Day", type: "social", action: "Fun content: 'Things that are better warm.' Cozy broth aesthetic content", dept: "content" },
  { date: "2026-08-15", name: "National Relaxation Day", type: "social", action: "Self-care ritual content: broth + bath + book. Evening wind-down ritual angle", dept: "content" },
  { date: "2026-08-21", name: "Newtopia Now / Naturally Rising Finals", type: "major", action: "If qualified: National finals for Naturally Rising. Prep pitch deck. Practice presentation. Film for content", dept: "grants" },
  { date: "2026-08-25", name: "Back to School", type: "major", action: "'Quick protein for busy mornings.' Parent angle. Dorm room essential angle. College care package bundles. 15% off student discount", dept: "email" },
  // SEPTEMBER
  { date: "2026-09-01", name: "Labor Day Weekend", type: "major", action: "Labor Day Sale: 'End summer right.' 20% off. Final summer push. Email + SMS + ads blitz", dept: "paid" },
  { date: "2026-09-07", name: "National Skincare Day", type: "social", action: "Collagen benefits for skin content blitz. Before/after testimonials. Partner with skincare creators", dept: "content" },
  { date: "2026-09-15", name: "Hispanic Heritage Month Starts", type: "cultural", action: "Spotlight: caldo traditions across Latin America. Partner with Latina food creators. Moroccan Soul crossover content", dept: "content" },
  { date: "2026-09-22", name: "Fall Equinox", type: "major", action: "'Cozy Season is HERE.' Fall campaign launch. Warm beverage content pivot. Pumpkin spice competitor angle: 'This fall, try something that actually nourishes you'", dept: "brand" },
  { date: "2026-09-29", name: "National Coffee Day", type: "social", action: "'Coffee's functional cousin.' Side-by-side comparison content: coffee crash vs sustained broth energy. Cafe wholesale push", dept: "content" },
  // OCTOBER
  { date: "2026-10-01", name: "Q4 Starts / Breast Cancer Awareness Month", type: "major", action: "Q4 KICKOFF: All holiday campaigns prepped. Pink partnership: donate % of Cozy Chick sales to breast cancer research. Co-branded content", dept: "brand" },
  { date: "2026-10-10", name: "World Mental Health Day", type: "values", action: "Gut-brain connection content. 'Nourish your gut, nourish your mind.' Partner with mental health advocates. Thoughtful, not exploitative", dept: "content" },
  { date: "2026-10-15", name: "Global Handwashing Day / Cold & Flu Season", type: "social", action: "'Immune support season.' Bone broth for immunity content. Sick day care package bundle. Collagen + protein immune angle", dept: "email" },
  { date: "2026-10-25", name: "Diwali (approx)", type: "cultural", action: "Cultural celebration content. Warm beverages in Indian tradition. Partner with South Asian creators", dept: "content" },
  { date: "2026-10-31", name: "Halloween", type: "social", action: "'Witch's Brew' limited edition packaging insert. Fun TikTok: 'Making potions with bone broth.' Costume content. Flash sale: 'Trick or TREAT yourself'", dept: "content" },
  // NOVEMBER
  { date: "2026-11-01", name: "BFCM Prep Month", type: "major", action: "ALL BFCM campaigns finalized and scheduled. Test all flows. Inventory confirmed. Ads pre-built. Affiliates briefed. SMS/email sequences loaded. War room mode", dept: "email" },
  { date: "2026-11-01", name: "National Bone Broth Day", type: "major", action: "BIGGEST BRAND HOLIDAY: Go ALL in. 25% off. Free shipping. Every creator posts. TikTok LIVE marathon. Press release. This is our Super Bowl", dept: "paid" },
  { date: "2026-11-11", name: "Veterans Day", type: "values", action: "15% military discount (permanent — announce it today). Partner with veteran wellness orgs. Respectful, service-focused content", dept: "brand" },
  { date: "2026-11-15", name: "National Entrepreneur Day", type: "social", action: "Founder story content. Behind the scenes of building to $1M. LinkedIn content blitz. Podcast pitch angle", dept: "content" },
  { date: "2026-11-19", name: "International Men's Day", type: "social", action: "'For the men who actually take care of themselves.' Gym bro angle. Protein for men content. Male wellness creators", dept: "content" },
  { date: "2026-11-26", name: "Thanksgiving", type: "cultural", action: "Gratitude email to all customers. 'Thankful for this community.' Recipe: bone broth gravy, bone broth stuffing. Warm family content", dept: "email" },
  { date: "2026-11-27", name: "BLACK FRIDAY", type: "critical", action: "MAXIMUM EFFORT: 30% off sitewide. VIP early access (Wed). Email: 5-part sequence. SMS: 4 blasts. All ads at 3x budget. TikTok Shop mega-deal. Every affiliate posts. TikTok LIVE all day. Amazon Lightning Deals. Target: $15K+ single day", dept: "paid" },
  { date: "2026-11-28", name: "Small Business Saturday", type: "major", action: "'We're a small business built by 2 people.' Founder story content. Behind the scenes. Support small business messaging. Partner with other small CPG brands for cross-promo", dept: "brand" },
  { date: "2026-11-30", name: "Cyber Monday", type: "critical", action: "Extended sale: 25% off + free gift with $75+ order. Digital gift cards push. Subscription special: first month 50% off. Email + SMS final push. 'Last chance' urgency", dept: "paid" },
  // DECEMBER
  { date: "2026-12-01", name: "Giving Tuesday", type: "values", action: "100% of profits to Action Against Hunger for 24 hours. PR this HARD. This generates press and goodwill. Email + social announcement", dept: "brand" },
  { date: "2026-12-01", name: "Holiday Gift Guide Season", type: "major", action: "FULL MONTH: Gift guide landing page live. 'Gifts Under $50' bundle. 'Wellness Lover Gift' bundle. Gift cards. Daily countdown content. Shipping cutoff urgency", dept: "email" },
  { date: "2026-12-05", name: "Green Monday", type: "major", action: "Second biggest online shopping day. Flash sale: 20% off for 24 hours only. Email + SMS blast. All ads live", dept: "paid" },
  { date: "2026-12-12", name: "12/12 Sale", type: "major", action: "12% off + free shipping. 'Gift deadline approaching' urgency. 12 days of content countdown", dept: "email" },
  { date: "2026-12-15", name: "Shipping Cutoff Warning", type: "critical", action: "URGENT: 'Order by [date] for Christmas delivery.' Countdown timer on site. 3 emails in 5 days. SMS daily. Ads shift to urgency creative", dept: "email" },
  { date: "2026-12-18", name: "Last Day to Ship Ground", type: "critical", action: "FINAL ground shipping day. 'LAST CHANCE' email + SMS. After this: pivot to express shipping, digital gift cards, e-gifts", dept: "email" },
  { date: "2026-12-21", name: "Winter Solstice", type: "social", action: "'The longest night deserves the warmest ritual.' Cozy aesthetic content. Candle + broth + blanket vibes", dept: "content" },
  { date: "2026-12-25", name: "Christmas Day", type: "cultural", action: "Warm holiday message. No hard sell. 'From our family to yours.' Set up Boxing Day sale for tomorrow", dept: "brand" },
  { date: "2026-12-26", name: "Boxing Day / Post-Christmas Sale", type: "major", action: "Post-Christmas sale: 25% off. 'New Year, New Ritual' campaign launches. Target gift card recipients. 'Spend your gift card' email to gift recipients", dept: "paid" },
  { date: "2026-12-31", name: "New Year's Eve", type: "major", action: "New Year's Resolution campaign: 'Start 2027 with a daily ritual.' Subscription push: 'Your 2027 self will thank you.' Goal: convert Dec buyers to Jan subscribers", dept: "email" },
];

// ─── RECURRING TASKS ────────────────────────────────────────────────────────
const RECURRING = [
  // DAILY — Revenue-generating activities first
  { id: "r1", freq: "daily", owner: "H", dept: "wholesale", text: "10 studio visits + 10 cafe visits with samples — log every single one", priority: "critical",
    subs: [
      { id: "r1a", text: "Research 20 target locations before leaving (Google Maps, Yelp, ClassPass)" },
      { id: "r1b", text: "Pack sample kit: 4 flavors, one-pagers, business cards, display cards" },
      { id: "r1c", text: "Visit 10 fitness studios (best: 10am-12pm)" },
      { id: "r1d", text: "Visit 10 cafes/juice bars (best: 2-4pm)" },
      { id: "r1e", text: "Log EVERY visit: name, manager, reaction (hot/warm/cold), samples left, follow-up date" },
      { id: "r1f", text: "Text every hot lead before you leave the area" },
    ]},
  { id: "r2", freq: "daily", owner: "H", dept: "content", text: "Post 1 TikTok by noon + cross-post to Reels same day", priority: "critical",
    subs: [
      { id: "r2a", text: "Film raw footage during morning field visits or market prep" },
      { id: "r2b", text: "Edit in CapCut (10 min max): hook in first 1 sec, text overlay, trending sound" },
      { id: "r2c", text: "Write caption with CTA: 'Comment BROTH for 15% off' or 'Link in bio'" },
      { id: "r2d", text: "Post to TikTok with TikTok Shop product tag" },
      { id: "r2e", text: "Download without watermark (SnapTik) and post to Instagram Reels" },
      { id: "r2f", text: "Reply to EVERY comment in first hour (triggers algorithm)" },
    ]},
  { id: "r3", freq: "daily", owner: "H", dept: "content", text: "Post 3-5 Instagram Stories by 3pm", priority: "high" },
  { id: "r4", freq: "daily", owner: "H", dept: "cx", text: "Reply to ALL DMs, comments, and support emails by noon", priority: "critical",
    subs: [
      { id: "r4a", text: "Check Gorgias inbox: email support tickets" },
      { id: "r4b", text: "Check Instagram DMs and comments" },
      { id: "r4c", text: "Check TikTok comments (reply to ALL in first hour of new posts)" },
      { id: "r4d", text: "Check TikTok DMs" },
      { id: "r4e", text: "Check Amazon seller messages (must reply within 24hrs)" },
      { id: "r4f", text: "Log any product complaints or praise in the feedback tracker" },
    ]},
  { id: "r5", freq: "daily", owner: "H", dept: "tiktok", text: "Engage with 20 creators in your niche: comment, duet ideas, stitch", priority: "high" },
  { id: "r6", freq: "daily", owner: "H", dept: "wholesale", text: "Follow up every hot lead within 48 hours via text (not email)", priority: "critical" },
  { id: "r7", freq: "daily", owner: "H", dept: "team", text: "Log all field activities in Live Tracker by 6pm", priority: "high" },

  // WEEKLY
  { id: "r10", freq: "weekly", owner: "B", dept: "team", text: "Monday 9am: 20-min weekly numbers review together", priority: "critical",
    subs: [
      { id: "r10a", text: "Pull: total studio/cafe visits this week" },
      { id: "r10b", text: "Pull: new wholesale accounts signed" },
      { id: "r10c", text: "Pull: Shopify revenue (DTC + wholesale)" },
      { id: "r10d", text: "Pull: subscription MRR and new subscribers" },
      { id: "r10e", text: "Pull: TikTok Shop revenue + top affiliate" },
      { id: "r10f", text: "Pull: email/SMS revenue and list growth" },
      { id: "r10g", text: "Pull: ad spend and ROAS by platform" },
      { id: "r10h", text: "Decide: what to double down on, what to cut" },
    ]},
  { id: "r11", freq: "weekly", owner: "D", dept: "finance", text: "Friday: review weekly Shopify revenue + subscription MRR + ad spend", priority: "critical" },
  { id: "r12", freq: "weekly", owner: "D", dept: "email", text: "Tuesday 9am: send 'The Broth Ritual' newsletter", priority: "high",
    subs: [
      { id: "r12a", text: "Draft newsletter Monday evening (300-400 words)" },
      { id: "r12b", text: "Structure: cultural story + ritual/recipe + brand update + CTA" },
      { id: "r12c", text: "Subject line: 'This week: [cultural topic] + [ritual idea]'" },
      { id: "r12d", text: "Include 1 product image and 1 clear CTA button" },
      { id: "r12e", text: "Schedule for Tuesday 9am EST" },
    ]},
  { id: "r13", freq: "weekly", owner: "D", dept: "content", text: "Post 3x on LinkedIn (Tue/Thu/Sat) — Poppi-style founder transparency", priority: "high",
    subs: [
      { id: "r13a", text: "Tuesday: founder journey update with REAL numbers (revenue, accounts, lessons)" },
      { id: "r13b", text: "Thursday: CPG industry insight or hot take" },
      { id: "r13c", text: "Saturday: behind-the-scenes or milestone celebration" },
      { id: "r13d", text: "Reply to every comment within 2 hours on post day" },
    ]},
  { id: "r14", freq: "weekly", owner: "H", dept: "content", text: "Batch 10 Pinterest pins every Monday", priority: "medium" },
  { id: "r15", freq: "weekly", owner: "H", dept: "tiktok", text: "2 TikTok LIVE sessions (Tue + Fri 7pm) — sell via Shop", priority: "critical",
    subs: [
      { id: "r15a", text: "Set up: ring light, product displayed, TikTok Shop cart loaded" },
      { id: "r15b", text: "Go live for 45-60 min: steep broth live, answer questions, tell stories" },
      { id: "r15c", text: "Offer live-only discount: 'LIVE15 for first 10 orders'" },
      { id: "r15d", text: "Pin product to screen throughout" },
      { id: "r15e", text: "Save and repost highlights as regular TikToks" },
    ]},
  { id: "r16", freq: "weekly", owner: "H", dept: "cx", text: "Screenshot 5 best customer messages/reviews to 'Customer Voice' folder", priority: "medium" },
  { id: "r17", freq: "weekly", owner: "H", dept: "cx", text: "Process all refunds same-day — no questions asked + personal follow-up", priority: "high" },
  { id: "r18", freq: "weekly", owner: "H", dept: "wholesale", text: "Proactive reorder outreach to accounts nearing 28-day mark", priority: "critical" },
  { id: "r19", freq: "weekly", owner: "H", dept: "email", text: "Grow email list: 30 captures at market + 10 from ManyChat", priority: "high" },
  { id: "r20", freq: "weekly", owner: "B", dept: "wholesale", text: "Saturday: West Village market (50 tastings, 20 sales, 30 emails)", priority: "critical" },
  { id: "r21", freq: "weekly", owner: "D", dept: "paid", text: "Ad review: kill <2.5x ROAS after 7 days, scale winners, refresh creative", priority: "critical" },
  { id: "r22", freq: "weekly", owner: "D", dept: "tiktok", text: "Review TikTok Shop analytics: affiliate sales, top creators, commission payouts", priority: "high" },
  { id: "r23", freq: "weekly", owner: "D", dept: "auto", text: "Check all automations for failures: Zapier, Klaviyo flows, ManyChat", priority: "medium" },

  // MONTHLY
  { id: "r30", freq: "monthly", owner: "D", dept: "finance", text: "1st Monday: full P&L review — channel performance + margins", priority: "critical",
    subs: [
      { id: "r30a", text: "Pull QuickBooks P&L report" },
      { id: "r30b", text: "Calculate gross margin by channel (DTC, wholesale, Amazon, TikTok Shop)" },
      { id: "r30c", text: "Review operating expenses vs budget" },
      { id: "r30d", text: "Calculate CAC, LTV, ROAS by channel" },
      { id: "r30e", text: "Compare revenue to $1M monthly target" },
      { id: "r30f", text: "Decide: cut channels below 3:1 LTV:CAC, scale channels above 5:1" },
    ]},
  { id: "r31", freq: "monthly", owner: "D", dept: "finance", text: "Invoice all wholesale accounts on Net-30 — follow up day 35, escalate day 45", priority: "critical" },
  { id: "r32", freq: "monthly", owner: "D", dept: "email", text: "Klaviyo audit: flow revenue, open rates, deliverability, list health", priority: "high" },
  { id: "r33", freq: "monthly", owner: "D", dept: "email", text: "Clean email list: suppress non-engagers >180 days", priority: "medium" },
  { id: "r34", freq: "monthly", owner: "D", dept: "product", text: "Inventory audit: physical count vs system + 90-day forecast", priority: "critical" },
  { id: "r35", freq: "monthly", owner: "D", dept: "product", text: "Product quality review: steep 3 bags per batch, check consistency", priority: "high" },
  { id: "r36", freq: "monthly", owner: "H", dept: "wholesale", text: "Personal check-in with every active wholesale account (day 28-30)", priority: "critical" },
  { id: "r37", freq: "monthly", owner: "D", dept: "pr", text: "Send 5 personalized press pitches + pitch 1 podcast", priority: "high" },
  { id: "r38", freq: "monthly", owner: "D", dept: "paid", text: "Ad creative refresh: minimum 3 new ad sets per platform", priority: "critical" },
  { id: "r39", freq: "monthly", owner: "D", dept: "tiktok", text: "Recruit 10 new TikTok Shop affiliates — seed product to top 5", priority: "critical" },
  { id: "r40", freq: "monthly", owner: "D", dept: "team", text: "Hire performance review: KPIs vs targets, written feedback", priority: "high" },
  { id: "r41", freq: "monthly", owner: "D", dept: "amazon", text: "Amazon audit: BSR, reviews, Buy Box, inventory, ACOS", priority: "high" },
  { id: "r42", freq: "monthly", owner: "D", dept: "website", text: "Site speed + CRO audit: PageSpeed Insights, heatmap review, broken links", priority: "medium" },
  { id: "r43", freq: "monthly", owner: "H", dept: "content", text: "Content performance report + 2-hour fresh photo shoot", priority: "medium" },
  { id: "r44", freq: "monthly", owner: "D", dept: "growth", text: "Referral + loyalty program review: signups, conversions, ROI", priority: "medium" },

  // QUARTERLY
  { id: "r50", freq: "quarterly", owner: "D", dept: "finance", text: "Full P&L vs $1M targets — emergency pivot if off track", priority: "critical" },
  { id: "r51", freq: "quarterly", owner: "D", dept: "finance", text: "Quarterly financials to WFOGen (due within 30 days of quarter end)", priority: "critical" },
  { id: "r52", freq: "quarterly", owner: "D", dept: "product", text: "New flavor pipeline evaluation — plan 1 new SKU per 6 months", priority: "high" },
  { id: "r53", freq: "quarterly", owner: "D", dept: "wholesale", text: "Wholesale account health: A/B/C grade, cut non-performers at 120 days", priority: "high" },
  { id: "r54", freq: "quarterly", owner: "D", dept: "website", text: "Full SEO audit + 2 new blog posts targeting long-tail keywords", priority: "medium" },
  { id: "r55", freq: "quarterly", owner: "D", dept: "grants", text: "Research 5 new grant/pitch/accelerator opportunities", priority: "medium" },
  { id: "r56", freq: "quarterly", owner: "B", dept: "team", text: "2-hour strategy review: on track to $1M? What to double down, what to kill?", priority: "critical" },
];

// ─── WEEKLY PLAN ────────────────────────────────────────────────────────────
// Priority-ordered: REVENUE CRITICAL tasks first each week
// Every task has subtasks for granular tracking
const WEEKS = [

  // ════ PHASE 1: FOUNDATION (Weeks 1-4) — Build the machine ════════════
  {
    week: 1, label: "Revenue Machine: Day 1 Systems", phase: "Foundation", phaseColor: C.purple,
    revenue_note: "No revenue yet — building the engine. Every hour here saves 10 hours later.",
    tasks: [
      // REVENUE CRITICAL — do these first
      { id: "w1t1", owner: "B", dept: "team", text: "Day 1 alignment: read plan, clarify roles, agree on $1M target", priority: "critical",
        subs: [
          { id: "w1t1a", text: "Block 2 hours together — no phones, no distractions" },
          { id: "w1t1b", text: "Walk through every section of this plan" },
          { id: "w1t1c", text: "Clarify: Danielle = strategy, brand, finance, ads, retail. Hire = field sales, content, CX, daily ops" },
          { id: "w1t1d", text: "Set shared calendar: weekly Monday review, Saturday market, daily check-in" },
          { id: "w1t1e", text: "Agree: 'We will hit $1M. There is no Plan B.'" },
        ]},
      { id: "w1t2", owner: "H", dept: "product", text: "Taste every flavor + memorize one-line pitch", priority: "critical",
        subs: [
          { id: "w1t2a", text: "Steep all 4 flavors: Beefy Boost, Cozy Chick, Moroccan Soul, Umami Miso" },
          { id: "w1t2b", text: "Write personal tasting notes for each (what it smells/tastes/feels like)" },
          { id: "w1t2c", text: "Memorize: 'World's first complete-protein bone broth in a tea bag — 10g protein, real collagen, just add hot water'" },
          { id: "w1t2d", text: "Practice pitch 10 times out loud until it's automatic" },
          { id: "w1t2e", text: "Know top 5 objections and responses cold (too expensive, I don't like broth, is it healthy, etc.)" },
        ]},
      { id: "w1t3", owner: "D", dept: "team", text: "Set up Live Tracker + define hire KPIs", priority: "critical",
        subs: [
          { id: "w1t3a", text: "Create Google Sheet: 'Rooted Broth Live Tracker'" },
          { id: "w1t3b", text: "Tabs: Daily Log, Wholesale Accounts, Influencer Log, Grant Apps, Weekly KPIs, Content Calendar" },
          { id: "w1t3c", text: "Columns: Date, Channel, Owner, Action, Outcome, Follow-up Date, Revenue, Status" },
          { id: "w1t3d", text: "Define Month 1 KPIs: 200 visits, 20 accounts, 30 TikToks, 30 email captures/Sat" },
          { id: "w1t3e", text: "Define Month 3 KPIs: 50 accounts, 500 Apollo emails/week, 300 TikTok followers" },
          { id: "w1t3f", text: "Define Month 6 KPIs: $15K/mo wholesale, 5 influencer relationships, 1K TikTok followers" },
        ]},
      { id: "w1t4", owner: "H", dept: "wholesale", text: "Start field visits TODAY — even if you only hit 5 today", priority: "critical",
        subs: [
          { id: "w1t4a", text: "Pack sample bags: 4 flavors per bag, one-pager, business card" },
          { id: "w1t4b", text: "Map 20 locations within walking/transit distance" },
          { id: "w1t4c", text: "Visit at least 5 studios + 5 cafes on Day 1" },
          { id: "w1t4d", text: "Log every visit in the tracker before bed" },
        ]},
      // HIGH IMPACT — this week
      { id: "w1t5", owner: "D", dept: "finance", text: "Financial infrastructure: bank + bookkeeper + QuickBooks", priority: "high",
        subs: [
          { id: "w1t5a", text: "Apply for Mercury business bank account (mercury.com, 24-48hr approval)" },
          { id: "w1t5b", text: "Hire CPG-experienced bookkeeper (Bench.co, Kruze Consulting, $300-800/mo)" },
          { id: "w1t5c", text: "Set up QuickBooks Online Plus (~$80/mo)" },
          { id: "w1t5d", text: "Connect Mercury + Shopify (via A2X app, $20/mo)" },
          { id: "w1t5e", text: "Build CoGS model: exact gross margin per SKU" },
          { id: "w1t5f", text: "Open business credit card (Ramp — free, 1.5% cash back, no personal guarantee)" },
        ]},
      { id: "w1t6", owner: "D", dept: "auto", text: "Set up core automations — Zapier + Slack", priority: "high",
        subs: [
          { id: "w1t6a", text: "Create Zapier account ($20/mo) — connect Shopify, Klaviyo, Slack, Google Sheets" },
          { id: "w1t6b", text: "Zap 1: new Shopify order -> #orders Slack channel + Google Sheet row" },
          { id: "w1t6c", text: "Zap 2: order > $100 -> #big-orders Slack alert" },
          { id: "w1t6d", text: "Zap 3: new subscription -> #subscriptions Slack + Google Sheet" },
          { id: "w1t6e", text: "Zap 4: subscription cancellation -> #churn-alert Slack + Google Sheet" },
        ]},
      { id: "w1t7", owner: "H", dept: "cx", text: "Set up customer support system", priority: "high",
        subs: [
          { id: "w1t7a", text: "Sign up for Gorgias ($10/mo for Shopify)" },
          { id: "w1t7b", text: "Connect: email, Instagram DMs, TikTok comments, Facebook" },
          { id: "w1t7c", text: "Write 15-scenario customer service playbook with exact scripts" },
          { id: "w1t7d", text: "Set response time target: <2 hours on business days" },
          { id: "w1t7e", text: "Create canned responses for top 10 questions" },
        ]},
      // FOUNDATION — important but not revenue-generating
      { id: "w1t8", owner: "D", dept: "legal", text: "Legal compliance: NJ registration + entity updates", priority: "low",
        subs: [
          { id: "w1t8a", text: "File NJ foreign corporation qualification (Certificate of Authority, ~$125)" },
          { id: "w1t8b", text: "Register for Illinois sales tax (MyTax Illinois portal, free)" },
          { id: "w1t8c", text: "Update entity name (Rooted Broth Inc.) on: Shopify, Klaviyo, Pod Foods, all banks" },
          { id: "w1t8d", text: "File federal trademark on 'Rooted Broth' ($250-350 per class)" },
        ]},
      { id: "w1t9", owner: "D", dept: "team", text: "Start SOP library in ClickUp — document everything from day 1", priority: "low",
        subs: [
          { id: "w1t9a", text: "Create ClickUp workspace: 'Rooted Broth Ops'" },
          { id: "w1t9b", text: "SOP 1: How to set up the market table" },
          { id: "w1t9c", text: "SOP 2: How to process a wholesale order in Shopify" },
          { id: "w1t9d", text: "SOP 3: How to post a TikTok with Shop tag" },
          { id: "w1t9e", text: "SOP 4: How to handle a refund request" },
        ]},
    ]
  },
  {
    week: 2, label: "Revenue Machine: Email + Website + Wholesale Kit", phase: "Foundation", phaseColor: C.purple,
    revenue_note: "Hire should be at 40+ visits by end of this week. You're building the conversion engine.",
    tasks: [
      { id: "w2t1", owner: "D", dept: "email", text: "Klaviyo setup + first 4 money-making flows", priority: "critical",
        subs: [
          { id: "w2t1a", text: "Configure custom sending domain (mail.rootedbroth.co)" },
          { id: "w2t1b", text: "Set up SPF, DKIM, and DMARC DNS records" },
          { id: "w2t1c", text: "Clean list: remove anyone unengaged >6 months before first send" },
          { id: "w2t1d", text: "Build Welcome Series (4 emails, 10 days): brand story -> product education -> social proof -> first purchase offer" },
          { id: "w2t1e", text: "Build Abandoned Cart flow (3 emails, 72hrs): reminder -> social proof -> final discount" },
          { id: "w2t1f", text: "Build Browse Abandonment flow (1hr trigger): 'Still thinking about this?'" },
          { id: "w2t1g", text: "Build Post-Purchase flow (5 emails, 30 days): thank you -> how to steep -> ritual tips -> review request -> reorder nudge" },
        ]},
      { id: "w2t2", owner: "D", dept: "website", text: "Shopify CRO audit + fix top conversion killers", priority: "critical",
        subs: [
          { id: "w2t2a", text: "Install Microsoft Clarity (free heatmap tool)" },
          { id: "w2t2b", text: "Watch 20 real session recordings — note every drop-off point" },
          { id: "w2t2c", text: "UX test: ask 5 people to 'find a product and buy it' while you watch silently" },
          { id: "w2t2d", text: "Set up GA4 + Google Tag Manager" },
          { id: "w2t2e", text: "Track events: add-to-cart, checkout, purchase, email signup, scroll depth" },
          { id: "w2t2f", text: "Fix top 5 issues found (usually: unclear value prop, no social proof above fold, slow load, confusing nav, hidden subscription)" },
          { id: "w2t2g", text: "Add Google Search Console" },
        ]},
      { id: "w2t3", owner: "H", dept: "wholesale", text: "Build professional wholesale onboarding kit", priority: "critical",
        subs: [
          { id: "w2t3a", text: "Printed account confirmation with wholesale pricing" },
          { id: "w2t3b", text: "Counter display card for their space" },
          { id: "w2t3c", text: "Menu insert for cafes (4x6 card: 'Bone Broth Tea $7')" },
          { id: "w2t3d", text: "Restock reminder: 'I'll follow up in 28 days'" },
          { id: "w2t3e", text: "5-step steeping guide for their staff" },
          { id: "w2t3f", text: "QR code linking to wholesale order page" },
        ]},
      { id: "w2t4", owner: "D", dept: "auto", text: "Set up ManyChat for Instagram + TikTok", priority: "high",
        subs: [
          { id: "w2t4a", text: "Sign up for ManyChat ($15/mo)" },
          { id: "w2t4b", text: "Connect Instagram + TikTok accounts" },
          { id: "w2t4c", text: "Build keyword trigger: 'BROTH' -> DM with discount code + email capture" },
          { id: "w2t4d", text: "Build keyword trigger: 'RITUAL' -> DM with subscription info" },
          { id: "w2t4e", text: "Test flow end-to-end on both platforms" },
        ]},
      { id: "w2t5", owner: "D", dept: "legal", text: "Product liability insurance + FDA compliance", priority: "high",
        subs: [
          { id: "w2t5a", text: "Get quotes: Hiscox, Next Insurance, Thimble (min $1M/$2M policy)" },
          { id: "w2t5b", text: "Purchase policy ($600-1800/year) — required for retail" },
          { id: "w2t5c", text: "Send all SKUs to certified food lab (Eurofins, NSF) for nutritional testing ($200-500/SKU)" },
          { id: "w2t5d", text: "Check: do label claims match lab results? Fix any discrepancies before scaling" },
        ]},
      { id: "w2t6", owner: "D", dept: "product", text: "Inventory system + supplier relationship", priority: "high",
        subs: [
          { id: "w2t6a", text: "Build inventory tracker: current stock, units sold/week, lead time, reorder points" },
          { id: "w2t6b", text: "Get supplier's cell phone (not just email)" },
          { id: "w2t6c", text: "Confirm: production lead time, MOQ, capacity constraints, backup suppliers" },
          { id: "w2t6d", text: "Negotiate volume pricing for 5x growth projection" },
          { id: "w2t6e", text: "Create packaging inventory system (boxes, mailers, inserts, tape)" },
        ]},
      { id: "w2t7", owner: "D", dept: "grants", text: "URGENT: Submit Naturally Rising NYC (deadline March 31)", priority: "high" },
      { id: "w2t8", owner: "D", dept: "finance", text: "Build 12-month cash flow forecast (3 scenarios)", priority: "medium",
        subs: [
          { id: "w2t8a", text: "Rows: monthly revenue by channel, CoGS, gross profit, opex, net cash flow" },
          { id: "w2t8b", text: "Base case: conservative growth" },
          { id: "w2t8c", text: "Bull case: everything works" },
          { id: "w2t8d", text: "Bear case: 50% of projected" },
          { id: "w2t8e", text: "Share with CPA. Review monthly" },
        ]},
      { id: "w2t9", owner: "H", dept: "content", text: "Set up content calendar in ClickUp — 4 weeks planned ahead", priority: "medium",
        subs: [
          { id: "w2t9a", text: "Create content calendar template: date, platform, content type, owner, status" },
          { id: "w2t9b", text: "Plan Week 3-6 content: 7 TikToks/week, 7 Reels, 35 Stories, 3 Pinterest, 2 LinkedIn" },
          { id: "w2t9c", text: "Assign filming days and content themes per day" },
        ]},
    ]
  },
  {
    week: 3, label: "Revenue Machine: SMS + More Flows + TikTok Shop Prep", phase: "Foundation", phaseColor: C.purple,
    revenue_note: "Email flows are now making money while you sleep. SMS will add 15-25% on top.",
    tasks: [
      { id: "w3t1", owner: "D", dept: "email", text: "Set up SMS marketing + build first SMS flows", priority: "critical",
        subs: [
          { id: "w3t1a", text: "Sign up for Postscript or Attentive ($100/mo starting)" },
          { id: "w3t1b", text: "Add SMS opt-in to Shopify checkout + popup" },
          { id: "w3t1c", text: "Build SMS Welcome: opt-in -> immediate 10% off code" },
          { id: "w3t1d", text: "Build SMS Abandoned Cart: 1hr after abandonment, direct checkout link" },
          { id: "w3t1e", text: "Build SMS Flash Sale template: for bi-weekly blasts" },
          { id: "w3t1f", text: "Set up SMS keyword: text BROTH to [number] -> 15% off + email capture" },
        ]},
      { id: "w3t2", owner: "D", dept: "email", text: "Build remaining Klaviyo lifecycle flows", priority: "critical",
        subs: [
          { id: "w3t2a", text: "Replenishment flow (Day 25 post-purchase): 'Running low? Reorder with 10% off'" },
          { id: "w3t2b", text: "Win-Back flow (Day 45, 5 emails): 'We miss you' -> discount ladder -> final offer" },
          { id: "w3t2c", text: "VIP flow (after 3rd purchase): thank you + exclusive perks + review request" },
          { id: "w3t2d", text: "Subscription Welcome flow: what to expect + how to manage + community invite" },
          { id: "w3t2e", text: "Subscription Day 14 Check-in: 'How's your ritual going?'" },
          { id: "w3t2f", text: "Subscription Cancellation Save: pause option -> downsell -> final discount" },
          { id: "w3t2g", text: "Cross-Sell flow: bought Beefy -> suggest Moroccan Soul" },
          { id: "w3t2h", text: "Upsell flow: bought single -> suggest variety pack or subscription" },
        ]},
      { id: "w3t3", owner: "D", dept: "tiktok", text: "Apply for TikTok Shop + prep listings", priority: "critical",
        subs: [
          { id: "w3t3a", text: "Apply for TikTok Shop seller account (needs LLC/Corp, EIN, bank)" },
          { id: "w3t3b", text: "While waiting for approval: prep all product photos (white background + lifestyle)" },
          { id: "w3t3c", text: "Write optimized titles: include keywords (bone broth, protein, collagen, tea bag)" },
          { id: "w3t3d", text: "Write detailed descriptions: benefits, ingredients, how to steep, social proof" },
          { id: "w3t3e", text: "Prep promotional videos: 3 product demos for Shop listing" },
        ]},
      { id: "w3t4", owner: "D", dept: "website", text: "Build subscription + gifting landing pages", priority: "high",
        subs: [
          { id: "w3t4a", text: "Build rootedbroth.co/ritual: hero, benefits, how it works, testimonials, FAQ, CTA" },
          { id: "w3t4b", text: "Build rootedbroth.co/gift: gift message, wrapping option, gift card" },
          { id: "w3t4c", text: "Build Store Locator page for wholesale accounts" },
          { id: "w3t4d", text: "Add live chat widget (Tidio) with auto-greeting on product pages" },
          { id: "w3t4e", text: "Add subscription upsell toggle on cart page: 'Subscribe & save 15%'" },
        ]},
      { id: "w3t5", owner: "D", dept: "growth", text: "Set up referral + loyalty programs", priority: "high",
        subs: [
          { id: "w3t5a", text: "Sign up for Smile.io ($50/mo): points for purchases, reviews, referrals, social follows" },
          { id: "w3t5b", text: "Configure referral: give $10, get $10 (or give 15%, get 15%)" },
          { id: "w3t5c", text: "Configure loyalty tiers: Bronze (0pts), Silver (200pts), Gold (500pts)" },
          { id: "w3t5d", text: "Add referral widget to post-purchase page" },
          { id: "w3t5e", text: "Add loyalty program banner to Shopify header" },
        ]},
      { id: "w3t6", owner: "D", dept: "auto", text: "Build wholesale + churn automations", priority: "medium",
        subs: [
          { id: "w3t6a", text: "Zap: new wholesale account -> auto-send onboarding email sequence" },
          { id: "w3t6b", text: "Zap: 3rd purchase -> auto-tag as VIP in Klaviyo" },
          { id: "w3t6c", text: "Zap: wholesale account no order in 25 days -> auto-reminder email" },
          { id: "w3t6d", text: "Zap: new 5-star review -> auto-request Google/TrustPilot cross-post" },
        ]},
      { id: "w3t7", owner: "D", dept: "product", text: "Formalize Variety Pack + activate Umami Miso", priority: "medium",
        subs: [
          { id: "w3t7a", text: "Create Variety Pack SKU: 2 bags per flavor, 6 total ($45)" },
          { id: "w3t7b", text: "Create Ritual Starter SKU: 1 bag per flavor, 3 total ($29)" },
          { id: "w3t7c", text: "Build proper product pages with photos for both" },
          { id: "w3t7d", text: "Activate Umami Miso: update listing, add to sample kits, set wholesale pricing" },
          { id: "w3t7e", text: "Film dedicated TikTok for Umami Miso (target: miso lovers, Japanese food audience)" },
        ]},
      { id: "w3t8", owner: "H", dept: "wholesale", text: "Set up Apollo for B2B cold outreach at scale", priority: "high",
        subs: [
          { id: "w3t8a", text: "Sign up for Apollo ($49/mo)" },
          { id: "w3t8b", text: "Build target lists: studio owners, cafe owners, wellness managers, hotel F&B directors" },
          { id: "w3t8c", text: "Write 3-email sequence: intro + value prop, follow-up + social proof, final + easy CTA" },
          { id: "w3t8d", text: "Set up: 50 new contacts per day, auto-send sequence" },
          { id: "w3t8e", text: "Review replies every morning, respond personally within 2 hours" },
        ]},
    ]
  },
  {
    week: 4, label: "Revenue Machine: TikTok Shop + Paid Ads LIVE", phase: "Foundation", phaseColor: C.purple,
    revenue_note: "This is the week revenue starts compounding. Every system is now live or going live.",
    tasks: [
      { id: "w4t1", owner: "D", dept: "tiktok", text: "Launch TikTok Shop + affiliate program (THE Poppi playbook)", priority: "critical",
        subs: [
          { id: "w4t1a", text: "List all SKUs on TikTok Shop with optimized titles/descriptions/images" },
          { id: "w4t1b", text: "Set affiliate commission: 15-20% (this is how Poppi scaled to millions)" },
          { id: "w4t1c", text: "Create 'Open Collab' listing: any creator can request free samples" },
          { id: "w4t1d", text: "Manually invite 50 micro-creators (5K-50K followers): wellness, fitness, food, momtok" },
          { id: "w4t1e", text: "Create affiliate creative brief: 3 video concepts they can use" },
          { id: "w4t1f", text: "Seed free product to top 25 creators who accept" },
          { id: "w4t1g", text: "Set up TikTok Shop promotions: bundle deals, free shipping threshold" },
        ]},
      { id: "w4t2", owner: "D", dept: "paid", text: "Launch Meta ads — test 3 creatives at $30/day", priority: "critical",
        subs: [
          { id: "w4t2a", text: "Set up Meta Business Manager + install pixel on Shopify" },
          { id: "w4t2b", text: "Create Conversions API connection (more accurate than pixel alone)" },
          { id: "w4t2c", text: "Build audiences: lookalike from purchasers, interest (bone broth, wellness, fitness, collagen)" },
          { id: "w4t2d", text: "Creative 1: UGC-style 'I found the best bone broth' (film yourself or hire on Billo)" },
          { id: "w4t2e", text: "Creative 2: founder story 'I created the world's first bone broth tea bag'" },
          { id: "w4t2f", text: "Creative 3: product demo showing the steep + benefits text overlay" },
          { id: "w4t2g", text: "Launch: 3 ad sets x 3 creatives = 9 combinations, $30/day total" },
          { id: "w4t2h", text: "Set up retargeting: site visitors (7-day), add-to-cart abandoners, video viewers (75%)" },
        ]},
      { id: "w4t3", owner: "D", dept: "paid", text: "Launch TikTok Spark Ads — boost top organic content", priority: "high",
        subs: [
          { id: "w4t3a", text: "Set up TikTok Ads Manager + install pixel on Shopify" },
          { id: "w4t3b", text: "Identify top 3 organic TikToks by engagement" },
          { id: "w4t3c", text: "Boost each as Spark Ad at $10/day, conversion objective" },
          { id: "w4t3d", text: "Set up TikTok retargeting: video viewers, profile visitors" },
        ]},
      { id: "w4t4", owner: "D", dept: "email", text: "Build gift + review automation flows", priority: "high",
        subs: [
          { id: "w4t4a", text: "Gift-Recipient flow: gift recipient -> welcome -> 'your gift from [name]' -> offer to buy for self" },
          { id: "w4t4b", text: "Review Request flow: Day 7 after delivery -> 'How was your first steep?' + review link" },
          { id: "w4t4c", text: "Birthday/Anniversary flow (if collecting DOB): surprise discount on their birthday" },
          { id: "w4t4d", text: "Set up Stamped.io or Judge.me for automated review collection ($15/mo)" },
        ]},
      { id: "w4t5", owner: "D", dept: "auto", text: "Revenue-tracking automations", priority: "high",
        subs: [
          { id: "w4t5a", text: "Zap: TikTok Shop sale -> Google Sheet log + #tiktok-sales Slack" },
          { id: "w4t5b", text: "Zap: order with gift message -> trigger gift-recipient email flow" },
          { id: "w4t5c", text: "Zap: daily revenue summary -> Slack at 9pm (pull from Shopify)" },
          { id: "w4t5d", text: "Set up Recharge subscription portal: pause, skip, swap flavors, gift" },
        ]},
      { id: "w4t6", owner: "D", dept: "grants", text: "Submit ALL 5 Enthuse Foundation grants (deadline Apr 27, up to $15K)", priority: "high",
        subs: [
          { id: "w4t6a", text: "Planet & Purpose Grant ($5K)" },
          { id: "w4t6b", text: "Digital Marketing Grant ($2.5K)" },
          { id: "w4t6c", text: "Professional Services Grant ($2.5K)" },
          { id: "w4t6d", text: "Business Tools Grant ($2.5K)" },
          { id: "w4t6e", text: "Insurance Grant ($2.5K)" },
        ]},
      { id: "w4t7", owner: "D", dept: "pr", text: "Build press kit + media list (like Poppi — earned media is free)", priority: "medium",
        subs: [
          { id: "w4t7a", text: "Build rootedbroth.co/press: brand story, founder bio, product photos (300dpi), claims, press contact" },
          { id: "w4t7b", text: "Build media target list: 30 journalists across Tier 1 (Well+Good, Shape), Tier 2 (BevNET, NOSH), Tier 3 (podcasts)" },
          { id: "w4t7c", text: "Send product to 10 journalists with handwritten notes (no ask, no pitch)" },
        ]},
      { id: "w4t8", owner: "D", dept: "brand", text: "National Broth Day prep (April 6) — your biggest brand holiday", priority: "critical",
        subs: [
          { id: "w4t8a", text: "Plan 20% off sitewide sale for April 6" },
          { id: "w4t8b", text: "Schedule email blast: 'Happy National Broth Day!' with sale" },
          { id: "w4t8c", text: "Schedule SMS blast for 9am" },
          { id: "w4t8d", text: "Plan TikTok LIVE for 7pm on April 6" },
          { id: "w4t8e", text: "Brief all TikTok affiliates to post on April 6" },
          { id: "w4t8f", text: "Create Meta + TikTok ad campaigns for the day" },
          { id: "w4t8g", text: "Create 5 pieces of content for the day" },
        ]},
    ]
  },

  // ════ PHASE 2: LAUNCH & SCALE (Weeks 5-12) ═══════════════════════════
  {
    week: 5, label: "Scale: Optimize What's Working + Amazon Prep", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "First real revenue data is in. Time to double winners and kill losers. Target: $4K/week.",
    tasks: [
      { id: "w5t1", owner: "D", dept: "paid", text: "Week 1 ad data analysis — scale or kill", priority: "critical",
        subs: [
          { id: "w5t1a", text: "Pull Meta data: which creative + audience has best ROAS?" },
          { id: "w5t1b", text: "Kill any ad set below 1.5x ROAS after $50 spend" },
          { id: "w5t1c", text: "Scale winning ad sets to $20/day each" },
          { id: "w5t1d", text: "Create 2 new creatives based on what's working (same format, new hooks)" },
          { id: "w5t1e", text: "Increase total budget to $50/day" },
        ]},
      { id: "w5t2", owner: "D", dept: "tiktok", text: "TikTok affiliate performance review + recruitment push", priority: "critical",
        subs: [
          { id: "w5t2a", text: "Check: how many affiliates actually posted? What were sales?" },
          { id: "w5t2b", text: "DM top performers: thank them, offer to increase commission to 25%" },
          { id: "w5t2c", text: "DM non-posters: 'Any questions? We'd love to see your take on Rooted Broth'" },
          { id: "w5t2d", text: "Recruit 25 new creators this week (wellness, fitness, momtok, foodtok)" },
          { id: "w5t2e", text: "Seed product to all new recruits within 48 hours" },
        ]},
      { id: "w5t3", owner: "D", dept: "amazon", text: "Start Amazon FBA setup (2nd biggest revenue channel)", priority: "critical",
        subs: [
          { id: "w5t3a", text: "Register Amazon Seller Central (Professional plan, $39.99/mo)" },
          { id: "w5t3b", text: "Apply for Amazon Brand Registry (need trademark filing receipt)" },
          { id: "w5t3c", text: "Create product listings: keyword-optimized titles, 5 bullet points, A+ Content" },
          { id: "w5t3d", text: "Hire freelancer on Fiverr for Amazon product photography ($50-150)" },
          { id: "w5t3e", text: "Prep FBA shipment: 200 units per SKU, labels, shipping plan" },
          { id: "w5t3f", text: "Ship to Amazon warehouse (allow 2-3 weeks for check-in)" },
        ]},
      { id: "w5t4", owner: "D", dept: "growth", text: "Launch referral program officially", priority: "high",
        subs: [
          { id: "w5t4a", text: "Announce via email: 'Give $10, Get $10 — share Rooted Broth'" },
          { id: "w5t4b", text: "Post on all social channels" },
          { id: "w5t4c", text: "Add referral CTA to post-purchase email flow" },
          { id: "w5t4d", text: "Add referral link to subscription portal" },
        ]},
      { id: "w5t5", owner: "D", dept: "email", text: "SMS VIP tier + high-intent segment", priority: "high",
        subs: [
          { id: "w5t5a", text: "Create Klaviyo segment: browsed 3x but no purchase (high-intent non-buyers)" },
          { id: "w5t5b", text: "Build targeted flow for this segment: 'We noticed you looking...' + incentive" },
          { id: "w5t5c", text: "Create SMS VIP tier: 3+ purchases -> exclusive early access + flash sales" },
        ]},
      { id: "w5t6", owner: "D", dept: "website", text: "Add social proof + urgency elements (Poppi does this everywhere)", priority: "high",
        subs: [
          { id: "w5t6a", text: "Install social proof app: 'Sarah from NYC just ordered' popups" },
          { id: "w5t6b", text: "Add 'X people viewing this' on product pages" },
          { id: "w5t6c", text: "Add star ratings + review count below every product title" },
          { id: "w5t6d", text: "Add 'As Featured In' logos (even with 1-2 press mentions)" },
          { id: "w5t6e", text: "Add post-purchase upsell page: 'Add X for 20% off before it ships'" },
        ]},
      { id: "w5t7", owner: "H", dept: "wholesale", text: "MILESTONE: 20+ wholesale accounts by end of this week", priority: "critical" },
    ]
  },
  {
    week: 6, label: "Scale: Influencer Army + Google Ads", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $5K/week. Poppi built their empire on influencer seeding — do the same.",
    tasks: [
      { id: "w6t1", owner: "D", dept: "growth", text: "Influencer seeding blitz (the Poppi playbook)", priority: "critical",
        subs: [
          { id: "w6t1a", text: "Create influencer target list: 50 creators (IG 10K-100K, TikTok 5K-50K)" },
          { id: "w6t1b", text: "Categories: wellness, fitness, postpartum, clean eating, NYC lifestyle, functional food" },
          { id: "w6t1c", text: "DM each one: personal message + offer to send free product (no obligation to post)" },
          { id: "w6t1d", text: "Ship Ritual Kit (2 boxes + ritual card + handwritten note) to all who accept" },
          { id: "w6t1e", text: "Track in Influencer Log: sent date, response, posted (yes/no), content link, sales attributed" },
          { id: "w6t1f", text: "Repost any UGC they create (with permission) to your channels" },
        ]},
      { id: "w6t2", owner: "D", dept: "paid", text: "Launch Google Shopping + Search ads", priority: "critical",
        subs: [
          { id: "w6t2a", text: "Set up Google Ads account + connect Shopify product feed" },
          { id: "w6t2b", text: "Launch Shopping campaigns: all products, $15/day" },
          { id: "w6t2c", text: "Launch Search campaigns: 'bone broth tea bag', 'portable bone broth', 'collagen broth'" },
          { id: "w6t2d", text: "Set up Google retargeting: site visitors, cart abandoners" },
        ]},
      { id: "w6t3", owner: "D", dept: "paid", text: "Scale Meta to $75/day — introduce UGC as ad creative", priority: "high",
        subs: [
          { id: "w6t3a", text: "Take best-performing influencer/customer UGC and run as ads (with permission)" },
          { id: "w6t3b", text: "Create 3 new ad sets using UGC content" },
          { id: "w6t3c", text: "A/B test: subscription offer vs one-time purchase in ads" },
        ]},
      { id: "w6t4", owner: "D", dept: "growth", text: "Approach 5 fitness studios for co-marketing partnerships", priority: "high",
        subs: [
          { id: "w6t4a", text: "Identify top 5 wholesale accounts with best relationship" },
          { id: "w6t4b", text: "Pitch: 'Official post-workout recovery partner' — co-branded content + placement" },
          { id: "w6t4c", text: "Offer: free product for their front desk + co-branded social content" },
          { id: "w6t4d", text: "Close at least 2 partnerships this week" },
        ]},
      { id: "w6t5", owner: "H", dept: "wholesale", text: "Build Faire listing for passive inbound wholesale", priority: "high",
        subs: [
          { id: "w6t5a", text: "Create Faire brand page (faire.com/brand, free)" },
          { id: "w6t5b", text: "Write strong brand story with social proof" },
          { id: "w6t5c", text: "Set opening order minimum at 1 case" },
          { id: "w6t5d", text: "Run intro offer: 20% off first order" },
          { id: "w6t5e", text: "Set up: review and fulfill Faire orders every Monday" },
        ]},
      { id: "w6t6", owner: "D", dept: "brand", text: "Mother's Day campaign prep (May 10)", priority: "high",
        subs: [
          { id: "w6t6a", text: "Create 'Gift of Ritual' bundle for moms" },
          { id: "w6t6b", text: "Build dedicated landing page: rootedbroth.co/mothers-day" },
          { id: "w6t6c", text: "Design email sequence: teaser (1 week before) -> gift guide -> last chance" },
          { id: "w6t6d", text: "SMS blast scheduled for Mother's Day morning" },
          { id: "w6t6e", text: "Postpartum wellness angle for ads: 'Give her body what it needs'" },
          { id: "w6t6f", text: "Brief TikTok affiliates on Mother's Day content" },
        ]},
    ]
  },
  {
    week: 7, label: "Scale: Subscription Growth + UGC Machine", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $6K/week. Subscription MRR is your most valuable metric — grow it aggressively.",
    tasks: [
      { id: "w7t1", owner: "D", dept: "website", text: "Optimize subscription conversion (this is your highest-LTV channel)", priority: "critical",
        subs: [
          { id: "w7t1a", text: "A/B test subscription page: 15% off vs 20% off vs 'free shipping forever'" },
          { id: "w7t1b", text: "Add comparison on product page: one-time price vs subscription price (strike-through)" },
          { id: "w7t1c", text: "Add 'Subscribe & Save' as DEFAULT option on product page (Poppi does this)" },
          { id: "w7t1d", text: "Add subscription upsell to cart page and post-purchase page" },
          { id: "w7t1e", text: "Create 'Subscription vs One-Time' comparison infographic" },
        ]},
      { id: "w7t2", owner: "D", dept: "growth", text: "Launch UGC program — build your army of content creators", priority: "critical",
        subs: [
          { id: "w7t2a", text: "Create #RootedBrothRitual hashtag and brand it across all channels" },
          { id: "w7t2b", text: "Post on all platforms: 'Post your ritual + tag us = $15 store credit'" },
          { id: "w7t2c", text: "Build rootedbroth.co/community page explaining the program" },
          { id: "w7t2d", text: "Set up: auto-detect tagged posts -> Slack alert -> repost approval workflow" },
          { id: "w7t2e", text: "Repost 2-3 UGC pieces per week to your channels" },
        ]},
      { id: "w7t3", owner: "D", dept: "email", text: "Subscription nudge + lifecycle deepening", priority: "high",
        subs: [
          { id: "w7t3a", text: "Build 'Subscription Nudge' flow: 2nd purchase -> pitch subscription with savings calc" },
          { id: "w7t3b", text: "Build 'Subscription Anniversary' flow: 3/6/12 month milestones with surprise gift" },
          { id: "w7t3c", text: "Build SMS re-engagement: 30-day inactive -> 'Miss you' text with offer" },
          { id: "w7t3d", text: "Build 'Subscription Downgrade Save': cancel -> offer pause or smaller box first" },
        ]},
      { id: "w7t4", owner: "D", dept: "paid", text: "Launch subscription-specific ad campaigns", priority: "high",
        subs: [
          { id: "w7t4a", text: "Create ads: '15% off forever when you subscribe'" },
          { id: "w7t4b", text: "Test on Meta + TikTok at $20/day" },
          { id: "w7t4c", text: "Create subscription unboxing content for TikTok Shop" },
        ]},
      { id: "w7t5", owner: "D", dept: "tiktok", text: "Increase affiliate commission for top performers to 25%", priority: "high" },
      { id: "w7t6", owner: "H", dept: "content", text: "Film 'Why I Subscribe' customer testimonial series (3 videos)", priority: "medium" },
      { id: "w7t7", owner: "D", dept: "grants", text: "Submit BevNET New Beverage Showdown (deadline May 15)", priority: "medium" },
    ]
  },
  {
    week: 8, label: "Scale: Amazon LIVE + Corporate Gifting + Poppi Sampling Model", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $7K/week. Amazon adds a whole new revenue stream. Corporate = high AOV.",
    tasks: [
      { id: "w8t1", owner: "D", dept: "amazon", text: "Launch Amazon PPC + Subscribe & Save", priority: "critical",
        subs: [
          { id: "w8t1a", text: "Launch auto-targeting PPC campaign: $20/day, let Amazon find keywords" },
          { id: "w8t1b", text: "Launch manual PPC: target 'bone broth', 'collagen broth', 'protein broth'" },
          { id: "w8t1c", text: "Enroll in Amazon Vine for early reviews (if eligible)" },
          { id: "w8t1d", text: "Enable Subscribe & Save on all SKUs" },
          { id: "w8t1e", text: "Create Amazon Storefront branded landing page" },
        ]},
      { id: "w8t2", owner: "D", dept: "growth", text: "Launch corporate gifting + B2B channel", priority: "critical",
        subs: [
          { id: "w8t2a", text: "Create corporate gifting one-pager: bulk pricing, customization, delivery" },
          { id: "w8t2b", text: "Register on gifting platforms: SnackMagic, Caroo, Giftory" },
          { id: "w8t2c", text: "Build corporate landing page: rootedbroth.co/corporate" },
          { id: "w8t2d", text: "Email 20 HR directors at NYC companies (use Apollo for contacts)" },
          { id: "w8t2e", text: "Pitch: 'Replace the protein bar budget — $380/mo for 20-person office'" },
        ]},
      { id: "w8t3", owner: "H", dept: "wholesale", text: "Poppi-style sampling events at top accounts", priority: "critical",
        subs: [
          { id: "w8t3a", text: "Organize 3 in-studio sampling events at your best wholesale locations" },
          { id: "w8t3b", text: "Setup: table, samples, menu card, QR code to shop, email capture iPad" },
          { id: "w8t3c", text: "Goal per event: 30 tastings, 10 sales, 15 email captures" },
          { id: "w8t3d", text: "Film everything for content (reaction videos perform best)" },
          { id: "w8t3e", text: "Offer the studio: 'We'll do this monthly if you want'" },
        ]},
      { id: "w8t4", owner: "D", dept: "product", text: "Create Gift Ritual bundle + wholesale sell sheet", priority: "high",
        subs: [
          { id: "w8t4a", text: "Gift Ritual: 2 flavors + ritual card + ribbon ($35)" },
          { id: "w8t4b", text: "Build gifting landing page with gift message option" },
          { id: "w8t4c", text: "Build wholesale sell sheet: 2-page PDF (product + brand story + pricing)" },
        ]},
      { id: "w8t5", owner: "D", dept: "paid", text: "Launch Google Search ads + scale Meta to $100/day total", priority: "high",
        subs: [
          { id: "w8t5a", text: "Google Search: 'bone broth tea bag', 'portable bone broth', 'collagen broth'" },
          { id: "w8t5b", text: "Scale Meta winning campaigns to $100/day total" },
          { id: "w8t5c", text: "Launch Pinterest promoted pins for recipe content ($10/day)" },
        ]},
      { id: "w8t6", owner: "D", dept: "grants", text: "Apply: Women Founders Network Fast Pitch ($25K, May 31 deadline)", priority: "medium" },
    ]
  },
  {
    week: 9, label: "Scale: Memorial Day Push + 2nd Market", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $8K/week. Memorial Day is your first big sales event. Execute the full playbook.",
    tasks: [
      { id: "w9t1", owner: "D", dept: "brand", text: "Memorial Day Sale campaign (May 25 weekend)", priority: "critical",
        subs: [
          { id: "w9t1a", text: "15% off sitewide: 'Summer wellness starts now'" },
          { id: "w9t1b", text: "Email sequence: 3 emails (Fri teaser, Sat sale live, Mon last chance)" },
          { id: "w9t1c", text: "SMS: 2 blasts (Sat + Mon)" },
          { id: "w9t1d", text: "Scale ads 2x for the weekend ($200/day)" },
          { id: "w9t1e", text: "TikTok Shop flash deal all weekend" },
          { id: "w9t1f", text: "Brief all affiliates: exclusive code for their audience" },
        ]},
      { id: "w9t2", owner: "D", dept: "tiktok", text: "Massive affiliate recruitment: 30 new creators this week", priority: "critical",
        subs: [
          { id: "w9t2a", text: "Search TikTok: #bonebroth #wellness #proteinsnack #momlife #gymlife" },
          { id: "w9t2b", text: "DM 50 creators, convert 30 to affiliates" },
          { id: "w9t2c", text: "Ship product to all within 48 hours" },
          { id: "w9t2d", text: "Create memorial day specific content brief for affiliates" },
        ]},
      { id: "w9t3", owner: "H", dept: "wholesale", text: "Add 2nd farmers market location", priority: "high",
        subs: [
          { id: "w9t3a", text: "Research: Brooklyn Flea, Hoboken Farmers Market, Smorgasburg" },
          { id: "w9t3b", text: "Apply for booth at 2 markets" },
          { id: "w9t3c", text: "Budget: $100-300/week per market" },
          { id: "w9t3d", text: "Goal: 2 market days per week = 2x email captures + revenue" },
        ]},
      { id: "w9t4", owner: "D", dept: "growth", text: "Approach postpartum + doula practices for partnerships", priority: "high",
        subs: [
          { id: "w9t4a", text: "Research 10 NYC doulas, lactation consultants, women's health practices" },
          { id: "w9t4b", text: "Pitch: 'Samples for all new clients, wholesale pricing, co-branded materials'" },
          { id: "w9t4c", text: "Close 3+ partnerships" },
        ]},
      { id: "w9t5", owner: "D", dept: "auto", text: "Build predictive churn system in Klaviyo", priority: "medium",
        subs: [
          { id: "w9t5a", text: "Enable Klaviyo predictive analytics: churn risk scoring" },
          { id: "w9t5b", text: "Build segment: customers with high churn risk score" },
          { id: "w9t5c", text: "Zap: customer hits churn risk -> trigger win-back SMS + email combo" },
        ]},
      { id: "w9t6", owner: "H", dept: "wholesale", text: "MILESTONE: 30+ active wholesale accounts", priority: "critical" },
    ]
  },
  {
    week: 10, label: "Scale: Fancy Food Show Prep + Retail Pipeline", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $9K/week. Start prepping for the biggest trade show opportunity of the year.",
    tasks: [
      { id: "w10t1", owner: "D", dept: "retail", text: "Fancy Food Show registration + buyer outreach", priority: "critical",
        subs: [
          { id: "w10t1a", text: "Register for Naturally Network Pavilion at Fancy Food Show (June 28-30, Javits NYC)" },
          { id: "w10t1b", text: "Budget: $3-5K for shared pavilion booth" },
          { id: "w10t1c", text: "Pre-schedule meetings with 10+ retail buyers attending" },
          { id: "w10t1d", text: "Prepare retail pitch deck: 10 slides with unit economics + velocity data" },
          { id: "w10t1e", text: "Order trade show materials: signage, samples (500+ units), sell sheets, business cards" },
        ]},
      { id: "w10t2", owner: "D", dept: "retail", text: "Start major retail groundwork", priority: "high",
        subs: [
          { id: "w10t2a", text: "Research Whole Foods local forager program — identify NE regional buyer" },
          { id: "w10t2b", text: "Research Target Forward Founders program" },
          { id: "w10t2c", text: "Begin UNFI/KeHE distributor application process" },
          { id: "w10t2d", text: "Ensure packaging meets all major retailer requirements (UPC, nutrition format)" },
        ]},
      { id: "w10t3", owner: "D", dept: "growth", text: "Luxury hotel amenity pilot pitch", priority: "high",
        subs: [
          { id: "w10t3a", text: "Research: 1 Hotels, Equinox Hotel NYC, Edition Hotels, Kimpton Hotels" },
          { id: "w10t3b", text: "Pitch F&B Director: in-room bone broth amenity alongside the kettle" },
          { id: "w10t3c", text: "Math: 200 rooms x monthly restock = $634+/mo per hotel" },
          { id: "w10t3d", text: "Offer: 30-day free pilot at one property" },
        ]},
      { id: "w10t4", owner: "D", dept: "paid", text: "Scale total ad spend to $150/day across all platforms", priority: "high" },
      { id: "w10t5", owner: "D", dept: "product", text: "Evaluate 3PL options for scaling fulfillment", priority: "medium",
        subs: [
          { id: "w10t5a", text: "Get quotes from ShipBob, Flexport, Whiplash" },
          { id: "w10t5b", text: "Compare: per-order cost, storage fees, speed, Shopify integration" },
          { id: "w10t5c", text: "Decision: switch if doing 50+ orders/day or if fulfillment is bottleneck" },
        ]},
      { id: "w10t6", owner: "D", dept: "content", text: "Launch YouTube channel + blog", priority: "medium",
        subs: [
          { id: "w10t6a", text: "Create YouTube channel: repurpose top TikToks + new long-form content" },
          { id: "w10t6b", text: "Publish first 3 SEO blog posts: bone broth benefits, collagen science, recipes" },
        ]},
    ]
  },
  {
    week: 11, label: "Scale: Father's Day + National Protein Day", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "Target: $10K/week. Two gift/sales moments back to back. Maximize both.",
    tasks: [
      { id: "w11t1", owner: "D", dept: "brand", text: "National Protein Day campaign (June 15)", priority: "critical",
        subs: [
          { id: "w11t1a", text: "'10g complete protein' messaging blitz across all channels" },
          { id: "w11t1b", text: "Comparison content: Rooted Broth vs protein shake vs protein bar" },
          { id: "w11t1c", text: "Partner with 5 gym/fitness creators for Protein Day content" },
          { id: "w11t1d", text: "Flash sale: protein-focused bundles 15% off" },
          { id: "w11t1e", text: "Email + SMS blast" },
        ]},
      { id: "w11t2", owner: "D", dept: "brand", text: "Father's Day campaign (June 21)", priority: "critical",
        subs: [
          { id: "w11t2a", text: "Gift campaign: 'For the dad who has everything — give him a ritual'" },
          { id: "w11t2b", text: "BBQ/grilling angle content: bone broth marinade recipe" },
          { id: "w11t2c", text: "Email sequence: teaser (1 week before), gift guide, last chance" },
          { id: "w11t2d", text: "Gift bundles on site + gift card push" },
        ]},
      { id: "w11t3", owner: "D", dept: "content", text: "Cold brew bone broth recipe for summer pivot", priority: "high",
        subs: [
          { id: "w11t3a", text: "Develop + film cold brew bone broth recipe (steep, chill, add ice + herbs)" },
          { id: "w11t3b", text: "Create 'Summer Ritual' content series" },
          { id: "w11t3c", text: "Update product pages with summer usage ideas" },
        ]},
      { id: "w11t4", owner: "D", dept: "paid", text: "Mid-phase ad creative refresh: 5 new creatives across all platforms", priority: "high" },
      { id: "w11t5", owner: "D", dept: "grants", text: "Submit BeyondCPG Accelerator NYC application", priority: "medium" },
      { id: "w11t6", owner: "H", dept: "wholesale", text: "MILESTONE: 40+ active wholesale accounts", priority: "critical" },
    ]
  },
  {
    week: 12, label: "Scale: FANCY FOOD SHOW WEEK", phase: "Launch & Scale", phaseColor: C.blue,
    revenue_note: "This week can generate $50K+ in wholesale pipeline. Go ALL in.",
    tasks: [
      { id: "w12t1", owner: "B", dept: "retail", text: "FANCY FOOD SHOW (June 28-30) — all hands", priority: "critical",
        subs: [
          { id: "w12t1a", text: "Booth setup day before: signage, samples, sell sheets, iPads, business cards" },
          { id: "w12t1b", text: "Both people at booth all 3 days — no breaks longer than 15 min" },
          { id: "w12t1c", text: "Pitch every single buyer who stops: one-line pitch -> sample -> pricing" },
          { id: "w12t1d", text: "Collect 50+ buyer business cards" },
          { id: "w12t1e", text: "Film ENTIRE experience for social content (10+ pieces minimum)" },
          { id: "w12t1f", text: "Log every contact in tracker SAME NIGHT — hot/warm/cold rating" },
        ]},
      { id: "w12t2", owner: "D", dept: "retail", text: "Follow up every lead within 48 hours of show", priority: "critical",
        subs: [
          { id: "w12t2a", text: "Send personalized follow-up email to every warm+ contact" },
          { id: "w12t2b", text: "Schedule calls with top 10 interested buyers within the week" },
          { id: "w12t2c", text: "Send sell sheet + pricing to every contact who requested it" },
        ]},
      { id: "w12t3", owner: "D", dept: "pr", text: "Pitch Fancy Food recap to BevNET, NOSH, Food Navigator", priority: "high" },
      { id: "w12t4", owner: "B", dept: "team", text: "PHASE 2 REVIEW: are we hitting $10K/week? Full channel audit", priority: "critical",
        subs: [
          { id: "w12t4a", text: "Pull total revenue by channel: DTC, wholesale, Amazon, TikTok Shop, markets" },
          { id: "w12t4b", text: "Calculate CAC and ROAS by platform" },
          { id: "w12t4c", text: "TikTok Shop review: total affiliate sales, top creators, ROI" },
          { id: "w12t4d", text: "Email/SMS revenue: which flows driving most revenue?" },
          { id: "w12t4e", text: "Decision: what to 2x, what to cut, where to shift budget" },
          { id: "w12t4f", text: "Hire 90-day review: KPIs vs targets, role evolution" },
        ]},
    ]
  },

  // ════ PHASE 3: ACCELERATE (Weeks 13-24) ══════════════════════════════
  {
    week: 13, label: "Accelerate: 4th of July Push + New Flavor R&D", phase: "Accelerate", phaseColor: C.teal,
    revenue_note: "Target: $12K/week. Q3 is about scaling what works and launching new SKUs.",
    tasks: [
      { id: "w13t1", owner: "D", dept: "brand", text: "4th of July Sale (July 4 weekend)", priority: "critical",
        subs: [
          { id: "w13t1a", text: "'Freedom from boring protein' — 20% off sitewide" },
          { id: "w13t1b", text: "Email: 3 emails (Thu teaser, Fri sale, Mon last chance)" },
          { id: "w13t1c", text: "SMS: 2 blasts (Fri + Mon)" },
          { id: "w13t1d", text: "Scale ads to $250/day for the weekend" },
          { id: "w13t1e", text: "Red/white/blue themed content + BBQ recipe content" },
          { id: "w13t1f", text: "TikTok Shop flash deal" },
        ]},
      { id: "w13t2", owner: "D", dept: "product", text: "New flavor development kickoff", priority: "high",
        subs: [
          { id: "w13t2a", text: "Send 'Vote on our next flavor' email to VIP list" },
          { id: "w13t2b", text: "Run Instagram poll: 3 flavor options" },
          { id: "w13t2c", text: "Finalize concept based on votes + market research" },
          { id: "w13t2d", text: "Order samples from manufacturer for testing" },
        ]},
      { id: "w13t3", owner: "D", dept: "retail", text: "Close Fancy Food Show deals — convert leads to accounts", priority: "critical" },
      { id: "w13t4", owner: "D", dept: "amazon", text: "Scale Amazon: $40/day PPC + Sponsored Brand + Display", priority: "high" },
      { id: "w13t5", owner: "D", dept: "growth", text: "Launch ambassador program: 10 superfans, monthly free product, 15% commission", priority: "high" },
      { id: "w13t6", owner: "H", dept: "wholesale", text: "MILESTONE: 50+ active wholesale accounts", priority: "critical" },
    ]
  },
  {
    week: 16, label: "Accelerate: National Wellness Month (Aug)", phase: "Accelerate", phaseColor: C.teal,
    revenue_note: "Target: $15K/week. August = wellness month. Own this narrative.",
    tasks: [
      { id: "w16t1", owner: "D", dept: "brand", text: "National Wellness Month campaign — full month activation", priority: "critical",
        subs: [
          { id: "w16t1a", text: "Launch '30-Day Broth Ritual Challenge' — daily content for 30 days" },
          { id: "w16t1b", text: "Partner with 20 wellness creators for challenge content" },
          { id: "w16t1c", text: "Create challenge landing page with subscription CTA" },
          { id: "w16t1d", text: "Email nurture: daily tips for 30 days (automated sequence)" },
          { id: "w16t1e", text: "UGC challenge: customers post daily ritual with hashtag" },
          { id: "w16t1f", text: "Subscription push: 'Start your 30-day ritual — subscribe & save'" },
        ]},
      { id: "w16t2", owner: "D", dept: "product", text: "New flavor launch prep: finalize formulation, order production", priority: "high" },
      { id: "w16t3", owner: "D", dept: "paid", text: "Scale total ad spend to $250/day", priority: "high" },
      { id: "w16t4", owner: "D", dept: "brand", text: "Back to School campaign prep (late Aug)", priority: "high",
        subs: [
          { id: "w16t4a", text: "'Quick protein for busy mornings' — parent + college student angle" },
          { id: "w16t4b", text: "Dorm room essential angle" },
          { id: "w16t4c", text: "College care package bundles" },
          { id: "w16t4d", text: "15% student discount (verify with SheerID)" },
        ]},
    ]
  },
  {
    week: 20, label: "Accelerate: New Flavor Launch + Mid-Year Review", phase: "Accelerate", phaseColor: C.teal,
    revenue_note: "Target: $18K/week. New flavor launch = press moment + content spike + reorder reason.",
    tasks: [
      { id: "w20t1", owner: "D", dept: "product", text: "NEW FLAVOR LAUNCH — full Poppi-style launch playbook", priority: "critical",
        subs: [
          { id: "w20t1a", text: "Product page live with professional photos" },
          { id: "w20t1b", text: "Email launch sequence: teaser (1 week before) -> reveal -> 'order now' -> review request" },
          { id: "w20t1c", text: "SMS: exclusive early access for SMS subscribers (24hr head start)" },
          { id: "w20t1d", text: "Seed to top 20 TikTok affiliates 1 week before launch" },
          { id: "w20t1e", text: "Paid ads: new flavor campaign $100/day across all platforms" },
          { id: "w20t1f", text: "Film: taste test content, recipe ideas, behind-scenes creation story" },
          { id: "w20t1g", text: "PR: pitch new flavor story to 10 food journalists" },
          { id: "w20t1h", text: "Amazon: list new flavor with launch PPC campaign" },
          { id: "w20t1i", text: "Wholesale: send samples to all accounts, announce in reorder emails" },
        ]},
      { id: "w20t2", owner: "B", dept: "team", text: "MID-YEAR REVIEW: are we on track to $1M?", priority: "critical",
        subs: [
          { id: "w20t2a", text: "Cumulative revenue vs target ($225K by end of Sep)" },
          { id: "w20t2b", text: "Channel profitability: where is actual profit, not just revenue?" },
          { id: "w20t2c", text: "Cash flow: runway at current burn, when cash-flow positive?" },
          { id: "w20t2d", text: "Ad audit: ROAS by platform — reallocate budget" },
          { id: "w20t2e", text: "Subscription MRR growth rate — is it compounding?" },
          { id: "w20t2f", text: "Do we need contractor help for holiday push?" },
        ]},
    ]
  },
  {
    week: 24, label: "Accelerate: Q4 Prep — Holiday War Room", phase: "Accelerate", phaseColor: C.teal,
    revenue_note: "Target: $20K/week. Q4 prep starts NOW. October 1 is too late.",
    tasks: [
      { id: "w24t1", owner: "D", dept: "product", text: "Q4 inventory: order 2x current levels for holiday demand", priority: "critical",
        subs: [
          { id: "w24t1a", text: "Calculate projected holiday demand (2-3x normal based on BFCM + gifting)" },
          { id: "w24t1b", text: "Place production order NOW (lead time matters)" },
          { id: "w24t1c", text: "Design holiday packaging: gift boxes, limited edition wrapping" },
          { id: "w24t1d", text: "Order extra packaging materials for gift bundles" },
        ]},
      { id: "w24t2", owner: "D", dept: "email", text: "Plan entire Q4 email/SMS calendar", priority: "critical",
        subs: [
          { id: "w24t2a", text: "Map every email from Oct 1 - Dec 31 (60+ emails)" },
          { id: "w24t2b", text: "Map every SMS from Oct 1 - Dec 31 (30+ texts)" },
          { id: "w24t2c", text: "Build BFCM email sequence: VIP early access, main sale, extensions" },
          { id: "w24t2d", text: "Build BFCM SMS sequence: aligned with email cadence" },
          { id: "w24t2e", text: "Build holiday gift guide emails" },
          { id: "w24t2f", text: "Build shipping cutoff urgency emails" },
        ]},
      { id: "w24t3", owner: "D", dept: "paid", text: "Q4 ad creative production: 10 holiday-themed creatives", priority: "critical" },
      { id: "w24t4", owner: "D", dept: "tiktok", text: "Brief all affiliates on Q4 promotions + holiday content calendar", priority: "high" },
      { id: "w24t5", owner: "D", dept: "growth", text: "Corporate gifting blitz: email 50 HR directors", priority: "high" },
      { id: "w24t6", owner: "D", dept: "website", text: "Build holiday landing pages: /gifts, /bfcm, /corporate-gifts", priority: "high" },
      { id: "w24t7", owner: "D", dept: "grants", text: "Submit Enthuse Annual Pitch Competition ($35K, deadline Oct 1)", priority: "medium" },
      { id: "w24t8", owner: "D", dept: "finance", text: "Q3 financials to WFOGen (due within 30 days)", priority: "critical" },
    ]
  },

  // ════ PHASE 4: DOMINATE Q4 (Weeks 25-32) ═════════════════════════════
  {
    week: 25, label: "Q4: October Launch — Cozy Season is HERE", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "Target: $22K/week. Fall = warm beverage season. Your biggest competitive advantage.",
    tasks: [
      { id: "w25t1", owner: "D", dept: "brand", text: "Fall campaign launch: 'Cozy Season is Here'", priority: "critical",
        subs: [
          { id: "w25t1a", text: "'This fall, try something that actually nourishes you' (anti-pumpkin spice angle)" },
          { id: "w25t1b", text: "Update all creative: warm tones, cozy aesthetics, sweater weather vibes" },
          { id: "w25t1c", text: "Email: 'Fall Wellness Collection' launch" },
          { id: "w25t1d", text: "All ads pivot to fall/cozy messaging" },
          { id: "w25t1e", text: "Candle + broth + blanket content aesthetic on all platforms" },
        ]},
      { id: "w25t2", owner: "D", dept: "brand", text: "Breast Cancer Awareness partnership (October)", priority: "high",
        subs: [
          { id: "w25t2a", text: "Donate % of Cozy Chick sales to breast cancer research" },
          { id: "w25t2b", text: "Co-branded content with awareness org" },
          { id: "w25t2c", text: "PR pitch to health outlets" },
        ]},
      { id: "w25t3", owner: "D", dept: "paid", text: "Scale ads to $300/day — warm audiences before BFCM", priority: "critical" },
      { id: "w25t4", owner: "D", dept: "email", text: "Cold & flu season immune support campaign", priority: "high" },
      { id: "w25t5", owner: "D", dept: "retail", text: "Push for holiday shelf placement at all retail partners", priority: "high" },
      { id: "w25t6", owner: "D", dept: "growth", text: "Close 5+ corporate gifting accounts for Dec delivery", priority: "critical" },
    ]
  },
  {
    week: 27, label: "Q4: National Bone Broth Day (Nov 1) — OUR SUPER BOWL", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "Target: $25K/week. This is the single most important brand day of the year.",
    tasks: [
      { id: "w27t1", owner: "D", dept: "brand", text: "National Bone Broth Day (Nov 1) — MAXIMUM EFFORT", priority: "critical",
        subs: [
          { id: "w27t1a", text: "25% off sitewide + free shipping" },
          { id: "w27t1b", text: "Email: dedicated campaign (sent Oct 31 teaser + Nov 1 main + Nov 2 last chance)" },
          { id: "w27t1c", text: "SMS: 3 blasts across 2 days" },
          { id: "w27t1d", text: "EVERY TikTok affiliate posts on Nov 1 (coordinate 2 weeks in advance)" },
          { id: "w27t1e", text: "TikTok LIVE marathon: 2-hour session with flash deals" },
          { id: "w27t1f", text: "All ads at 3x budget for 48 hours" },
          { id: "w27t1g", text: "Press release to all food/wellness media" },
          { id: "w27t1h", text: "Sampling events at all wholesale locations that agree" },
          { id: "w27t1i", text: "Amazon deals: coupons + promos" },
          { id: "w27t1j", text: "Target: $5K+ revenue from this single day" },
        ]},
      { id: "w27t2", owner: "D", dept: "email", text: "Build BFCM Early Access VIP list signup", priority: "critical",
        subs: [
          { id: "w27t2a", text: "Email: 'Join the VIP list for first access to our biggest sale ever'" },
          { id: "w27t2b", text: "SMS: 'Reply YES for early access to Black Friday'" },
          { id: "w27t2c", text: "Goal: build anticipation + segment your hottest buyers" },
        ]},
      { id: "w27t3", owner: "D", dept: "auto", text: "Test ALL BFCM automations end-to-end", priority: "critical" },
      { id: "w27t4", owner: "D", dept: "product", text: "Confirm all BFCM inventory is received + prepped", priority: "critical" },
    ]
  },
  {
    week: 29, label: "Q4: BLACK FRIDAY / CYBER MONDAY — THE BIG ONE", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "Target: $40K this week. This is the single biggest revenue week of the year.",
    tasks: [
      { id: "w29t1", owner: "D", dept: "paid", text: "BFCM ads: scale to $500/day ALL platforms", priority: "critical",
        subs: [
          { id: "w29t1a", text: "Tuesday: VIP early access ads (retarget past purchasers + email list)" },
          { id: "w29t1b", text: "Wednesday: pre-sale hype ads (everyone)" },
          { id: "w29t1c", text: "Friday-Sunday: main sale ads at maximum spend" },
          { id: "w29t1d", text: "Monday: Cyber Monday last chance ads" },
          { id: "w29t1e", text: "Refresh creative daily based on performance" },
        ]},
      { id: "w29t2", owner: "D", dept: "email", text: "Execute BFCM email + SMS sequences", priority: "critical",
        subs: [
          { id: "w29t2a", text: "Tuesday: VIP early access email (subscribers/VIPs only)" },
          { id: "w29t2b", text: "Thursday: 'Tomorrow is the day' hype email" },
          { id: "w29t2c", text: "Friday AM: 'BLACK FRIDAY IS LIVE — 30% OFF' email + SMS" },
          { id: "w29t2d", text: "Saturday: 'Best sellers selling fast' social proof email" },
          { id: "w29t2e", text: "Sunday: 'Last day for Black Friday pricing' email + SMS" },
          { id: "w29t2f", text: "Monday AM: 'CYBER MONDAY — Extended 25% off + free gift' email + SMS" },
          { id: "w29t2g", text: "Monday PM: 'Final hours — sale ends at midnight' email + SMS" },
        ]},
      { id: "w29t3", owner: "D", dept: "tiktok", text: "TikTok Shop BFCM mega-deal + affiliate coordination", priority: "critical",
        subs: [
          { id: "w29t3a", text: "Set up TikTok Shop mega-deal pricing" },
          { id: "w29t3b", text: "Coordinate: all affiliates post on Black Friday" },
          { id: "w29t3c", text: "Go LIVE every day of BFCM week — flash deals each session" },
          { id: "w29t3d", text: "Bonus commission: 30% for BFCM week only" },
        ]},
      { id: "w29t4", owner: "D", dept: "amazon", text: "Amazon BFCM: Lightning Deals, coupons, all promos live", priority: "critical" },
      { id: "w29t5", owner: "H", dept: "cx", text: "All-hands customer service: respond within 1 hour all week", priority: "critical" },
      { id: "w29t6", owner: "B", dept: "finance", text: "Track revenue HOURLY during BFCM: target $15K+ single day on Black Friday", priority: "critical" },
    ]
  },
  {
    week: 30, label: "Q4: Holiday Gifting Sprint", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "Target: $30K/week. Shift ALL messaging to gifting. Every product is a gift now.",
    tasks: [
      { id: "w30t1", owner: "D", dept: "brand", text: "Giving Tuesday (Dec 1): 100% profits to Action Against Hunger", priority: "critical",
        subs: [
          { id: "w30t1a", text: "PR this HARD: press release to all outlets" },
          { id: "w30t1b", text: "Email: '100% of today's profits feed hungry people'" },
          { id: "w30t1c", text: "This generates press, goodwill, and sales simultaneously" },
        ]},
      { id: "w30t2", owner: "D", dept: "email", text: "Holiday Gift Guide campaign — weekly until Christmas", priority: "critical",
        subs: [
          { id: "w30t2a", text: "Email 1: 'The Ultimate Wellness Gift Guide'" },
          { id: "w30t2b", text: "Email 2: 'Gifts Under $50 That Feel Like $100'" },
          { id: "w30t2c", text: "Email 3: 'Last-Minute Gifts That Ship Fast'" },
          { id: "w30t2d", text: "SMS: 'Gift shopping? We've got you' with direct link" },
        ]},
      { id: "w30t3", owner: "D", dept: "paid", text: "Shift all ads to gifting creative: 'The Perfect Wellness Gift'", priority: "critical" },
      { id: "w30t4", owner: "D", dept: "website", text: "Add shipping cutoff countdown timer to all product pages", priority: "high" },
      { id: "w30t5", owner: "H", dept: "wholesale", text: "Holiday reorder push: contact ALL accounts for holiday restock", priority: "high" },
    ]
  },
  {
    week: 31, label: "Q4: Shipping Cutoff Urgency + Digital Gifts Pivot", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "Target: $25K/week. Create maximum urgency before shipping cutoffs.",
    tasks: [
      { id: "w31t1", owner: "D", dept: "email", text: "Shipping cutoff urgency campaign", priority: "critical",
        subs: [
          { id: "w31t1a", text: "5 days before cutoff: 'Order soon for guaranteed Christmas delivery'" },
          { id: "w31t1b", text: "3 days before: 'Shipping deadline approaching — don't miss it'" },
          { id: "w31t1c", text: "1 day before: 'LAST DAY for Christmas delivery — order by midnight'" },
          { id: "w31t1d", text: "Day of cutoff: 'Final hours for standard shipping'" },
          { id: "w31t1e", text: "After cutoff: pivot to e-gift cards + subscription gifts (instant delivery)" },
        ]},
      { id: "w31t2", owner: "D", dept: "paid", text: "Shift ads to digital gift cards after shipping cutoff", priority: "critical" },
      { id: "w31t3", owner: "D", dept: "tiktok", text: "'Still need a gift?' content — last minute gifting push", priority: "high" },
      { id: "w31t4", owner: "H", dept: "content", text: "New Year campaign content prep: 'New Year, New Ritual'", priority: "high" },
    ]
  },
  {
    week: 32, label: "Q4: Year-End Close + 2027 Setup", phase: "Dominate Q4", phaseColor: C.red,
    revenue_note: "FINAL WEEK. Calculate the total. Celebrate. Then plan to do it bigger in 2027.",
    tasks: [
      { id: "w32t1", owner: "D", dept: "email", text: "New Year's Resolution campaign: subscription push", priority: "critical",
        subs: [
          { id: "w32t1a", text: "'Start 2027 with a daily ritual' — subscription special" },
          { id: "w32t1b", text: "First month 50% off subscription" },
          { id: "w32t1c", text: "Email: 'Your 2027 self will thank you'" },
          { id: "w32t1d", text: "Target: convert Dec one-time buyers to Jan subscribers" },
        ]},
      { id: "w32t2", owner: "D", dept: "email", text: "Year-end thank you email to ALL customers", priority: "high" },
      { id: "w32t3", owner: "D", dept: "paid", text: "New Year resolution ads: wellness + ritual messaging", priority: "high" },
      { id: "w32t4", owner: "B", dept: "finance", text: "CALCULATE TOTAL 2026 REVENUE", priority: "critical",
        subs: [
          { id: "w32t4a", text: "Pull every channel: Shopify DTC, Shopify wholesale, Amazon, TikTok Shop, markets, corporate" },
          { id: "w32t4b", text: "Calculate: total revenue, gross margin, net profit" },
          { id: "w32t4c", text: "Compare to $1M target" },
          { id: "w32t4d", text: "Q4 financials prep for WFOGen" },
        ]},
      { id: "w32t5", owner: "B", dept: "team", text: "Annual review: what worked, what didn't, 2027 strategy", priority: "critical",
        subs: [
          { id: "w32t5a", text: "Top 5 wins of 2026" },
          { id: "w32t5b", text: "Top 5 misses and lessons learned" },
          { id: "w32t5c", text: "2027 revenue target and channel plan" },
          { id: "w32t5d", text: "2027 budget and hiring plan" },
          { id: "w32t5e", text: "2027 product roadmap (new flavors, new formats, retail expansion)" },
        ]},
    ]
  },
];

// ─── REVENUE MILESTONES ─────────────────────────────────────────────────────
const REVENUE_MILESTONES = [
  { month: "Apr", target: 18000, run: 4500, note: "Foundation + first sales from flows + market + existing wholesale" },
  { month: "May", target: 42000, run: 10500, note: "Paid ads scaling, TikTok Shop launched, Mother's Day + Memorial Day" },
  { month: "Jun", target: 72000, run: 15000, note: "Affiliates + Fancy Food Show pipeline + Father's Day + Protein Day" },
  { month: "Jul", target: 110000, run: 19000, note: "Amazon FBA live, 4th of July, 50+ wholesale, corporate accounts started" },
  { month: "Aug", target: 160000, run: 25000, note: "Wellness Month campaign, scaling ads, Back to School, new flavor prep" },
  { month: "Sep", target: 225000, run: 32500, note: "New flavor launch, Fall campaign, Labor Day, retail conversations closing" },
  { month: "Oct", target: 310000, run: 42500, note: "Q4 push, Bone Broth Day mega-event, holiday ads live, gift bundles" },
  { month: "Nov", target: 430000, run: 60000, note: "BFCM ($40K week), Small Biz Saturday, Giving Tuesday, Cyber Monday" },
  { month: "Dec", target: 560000, run: 65000, note: "Holiday gifting peak, corporate orders, shipping urgency, New Year push" },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────
// ─── WEEKLY TARGETS for the tracker ─────────────────────────────────────────
const WEEK_TARGETS = [];
for (let i = 1; i <= 32; i++) {
  let rev = 0;
  if (i <= 4) rev = 3000 + i * 500;
  else if (i <= 8) rev = 5000 + (i - 4) * 1000;
  else if (i <= 12) rev = 9000 + (i - 8) * 1500;
  else if (i <= 20) rev = 15000 + (i - 12) * 1500;
  else if (i <= 24) rev = 27000 + (i - 20) * 2500;
  else if (i <= 28) rev = 37000 + (i - 24) * 3000;
  else rev = 49000 + (i - 28) * 5000;
  let accts = Math.min(i <= 4 ? i * 5 : i <= 8 ? 20 + (i - 4) * 5 : i <= 12 ? 40 + (i - 8) * 5 : 60 + (i - 12) * 2, 100);
  WEEK_TARGETS.push({ week: i, revTarget: rev, acctTarget: accts });
}

// Sales map URL
const SALES_MAP_URL = "https://rooted-broth-sales-map.onrender.com/";

export default function App() {
  const [checked, setChecked] = useState({});
  const [view, setView] = useState("weekly");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [freqFilter, setFreqFilter] = useState("ALL");
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [expandedSubs, setExpandedSubs] = useState({});

  // ─── REVENUE TRACKER STATE ──────────────────────────────────────────
  const [weeklyData, setWeeklyData] = useState({}); // { 1: { revenue: 3200, accounts: 5, notes: "..." }, ... }
  const [wonAccounts, setWonAccounts] = useState(0);
  const [editingWeek, setEditingWeek] = useState(null);
  const [editForm, setEditForm] = useState({ revenue: "", accounts: "", shopify: "", amazon: "", tiktok: "", wholesale: "", subscriptionMRR: "", notes: "" });

  // Load all data
  useEffect(() => {
    (async () => {
      try { const s = await window.storage.get("rb-1m-v4"); if (s) setChecked(JSON.parse(s.value)); } catch (e) {}
      try { const s = await window.storage.get("rb-1m-weekly-data"); if (s) setWeeklyData(JSON.parse(s.value)); } catch (e) {}
    })();
    // Try to read won accounts from sales tracker localStorage
    try {
      const raw = localStorage.getItem("rooted_broth_outreach_v2");
      if (raw) {
        const data = JSON.parse(raw);
        let won = 0;
        Object.values(data).forEach(o => { if (o && o.statuses && o.statuses.includes("won")) won++; });
        setWonAccounts(won);
      }
    } catch (e) {}
    // Also listen for storage changes from sales tracker
    const handler = (e) => {
      if (e.key === "rooted_broth_outreach_v2") {
        try {
          const data = JSON.parse(e.newValue);
          let won = 0;
          Object.values(data).forEach(o => { if (o && o.statuses && o.statuses.includes("won")) won++; });
          setWonAccounts(won);
        } catch (ex) {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const save = useCallback(async (nc) => {
    try { await window.storage.set("rb-1m-v4", JSON.stringify(nc)); setSaved(true); setTimeout(() => setSaved(false), 1200); } catch (e) {}
  }, []);

  const saveWeeklyData = useCallback(async (nd) => {
    try { await window.storage.set("rb-1m-weekly-data", JSON.stringify(nd)); setSaved(true); setTimeout(() => setSaved(false), 1200); } catch (e) {}
  }, []);

  const saveWeekEntry = useCallback((weekNum) => {
    const nd = { ...weeklyData, [weekNum]: {
      revenue: parseFloat(editForm.revenue) || 0,
      accounts: parseInt(editForm.accounts) || 0,
      shopify: parseFloat(editForm.shopify) || 0,
      amazon: parseFloat(editForm.amazon) || 0,
      tiktok: parseFloat(editForm.tiktok) || 0,
      wholesale: parseFloat(editForm.wholesale) || 0,
      subscriptionMRR: parseFloat(editForm.subscriptionMRR) || 0,
      notes: editForm.notes || "",
    }};
    setWeeklyData(nd);
    saveWeeklyData(nd);
    setEditingWeek(null);
  }, [weeklyData, editForm, saveWeeklyData]);

  const startEditWeek = useCallback((weekNum) => {
    const existing = weeklyData[weekNum] || {};
    setEditForm({
      revenue: existing.revenue || "",
      accounts: existing.accounts || "",
      shopify: existing.shopify || "",
      amazon: existing.amazon || "",
      tiktok: existing.tiktok || "",
      wholesale: existing.wholesale || "",
      subscriptionMRR: existing.subscriptionMRR || "",
      notes: existing.notes || "",
    });
    setEditingWeek(weekNum);
  }, [weeklyData]);

  // Refresh won accounts from sales tracker
  const refreshWonAccounts = useCallback(() => {
    try {
      const raw = localStorage.getItem("rooted_broth_outreach_v2");
      if (raw) {
        const data = JSON.parse(raw);
        let won = 0;
        Object.values(data).forEach(o => { if (o && o.statuses && o.statuses.includes("won")) won++; });
        setWonAccounts(won);
      }
    } catch (e) {}
  }, []);

  const toggle = useCallback((id) => {
    const u = { ...checked, [id]: !checked[id] }; setChecked(u); save(u);
  }, [checked, save]);

  const toggleExpand = useCallback((id) => {
    setExpandedSubs(p => ({ ...p, [id]: !p[id] }));
  }, []);

  // Computed
  const allWeeklyTasks = useMemo(() => WEEKS.flatMap(w => w.tasks), []);
  const allWeeklySubs = useMemo(() => allWeeklyTasks.flatMap(t => t.subs || []), [allWeeklyTasks]);
  const allRecurringSubs = useMemo(() => RECURRING.flatMap(t => t.subs || []), []);
  const allCheckable = useMemo(() => [...allWeeklyTasks, ...allWeeklySubs, ...RECURRING, ...allRecurringSubs], [allWeeklyTasks, allWeeklySubs, allRecurringSubs]);
  const totalAll = allCheckable.length;
  const doneAll = allCheckable.filter(t => checked[t.id]).length;
  const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;

  const phases = useMemo(() => {
    const map = {};
    WEEKS.forEach(w => {
      if (!map[w.phase]) map[w.phase] = { label: w.phase, color: w.phaseColor, weeks: [] };
      map[w.phase].weeks.push(w);
    });
    return Object.values(map);
  }, []);

  const weekProgress = useMemo(() => WEEKS.map(w => {
    const items = [...w.tasks, ...w.tasks.flatMap(t => t.subs || [])];
    const done = items.filter(t => checked[t.id]).length;
    return { week: w.week, total: items.length, done, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
  }), [checked]);

  const currentWeekData = WEEKS.find(w => w.week === currentWeek) || WEEKS[0];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    WEEKS.forEach(w => w.tasks.forEach(t => {
      if (t.text.toLowerCase().includes(q)) results.push({ ...t, source: `Week ${w.week}` });
      (t.subs || []).forEach(s => { if (s.text.toLowerCase().includes(q)) results.push({ ...s, source: `Week ${w.week}`, dept: t.dept, owner: t.owner }); });
    }));
    RECURRING.forEach(t => {
      if (t.text.toLowerCase().includes(q)) results.push({ ...t, source: `Recurring (${t.freq})` });
      (t.subs || []).forEach(s => { if (s.text.toLowerCase().includes(q)) results.push({ ...s, source: `Recurring (${t.freq})`, dept: t.dept, owner: t.owner }); });
    });
    return results.slice(0, 30);
  }, [searchQuery]);

  // Holiday filtering
  const currentMonth = useMemo(() => {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return monthNames;
  }, []);
  const [holidayMonth, setHolidayMonth] = useState(3); // April = index 3

  const filteredHolidays = useMemo(() => {
    const m = String(holidayMonth + 1).padStart(2, "0");
    return HOLIDAYS.filter(h => h.date.startsWith(`2026-${m}`));
  }, [holidayMonth]);

  // ─── TASK CARD ────────────────────────────────────────────────────────
  const TaskCard = ({ task, showSource, indent }) => {
    const isDone = checked[task.id];
    const dept = DEPTS[task.dept] || {};
    const owner = OWNERS[task.owner] || {};
    const pri = PRIORITY[task.priority] || {};
    const hasSubs = task.subs && task.subs.length > 0;
    const isExpanded = expandedSubs[task.id];
    const subsDone = hasSubs ? task.subs.filter(s => checked[s.id]).length : 0;

    return (
      <div style={{ marginLeft: indent ? 20 : 0 }}>
        <div
          style={{
            background: isDone ? "#FAFAF8" : C.card, border: `1px solid ${isDone ? C.soft : C.border}`,
            borderRadius: 8, padding: "10px 14px", cursor: "pointer",
            opacity: isDone ? 0.5 : 1, transition: "all 0.15s", marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div onClick={(e) => { e.stopPropagation(); toggle(task.id); }} style={{
              width: 20, height: 20, borderRadius: 5, border: `2px solid ${isDone ? C.green : C.border}`,
              background: isDone ? C.green : "transparent", flexShrink: 0, marginTop: 1,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              {isDone && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>\u2713</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }} onClick={() => hasSubs && toggleExpand(task.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                {task.priority && <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 6, background: pri.bg, color: pri.color, fontWeight: 700, letterSpacing: "0.03em" }}>{pri.label}</span>}
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: owner.bg, color: owner.color, fontWeight: 600 }}>{owner.label}</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: dept.bg, color: dept.color, fontWeight: 600 }}>{dept.icon} {dept.label}</span>
                {showSource && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: "#F0F0F0", color: C.muted }}>{task.source}</span>}
                {task.freq && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: task.freq === "daily" ? C.lightRed : task.freq === "weekly" ? C.lightOrange : task.freq === "monthly" ? C.lightBlue : C.lightPurple, color: task.freq === "daily" ? C.red : task.freq === "weekly" ? C.orange : task.freq === "monthly" ? C.blue : C.purple, fontWeight: 600 }}>{task.freq.toUpperCase()}</span>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: isDone ? C.muted : C.charcoal, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.5 }}>{task.text}</div>
              {hasSubs && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4, cursor: "pointer" }}>
                  {isExpanded ? "\u25BC" : "\u25B6"} {subsDone}/{task.subs.length} subtasks {subsDone === task.subs.length && task.subs.length > 0 ? "\u2713" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Subtasks */}
        {hasSubs && isExpanded && (
          <div style={{ marginLeft: 30, marginBottom: 8 }}>
            {task.subs.map(sub => {
              const subDone = checked[sub.id];
              return (
                <div key={sub.id} onClick={() => toggle(sub.id)} style={{
                  display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 10px",
                  background: subDone ? "#FAFAF8" : "#FEFEFE", borderLeft: `2px solid ${subDone ? C.green : C.soft}`,
                  marginBottom: 2, cursor: "pointer", borderRadius: "0 6px 6px 0",
                  opacity: subDone ? 0.5 : 1,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, border: `2px solid ${subDone ? C.green : C.border}`,
                    background: subDone ? C.green : "transparent", flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {subDone && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>\u2713</span>}
                  </div>
                  <span style={{ fontSize: 12, color: subDone ? C.muted : C.charcoal, textDecoration: subDone ? "line-through" : "none", lineHeight: 1.5 }}>{sub.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: C.bg, minHeight: "100vh", color: C.charcoal, display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{ background: C.green, color: C.cream, padding: "10px 16px", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Rooted Broth — $1M Revenue Dashboard</div>
            <div style={{ fontSize: 9, color: "#B8C98A", letterSpacing: "0.1em", textTransform: "uppercase" }}>32 weeks \u00B7 2 people \u00B7 every channel \u00B7 Poppi-level execution</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saved && <span style={{ color: "#B8C98A", fontSize: 10 }}>\u2713</span>}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#E8C97A" }}>{pct}%</div>
              <div style={{ fontSize: 8, color: "#B8C98A" }}>{doneAll}/{totalAll}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 3, marginTop: 6, flexWrap: "wrap" }}>
          {[
            { key: "weekly", label: "Weekly Plan" },
            { key: "tracker", label: "Revenue Tracker" },
            { key: "salesmap", label: "Sales Map" },
            { key: "recurring", label: "Recurring" },
            { key: "holidays", label: "Holidays" },
            { key: "revenue", label: "Targets" },
            { key: "search", label: "Search" },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{
              padding: "4px 10px", borderRadius: 5, border: "none",
              background: view === v.key ? "rgba(255,255,255,0.2)" : "transparent",
              color: view === v.key ? "#fff" : "#B8C98A", fontSize: 10, fontWeight: view === v.key ? 600 : 400, cursor: "pointer",
            }}>{v.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
          <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} style={{ fontSize: 10, padding: "3px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: C.cream }}>
            <option value="ALL">All owners</option>
            <option value="D">Danielle</option><option value="H">Hire</option><option value="B">Both</option>
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ fontSize: 10, padding: "3px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: C.cream }}>
            <option value="ALL">All depts</option>
            {Object.entries(DEPTS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          {view === "recurring" && (
            <select value={freqFilter} onChange={e => setFreqFilter(e.target.value)} style={{ fontSize: 10, padding: "3px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: C.cream }}>
              <option value="ALL">All freq</option>
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option>
            </select>
          )}
          <button onClick={() => setSideOpen(v => !v)} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: C.cream, borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 10, marginLeft: "auto" }}>{sideOpen ? "\u2190" : "\u2630"}</button>
        </div>

        <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, marginTop: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#E8C97A", borderRadius: 2, transition: "width 0.6s" }} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* SIDEBAR */}
        {sideOpen && (view === "weekly" || view === "tracker") && (
          <div style={{ width: 190, flexShrink: 0, background: "#fff", borderRight: `1px solid ${C.border}`, overflowY: "auto", position: "sticky", top: 130, maxHeight: "calc(100vh - 130px)" }}>
            {phases.map(phase => (
              <div key={phase.label}>
                <div style={{ padding: "6px 10px", fontSize: 9, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em", background: "#FAFAFA", borderBottom: `1px solid ${C.border}` }}>{phase.label}</div>
                {phase.weeks.map(w => {
                  const wp = weekProgress.find(p => p.week === w.week);
                  const isOn = currentWeek === w.week;
                  return (
                    <button key={w.week} onClick={() => setCurrentWeek(w.week)} style={{
                      display: "flex", alignItems: "center", gap: 6, width: "100%",
                      padding: "6px 10px", background: isOn ? C.lightGreen : "transparent",
                      border: "none", borderLeft: `3px solid ${isOn ? C.green : "transparent"}`, cursor: "pointer", textAlign: "left",
                    }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: wp?.pct === 100 ? C.green : "#F5F5F5", border: `2px solid ${wp?.pct === 100 ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {wp?.pct === 100 ? <span style={{ color: "#fff", fontSize: 9 }}>\u2713</span> : <span style={{ fontSize: 8, fontWeight: 600, color: C.muted }}>{w.week}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 9, fontWeight: isOn ? 600 : 400, color: isOn ? C.green : C.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.label.split(": ")[1] || w.label}</div>
                        <div style={{ fontSize: 8, color: C.muted }}>{wp?.done}/{wp?.total} {wp?.pct > 0 && wp?.pct < 100 && `(${wp?.pct}%)`}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 60px", maxWidth: 900 }}>

          {/* WEEKLY VIEW */}
          {view === "weekly" && (() => {
            const w = currentWeekData;
            const allItems = [...w.tasks, ...w.tasks.flatMap(t => t.subs || [])];
            const done = allItems.filter(t => checked[t.id]).length;
            const total = allItems.length;

            const filteredTasks = w.tasks.filter(t => {
              if (ownerFilter !== "ALL" && t.owner !== ownerFilter) return false;
              if (deptFilter !== "ALL" && t.dept !== deptFilter) return false;
              return true;
            });

            // Group by priority
            const priorityOrder = ["critical", "high", "medium", "low"];

            return (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: w.phaseColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>{w.phase}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>Week {w.week}: {w.label.split(": ")[1] || w.label}</div>
                  {w.revenue_note && <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{w.revenue_note}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {priorityOrder.map(p => {
                        const count = filteredTasks.filter(t => t.priority === p).length;
                        if (!count) return null;
                        const pc = PRIORITY[p];
                        return <span key={p} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: pc.bg, color: pc.color, fontWeight: 600 }}>{pc.label}: {count}</span>;
                      })}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: done === total ? C.green : C.orange }}>{done}/{total}</div>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${total ? (done / total) * 100 : 0}%`, background: done === total ? C.green : C.orange, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                </div>

                {priorityOrder.map(pri => {
                  const tasks = filteredTasks.filter(t => t.priority === pri);
                  if (!tasks.length) return null;
                  const pc = PRIORITY[pri];
                  return (
                    <div key={pri} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 8, background: pc.bg, color: pc.color, fontWeight: 700 }}>{pc.label}</span>
                        <div style={{ flex: 1, height: 1, background: C.soft }} />
                      </div>
                      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                  );
                })}

                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  {(() => { const prev = WEEKS.filter(wk => wk.week < currentWeek).pop(); return prev ? (
                    <button onClick={() => setCurrentWeek(prev.week)} style={{ flex: 1, padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 11, color: C.muted }}>\u2190 Week {prev.week}</button>
                  ) : null; })()}
                  {(() => { const next = WEEKS.find(wk => wk.week > currentWeek); return next ? (
                    <button onClick={() => setCurrentWeek(next.week)} style={{ flex: 1, padding: "8px 12px", border: `1px solid ${C.green}`, borderRadius: 8, background: C.green, cursor: "pointer", fontSize: 11, color: C.cream, fontWeight: 600 }}>Week {next.week} \u2192</button>
                  ) : null; })()}
                </div>
              </div>
            );
          })()}

          {/* ─── REVENUE TRACKER VIEW ────────────────────────────── */}
          {view === "tracker" && (() => {
            // Compute cumulative
            const weekNums = WEEK_TARGETS.map(w => w.week);
            const cumulativeActual = [];
            let cumRev = 0;
            let cumAccts = 0;
            weekNums.forEach(wn => {
              const d = weeklyData[wn];
              if (d) { cumRev += d.revenue; cumAccts = Math.max(cumAccts, d.accounts); }
              cumulativeActual.push({ week: wn, revenue: cumRev, accounts: cumAccts, hasData: !!d });
            });
            const cumulativeTarget = [];
            let cumTarget = 0;
            WEEK_TARGETS.forEach(wt => { cumTarget += wt.revTarget; cumulativeTarget.push({ week: wt.week, revenue: cumTarget }); });
            const maxRev = Math.max(560000, cumRev, cumTarget);
            const chartW = 800;
            const chartH = 200;
            const lastDataWeek = cumulativeActual.filter(c => c.hasData).length;

            // SVG chart points
            const targetPoints = cumulativeTarget.map((c, i) => `${(i / 31) * chartW},${chartH - (c.revenue / maxRev) * chartH}`).join(" ");
            const actualPoints = cumulativeActual.filter(c => c.hasData).map((c, i) => `${(i / 31) * chartW},${chartH - (c.revenue / maxRev) * chartH}`).join(" ");

            // Account chart
            const maxAccts = Math.max(100, cumAccts);
            const acctTargetPts = WEEK_TARGETS.map((wt, i) => `${(i / 31) * chartW},${100 - (wt.acctTarget / maxAccts) * 100}`).join(" ");
            const acctActualPts = cumulativeActual.filter(c => c.hasData).map((c, i) => `${(i / 31) * chartW},${100 - (c.accounts / maxAccts) * 100}`).join(" ");

            return (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>Revenue Tracker</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Enter your actual numbers each Monday. Track against the $1M plan.</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {wonAccounts > 0 && (
                      <div style={{ background: C.lightGreen, border: `1px solid ${C.green}`, borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{wonAccounts}</div>
                        <div style={{ fontSize: 8, color: C.green, fontWeight: 600 }}>WON (Sales Map)</div>
                      </div>
                    )}
                    <button onClick={refreshWonAccounts} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", color: C.muted }}>Refresh from Sales Map</button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "Total Revenue", value: `$${(cumRev / 1000).toFixed(1)}K`, target: "$560K", color: C.green },
                    { label: "This Week", value: weeklyData[lastDataWeek] ? `$${(weeklyData[lastDataWeek].revenue / 1000).toFixed(1)}K` : "--", target: WEEK_TARGETS[lastDataWeek - 1] ? `$${(WEEK_TARGETS[lastDataWeek - 1].revTarget / 1000).toFixed(1)}K` : "--", color: C.blue },
                    { label: "Wholesale Accts", value: cumAccts || wonAccounts || "--", target: "80+", color: C.orange },
                    { label: "Sub MRR", value: weeklyData[lastDataWeek]?.subscriptionMRR ? `$${(weeklyData[lastDataWeek].subscriptionMRR / 1000).toFixed(1)}K` : "--", target: "$12K", color: C.purple },
                    { label: "Weeks Tracked", value: `${lastDataWeek}/32`, target: "", color: C.teal },
                    { label: "Won (Sales Map)", value: wonAccounts, target: "", color: C.green },
                  ].map(kpi => (
                    <div key={kpi.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                      <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{kpi.label}</div>
                      {kpi.target && <div style={{ fontSize: 9, color: C.muted }}>target: {kpi.target}</div>}
                    </div>
                  ))}
                </div>

                {/* Revenue Growth Chart */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Cumulative Revenue: Actual vs Target</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: C.green, borderRadius: 2, display: "inline-block" }} /> Actual</span>
                    <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: C.muted, borderRadius: 2, display: "inline-block", opacity: 0.4 }} /> Target</span>
                  </div>
                  <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ width: "100%", height: 220 }}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => (
                      <g key={pct}>
                        <line x1={0} y1={chartH - pct * chartH} x2={chartW} y2={chartH - pct * chartH} stroke={C.border} strokeWidth={0.5} />
                        <text x={-2} y={chartH - pct * chartH + 3} fontSize={8} fill={C.muted} textAnchor="end">${((pct * maxRev) / 1000).toFixed(0)}K</text>
                      </g>
                    ))}
                    {/* Target line */}
                    <polyline points={targetPoints} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="6,4" opacity={0.3} />
                    {/* Actual line */}
                    {lastDataWeek > 0 && <polyline points={actualPoints} fill="none" stroke={C.green} strokeWidth={3} />}
                    {/* Actual dots */}
                    {cumulativeActual.filter(c => c.hasData).map((c, i) => (
                      <circle key={i} cx={(i / 31) * chartW} cy={chartH - (c.revenue / maxRev) * chartH} r={4} fill={C.green} />
                    ))}
                    {/* Week labels */}
                    {[1, 4, 8, 12, 16, 20, 24, 28, 32].map(wn => (
                      <text key={wn} x={((wn - 1) / 31) * chartW} y={chartH + 14} fontSize={8} fill={C.muted} textAnchor="middle">W{wn}</text>
                    ))}
                  </svg>
                </div>

                {/* Wholesale Accounts Chart */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Wholesale Accounts: Actual vs Target</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: C.orange, borderRadius: 2, display: "inline-block" }} /> Actual / Won</span>
                    <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: C.muted, borderRadius: 2, display: "inline-block", opacity: 0.4 }} /> Target</span>
                  </div>
                  <svg viewBox={`0 0 ${chartW} 120`} style={{ width: "100%", height: 130 }}>
                    {[0, 25, 50, 75, 100].map(v => (
                      <g key={v}>
                        <line x1={0} y1={100 - v} x2={chartW} y2={100 - v} stroke={C.border} strokeWidth={0.5} />
                        <text x={-2} y={100 - v + 3} fontSize={8} fill={C.muted} textAnchor="end">{v}</text>
                      </g>
                    ))}
                    <polyline points={acctTargetPts} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="6,4" opacity={0.3} />
                    {lastDataWeek > 0 && <polyline points={acctActualPts} fill="none" stroke={C.orange} strokeWidth={3} />}
                    {cumulativeActual.filter(c => c.hasData).map((c, i) => (
                      <circle key={i} cx={(i / 31) * chartW} cy={100 - (c.accounts / maxAccts) * 100} r={4} fill={C.orange} />
                    ))}
                    {[1, 4, 8, 12, 16, 20, 24, 28, 32].map(wn => (
                      <text key={wn} x={((wn - 1) / 31) * chartW} y={115} fontSize={8} fill={C.muted} textAnchor="middle">W{wn}</text>
                    ))}
                  </svg>
                </div>

                {/* Weekly Data Entry Table */}
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Weekly Revenue Log</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Click any week to enter actual numbers from Shopify + other channels.</div>

                <div style={{ display: "grid", gap: 4 }}>
                  {WEEK_TARGETS.map(wt => {
                    const d = weeklyData[wt.week];
                    const isEditing = editingWeek === wt.week;
                    const onTrack = d ? d.revenue >= wt.revTarget : null;
                    return (
                      <div key={wt.week}>
                        <div onClick={() => !isEditing && startEditWeek(wt.week)} style={{
                          display: "grid", gridTemplateColumns: "50px 1fr 90px 90px 60px", alignItems: "center", gap: 8,
                          padding: "8px 12px", background: d ? (onTrack ? C.lightGreen : C.lightRed) : C.card,
                          border: `1px solid ${isEditing ? C.green : C.border}`, borderRadius: 6, cursor: "pointer",
                          fontSize: 12,
                        }}>
                          <span style={{ fontWeight: 700, color: C.muted }}>W{wt.week}</span>
                          <span style={{ color: C.muted, fontSize: 10 }}>Target: ${(wt.revTarget / 1000).toFixed(1)}K / {wt.acctTarget} accts</span>
                          <span style={{ fontWeight: 700, color: d ? (onTrack ? C.green : C.red) : C.muted }}>
                            {d ? `$${(d.revenue / 1000).toFixed(1)}K` : "-- enter --"}
                          </span>
                          <span style={{ fontSize: 10, color: C.muted }}>{d ? `${d.accounts} accts` : ""}</span>
                          <span>{d ? (onTrack ? "\u2705" : "\u26A0\uFE0F") : "\u2B1C"}</span>
                        </div>
                        {isEditing && (
                          <div style={{ background: "#fff", border: `1px solid ${C.green}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: C.green }}>Week {wt.week} Actuals</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                              {[
                                { key: "revenue", label: "Total Revenue ($)", ph: "e.g. 5200" },
                                { key: "accounts", label: "Wholesale Accounts (#)", ph: "e.g. 22" },
                                { key: "shopify", label: "Shopify DTC ($)", ph: "e.g. 2100" },
                                { key: "amazon", label: "Amazon ($)", ph: "e.g. 800" },
                                { key: "tiktok", label: "TikTok Shop ($)", ph: "e.g. 600" },
                                { key: "wholesale", label: "Wholesale Rev ($)", ph: "e.g. 1200" },
                                { key: "subscriptionMRR", label: "Subscription MRR ($)", ph: "e.g. 1500" },
                              ].map(f => (
                                <div key={f.key}>
                                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 2, fontWeight: 600 }}>{f.label}</div>
                                  <input
                                    type="number"
                                    value={editForm[f.key]}
                                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.ph}
                                    style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, boxSizing: "border-box" }}
                                  />
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 9, color: C.muted, marginBottom: 2, fontWeight: 600 }}>Notes</div>
                              <input value={editForm.notes} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} placeholder="Key wins, lessons, what to change..." style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 12, boxSizing: "border-box" }} />
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                              <button onClick={() => saveWeekEntry(wt.week)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: C.green, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save Week {wt.week}</button>
                              <button onClick={() => setEditingWeek(null)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", fontSize: 11, cursor: "pointer", color: C.muted }}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Channel breakdown for weeks with data */}
                {Object.keys(weeklyData).length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Channel Breakdown (Latest Week with Data)</div>
                    {(() => {
                      const lastWeek = Math.max(...Object.keys(weeklyData).map(Number));
                      const d = weeklyData[lastWeek];
                      if (!d) return null;
                      const channels = [
                        { name: "Shopify DTC", val: d.shopify, color: C.teal },
                        { name: "Amazon", val: d.amazon, color: C.orange },
                        { name: "TikTok Shop", val: d.tiktok, color: C.charcoal },
                        { name: "Wholesale", val: d.wholesale, color: C.green },
                        { name: "Subscription MRR", val: d.subscriptionMRR, color: C.purple },
                      ].filter(c => c.val > 0);
                      const total = channels.reduce((s, c) => s + c.val, 0) || 1;
                      return channels.map(ch => (
                        <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, width: 120, flexShrink: 0 }}>{ch.name}</span>
                          <div style={{ flex: 1, height: 14, background: C.soft, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(ch.val / total) * 100}%`, background: ch.color, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: ch.color, minWidth: 55, textAlign: "right" }}>${(ch.val / 1000).toFixed(1)}K</span>
                          <span style={{ fontSize: 10, color: C.muted, minWidth: 30 }}>{Math.round((ch.val / total) * 100)}%</span>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── SALES MAP VIEW ─────────────────────────────────────── */}
          {view === "salesmap" && (
            <div style={{ marginTop: -16, marginLeft: -16, marginRight: -16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Rooted Broth Sales Map</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Mark accounts as "won" here and they sync to your Revenue Tracker.</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ background: C.lightGreen, border: `1px solid ${C.green}`, borderRadius: 8, padding: "4px 10px", textAlign: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{wonAccounts}</span>
                    <span style={{ fontSize: 9, color: C.green, marginLeft: 4 }}>won</span>
                  </div>
                  <button onClick={refreshWonAccounts} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer" }}>Refresh</button>
                  <a href={SALES_MAP_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: "4px 8px", borderRadius: 4, border: `1px solid ${C.blue}`, background: C.lightBlue, color: C.blue, textDecoration: "none", cursor: "pointer" }}>Open Full Screen</a>
                </div>
              </div>
              <iframe
                src={SALES_MAP_URL}
                style={{ width: "100%", height: "calc(100vh - 200px)", border: "none" }}
                title="Rooted Broth Sales Map"
                allow="geolocation"
              />
            </div>
          )}

          {/* RECURRING VIEW */}
          {view === "recurring" && (() => {
            const freqs = ["daily", "weekly", "monthly", "quarterly"];
            const freqStyles = { daily: { label: "Daily", color: C.red, bg: C.lightRed }, weekly: { label: "Weekly", color: C.orange, bg: C.lightOrange }, monthly: { label: "Monthly", color: C.blue, bg: C.lightBlue }, quarterly: { label: "Quarterly", color: C.purple, bg: C.lightPurple } };
            const filtered = RECURRING.filter(t => {
              if (ownerFilter !== "ALL" && t.owner !== ownerFilter) return false;
              if (deptFilter !== "ALL" && t.dept !== deptFilter) return false;
              if (freqFilter !== "ALL" && t.freq !== freqFilter) return false;
              return true;
            });
            return (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Recurring Operating Rhythm</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>These run forever alongside weekly tasks. This IS the business.</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {freqs.map(f => {
                    const tasks = filtered.filter(t => t.freq === f);
                    const done = [...tasks, ...tasks.flatMap(t => t.subs || [])].filter(t => checked[t.id]).length;
                    const total = [...tasks, ...tasks.flatMap(t => t.subs || [])].length;
                    return (
                      <div key={f} style={{ padding: "6px 12px", borderRadius: 8, background: freqStyles[f].bg, border: `1px solid ${freqStyles[f].color}20`, textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: freqStyles[f].color }}>{done}/{total}</div>
                        <div style={{ fontSize: 9, color: freqStyles[f].color, fontWeight: 600, textTransform: "uppercase" }}>{freqStyles[f].label}</div>
                      </div>
                    );
                  })}
                </div>
                {freqs.map(freq => {
                  const fTasks = filtered.filter(t => t.freq === freq);
                  if (!fTasks.length) return null;
                  return (
                    <div key={freq} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: freqStyles[freq].bg, color: freqStyles[freq].color, fontWeight: 700, border: `1px solid ${freqStyles[freq].color}30` }}>{freqStyles[freq].label} \u2014 {fTasks.length} tasks</span>
                        <div style={{ flex: 1, height: 1, background: C.soft }} />
                      </div>
                      {fTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* HOLIDAY CALENDAR VIEW */}
          {view === "holidays" && (
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Holiday & Sales Calendar 2026</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>Every sales moment, cultural moment, and content opportunity. Plan around these.</div>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <button key={m} onClick={() => setHolidayMonth(i + 3)} style={{
                    padding: "6px 14px", borderRadius: 6, border: `1px solid ${holidayMonth === i + 3 ? C.green : C.border}`,
                    background: holidayMonth === i + 3 ? C.green : "#fff", color: holidayMonth === i + 3 ? "#fff" : C.charcoal,
                    fontSize: 12, fontWeight: holidayMonth === i + 3 ? 700 : 400, cursor: "pointer",
                  }}>{m}</button>
                ))}
              </div>

              {filteredHolidays.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No holidays mapped for this month yet.</div>
              ) : (
                filteredHolidays.map(h => {
                  const typeColors = { critical: { bg: C.red, color: "#fff" }, major: { bg: C.orange, color: "#fff" }, cultural: { bg: C.blue, color: "#fff" }, values: { bg: C.teal, color: "#fff" }, social: { bg: C.purple, color: "#fff" } };
                  const tc = typeColors[h.type] || typeColors.social;
                  const dept = DEPTS[h.dept] || {};
                  return (
                    <div key={h.date + h.name} style={{ background: C.card, border: `1px solid ${h.type === "critical" ? C.red : C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, borderLeft: `4px solid ${tc.bg}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{h.date.split("-")[2]}</span>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{h.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: tc.bg, color: tc.color, fontWeight: 600 }}>{h.type.toUpperCase()}</span>
                          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: dept.bg, color: dept.color, fontWeight: 600 }}>{dept.icon} {dept.label}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: C.charcoal, lineHeight: 1.6 }}>{h.action}</div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* REVENUE VIEW */}
          {view === "revenue" && (
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Revenue Tracker — Path to $1M</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Monthly cumulative targets + weekly run rate needed.</div>

              {REVENUE_MILESTONES.map(m => (
                <div key={m.month} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{m.month} 2026</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Need ${(m.run / 1000).toFixed(1)}K/week run rate</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>${(m.target / 1000).toFixed(0)}K cumulative</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{m.note}</div>
                  <div style={{ height: 6, background: C.soft, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(m.target / 560000) * 100}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 3 }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Channel Revenue Targets (Dec Run Rate)</div>
              {[
                { ch: "DTC Shopify (one-time)", target: "$22K/mo" },
                { ch: "Subscription MRR", target: "$12K/mo" },
                { ch: "TikTok Shop + Affiliates", target: "$10K/mo" },
                { ch: "Amazon FBA", target: "$8K/mo" },
                { ch: "Wholesale (80+ accounts)", target: "$12K/mo" },
                { ch: "Farmers Markets + Pop-ups", target: "$4K/mo" },
                { ch: "Corporate Gifting", target: "$3K/mo" },
              ].map(c => (
                <div key={c.ch} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{c.ch}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{c.target}</span>
                </div>
              ))}
            </div>
          )}

          {/* SEARCH VIEW */}
          {view === "search" && (
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Search All Tasks</div>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search across all weeks, recurring, and subtasks..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, marginBottom: 14, boxSizing: "border-box" }} />
              {searchQuery.trim() && <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{searchResults.length} results</div>}
              {searchResults.map(task => <TaskCard key={task.id} task={task} showSource />)}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: `1px solid ${C.border}`, padding: "5px 14px", display: "flex", gap: 12, alignItems: "center", zIndex: 100, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{pct}%</div><div style={{ fontSize: 8, color: C.muted }}>DONE</div></div>
        <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 2, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 10, color: C.muted }}>{doneAll}/{totalAll} tasks + subtasks</div>
      </div>
    </div>
  );
}
