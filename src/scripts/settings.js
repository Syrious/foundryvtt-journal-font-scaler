import {setScaleImages} from "./script.js";

export const moduleId = "journal-font-scaler";

function i18n(key) {
    return game.i18n.localize(key)
}

Hooks.on('init', () => {
    game.settings.register(moduleId, "scale-images", {
        name: i18n("Always scale images"),
        hint: i18n("Whether or not to ALWAYS scale images. If this is disabled, you have to hold ctrl + shift while using the mouse wheel to scale images."),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: false,
        onChange: value => {
            setScaleImages(value)
        }
    });
});





