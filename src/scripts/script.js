import {moduleId} from "./helper";

const SCALE_STEP = 1.1;
const MIN_IMG_SIZE = 40;
const MIN_FONT_SIZE = 8;
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
    } else {
    }

    resizeTextElements(editor, direction);

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
