import { moduleId } from "./helper";

const SCALE_STEP = 1.1;
const MIN_IMG_SIZE = 40;
const MIN_FONT_SIZE = 3;
let scaleImages = false;

const ZOOM_CONFIG = {
    // Journal Sheets selectrs
    sheets: [
        '.sheet.journal-sheet .journal-entry-pages', // Default Foundry
        '.sheet.journal-sheet .sheet-main', // Campaign Codex
        '.sheet.monks-journal-sheet', // Monk's Journal
        '.sheet.item-sheet',
        '.wgtngm-view-notes .vn-editor-container' // Mini Calendar
    ],
    // Editor selectors
    editors: [
        '.journal-page-content',
        '.editor-content',
        '.editor',
        '.prosemirror',
        '.monks-journal-content'
    ]
};

/**
 * Initializes the wheel event listener for journal scaling.
 */
export function setupScript() {
    scaleImages = game.settings.get(moduleId, "scale-images");
    window.addEventListener("wheel", handleJournalResize, { passive: false });
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

    const sheetSelector = ZOOM_CONFIG.sheets.join(', ');
    const journalSheet = event.target.closest(sheetSelector);
    if (!journalSheet) return;

    event.preventDefault();

    const direction = event.deltaY < 0 ? 'increase' : 'decrease';

    resizeJournalText(journalSheet, direction);

    if (scaleImages) {
        resizeJournalImages(journalSheet, direction, event.target);
    }
}

/**
 * Adjusts the font size of matched editor elements inside the sheet.
 * @param {HTMLElement} journalSheet
 * @param {'increase'|'decrease'} direction
 */
function resizeJournalText(journalSheet, direction) {
    const editorSelector = ZOOM_CONFIG.editors.join(', ');
    const editors = journalSheet.querySelectorAll(editorSelector);

    editors.forEach(editor => {
        const currentSize = parseFloat(window.getComputedStyle(editor).fontSize) || 16;
        const newSize = direction === 'increase' ? currentSize * SCALE_STEP : currentSize / SCALE_STEP;

        if (newSize >= MIN_FONT_SIZE) {
            editor.style.fontSize = `${newSize}px`;
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
