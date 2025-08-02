/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


// --- TYPE DEFINITIONS ---
type HTMLElementOrNull = HTMLElement | null;
type HTMLButtonElementOrNull = HTMLButtonElement | null;
type HTMLInputElementOrNull = HTMLInputElement | null;

// --- GLOBAL STATE & CONFIGURATION ---
let ai: GoogleGenAI | null = null;
const modelName = 'gemini-2.5-flash';
let lastFocusedElement: HTMLElementOrNull = null;
let tooltipTimeout: number | null = null;
const tooltipDelay = 200; // ms

// --- INITIALIZATION ---
try {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
  // We can still run the app with UI features, but AI will be disabled.
}

// --- CORE AI & UTILITY FUNCTIONS ---

/**
 * A simplified markdown-to-HTML converter.
 * @param text The markdown text to convert.
 * @returns An HTML string.
 */
function markdownToHtml(text: string): string {
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Paragraphs
  html = html.split('\n').map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join('');
  return `<div class="prose max-w-none">${html}</div>`;
}

/**
 * Streams a response from the Gemini API to an element with a typing effect.
 * @param prompt The prompt to send to the API.
 * @param outputElement The element to display the output in.
 */
async function streamResponseToElement(prompt: string, outputElement: HTMLElement) {
    outputElement.innerHTML = `<div class="prose max-w-none"><span class="typing-cursor"></span></div>`;

    if (!ai) {
        outputElement.innerHTML = `<p class="text-red-500">Sorry, the AI feature is not configured correctly.</p>`;
        return;
    }
    
    try {
        const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: prompt,
        });

        let fullResponse = "";
        const proseContainer = outputElement.querySelector('.prose') as HTMLElement;
        for await (const chunk of responseStream) {
            fullResponse += chunk.text;
            proseContainer.innerHTML = markdownToHtml(fullResponse).replace('</div>', '<span class="typing-cursor"></span></div>');
        }
        proseContainer.querySelector('.typing-cursor')?.remove();

    } catch (error) {
        console.error("Gemini API Error:", error);
        outputElement.innerHTML = `<p class="text-red-500">Sorry, an error occurred. Please try again.</p>`;
    }
}

// --- MODAL & TOOLTIP MANAGEMENT ---

function showModal(title: string) {
    const aiModal = document.getElementById('ai-modal') as HTMLElementOrNull;
    const modalTitle = document.getElementById('modal-title') as HTMLElementOrNull;
    if (aiModal && modalTitle) {
        lastFocusedElement = document.activeElement as HTMLElement;
        modalTitle.innerHTML = `<span class="gradient-text">${title}</span>`;
        aiModal.style.display = 'flex';
        (aiModal.querySelector('.modal-close-btn') as HTMLElementOrNull)?.focus();
    }
}

function hideModal() {
    const aiModal = document.getElementById('ai-modal') as HTMLElementOrNull;
    if (aiModal) {
        aiModal.style.display = 'none';
        (document.getElementById('modal-output') as HTMLElementOrNull)!.innerHTML = '';
        lastFocusedElement?.focus();
    }
}

