---
name: Aval Designs
description: A premium bridal & occasion-wear boutique — editorial fashion presentation with custom tailoring built in.
colors:
  ivory: "oklch(0.970 0.012 75)"
  ivory-deep: "oklch(0.940 0.015 72)"
  beige-surface: "oklch(0.915 0.017 68)"
  charcoal-ink: "oklch(0.220 0.010 55)"
  charcoal-muted: "oklch(0.480 0.014 55)"
  charcoal-line: "oklch(0.850 0.012 60)"
  espresso: "oklch(0.160 0.008 45)"
  espresso-deep: "oklch(0.110 0.006 45)"
  rose: "oklch(0.620 0.090 18)"
  rose-deep: "oklch(0.480 0.095 16)"
  rose-pale: "oklch(0.900 0.035 20)"
  gold: "oklch(0.720 0.110 80)"
  gold-deep: "oklch(0.560 0.105 75)"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.75rem, 6vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
  2xl: "144px"
components:
  button-primary:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "18px 44px"
  button-primary-hover:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.ivory}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.none}"
    padding: "17px 42px"
  button-secondary-hover:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.ivory}"
  button-on-dark:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.none}"
    padding: "18px 44px"
  badge-new:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  badge-customizable:
    backgroundColor: "transparent"
    textColor: "{colors.rose-deep}"
    rounded: "{rounded.none}"
    padding: "5px 11px"
---

# Design System: Aval Designs

## 1. Overview

**Creative North Star: "The Atelier Fitting Room"**

Aval Designs should feel like stepping into a quiet, sunlit atelier the week before a wedding — not a shopping cart. The palette is warm and restrained (ivory, beige, charcoal) so that fashion photography and the promise of a garment made to fit *you* carry the emotional weight, with muted rose and soft gold appearing only where the brand wants to be noticed: a button, a divider, a customization badge. Structure alternates between light editorial pages (ivory) and deep espresso-charcoal sections (footer, the "Create Your Design" CTA, editorial banners) — never a fully dark site, but enough contrast to keep the page from reading as one long cream scroll, which is the single biggest way a boutique site collapses into generic template territory.

This system explicitly rejects: saturated or busy color, gradients of any kind, soft/cheap drop shadows, heavy rounded corners, cluttered dense layouts, icon-heavy chrome, small or cropped product photography, and anything that reads as a stock Bootstrap admin template. Corners are square or barely-eased (0–4px) everywhere; softness comes from whitespace and photography, not from border-radius.

**Key Characteristics:**
- Ivory/beige neutrals do the structural work; rose and gold are named, deliberate accents, not a wash of "warm" applied everywhere.
- Deep espresso-charcoal sections punctuate the page for rhythm and to avoid an all-cream, low-contrast feel.
- Square-cornered, editorial-grid layouts; no card-soup, no icon clutter.
- Large, consistent-ratio photography is the primary visual language — UI chrome stays quiet.

## 2. Colors

A warm, restrained neutral system (ivory → charcoal → espresso) carrying two deliberate accents: muted rose and soft gold, each reserved for specific, named moments rather than spread across the UI.

### Primary
- **Charcoal Ink** (oklch(0.220 0.010 55)): the workhorse "dark" — primary button fills, primary headings on light backgrounds, the default ink color for display type.

### Secondary
- **Muted Rose** (oklch(0.620 0.090 18)): the brand's signature accent — wishlist/heart states, the "Customizable" badge, sale price, active filter chips, the odd single-word emphasis in copy. Never used for large fills or body backgrounds.
- **Soft Gold** (oklch(0.720 0.110 80)): reserved for moments of craftsmanship and occasion — dividers on the About/Craftsmanship story, review stars, a thin rule under "Bridal Collection," premium/limited badges. Used more sparingly than rose.

