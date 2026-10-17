# Artisan Chocolat Gallery

# ANAHITA — Luxury 3D Artisan Chocolate Website

Act as a world-class creative director, luxury e-commerce designer, 3D web experience designer, and senior frontend developer.

Create a premium, visually unforgettable website for **ANAHITA**, a handmade artisan chocolate brand. The website must feel like a luxury chocolate boutique, combining cinematic 3D visuals, elegant editorial design, realistic chocolate photography, refined motion, and a seamless shopping experience.

## 1. Brand identity

Brand name: ANAHITA

Brand positioning: Luxury handmade chocolates, artisan chocolate gifts, personalized gift boxes, and seasonal chocolate collections.

Visual direction:
- Sophisticated, sensual, artistic, warm, premium, and timeless.
- Chocolate brown, ivory cream, muted gold, and deep burgundy.
- Elegant editorial typography: a high-contrast serif for headlines and a clean sans-serif for body text.
- Realistic chocolate textures, glossy ganache, delicate highlights, subtle shadows, and premium packaging.
- Avoid generic AI-generated storefront layouts, excessive gradients, neon colors, cartoon chocolate, and cheap-looking animations.

## 2. Build a cinematic 3D landing page

The first screen must be extraordinary.

Create a full-screen, immersive hero section featuring a beautifully designed luxury ANAHITA chocolate gift box, surrounded by realistic handcrafted pralines and chocolate pieces.

The hero should include:
- A large, visually dominant 3D chocolate box.
- Realistic materials, reflections, soft studio lighting, and cinematic depth.
- Slowly floating chocolate pieces with subtle, natural motion.
- Interactive mouse-based parallax or gentle 3D rotation.
- An elegant camera movement or reveal animation when the page loads.
- A refined headline: “A Little Piece of Art.”
- Supporting text: “Handcrafted chocolates, made to turn every moment into something unforgettable.”
- Primary CTA: “Discover Our Chocolates”.
- Secondary CTA: “Explore Gift Boxes”.
- Minimal navigation with the ANAHITA wordmark, Shop, Our Story, Collections, and a shopping bag icon.

Use Three.js with React Three Fiber and Drei if supported by the existing stack. Prefer optimized GLB/GLTF models and physically based materials for genuine 3D objects. If suitable 3D assets are unavailable, create a convincing layered experience with high-quality product imagery and subtle depth effects. Never present a flat image as an interactive 3D model.

## 3. Scroll-driven storytelling

Design the homepage as a premium visual journey.

**Section 1 — The Signature Collection**
Showcase handcrafted bonbons in an elegant grid with macro photography, subtle hover effects, product names, prices, and “Quick Add” actions.

**Section 2 — The Chocolate Experience**
Create a cinematic scroll sequence where the gift box opens and individual chocolates are revealed. Use restrained motion and smooth transitions.

**Section 3 — Crafted by Hand**
Tell the brand story through close-up visuals of chocolate pouring, hand-finishing pralines, delicate cocoa dusting, and artisanal craftsmanship.

**Section 4 — Gifts for Every Moment**
Create premium collections for:
- Romantic gifts and Valentine's Day
- Wedding anniversaries
- Birthdays
- Christmas and seasonal celebrations
- Personalized chocolate gift boxes

**Section 5 — Build Your Own Box**
Create an interactive product experience allowing customers to choose a box size, select chocolates, personalize a message, and preview their gift selection.

**Section 6 — Brand Story**
Communicate the artistry, ingredients, craftsmanship, and personal touch behind ANAHITA.

**Section 7 — Final Conversion Section**
Display an elegant gift-box visual, a persuasive headline, and a clear “Shop Chocolates” CTA.

Finish with a refined footer, contact information, social links, shipping information, FAQs, and newsletter signup.

## 4. E-commerce functionality

Do not create a static design mockup only.

Build a functional storefront with:
- Product catalog and individual product pages.
- Product images, descriptions, prices, stock status, and available variants.
- Shopping cart with quantity controls and price calculations.
- Gift-box customization and personalized gift messages.
- Checkout flow with customer details, delivery address, shipping options, and order summary.
- Responsive product search and category filtering.
- Customer-friendly loading, empty-cart, validation, and error states.
- An architecture that can support order management, inventory, email notifications, and a secure payment provider.

Do not claim that payments or order processing are operational until the required backend and payment credentials are configured and tested.

## 5. Technical requirements

- Use a maintainable React-based architecture compatible with the selected platform.
- Use Three.js / React Three Fiber only where it adds real value.
- Keep components modular and reusable.
- Implement smooth, tasteful animation using an appropriate animation library such as GSAP or Framer Motion.
- Make the layout responsive across desktop, tablet, and mobile.
- On mobile, provide a lighter 3D experience or a high-quality static fallback.
- Lazy-load 3D assets and use optimized textures and models.
- Respect reduced-motion preferences.
- Prevent horizontal overflow, layout shifts, and excessively long loading times.
- Optimize image formats, accessibility, keyboard navigation, contrast, and SEO metadata.
- Use real product imagery or clearly identified placeholders. Do not invent customer reviews, awards, or product claims.

## 6. Design quality requirements

The result should resemble a custom-designed luxury chocolate brand, not a generic template.

Prioritize:
1. Exceptional visual impact in the first viewport.
2. Realistic chocolate and packaging.
3. Sophisticated typography and spacing.
4. Seamless, subtle 3D interaction.
5. Clear product discovery and purchasing.
6. Excellent mobile performance.

Use a coherent design system throughout the website.

## 7. Implementation workflow

First inspect the existing project and identify its framework, files, and dependencies.

Then:
1. Establish the visual design system.
2. Build and refine the homepage hero.
3. Implement the remaining landing-page sections.
4. Add the real product browsing and shopping flows.
5. Test desktop, mobile, navigation, cart calculations, and error states.
6. Document any missing assets, credentials, backend integrations, and deployment requirements.

Preserve existing working functionality. Do not overwrite or remove existing project files without understanding their purpose.

**Start by building the landing page and its 3D hero to a very high visual standard. Then continue with the remaining sections and functional e-commerce features. Do not stop after producing a static mockup.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://artisan-chocolat-gallery.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0bc97d4a-ac89-4497-959f-6455e491c33c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
