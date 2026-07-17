# DESIGN.md — Filipino Profanity API

## 1. Objective

Every artifact in this system should feel like a page from a premium technical journal: calm, typographically confident, and spacious enough to breathe. The reader should finish scrolling thinking "this team knows what they built." The quality bar is: could this pass as a Linear or Vercel marketing page?

## 2. Product Context

- **What the product does:** Provides a free REST API for detecting Filipino and regional profanity words, with 310 words across two language categories.
- **Who it's for:** Developers building Filipino-language apps who need content moderation, and technical leads evaluating API quality before integration.
- **Adjacent brands (feel like these):** Vercel (developer marketing), Linear (editorial product pages), Stripe (API documentation)
- **Distant brand (do not feel like this):** Wix (template-driven, decorative, noisy — this product communicates through restraint, not decoration)
- **Cultural register:** Technical — the product speaks to engineers, not executives. Confidence through specificity, not buzzwords.

## 3. Visual Foundations

### 3a. Color

- **Neutral scale:** `--n-50: #FAFAF8, --n-100: #F5F5F0, --n-200: #E7E7E3, --n-300: #D4D4CC, --n-400: #8A8A8A, --n-500: #6B6B6B, --n-600: #4B4B4B, --n-700: #2A2A2A, --n-800: #1A1A1A, --n-900: #0F0F0F`
- **Accent:** `--accent: #6B7A3D` (olive green), `--accent-alt: #5E6B36`, `--accent-hover: #4F5A2F`
- **Semantic:** `--success: #4A7C3F, --warning: #B8860B, --error: #C23B22, --info: #3B7A8A`
- **Usage rules:** Olive accent appears exactly twice per page: the primary CTA and one data highlight (the total word count). Never as a section background, never as a gradient. Semantic colors only in the API tester (success/error states) and dashboard chart.

### 3b. Typography

- **Display face:** Cormorant Garamond, weight 400–500, tracking -0.02em, line-height 0.95
- **Body face:** Geist, weight 400–500, line-height 1.6
- **Fallback stack:** `Cormorant Garamond, Georgia, serif` (display) / `Geist, system-ui, sans-serif` (body)
- **Type scale:** 13 / 14 / 16 / 18 / 20 / 28 / 40 / 56 / 72 / 96 (desktop hero: 72–96px, mobile: 40–52px)
- **Weight discipline:** Display headings: 400 only (never bold on serif). Body: 400 for paragraphs, 500 for labels/buttons. Monospace: Geist Mono for code.

### 3c. Spacing & rhythm

- **Base unit:** 8px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120, 160
- **"Generous" whitespace in numbers:** Section padding: 120–160px on desktop, 80px on mobile. Card gap: 24–32px. Container horizontal padding: 48–64px. Container max-width: 1200px.

### 3d. Component seeds

