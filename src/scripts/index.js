import {setupScript} from "./script";
import {addSettings} from "./settings";
import {verifyPrerequisits} from "./helper";

Hooks.on('init', () => {
    addSettings();
});

Hooks.once('setup', function () {
    setupScript();
});

Hooks.once('ready', () => {
    verifyPrerequisits()
});