import {moduleId} from "./helper";

const SCALE_STEP = 1.1;
const MIN_IMG_SIZE = 40;
const MIN_FONT_SIZE = 8;
const FOUNDRY_FONT_SIZE_DEFAULTS = {
    "--font-size-10": "0.625rem",
    "--font-size-11": "0.6875rem",
    "--font-size-12": "0.75rem",
    "--font-size-13": "0.8125rem",
    "--font-size-14": "0.875rem",
    "--font-size-15": "0.9375rem",
    "--font-size-16": "1rem",
    "--font-size-18": "1.125rem",
    "--font-size-20": "1.25rem",
    "--font-size-24": "1.5rem",
    "--font-size-28": "1.75rem",
    "--font-size-32": "2rem",
    "--font-size-36": "2.25rem",
    "--font-size-40": "2.5rem",
    "--font-size-48": "3rem",
    "--font-size-64": "4rem",
    "--font-size-80": "5rem"
};

const FOUNDRY_DERIVED_FONT_SIZES = {
    "--font-h1-size": "var(--font-size-48)",
    "--font-h2-size": "var(--font-size-32)",
    "--font-h3-size": "var(--font-size-28)",
    "--font-h4-size": "var(--font-size-24)",
    "--font-h5-size": "var(--font-size-20)",
    "--font-h6-size": "var(--font-size-16)"
};

const frameworkFontScaleStates = new WeakMap();
let scaleImages = false;

const ZOOM_CONFIG = {
    selectors: [
        '.journal-entry-pages', // Default Foundry journal
        '.editor-content.ProseMirror', // Default Foundry editor
        '.editor', // dnd5e biography
    ]
};

/**
 * Initializes the wheel event listener for journal scaling.
 */
export function setupScript() {
    scaleImages = game.settings.get(moduleId, "scale-images");
    window.addEventListener("wheel", handleJournalResize, {passive: false});
}

/**
 * Updates the image scaling configuration dynamically.
 * @param {boolean} newScaleImages
 */
export function setScaleImages(newScaleImages) {
    scaleImages = newScaleImages;
}

/**
 * Handles the mouse wheel event to zoom journal text and images.
 * @param {WheelEvent} event
 */
function handleJournalResize(event) {
    if (!event.ctrlKey) return;

    const editorSelector = ZOOM_CONFIG.selectors.join(', ');
    const editor = event.target.closest(editorSelector);
    if (!editor) return;

    event.preventDefault();

    const direction = event.deltaY < 0 ? 'increase' : 'decrease';

    if (editor.className?.includes("ProseMirror")) {
        resizeParentDivElement(editor, direction);
        resizeFrameworkFontVariables(editor, direction);
    } else {
        resizeTextElements(editor, direction);
    }

    if (scaleImages) {
        resizeJournalImages(editor, direction, event.target);
    }
}

/**
 * Adjusts the font size of the matched editor element.
 * @param {HTMLElement} editor
 * @param {'increase'|'decrease'} direction
 */
function resizeParentDivElement(editor, direction) {
    const currentSize = parseFloat(window.getComputedStyle(editor).fontSize) || 16;
    const newSize = direction === 'increase' ? currentSize * SCALE_STEP : currentSize / SCALE_STEP;

    if (newSize >= MIN_FONT_SIZE) {
        editor.style.fontSize = `${newSize}px`;
    }
}

function resizeFrameworkFontVariables(editor, direction) {
    let state = frameworkFontScaleStates.get(editor);

    if (!state) {
        const editorStyles = window.getComputedStyle(editor);
        const baseSizes = {};

        for (const [variableName, defaultValue] of Object.entries(FOUNDRY_FONT_SIZE_DEFAULTS)) {
            baseSizes[variableName] = editorStyles.getPropertyValue(variableName).trim() || defaultValue;
        }

        state = {scale: 1, baseSizes};
        frameworkFontScaleStates.set(editor, state);
    }

    const newScale = direction === "increase"
        ? state.scale * SCALE_STEP
        : state.scale / SCALE_STEP;

    if (10 * newScale < MIN_FONT_SIZE) return;

    for (const [variableName, baseSize] of Object.entries(state.baseSizes)) {
        editor.style.setProperty(variableName, `calc(${baseSize} * ${newScale})`);
    }

    for (const [variableName, value] of Object.entries(FOUNDRY_DERIVED_FONT_SIZES)) {
        editor.style.setProperty(variableName, value);
    }

    state.scale = newScale;
}
/**
 * Adjusts the font size of text elements inside the editor.
 * @param {HTMLElement} editor
 * @param {'increase'|'decrease'} direction
 */
function resizeTextElements(editor, direction) {
    const textSelector = [
        'p',
        'span',
        'li',
        'td',
        'th',
        'blockquote',
        'figcaption',
        'label',
        'strong',
        'em',
        'small',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6'
    ].join(', ');

    const textElements = editor.matches(textSelector)
        ? [editor]
        : editor.querySelectorAll(textSelector);

    textElements.forEach(element => {
        const currentSize = parseFloat(window.getComputedStyle(element).fontSize) || 16;
        const newSize = direction === 'increase' ? currentSize * SCALE_STEP : currentSize / SCALE_STEP;

        if (newSize >= MIN_FONT_SIZE) {
            element.style.fontSize = `${newSize}px`;
        }
    });
}

/**
 * Adjusts the size of images inside the journal sheet.
 * @param {HTMLElement} journalSheet
 * @param {'increase'|'decrease'} direction
 * @param {EventTarget} target
 */
function resizeJournalImages(journalSheet, direction, target) {
    const images = target.matches('img') ? [target] : journalSheet.querySelectorAll('img');

    images.forEach(img => {
        const currentWidth = img.clientWidth || img.getBoundingClientRect().width;
        if (!currentWidth) return;

        const newWidth = direction === 'increase' ? currentWidth * SCALE_STEP : currentWidth / SCALE_STEP;

        if (newWidth >= MIN_IMG_SIZE) {
            img.style.width = `${newWidth}px`;
            img.style.height = 'auto';
        }
    });
}
