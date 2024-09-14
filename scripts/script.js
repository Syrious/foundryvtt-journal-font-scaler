const MODULE_ID = 'journal-font-scaler';
const JOURNALSHEET_CLASS = 'sheet journal-sheet';
const INCREASE = 'increase';
const DECREASE = 'decrease';

Hooks.once('ready', () => {
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM)
        ui.notifications.error("This module requires the 'libWrapper' module. Please install and activate it.");
});

// Overriding original mousewheel behavior
Hooks.once('setup', function () {
        libWrapper.register(
            MODULE_ID,
            'MouseManager.prototype._onWheel',
            function (existing_onWheel, event) {
                _onWheel_override.bind(this)(event);
                return existing_onWheel.bind(this)(event);
            },
            'WRAPPER',
        )
    }
)

// Mouse Wheel Override
function _onWheel_override(event) {
    if (event.ctrlKey === false) {
        return;
    }

    // Get the list of all windows currently open that are journal-sheet windows
    let jrn_sheet_windows = document.getElementsByClassName(JOURNALSHEET_CLASS);

    // If there are none, just exit the function.
    if (jrn_sheet_windows.length === 0) {
        return;
    }

    // Trying to find the window hovered with the mouse among the opened journal sheet windows.
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

    if (foundit === false) {
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
        _onWheel_imageResize(journal_win, resizeDirection);
    }
}

function _onWheel_textResize(journal_win, which_dir) {
    // Get the DOM element of the journal editor and change its style
    let journal_editor = getTextDomElement(journal_win);

    if (!journal_editor) {
        console.error("Could not find journal DOM element");
        return;
    }

    let current_size_str = journal_editor.style.fontSize
    let current_size = current_size_str === '' ? 14 : Number(current_size_str.slice(0, current_size_str.length - 2));

    if (which_dir === INCREASE) {
        journal_editor.style.fontSize = `${String(current_size + 1)}px`
    } else {
        journal_editor.style.fontSize = `${String(current_size - 1)}px`
    }
}

function _onWheel_imageResize(journal_win, which_dir) {
    let images = journal_win.getElementsByTagName('img');

    if (images.length === 0) {
        return;
    }

    for (let img of images) {
        let current_width = img.width;
        let current_height = img.height;
        let aspect_ratio = img.naturalWidth / img.naturalHeight;

        if (which_dir === INCREASE) {
            let newWidth = current_width + 10;
            img.style.width = `${newWidth}px`;
            img.style.height = `${newWidth / aspect_ratio}px`;
        } else if (which_dir === DECREASE) {
            if (current_width > 50 && current_height > 50) {
                let newWidth = current_width - 10;
                img.style.width = `${newWidth}px`;
                img.style.height = `${newWidth / aspect_ratio}px`;
            }
        }
    }
}

function getTextDomElement(journal_win) {
    let journal_editor = journal_win.getElementsByClassName('journal-entry-page')[0];

    if (!journal_editor) {
        journal_editor = journal_win.getElementsByClassName('editor-content')[0];
    }

    return journal_editor;
}
