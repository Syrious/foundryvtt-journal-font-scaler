
declare namespace Game {
    interface Settings {
        get(moduleId: string, key: string): any;
        register(moduleId: string, key: string, data: any): void;
    }

    interface I18n {
        localize(key: string): string;
    }

    interface User {
        isGM: boolean;
    }

    interface Modules {
        get(id: string): { active: boolean } | undefined;
    }
}

declare const game: {
    settings: Game.Settings;
    i18n: Game.I18n;
    user: Game.User;
    modules: Game.Modules;
    version: string;
};

declare namespace foundry {
    namespace utils {
        function isNewerVersion(v1: string, v2: string): boolean;
    }
}