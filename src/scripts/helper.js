export const moduleId = "journal-font-scaler";

export function i18n(key) {
    return game.i18n.localize(key)
}

export function isV13OrLater() {
    return foundry.utils.isNewerVersion(game.version, "13");
}

export function verifyPrerequisits() {
    let isGm = game.user.isGM;
    let libWrapperActive = game.modules.get('lib-wrapper')?.active;
    let needsLibWrapperButIsNotActive = isGm && !isV13OrLater() && !libWrapperActive;

    if (needsLibWrapperButIsNotActive) {
        ui.notifications.error("This module requires the 'libWrapper' module. Please install and activate it.");
    }
}

