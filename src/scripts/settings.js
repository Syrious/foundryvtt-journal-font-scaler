import {i18n, moduleId} from "./helper";
import {setScaleImages} from "./script";

export function addSettings(){
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
}