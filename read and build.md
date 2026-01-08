# Project Build Prompt for Google Antigravity AI
## Project Name: CopyPasteUI

You are a senior full-stack engineer and UI/UX architect.

Your task is to generate a **production-ready, SEO-optimized, component-based web UI library website** named **CopyPasteUI**.

The website allows developers to browse UI components, preview them live, and copy clean code for use in their own projects.

---

## 1. Tech Stack (Strict)
- Framework: **Next.js (App Router)**
- Styling: **Tailwind CSS**
- Database: **Firebase Firestore**
- Hosting: **Vercel (Free Tier)**
- Ads: **Google AdSense (policy compliant)**
- Authentication: Firebase (Admin only)

---

## 2. Core Concept
CopyPasteUI is a **free UI component library** where users:
- Browse components by category
- Preview components live
- Copy component code instantly
- Use components without login

Target users:
- Web developers
- Students
- Freelancers
- Beginners (Bangladesh + Global)

---

## 3. Pages to Build

### 3.1 Landing Page (`/`)
Sections:
Make sure unique, creative and smooth animation
- Navbar (logo: CopyPasteUI)
- Hero Section:
  - Heading: “Copy. Paste. Build Faster.”
  - CTA Button: Browse Components
- Features:
  - Copy-paste ready
  - Responsive design
  - No signup required
  - Free forever
- Popular Components Grid
- Categories Preview
- Footer (SEO links + copyright)

SEO:
- Meta title, description
- OpenGraph tags

---

### 3.2 Components Browse Page (`/components`)
Layout:
Make sure unique, creative and smooth animation

- Left Sidebar (fixed):
  - Categories list
  - Search input
  - Framework filter (HTML, Tailwind, React)
- Right Content Area:
  - Component preview
  - Code viewer

---

### 3.3 Component Details Page (`/components/[category]/[slug]`)
Main Features:
- Live Preview (iframe or rendered)
- Responsive toggle:
  - Desktop
  - Tablet
  - Mobile
- Dark / Light mode toggle

Code Section:
- Tabs:
  - HTML
  - CSS
  - Tailwind
  - React JSX
- One-click Copy button
- Copy success toast

AdSense placement (safe):
- Between preview and code section
- Below code block
- Mobile sticky bottom ad

---

## 4. Sidebar Categories
Include:
Make sure dynamic, admin can add.
- Navbar
- Hero Sections
- Buttons
- Cards
- Forms
- Pricing Tables
- Testimonials
- Modals
- Footers
- Dashboard Widgets

---

## 5. Component Customizer (Important)
Without login:
add more creativity
- Change primary color
- Adjust border radius
- Change font size
- Update preview instantly
- Generate updated code automatically

---

## 6. Admin Panel (`/admin`)
Admin-only access.

Features:
Make sure unique, creative and smooth animation

- Login via Firebase Auth
- Add/Edit/Delete components
- Add component code for:
  - HTML
  - Tailwind
  - React
- Manage categories
- Track:
  - View count
  - Copy count

---

## 7. Firestore Database Schema

Collections:
- categories
  - id
  - name
  - slug
- components
  - id
  - name
  - slug
  - category
  - previewCode
  - htmlCode
  - tailwindCode
  - reactCode
  - views
  - copies
  - createdAt

---

## 8. UI & UX Rules
Make sure unique, creative and smooth animation

- Clean, modern, minimal
- Developer-focused
- Fast loading
- Fully responsive
- Mobile-first
- No clutter
- Dark mode supported

---

## 9. SEO Requirements
- Each component is its own indexable page
- Clean URLs
- Schema-friendly structure
- Fast Core Web Vitals

---

## 10. Google AdSense Compliance
- Do NOT place ads near copy buttons
- Use responsive ads
- Limit ad density
- Ads must not block content

---

## 11. Performance Optimization
- Use Next.js static generation
- Lazy load previews
- Optimize images
- Minimize JavaScript

---

## 12. Final Output Expectation
Generate:
- Full project folder structure
- All required pages and components
- Firebase integration
- Tailwind setup
- Sample components data
- Clean, readable, production-level code

The final result should be a **real, deployable website** ready for Vercel deployment and Google AdSense approval.

Build CopyPasteUI as a **world-class, monetizable, zero-investment UI component platform and Make sure unique, creative and smooth animation
**.
