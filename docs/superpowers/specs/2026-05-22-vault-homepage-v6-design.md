# The Vault — Homepage v6 Design Spec
**Date:** 2026-05-22  
**File:** `app/6/page.jsx`  
**Approach:** Editorial Calm — ultra-minimal luxury, Cormorant Garamond serif, extreme whitespace, parallax imagery, scroll-driven 3D models.

---

## Overview

A full-scroll homepage for "THE VAULT by Karan Desai" jewelry brand. Light theme (warm cream `#FAF8F5` base). 8 sections. Lenis smooth scroll is already globally wired in `layout.tsx`. No existing components to reuse — all new components live in `app/6/page.jsx` or as co-located files if needed.

---

## Tech Stack (already in project)

- **Next.js 13.5** (App Router, `'use client'` where needed)
- **React Three Fiber + Drei** — 3D models
- **GSAP** — scroll-driven animations (ScrollTrigger)
- **Framer Motion** — entrance animations, opacity fades
- **Lenis** — smooth scroll (globally active via `SmoothScrollProvider`)
- **Tailwind CSS** — layout and spacing
- **Fonts** — Cormorant Garamond (luxury serif), Montserrat (labels), Inter (UI)
- **Images** — `/public/p/1.png` through `/public/p/40.png` (40 editorial shots)
- **3D Models** — `/public/optimized/bracelet.glb`, `/public/optimized/ring.glb`, `/public/optimized/pendant.glb`
- **Logo** — `/public/croppedlogo.png`
- **HDR** — `/public/final.hdr` for 3D lighting

---

## Color & Typography

| Token | Value | Usage |
|---|---|---|
| Background | `#FAF8F5` | Page base |
| Text primary | `#1A1A1A` | Headings, body |
| Text muted | `#888` | Labels, captions |
| Accent line | `#D4B896` | Thin decorative rules |
| Font — display | Cormorant Garamond, thin/light weight | Section headings, hero title |
| Font — label | Montserrat, uppercase, wide tracking | Category labels (BRACELETS, RINGS etc) |
| Font — body | Inter | Descriptions, nav links |

---

## Section-by-Section Design

### S1: Hero

- **Height:** 100vh
- **Background:** `/public/p/1.png` (or similar editorial shot) — `object-fit: cover`, parallax at 0.6x scroll speed via GSAP ScrollTrigger
- **Overlay:** subtle gradient, bottom 30% of image, `rgba(250,248,245,0.3)` → transparent (ensures text legibility)
- **3D model:** Bracelet GLB, centered-right (60% from left, 50% from top), auto-rotating slowly, Y-axis tilt driven by scroll progress (0→30deg as hero scrolls out)
- **Text:** "THE VAULT" — Cormorant Garamond, `clamp(72px, 10vw, 140px)`, weight 300, left-anchored at 8% from left, vertically centered
- **Subtext:** "by Karan Desai" — Montserrat, uppercase, letter-spacing 0.3em, 14px, below the main title
- **Scroll indicator:** centered bottom, thin vertical line animating downward, fades out on first scroll
- **Navbar:** transparent, floats above hero. Logo left, 3 links right (Collections, About, Contact). Hides on scroll down, shows on scroll up (GSAP ScrollTrigger direction detection)

### S2: Brand Statement

- **Height:** 60vh minimum
- **Background:** `#FAF8F5`
- **Content:** Single centered italic Cormorant Garamond line: *"Crafted to endure. Worn to be remembered."*
- **Size:** `clamp(28px, 4vw, 56px)`
- **Animation:** Framer Motion fade+translateY on viewport entry
- **Decoration:** thin `1px` horizontal rule in `#D4B896`, centered, 80px wide, below the text

### S3: Bracelets Collection

- **Height:** 100vh
- **Layout:** Image left (55% width) + 3D model + text right (45% width)
- **Image:** 2–3 images from `/public/p` (the bracelet campaign shots), stacked with a slight overlap, parallax (image moves at 0.8x container scroll speed)
- **3D model:** Bracelet GLB, floats in right panel, Y-axis rotation mapped to scroll progress through this section (0 → 360deg across the section height)
- **Text block:** 
  - Label: "BRACELETS" — Montserrat uppercase, 11px, tracking 0.4em, muted
  - Heading: "A4. Full Oval Bracelet" — Cormorant, 48px
  - Description: 1–2 sentences, Inter 16px, muted
  - CTA: "Explore →" — Montserrat, 12px, underline on hover
- **Entry animation:** text slides in from right, image fades in

### S4: Rings Collection

- **Height:** 100vh
- **Layout:** Mirror of S3 — 3D model left, image right
- **Image:** Ring campaign images from `/public/p`
- **3D model:** Ring GLB, scroll-driven Y rotation
- **Text block:** same structure, "RINGS" label