- **Button:** Two variants. Primary: olive green (#6B7A3D), white text, pill-shaped (999px radius), 16px × 28px padding, 200ms hover transition with slight darkening. Secondary: transparent, border only (#E7E7E3), dark text, same pill shape. One primary button per view.
- **Card / container:** White (#FFFFFF) background, 1px border (#E7E7E3), 24px radius, no shadow. Elevated through spacing and border, never through drop shadows. Used for: feature items, API docs blocks, GitHub card.
- **Iconography:** Lucide React, stroke weight 1.5, 18–20px. Used sparingly — only where an icon replaces a word (Database, Code, Shield, Globe), never as decoration.
- **Badge/tag:** Small olive-tinted pill for status indicators ("API Live" = olive dot + text, "GET"/"POST" = light olive border).

## 4. Accessibility

- **Text contrast:** Body text #4B4B4B on #FAFAF8 = 7.2:1 (exceeds 4.5:1). Muted text #8A8A8A on #FAFAF8 = 3.5:1 (large text only). Accent on white = 4.6:1.
- **Motion:** Default reduced-motion support. All entrance animations via CSS transitions (fade + translate), 200–350ms. No bounce, no elastic, no parallax.
- **Focus indicators:** 2px solid olive accent (#6B7A3D), 2px offset. Visible on all interactive elements.
- **Alt text policy:** Decorative icons get `aria-hidden="true"`. Functional icons (GitHub link, external link) get descriptive `aria-label`.
- **Keyboard navigation:** All interactive elements focusable and operable via keyboard. Tab order follows visual order.

## 5. Voice & Tone

- **Register:** Technical — precise, minimal, confident. Speaks like a well-written README, not a marketing brochure.
- **Sentence rhythm:** Short. Most sentences under 15 words. Descriptions are one line.
- **Words this API uses:** "detect," "filter," "endpoint," "collection"
- **Words this API refuses:** "seamlessly," "elevate," "journey," "unlock," "powerful," "intuitive," "delight," "transform"
- **Address:** "you" — direct, developer-to-developer.

## 6. Implementation Practices

- **Token format:** CSS custom properties on `:root`, referenced via Tailwind `@theme inline` and direct `var()` usage.
- **Component library convention:** Bespoke components. No external UI library. Reuse via `components/ui/` primitives (Button, Card, Badge, Input, Select, CodeBlock, SectionHeader).
- **Image treatment rules:** No photographs. The product is API-focused — code examples and JSON output ARE the visual content. GitHub card icon is a Lucide Github glyph.
- **Grid system:** Single-column centered layout (max-width 1200px). Feature cards: 3-column on desktop, 2 on tablet, 1 on mobile. Dashboard stats: 3-column on desktop, stacked on mobile.
- **Motion rules:** CSS transitions only. Duration: 200ms for hover/active, 300ms for entrance. Easing: ease-out for entrances, ease-in-out for hover. Types: opacity fade + translateY(8px) for reveal. No framer-motion.

## 7. Anti-Patterns

- **No dark mode.** This is a calm editorial product page. Dark backgrounds (zinc-900, zinc-800) belong in dashboards, not marketing. The TODO.md specifies warm minimalism (#FAFAF8) — honor it.
- **No gradient text.** Gradient-clipped headings are the #1 AI-slop tell. Typography earns attention through weight, size, and contrast — not color effects.
- **No glassmorphism.** Backdrop-blur on cards is decoration pretending to be depth. Use borders and spacing instead.
- **No framer-motion.** CSS transitions handle every animation this page needs. Framer-motion adds 44kb for animations that can be done in 20 lines of CSS.
- **No gradient buttons.** One solid olive green per primary CTA. Gradients on buttons read as "template," not "designed."
- **No "feature grid" with icon + heading + two lines.** The current 5-card feature grid is W5 from anti-slop.md. Convert to inline typographic sections or a tighter editorial layout.

## 8. Decision-Making

1. **Editorial calm over conversion optimization.** When a design choice could increase CTA clicks but reduce the calm, editorial feel, choose calm. This is a free API, not a SaaS with a trial funnel.
2. **Typography over decoration.** When visual interest is needed, add weight/size contrast to type first. Only add a visual element (icon, color accent) if typography alone can't carry the hierarchy.
3. **Specificity over generality.** Code examples beat feature lists. Real API responses beat "powerful detection capabilities." Every section should contain something that could only be about this product.
4. **Performance over polish.** If an animation or component adds bundle weight without improving comprehension, skip it. The page should load in under 2 seconds.
5. **Consistency over novelty.** Every card, every button, every heading should use the same tokens. Novelty is a bug in a design system, not a feature.

## 9. Workflow

1. Start with the content hierarchy: what does the reader need to know, in what order? (Hero → Features → Dashboard → API Tester → Docs → GitHub)
2. Set up the design tokens in `globals.css` before writing any component. Every color, spacing, and radius value must come from a token.
3. Build the page as a Server Component with client islands only where interactivity is required (API Tester, DashboardStats).
4. Implement typography first — get the heading/body hierarchy right before adding any visual elements.
5. Build components bottom-up: UI primitives (Button, Card, Badge) → section components (Hero, FeatureGrid) → page assembly.
6. Test responsive at 375px (mobile), 768px (tablet), 1280px (desktop). No horizontal scroll at any breakpoint.
7. Run the anti-slop checklist before committing: gradient text? glassmorphism? gradient buttons? emoji decoration? Fix or trace.
