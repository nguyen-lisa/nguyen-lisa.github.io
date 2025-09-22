# Lisa Nguyen — Portfolio

A clean, fast personal site built with **Next.js** and **TypeScript** to showcase projects, writing, and experience.

<p align="center">
  <a href="https://nguyen-lisa.github.io" target="_blank"><b>Live Site → nguyen-lisa.github.io</b></a>
</p>

---

## Features

* Project gallery with concise case studies
* About/Resume section
* MDX notes/blog (Contentlayer)
* Responsive, accessible UI
* SEO-friendly metadata & social previews

---

## Tech Stack

* **Framework:** Next.js (App Router; create-next-app)
* **Language:** TypeScript
* **Content:** MDX via Contentlayer
* **Styling:** Tailwind CSS

---

## Getting Started (Local Dev)

Clone and install dependencies:

```bash
# 1) Clone
git clone https://github.com/nguyen-lisa/nguyen-lisa.github.io.git
cd nguyen-lisa.github.io

# 2) Install
npm install  # or: yarn / pnpm / bun

# 3) Run the dev server
npm run dev   # or: yarn dev / pnpm dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Edit files in `src/` — changes hot‑reload instantly.

---

## Content (MDX)

* Write posts or notes in MDX (location defined by your Contentlayer setup).
* Contentlayer indexes your MDX so you can query typed content in components.
* Add frontmatter (title, date, summary, tags) to drive lists, filters, and SEO meta.

---

## Deployment

**Target:** GitHub Pages via GitHub Actions (CI/CD)

* Build a **static export** of the site (`next build && next export`) so the output lives in `out/`.
* Ensure `next.config.ts` includes `output: 'export'` and any needed image/basePath tweaks for static hosting.
* Your workflow in `.github/workflows/` builds the site and deploys to **Pages**. Every push to `main` publishes an update.

> GitHub Pages serves static files only, so avoid server‑only Next.js features (e.g., server actions or dynamic routes without pre‑rendering).

---

## Accessibility

* Audited with axe DevTools and Lighthouse; resolved flagged issues where applicable.
* ARIA labels and roles applied to interactive elements and landmarks for clarity.
* Keyboard navigation and focus states verified.
* Semantic HTML landmarks and headings.
* Descriptive alt text; color contrast checked.

---

## Roadmap / Ideas

* **Project filters** (tags/tech)
* **Accessible icons/labels** to aid scanning and screen‑reader cues
* **All Projects** page; **Home** shows **Featured Projects**
* (Optional) Dark mode toggle
* (Optional) RSS feed; Open Graph image automation for posts

---

## Contributing

This is a personal site, but suggestions are welcome via issues or pull requests.

---

## License

* **Code:** MIT License.
* **Content (text/images/case studies):** All Rights Reserved.

---

## Contact

* **Email:** [lisanguyen.tech@yahoo.com](mailto:lisanguyen.tech@yahoo.com)
* **LinkedIn:** [https://www.linkedin.com/in/lisa-nguyen-48825a160/](https://www.linkedin.com/in/lisa-nguyen-48825a160/)
