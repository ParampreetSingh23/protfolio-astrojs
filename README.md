# Modernist Editorial Developer Portfolio (Astro + Tailwind)

This is a premium, Swiss-editorial developer portfolio built for **Parampreet Singh** using **Astro JS** and **Tailwind CSS v4**. 

## Features

- **Swiss-Editorial Design Layout**: Alternates between modernist light screens (off-white, high contrast) and dark slate screens, styled with fine lines, clean margins, and inline visual badges.
- **Interactive Venn Diagram**: Responsive, SVG-based interactive Venn diagram reflecting skill synthesis (Web Dev, Cloud/DevOps, Programming/DB) with hover actions.
- **Vertical Stacked Projects**: Staggered list layout featuring technical tags, clean border dividers, and smooth hover scales.
- **Copy-to-Clipboard Integrations**: Interactive copy action for email address.
- **Astro Docs MCP Config**: Pre-configured JSON snippet to easily hook up AI editors to the live Astro framework documentation.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:4321/](http://localhost:4321/) in your browser.

### 3. Build for Production
```bash
npm run build
```
The compiled static assets will be located in the `dist/` directory, ready to be deployed to Vercel, Netlify, or AWS S3.

---

## AI Assistant Integration (Astro Docs MCP)

This project includes configuration for the **Model Context Protocol (MCP)** to give AI coding assistants (like Cursor, Claude Desktop, or VS Code Copilot) real-time access to the latest Astro framework documentation.

### Setting up in Cursor
1. Go to **Cursor Settings** > **Features** > **MCP**.
2. Click **+ Add New MCP Server**.
3. Configure it as follows:
   - **Name**: `Astro Docs`
   - **Type**: `http`
   - **URL**: `https://mcp.docs.astro.build/mcp`
4. Alternatively, Cursor will automatically pick up the configuration defined in the project's [`.cursor/mcp.json`](./.cursor/mcp.json).

---

## Project Customization

- **Resume**: Overwrite the placeholder file `public/resume.pdf` with your actual PDF resume.
- **Styling**: Theme custom colors, typography (Outfit & Space Grotesk), and custom animations are configured in [`src/styles/global.css`](./src/styles/global.css) using Tailwind v4 custom theme directives.
- **Content**: Update projects, skills, education, and contact links directly in [`src/pages/index.astro`](./src/pages/index.astro).