### Neutral
- **Warm Ivory** (oklch(0.970 0.012 75)): default page background.
- **Ivory Deep** (oklch(0.940 0.015 72)): alternating section background (breaks up long ivory stretches without introducing a new hue).
- **Beige Surface** (oklch(0.915 0.017 68)): card/panel surface when a surface must read as physically distinct from the page (filter sidebar, modals, input fields).
- **Charcoal Muted** (oklch(0.480 0.014 55)): secondary text — captions, meta info, muted descriptions.
- **Charcoal Line** (oklch(0.850 0.012 60)): hairline borders and dividers on light backgrounds.
- **Espresso** (oklch(0.160 0.008 45)): deep section background — footer, Custom Design CTA, editorial banner. The system's one "dark theme" surface.
- **Espresso Deep** (oklch(0.110 0.006 45)): the darkest value in the system; used only for the very base of the footer or a full-bleed cinematic hero scrim.

### Named Rules
**The Two-Accent Rule.** Only rose and gold ever act as color accents. No third hue enters the palette anywhere — not in charts, not in status states, not in "just this one banner."

**The Restraint Rule.** Rose and gold combined never cover more than ~10% of any given viewport. Their power comes from rarity: a rose heart icon, a gold hairline, a rose price — never a rose section background or a gold button fill.

**The Punctuation Rule.** No more than two consecutive ivory sections before an espresso (or ivory-deep) section breaks the rhythm. This keeps the "editorial magazine" alternating-layout feeling the brief calls for, rather than one long cream page.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** An elegant high-contrast serif for anything the brand wants to be *felt* (hero lines, collection names, campaign moments) paired with a quiet, highly legible grotesque for everything the brand wants to be *used* (navigation, prices, forms, product meta). The contrast between the two carries the "editorial luxury" feeling on its own — no italics-everywhere, no script fonts.

### Hierarchy
- **Display** (500, clamp(2.75rem, 6vw, 5.5rem), line-height 1.05, letter-spacing -0.01em): Hero headline only. One per page, max.
- **Headline** (500, clamp(2rem, 3.4vw, 3rem), line-height 1.1): Section titles ("New Arrivals," "Shop by Category," collection names).
- **Title** (600, 1.125rem, line-height 1.3, Inter): Product names, card titles, form section headers.
- **Body** (400, 1rem, line-height 1.6, Inter, max 70ch): Descriptions, paragraph copy.
- **Label** (500, 0.75rem, line-height 1.4, letter-spacing 0.14em, uppercase, Inter): Nav items, button text, meta labels (price qualifiers, size labels, filter group headers).

### Named Rules
**The One-Serif Rule.** Playfair Display appears only at Display and Headline scale. It never appears in body copy, buttons, form labels, or UI chrome — those are always Inter. Mixing the serif into small UI text is the fastest way to make the site look like a template rather than a considered pairing.

**The No-Italic-Script Default.** No script/cursive fonts anywhere in the base system. Emphasis is carried by the serif/sans contrast and by scale, not by decorative lettering.

## 4. Elevation

Aval Designs is flat by default. Depth is conveyed through the ivory → beige-surface → espresso layering and generous whitespace, not through drop shadows. The one exception is a very soft, low-opacity contact shadow used to lift interactive product imagery on hover — deliberately faint, never a "floating card" effect.

### Shadow Vocabulary
- **hover-lift** (`box-shadow: 0 12px 32px -16px rgba(20, 16, 12, 0.22)`): applied only on product-image hover and open dropdowns/drawers, paired with a 2–4px translateY. Never present at rest.
- **modal-scrim** (`box-shadow: 0 24px 64px -24px rgba(20, 16, 12, 0.35)`): quick-view modal, cart drawer, size-chart modal only.

### Named Rules
**The Flat-At-Rest Rule.** No card, product tile, or panel carries a shadow in its default state. Shadows are exclusively a response to hover, open, or focus — never decoration.

## 5. Components

