# One Stop Pet Shop — Project Prompt

Project summary
- Build a working, production-ready e-commerce website for "One Stop Pet Shop" (pet store). The site should be customer-focused and designed primarily to attract new customers while remaining simple, fast, and easy to manage.

Reference for concept and layout inspiration: `https://petshopnearme.co.in/` (use as visual/flow reference only, social media links and other information only, not exact ui).

Core features (must-have)
- **User authentication:** Google account sign-in (OAuth). Provide secure session handling.
- **Responsive UI:** Minimal, user-friendly design that works well on mobile, tablet, and desktop.
- **Product catalog:** Categories, product pages, images, prices, discounts, and special offers.
- **Shopping cart & checkout:** Add/remove items, cart persistence, billing summary, and order creation.
- **Order management:** Dashboard for administrators to view orders and update product delivery status (pending, shipped, delivered, returned).
- **Admin management program:** A lightweight custom admin interface or standalone tool to add/remove categories, products, prices, discounts, and special offers.
- **Backend server & API:** A secure backend to power site functionality (auth, product management, orders, delivery status). Provide REST or GraphQL API endpoints and data persistence.

Non-functional requirements
- **Performance:** Very lightweight pages; prioritize fast load times and small bundle sizes (optimize images, minimize JS/CSS). Aim for good Core Web Vitals.
- **SEO:** Server-rendered or pre-rendered critical pages, clean metadata, sitemap, and fast-first-paint behavior.
- **Accessibility:** Basic accessibility (keyboard nav, alt text, semantic HTML).
- **Security:** Proper handling of auth tokens, input validation, and CSRF protection where relevant.

Deliverables
- Complete source code for frontend and backend.
- Admin management program source.
- `README.md` with setup, run, and deployment instructions.
- Minimal sample data (seed script) and example environment configuration.
- List of third-party services used (e.g., OAuth provider, database, storage).

Suggested acceptance criteria
- Users can sign in with Google and browse products on any device.
- Admin can add/update/delete categories and products via the management UI.
- Customers can add items to cart and create orders; admins can update delivery status.
- The site serves fast and scores reasonably on basic performance checks.

Optional (tech guidance)
- Use any language/framework but keep the stack easy to run locally (e.g., Node.js + Express/Nest + React/Vite, or Python + FastAPI + minimal frontend). Use SQLite or a small managed DB for prototype.

Notes for implementer
- Provide clear setup steps and commands in `README.md`.
- Keep the UI minimal and componentized so it is easy to extend.