### S5: Pendants Collection

- **Height:** 100vh
- **Layout:** Same as S3 (image left, model right) — alternating rhythm
- **Image:** Pendant campaign images from `/public/p`
- **3D model:** Pendant GLB, scroll-driven Y rotation
- **Text block:** "PENDANTS" label

### S6: Editorial Grid

- **Height:** auto (content-driven, approx 120–150vh)
- **Layout:** Asymmetric 3-column CSS grid, 8–10 images from `/public/p`
  - Column 1: `1fr`, images start at `translateY(0)`
  - Column 2: `1.2fr`, images start at `translateY(60px)` — offset downward
  - Column 3: `0.8fr`, images start at `translateY(-40px)` — offset upward
  - All three columns move at slightly different scroll speeds (parallax via GSAP)
- **Image treatment:** no borders, no captions. Desaturated (CSS `filter: grayscale(100%)`) by default, full color on hover with `transition: filter 0.6s ease`
- **Section label:** "THE EDIT" — Montserrat uppercase, centered above the grid

### S7: Craftsmanship

- **Height:** 80vh
- **Layout:** Text left (40%), large image right (60%), image bleeds to right edge
- **Text:**
  - Label: "THE CRAFT"
  - Heading: "Precision in every detail." — Cormorant, 52px
  - Body: 2–3 sentences about the brand/craftsmanship
  - CTA link: "Explore the Collection →"
- **Image:** one of the larger editorial shots from `/public/p`
- **Animation:** image parallax, text fades in

### S8: Footer

- **Height:** auto
- **Background:** `#1A1A1A` (dark, for contrast)
- **Content:**
  - Logo centered (white version or SVG text)
  - 3 nav links: Collections, About Us, Contact
  - Copyright line: "© 2024 THE VAULT by Karan Desai"
- **Style:** minimal, Montserrat, muted tones on dark

---

## Component Architecture

All components are new, defined in `app/6/page.jsx` or sibling files imported from there. No reuse of existing `/components` directory.

| Component | Purpose |
|---|---|
| `VaultNav` | Floating navbar with hide/show on scroll |
| `HeroSection` | Full-screen parallax image + 3D model + text |
| `StatementSection` | Brand quote, fade-in |
| `CollectionSection` | Reusable for Bracelets/Rings/Pendants, accepts props for layout direction, model path, images, text |
| `Model3D` | React Three Fiber canvas wrapper, accepts path + scrollProgress prop for rotation |
| `EditorialGrid` | Asymmetric parallax image grid |
| `CraftsmanshipSection` | Text + bleed image |
| `VaultFooter` | Dark footer |

---

## Scroll / Animation Strategy

- **Lenis** handles smooth scroll globally (already wired)
- **GSAP ScrollTrigger** — needs Lenis integration: `ScrollTrigger.scrollerProxy` or using `lenis.on('scroll', ScrollTrigger.update)`
- **Hero parallax:** `gsap.to(heroImg, { yPercent: -20, ease: 'none', scrollTrigger: { scrub: true } })`
- **3D scroll rotation:** each `CollectionSection` tracks its own `scrollYProgress` via Framer Motion's `useScroll` + `useTransform`, passes `rotationY` value to `Model3D`
- **Editorial grid parallax:** three column refs, each with different `yPercent` targets via ScrollTrigger scrub
- **Navbar hide/show:** `scrollDirection` detection via GSAP ScrollTrigger `onUpdate`
- **Text entrances:** Framer Motion `whileInView`, `initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`

---

## Image Selection from `/public/p`

Based on the campaign images visible:
- **Hero background:** `p/2.png` or `p/3.png` (large editorial triptych)
- **Bracelets:** `p/1.png`, `p/4.png`, `p/5.png` (A4/A5 bracelet shots)
- **Rings:** `p/8.png`, `p/9.png`, `p/10.png`
- **Pendants:** `p/25.png`, `p/26.png`, `p/27.png` (B. Pendants section)
- **Editorial grid:** mixed selection of 8–10 from across the set
- **Craftsmanship:** `p/6.png` or `p/7.png`

(Exact numbers to be confirmed during implementation by scanning the images.)

---

## Constraints

- `'use client'` required — Three.js canvas and scroll hooks are client-side
- Canvas must be wrapped in error boundary (pattern from existing `newhome/page.jsx`)
- `useGLTF.preload()` calls at module level for all 3 models
- No SSR for 3D sections — wrap Canvas in `dynamic(() => import(...), { ssr: false })` if needed
- Images use Next.js `<Image>` component with `fill` or explicit dimensions