### Buttons
- **Shape:** square corners, 0px radius, always.
- **Primary:** Charcoal Ink background, Ivory text, uppercase Label typography (0.14em tracking), 18px/44px padding. Used for the single most important action per section ("Shop Collection," "Add to Cart," "Book a Consultation").
- **Hover / Focus:** background shifts to Espresso; a 2px Ivory focus outline offset 2px for keyboard focus. 200ms ease-out-quart transition, no bounce.
- **Secondary / Ghost:** transparent background, 1px Charcoal Ink border, Charcoal Ink text; on hover, fills solid Charcoal Ink with Ivory text (matches primary's hover state, so the two never look like competing systems).
- **On-Dark:** Ivory background, Espresso text — used only inside Espresso-background sections (footer, Custom Design CTA).

### Badges
- **New / Bestseller / Limited / Sale:** solid Charcoal Ink fill, Ivory uppercase Label text, square corners, 6px/12px padding — deliberately understated, never colored per-badge-type (no green "new," no red "sale"); the word carries the meaning, not a traffic-light color system.
- **Customizable:** transparent background, 1px Rose Deep border, Rose Deep uppercase text — the one badge that breaks from charcoal, because customization is the brand's core differentiator and deserves the accent.

### Cards / Product Tiles
- **Corner Style:** 0px radius.
- **Background:** Ivory or Ivory Deep depending on section; image itself sits directly on the page background, no boxed card frame around photography.
- **Shadow Strategy:** flat at rest; hover-lift shadow + 1.02 image scale + secondary-image crossfade on hover (per the brief's product-card hover spec).
- **Border:** none around the image; a single 1px Charcoal Line hairline only if a tile needs visual separation in a dense grid (e.g. filter results with no imagery yet).
- **Internal Padding:** image is full-bleed to the tile edge; text block below gets 16px top padding, no side padding beyond the grid gutter.

### Inputs / Fields
- **Style:** no border box; a 1px Charcoal Line bottom border only (underline-style input), Beige Surface background reserved for textareas and select menus that need a visible boundary (measurement forms, checkout fields).
- **Focus:** bottom border shifts to 2px Charcoal Ink, no glow/ring.
- **Error:** border shifts to Rose Deep; helper text in Rose Deep, Label scale.

### Navigation
- Ivory background at 96% opacity with backdrop-blur when scrolled (sticky), fully opaque Ivory at top of page. Logo in Display serif at Title scale; nav links in Label typography (uppercase, 0.14em tracking), Charcoal Muted at rest, Charcoal Ink + 1px Gold underline on hover/active. Compacts vertical padding from 32px to 16px once scrolled past the hero. Mobile: nav collapses to a bottom tab bar (Home / Shop / Search / Wishlist / Account / Cart) per the brief's mobile-navigation spec, not a shrunk desktop menu.

### Announcement Bar
Espresso background, Ivory Label-scale text, centered, thin (40px), no icons — a single rotating line ("Complimentary alterations on all bridal orders" / "Free shipping over ₹2,999").

## 6. Do's and Don'ts

### Do:
- **Do** keep corners square (0px) everywhere — buttons, cards, inputs, badges, images.
- **Do** let photography be the largest element on any given section; text and UI never compete with it for space.
- **Do** alternate Ivory / Ivory-Deep / Espresso section backgrounds to create editorial rhythm (Punctuation Rule).
- **Do** reserve Rose and Gold for specific, named roles (wishlist/customization/price for rose; craftsmanship/rating/premium dividers for gold) — never as general decoration.
- **Do** use Playfair Display only at Display/Headline scale; everything else is Inter.

### Don't:
- **Don't** use overly colorful UI, gradients, or neon/bright accents anywhere in the system.
- **Don't** use cheap-looking or heavy drop shadows, or any shadow present at an element's resting state.
- **Don't** use excessive rounded corners — no `rounded-lg`/`rounded-xl` card treatments.
- **Don't** build cluttered, dense layouts or over-animate — motion is subtle (reveal/hover only), never choreographed for its own sake.
- **Don't** use generic Bootstrap-looking components (default card grids, boxed stat tiles, icon-heavy feature grids).
- **Don't** use excessive iconography — prefer text labels (Label typography) over icons except for universally understood actions (search, cart, wishlist heart, account).
- **Don't** crop or shrink product photography — images stay large and full-bleed within their tile.
- **Don't** introduce a third accent hue anywhere (Two-Accent Rule) — no ad-hoc "just this once" colors in charts, alerts, or banners.
