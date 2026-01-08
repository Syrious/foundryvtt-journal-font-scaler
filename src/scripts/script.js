import {isV13OrLater, moduleId} from "./helper";

const DEFAULT_JOURNAL_SHEET_CLASS = 'sheet journal-sheet';
const MONKS_JOURNAL_SHEET_CLASS = 'sheet monks-journal-sheet';
const INCREASE = 'increase';
const DECREASE = 'decrease';
const SCALE_STEP = 1.1;  // Define a consistent scale step across text and images
const MIN_IMG_SIZE = 40;    // Minimum size to prevent items from becoming too small
const MIN_FONT_SIZE = 3
let scaleImages;

/// <reference path="./foundry.d.ts" />

export function setupScript() {
    setScaleImages(game.settings.get(moduleId, "scale-images"));

    if (isV13OrLater()) {
        window.addEventListener("wheel", (event) => {
            _onWheel_override(event);
        }, {passive: false});
    } else {
        libWrapper.register(
            moduleId,
            'MouseManager.prototype._onWheel',
            function (existing_onWheel, event) {
                _onWheel_override.bind(this)(event);
                return existing_onWheel.bind(this)(event);
            },
            'WRAPPER',
        )
    }
}

export function setScaleImages(_scaleImages) {
    scaleImages = _scaleImages;
}

function _onWheel_override(event) {
    if (!event.ctrlKey) {
        return;
    }

    let isMonkSheet = false;
    let journalSheetElement = document.getElementsByClassName(DEFAULT_JOURNAL_SHEET_CLASS);

    if (journalSheetElement.length === 0) {
        // Alternative test for Monk's Journal Sheet
        journalSheetElement = document.getElementsByClassName(MONKS_JOURNAL_SHEET_CLASS);
        isMonkSheet = true;
    }

    if (journalSheetElement.length === 0) {
        return;
    }

    let i;
    let journal_win;
    let foundIt = false;
    for (i = 0; i < journalSheetElement.length; i++) {
        journal_win = journalSheetElement[i];
        if (journal_win.contains(event.target)) {
            foundIt = true;
            break;
        }
    }

    if (!foundIt) {
        return;
    }

    let resizeDirection;
    if ((event.wheelDelta > 0) || (event.deltaY < 0)) {
        resizeDirection = INCREASE;
    } else if ((event.wheelDelta < 0) || (event.deltaY > 0)) {
        resizeDirection = DECREASE;
    }

    if (resizeDirection) {
        _onWheel_textResize(journal_win, resizeDirection, isMonkSheet);

        if (scaleImages || event.shiftKey) {
            _onWheel_imageResize(journal_win, resizeDirection);
        }
    }
}

function _onWheel_textResize(journal_win, which_dir, isMonkSheet) {
    // Get the DOM element of the journal editor and change its style
    let journalPageElement = getTextDomElement(journal_win, isMonkSheet);
    let textBody = journalPageElement.textBody;


    if (!textBody) {
        console.error("Could not find journal DOM element");
        return;
    }

    if (journalPageElement.applySelf) {
        resizeFontOfElement(textBody, which_dir);
    }

    if (journalPageElement.applyToChildren) {
        for (let child of textBody.children) {
            applyTextResizeToElementAndChildren(child, which_dir)
        }
    }
}

function computeNewFontSize(element, direction) {
    // Get computed font size (includes CSS styles, not just inline)
    let computedStyle = window.getComputedStyle(element);
    let currentSizeString = computedStyle.fontSize;


    let currentSize = currentSizeString === '' ? 14 : Number(currentSizeString.replace('px', ''));

    if (direction === INCREASE) {
        return currentSize * SCALE_STEP;
    } else {
        return currentSize / SCALE_STEP;
    }
}

function resizeFontOfElement(element, which_dir) {
    let newFontSize = computeNewFontSize(element, which_dir);

    if (newFontSize > MIN_FONT_SIZE) {
        element.style.fontSize = `${newFontSize}px`;
    }
}

function applyTextResizeToElementAndChildren(element, which_dir) {
    resizeFontOfElement(element, which_dir);

    // Recursively apply to all children
    for (let child of element.children) {
        applyTextResizeToElementAndChildren(child, which_dir);
    }
}

function _onWheel_imageResize(journal_win, which_dir) {
    let images = journal_win.getElementsByTagName('img');

    if (images.length === 0) {
        return;
    }

    for (let img of images) {
        let current_width = img.width;
        let aspect_ratio = img.naturalWidth / img.naturalHeight;

        let new_width, new_height;
        if (which_dir === INCREASE) {
            new_width = current_width * SCALE_STEP;
            new_height = new_width / aspect_ratio;

            img.style.width = `${new_width}px`;
            img.style.height = `${new_height}px`;
        } else if (which_dir === DECREASE) {
            new_width = current_width / SCALE_STEP
            new_height = new_width / aspect_ratio;

            if (new_width > MIN_IMG_SIZE && new_height > MIN_IMG_SIZE) {
                img.style.width = `${new_width}px`;
                img.style.height = `${new_height}px`;
            }
        }


    }
}


function getTextDomElement(journal_win, isMonkSheet) {
    let textBody;
    let applyToChildren = true;
    let applySelf = true;

    if (isMonkSheet) {
        // This is for Monk's Journal Sheet. We can manipulate the whole element directly
        textBody = journal_win.getElementsByClassName("sheet-body")[0];
        applyToChildren = true;
    }

    if (!textBody) {
        // ProseMirror editor
        textBody = journal_win.getElementsByClassName('editor-content')[0];
    }

    if (!textBody) {
        // Foundry's default in Read-Only mode
        textBody = journal_win.getElementsByClassName('journal-page-content')[0];
    }


    return {textBody, applyToChildren, applySelf};
}