function showTooltip(termElement: HTMLElement, content: string | HTMLElement) {
    const tooltip = document.getElementById('ai-tooltip') as HTMLElementOrNull;
    if (!tooltip) return;

    if (typeof content === 'string') {
        tooltip.innerHTML = content;
    } else {
        tooltip.innerHTML = '';
        tooltip.appendChild(content);
    }
    
    const rect = termElement.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`; // 8px spacing
    tooltip.classList.add('visible');
}

function hideTooltip() {
     const tooltip = document.getElementById('ai-tooltip') as HTMLElementOrNull;
     tooltip?.classList.remove('visible');
}

// --- ANIMATION FUNCTIONS ---
function animateCountUp(el: HTMLElement) {
    const target = parseInt(el.dataset.count || '0', 10);
    let current = 0;
    const duration = 1500; // ms
    const stepTime = 20; // ms
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.ceil(current).toString();
    }, stepTime);
}


// --- INITIALIZATION FUNCTIONS ---

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link');
    const sections = document.querySelectorAll('.section');

    const scrollToAction = (targetId: string) => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        document.getElementById('mobile-menu')?.classList.add('hidden');
      }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = (event.currentTarget as HTMLElement).dataset.target;
            if (targetId) scrollToAction(targetId);
            // Handle footer links that are simple hrefs
            else if (link.getAttribute('href')?.startsWith('#')) {
                 const hrefTargetId = link.getAttribute('href')?.substring(1);
                 if(hrefTargetId) scrollToAction(hrefTargetId);
            }
        });
    });

    // Mobile Menu Toggle
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('hidden');
    });

    // Hero Explore Button
    document.getElementById('explore-btn-hero')?.addEventListener('click', () => {
        scrollToAction('debate');
    });

    // Scrollspy
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-target') === id);
                });
            }
        });
    }, { rootMargin: "-20% 0px -70% 0px" }); // trigger when section is in the middle 10% of the screen
    sections.forEach(section => sectionObserver.observe(section));
}

function initAccordions() {
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling as HTMLElementOrNull;
            button.classList.toggle('open');
            if (content) {
                content.style.maxHeight = content.style.maxHeight ? '' : content.scrollHeight + "px";
            }
        });
    });
}

function initScrollEffects() {
    const backToTopButton = document.getElementById('back-to-top');
    const siteHeader = document.getElementById('site-header');

    // Back to top & Header Scroll effects
    if (backToTopButton && siteHeader) {
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 100;
            backToTopButton.style.display = isScrolled ? "flex" : "none";
            siteHeader.classList.toggle('scrolled', isScrolled);
        }, { passive: true });
        backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Reveal on Scroll
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Animate count-up if applicable
                entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCountUp);
                // Animate timeline if applicable
                if(entry.target.id === 'timeline-container') {
                    entry.target.classList.add('is-drawing');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-on-scroll, .ranked-list-item').forEach(el => revealObserver.observe(el));
    const timelineContainer = document.getElementById('timeline-container');
    if(timelineContainer) revealObserver.observe(timelineContainer);
}


function initAITools() {
    // Main AI tool buttons
    document.getElementById('explain-btn')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const passage = (document.getElementById('passage-input') as HTMLInputElementOrNull)?.value;
        const prompt = passage ? `As a biblical scholar, provide a detailed but accessible explanation of the passage "${passage}". Cover its immediate context, key terms, theological significance, and how it's understood in broader biblical themes.` : null;
        if (!prompt) return;
        const outputElement = document.getElementById('explain-output')!;
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="btn-loader"></span> Processing...`;
        await streamResponseToElement(prompt, outputElement);
        btn.disabled = false;
        btn.innerHTML = originalContent;
    });

    document.getElementById('compare-btn')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const concept1 = (document.getElementById('compare1-input') as HTMLInputElementOrNull)?.value;
        const concept2 = (document.getElementById('compare2-input') as HTMLInputElementOrNull)?.value;
        const prompt = (concept1 && concept2) ? `As a biblical scholar, create a detailed comparison and contrast between "${concept1}" and "${concept2}". Structure the response with an introduction, a section for similarities, a section for differences, and a conclusion.` : null;
        if (!prompt) return;
        const outputElement = document.getElementById('compare-output')!;
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="btn-loader"></span> Processing...`;
        await streamResponseToElement(prompt, outputElement);
        btn.disabled = false;
        btn.innerHTML = originalContent;
    });

    // Contextual AI buttons (in accordions)
    document.querySelectorAll('.contextual-ai-btn').forEach(btn => {
        const button = btn as HTMLButtonElement;
        button.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent accordion from closing
            const prompt = button.dataset.prompt;
            const buttonText = button.textContent?.replace('✨', '').trim() || 'Details';
            const modalOutput = document.getElementById('modal-output');
            if (prompt && modalOutput) {
                showModal(`Explanation: ${buttonText}`);
                const originalContent = button.innerHTML;
                button.disabled = true;
                button.innerHTML = `✨ Loading...`;
                await streamResponseToElement(prompt, modalOutput);
                button.disabled = false;
                button.innerHTML = originalContent;
            }
        });
    });
    
    // Section Summaries
    document.querySelectorAll('.btn-summarize').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const button = e.currentTarget as HTMLButtonElement;
            const sectionCard = button.closest<HTMLElement>('.card');
            if (!sectionCard) return;
            const content = sectionCard.innerText;
            const title = (sectionCard.querySelector('h2') as HTMLElement | null)?.innerText || 'Summary';
            const prompt = `Please provide a concise, bullet-point summary of the following text: "${content}"`;
            const modalOutput = document.getElementById('modal-output');
            
            if (modalOutput) {
                showModal(title);
                await streamResponseToElement(prompt, modalOutput);
            }
        });
    });

    // AI Glossary Tooltips
    document.querySelectorAll('.interactive-term').forEach(termEl => {
        const term = (termEl as HTMLElement).dataset.term || termEl.textContent || '';
        if (!term) return;

        termEl.addEventListener('mouseenter', () => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = window.setTimeout(async () => {
                 const tooltipContent = document.createElement('div');
                 showTooltip(termEl as HTMLElement, tooltipContent);
                 const prompt = `In the context of biblical studies, explain the term "${term}" in 1-2 concise sentences.`;
                 await streamResponseToElement(prompt, tooltipContent);
            }, tooltipDelay);
        });

        termEl.addEventListener('mouseleave', () => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            hideTooltip();
        });
    });
}

function initSuggestionChips() {
     document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('suggestion-chip')) return;
        const buttonText = target.textContent || '';
        const container = target.closest('.suggestion-chips');
        if (!container) return;
        const { targetInput, targetInput1, targetInput2 } = (container as HTMLElement).dataset;
        if (targetInput1 && targetInput2) {
            const parts = buttonText.split(' vs. ');
            if (parts.length === 2) {
                (document.getElementById(targetInput1) as HTMLInputElementOrNull)!.value = parts[0].trim();
                (document.getElementById(targetInput2) as HTMLInputElementOrNull)!.value = parts[1].trim();
            }
        } else if (targetInput) {
            (document.getElementById(targetInput) as HTMLInputElementOrNull)!.value = buttonText;
        }
    });
}

function initModal() {
    const aiModal = document.getElementById('ai-modal') as HTMLElementOrNull;
    document.querySelector('.modal-close-btn')?.addEventListener('click', hideModal);
    aiModal?.addEventListener('click', (e) => { if (e.target === aiModal) hideModal(); });
    document.addEventListener('keydown', (e) => {
        if (aiModal?.style.display !== 'flex' || e.key !== 'Escape') return;
        hideModal();
    });
}


/**
 * Main application setup function.
 */
function main() {
    initNavigation();
    initAccordions();
    initScrollEffects();
    initSuggestionChips();
    initModal();
    if(ai) { // Only initialize AI features if the API key is present
        initAITools();
    } else {
        console.warn("AI features are disabled. No API Key found.");
        document.querySelectorAll('#ai_tools, .contextual-ai-btn, .btn-summarize, .interactive-term').forEach(el => (el as HTMLElement).style.display = 'none');
    }
}

document.addEventListener('DOMContentLoaded', main);