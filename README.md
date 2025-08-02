# The Making of the Bible: An Interactive Exploration

This is a single-page web application that provides an interactive and educational journey into the creation of the Bible. It combines scholarly and theological perspectives, presented in a modern, responsive interface. The application leverages the Google Gemini API to offer AI-powered study tools, such as passage explanations, concept comparisons, and content summaries.

## Features

-   **Interactive Content Sections:** Detailed sections on the core debates, historical timeline, authorship theories (Documentary Hypothesis, Synoptic Problem), canonization process, and textual transmission.
-   **AI-Powered Study Tools:**
    -   **Passage Explainer:** Get detailed explanations for any biblical passage.
    -   **Compare & Contrast:** Analyze the similarities and differences between two concepts.
    -   **Section Summaries:** Generate concise summaries for content sections with a single click.
    -   **Contextual AI Modals:** Get in-depth explanations on specific topics without leaving the page.
    -   **Interactive Glossary:** Hover over key terms to get instant definitions from the AI.
-   **Modern UI/UX:**
    -   Fully responsive design for desktop and mobile.
    -   Smooth scrolling and scroll-spy navigation.
    -   Engaging animations and visual effects that trigger on scroll.
    -   Clean, readable typography and a professionally designed layout.
-   **Dynamic Timeline:** An animated timeline that visually represents the key dates in the Bible's formation.
-   **Accordions and Modals:** To present complex information in a digestible and non-overwhelming way.

## Tech Stack

-   **Frontend:** HTML5, CSS3, TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS (via CDN), Custom CSS for theming and animations
-   **AI:** Google Gemini API (`@google/genai`)
-   **Fonts:** Google Fonts (Inter)

## Prerequisites

-   Node.js and npm (or yarn).
-   A **Google Gemini API Key**.

## Getting Started

### 1. API Key Configuration

This project requires a Google Gemini API key to power its AI features. The application is designed to be run in an environment where this key is provided as an environment variable named `API_KEY`.

You must ensure that the `API_KEY` environment variable is available in your shell before running the development or build commands. For hosting platforms like Render, this should be set in the service's environment variable settings.

### 2. Installation & Running

1.  **Install dependencies:**
    ```bash
    # Using npm
    npm install

    # Or using yarn
    yarn install
    ```

2.  **Run in Development Mode:**
    To run the app with a local development server and hot-reloading:
    ```bash
    # Using npm
    npm run dev

    # Or using yarn
    yarn dev
    ```

3.  **Build for Production:**
    To create an optimized build for deployment:
    ```bash
    # Using npm
    npm run build

    # Or using yarn
    yarn build
    ```
    This creates a `dist` directory with the final static assets.

4.  **Start Production Server:**
    The `start` command is used by hosting platforms like Render to serve the built application. It runs after the `build` command is complete.
    ```bash
    # Using npm
    npm run start

    # Or using yarn
    yarn start
    ```
    This command will serve the contents of the `dist` folder.

## File Structure

```
.
├── dist/              # The build output directory (created after `npm run build`)
├── node_modules/      # Project dependencies (created after `npm install`)
├── index.html         # The main HTML entry point for the application.
├── index.css          # Custom styles, theming, and animations.
├── index.ts           # The core application logic in TypeScript.
├── package.json       # Defines project scripts and dependencies.
├── tsconfig.json      # TypeScript compiler configuration.
├── vite.config.ts     # Vite build tool configuration.
├── metadata.json      # Project metadata.
└── README.md          # This file.
```

## License

This project is licensed under the Apache 2.0 License. See the `SPDX-License-Identifier` in the source code for more details.
