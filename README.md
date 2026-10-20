# Widget Tide Studio

# Lovable Prompt: WebToolOcean Widget Studio UI

Build a polished, modern, responsive **Website Widgets Studio** for WebToolOcean, inspired by the usability of Elfsight but with our own unique branding and design.

## 1. Main Objective

Create a functional front-end UI where users can browse website widgets, select one, customize its settings, preview it, and obtain installation code.

**Important:** If this is an existing project, inspect the current codebase first. Reuse the existing components, routes, state management, authentication, and styling. Do not rebuild or replace existing functionality.

## 2. Design Requirements

- Modern SaaS dashboard inspired by premium website builders.
- White background, subtle gray borders, rounded cards, soft shadows, and pink/purple/blue accents.
- Compact, clean layouts with excellent spacing and typography.
- Responsive for desktop, tablet, and mobile.
- Use the existing project's React, TypeScript, Tailwind CSS, shadcn/ui, and Lucide icons if already installed.
- Use CSS for layouts, hover effects, transitions, and animations wherever possible.
- Avoid unnecessary dependencies and complex architecture.

## 3. Widget Dashboard

Keep a left sidebar with:

- Dashboard
- All Widgets
- My Widgets
- Templates
- Integrations
- Settings

The main content should contain:

- Heading: "Website Widgets"
- Description: "Discover, customize and manage all your website widgets in one place."
- Search widgets input
- Category filter tabs
- Widget count
- Responsive widget card grid

Include these widget cards:

Google Reviews, Instagram Feed, Facebook Feed, WhatsApp Chat, FAQ Accordion, Countdown Timer, Testimonials, Contact Form, Popup, Event Calendar, Social Media Feed, YouTube Gallery, Accessibility Widget, Language Switcher, Store Locator, Announcement Bar, and Custom HTML.

Each card should have an icon or preview thumbnail, widget name, one-line description, and a status label.

Use **Ready** for implemented widgets and **Coming Soon** for widgets that are not implemented. Do not falsely mark nonfunctional widgets as ready.

Add search and category filtering that actually work.

## 4. Widget Customization

When a user clicks an implemented widget's Create or Customize button, open a clean editor page or modal containing:

- Live widget preview
- Content settings
- Layout and display settings
- Theme and color settings
- Width and height controls where applicable
- Border radius and spacing controls
- Desktop and mobile preview options
- Save Widget button
- Install Widget button

Use dynamic form controls appropriate to the selected widget. For example, Google Reviews should include review layout, rating display, colors, and header settings; WhatsApp Chat should include welcome text, button color, and floating position.

Changes should update the preview immediately. Persist settings using the existing project's storage or state management where available.

## 5. Widget Installation

Create a simple installation interface with:

- Installation instructions
- Copy embed code button
- HTML installation option
- WordPress, Shopify, Wix, Webflow, and custom website options

Generate a clearly identified demo embed snippet for the selected widget. Copy Code should work, but do not pretend that the snippet connects to a production widget service unless the existing backend supports it.

## 6. Functionality and Constraints

- Search, category filters, navigation, preview updates, save actions, and copy-code controls must work.
- Reuse existing functionality and data wherever possible.
- Keep page widgets such as FAQ, testimonials, galleries, and Google Reviews distinct from floating widgets such as WhatsApp Chat, accessibility, and language switchers.
- Do not force every widget into drag-and-drop.
- Do not implement a complex page builder, new backend, payment system, or authentication flow.
- Do not create duplicate pages or unnecessary components.
- Do not break existing routes, integrations, or saved widget configurations.
- Use realistic demo data only where actual data is unavailable.

## 7. Deliverable

Complete the dashboard, widget catalog, and a reusable widget customization/install interface as one cohesive UI. Ensure the application builds successfully and all visible controls work.

**Prioritize a complete, polished, functional UI over adding more features. Make the smallest necessary code changes and do not expand the scope beyond this task.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://widget-tide-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95ce8684-709e-4f87-8f03-9266c962c242).

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
