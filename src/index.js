import {setupScript} from "./scripts/script";
import {addSettings} from "./scripts/settings";
import {verifyPrerequisits} from "./scripts/helper";

Hooks.on('init', () => {
    addSettings();
});

Hooks.once('setup', function () {
    setupScript();
});

Hooks.once('ready', () => {
    verifyPrerequisits()
});