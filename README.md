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
-   **Styling:** Tailwind CSS (via CDN), Custom CSS for theming and animations
-   **AI:** Google Gemini API (`@google/genai`)
-   **Fonts:** Google Fonts (Inter)

## Prerequisites

-   A modern web browser (Chrome, Firefox, Safari, Edge).
-   A local web server to serve the files (required for ES Modules to work correctly).
-   A **Google Gemini API Key**.

## Getting Started

### 1. API Key Configuration

This project requires a Google Gemini API key to power its AI features. The application is designed to be run in an environment where this key is provided as `process.env.API_KEY`.

**Important:** Standard browser environments do not have a `process` object. This project assumes it's being run on a platform or with a development server (like Vite, Parcel, or Webpack) that replaces `process.env.API_KEY` with a valid key during the serving or building process. To run this project, you must first ensure your environment is configured to do this.

### 2. Running the Application Locally

Once the API key is configured in your environment, you can serve the project files using any simple local web server.

1.  Navigate to the project's root directory in your terminal.
2.  Start a web server. Here are two common options:

    -   **Using Python:**
        ```bash
        # For Python 3
        python3 -m http.server
        ```

    -   **Using Node.js (requires the `http-server` package):**
        ```bash
        # If you don't have http-server, you can run it with npx
        npx http-server
        ```
3.  Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:8000` or `http://127.0.0.1:8080`).

## File Structure

```
.
├── index.html       # The main HTML entry point for the application.
├── index.css        # Custom styles, theming, and animations.
├── index.tsx        # The core application logic in TypeScript.
├── metadata.json    # Project metadata.
└── README.md        # This file.
```

## License

This project is licensed under the Apache 2.0 License. See the `SPDX-License-Identifier` in the source code for more details.
