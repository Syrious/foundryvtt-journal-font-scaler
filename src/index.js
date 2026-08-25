import {setupScript} from "./scripts/script";
import {addSettings} from "./scripts/settings";

Hooks.on('init', () => {
    addSettings();
});

Hooks.once('setup', function () {
    setupScript();
});