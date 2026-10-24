# Rules.md — CampaignGuard
> AI Coding Rules, Constraints & Boundaries

---

## 1. Tech Rules (Always Follow)

- **Framework:** Next.js 14 App Router ONLY — no Pages Router
- **Language:** TypeScript everywhere — no plain `.js` files
- **Styling:** Tailwind CSS + shadcn/ui ONLY — no inline styles, no CSS modules, no styled-components
- **Database:** Prisma ORM with Neon PostgreSQL — never raw SQL queries in route handlers
- **Validation:** Zod for all API inputs and AI outputs — never trust unvalidated data
- **AI:** Google Gemini 1.5 Pro via `@google/generative-ai` SDK — no other AI providers
- **Auth:** NextAuth.js v5 credentials provider — no custom JWT logic

---

## 2. Libraries to USE

```
@google/generative-ai      — Gemini API
@prisma/client             — Database ORM
next-auth                  — Authentication
zod                        — Schema validation
@radix-ui/*                — Headless UI primitives (via shadcn)
tailwind-merge             — Class merging utility
clsx                       — Conditional classnames
date-fns                   — Date formatting and comparison
react-hook-form            — Form state management
@hookform/resolvers        — Zod integration with react-hook-form
react-dropzone             — File upload UI
lucide-react               — Icons ONLY (no other icon library)
sonner                     — Toast notifications
```

---

## 3. Libraries to AVOID

- ❌ axios — use native fetch with typed wrappers
- ❌ moment.js — use date-fns
- ❌ redux / zustand — use React Server Components + useState where needed
- ❌ react-query / SWR — use Next.js server actions or fetch directly
- ❌ tesseract.js — Gemini handles image reading natively
- ❌ any CSS-in-JS libraries (emotion, styled-components)
- ❌ any UI library other than shadcn/ui (no MUI, no Chakra, no Ant Design)
- ❌ express or any separate backend framework

---

## 4. AI Integration Rules

- Always send structured prompts with clear JSON output instructions
- Always validate Gemini output with a Zod schema before saving to DB
- Hard facts (discount %, dates, required terms) MUST be checked deterministically in TypeScript — NEVER sent to Gemini for factual lookup
- Gemini is used ONLY for: image text extraction, cross-asset semantic comparison, tone analysis
- Always wrap Gemini calls in try/catch — on failure, mark findings as `SEMANTIC_CHECK_INCOMPLETE`, do NOT block the whole check
- Uploaded asset content is injected into prompts inside clearly delimited data blocks to prevent prompt injection

---

## 5. Error Handling Rules

- Every API route must return typed JSON responses — never plain text errors
- Use consistent response shape: `{ success: boolean, data?: T, error?: string }`
- Prisma errors must be caught and return 500 with generic message (never expose DB errors to client)
- Gemini API failures must NOT crash the preflight — degrade gracefully with `SEMANTIC_CHECK_INCOMPLETE` status
- OCR failure (unreadable image) → mark finding as `OCR_FAILED`, flag for manual review
- Missing evidence → mark claim status as `INSUFFICIENT_EVIDENCE` — AI must NOT fabricate facts

---

## 6. Security Rules

- API keys (GEMINI_API_KEY, DATABASE_URL) in `.env.local` ONLY — never in client-side code
- All Gemini calls happen server-side (API routes or server actions)
- File uploads: validate MIME type and size before processing
- Treat all uploaded content (captions, PDF text, OCR output) as untrusted data — never pass raw user input directly as system prompt
- Role-based access: check user role before performing Brand Manager / Reviewer actions

---

## 7. Code Style Rules

- Use `async/await` — no `.then()` chains
- Use named exports for components — no default exports except page.tsx and layout.tsx
- Component files: PascalCase (`FindingCard.tsx`)
- Utility files: camelCase (`preflight.ts`)
- Keep components under 200 lines — split if larger
- No `any` type — use `unknown` and narrow, or define proper types
- All DB mutations go through Prisma in API routes — never call Prisma from client components

---

## 8. Build & Deploy Rules

- Target: Vercel via Git auto-deploy
- `next build` must pass with zero errors before committing
- No `console.log` in production code — use structured comments instead
- Environment variables set in Vercel dashboard (not committed to repo)
- `.env.local` in `.gitignore` always
