import {moduleId} from "./settings.js";

const MODULE_ID = 'journal-font-scaler';
const JOURNALSHEET_CLASS = 'sheet journal-sheet';
const INCREASE = 'increase';
const DECREASE = 'decrease';
const SCALE_STEP = 1.1;  // Define a consistent scale step across text and images
const MIN_IMG_SIZE = 40;    // Minimum size to prevent items from becoming too small
const MIN_FONT_SIZE = 3
let scaleImages;

Hooks.once('ready', () => {
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error("This module requires the 'libWrapper' module. Please install and activate it.");
});

export function setScaleImages(_scaleImages) {
    scaleImages = _scaleImages;
}

// Overriding original mousewheel behavior
Hooks.once('setup', function () {
    setScaleImages(game.settings.get(moduleId, "scale-images"));

    // Add our wheel event listener
    window.addEventListener("wheel", (event) => {
        _onWheel_override(event);
    }, { passive: false });
});

function _onWheel_override(event) {
    if (!event.ctrlKey) {
        return;
    }

    let jrn_sheet_windows = document.getElementsByClassName(JOURNALSHEET_CLASS);

    if (jrn_sheet_windows.length === 0) {
        return;
    }

    let i;
    let journal_win;
    let foundit = false;
    for (i = 0; i < jrn_sheet_windows.length; i++) {
        journal_win = jrn_sheet_windows[i];
        if (journal_win.contains(event.target)) {
            foundit = true;
            break;
        }
    }

    if (!foundit) {
        return;
    }

    let resizeDirection;
    if ((event.wheelDelta > 0) || (event.deltaY < 0)) {
        resizeDirection = INCREASE;
    } else if ((event.wheelDelta < 0) || (event.deltaY > 0)) {
        resizeDirection = DECREASE;
    }

    if (resizeDirection) {
        _onWheel_textResize(journal_win, resizeDirection);

        if (scaleImages || event.shiftKey) {
            _onWheel_imageResize(journal_win, resizeDirection);
        }
    }
}

function _onWheel_textResize(journal_win, which_dir) {
    // Get the DOM element of the journal editor and change its style
    let journal_editor = getTextDomElement(journal_win);

    if (!journal_editor) {
        console.error("Could not find journal DOM element");
        return;
    }

    let current_size_str = journal_editor.style.fontSize;
    let current_size = current_size_str === '' ? 14 : Number(current_size_str.replace('px', ''));

    let new_size;
    if (which_dir === INCREASE) {
        new_size = current_size * SCALE_STEP;
    } else {
        new_size = current_size / SCALE_STEP;
    }

    if (new_size > MIN_FONT_SIZE) {
        journal_editor.style.fontSize = `${new_size}px`;
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


function getTextDomElement(journal_win) {
    let journal_editor = journal_win.getElementsByClassName('journal-page-content')[0];

    if (!journal_editor) {
        journal_editor = journal_win.getElementsByClassName('editor-content')[0];
    }

    return journal_editor;
}
