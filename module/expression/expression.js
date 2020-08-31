export class SystemExpression {
    static get credentials() {
        let creds = game.settings.get('gumshoe', 'charsheet-credentials');
        if(!creds || typeof creds !== 'object' || Array.isArray(creds)) {
            creds = {};
        }
        if(!creds.entries) {
            creds.entries = [];
        }
        return creds;
    }

    static async updateCredentials(creds) {
        await game.settings.set('gumshoe', 'charsheet-credentials', creds);
    }

    static get investigativeAbilities() {
        let abilities = game.settings.get('gumshoe', 'charsheet-investigative-abilities');
        if(!abilities || typeof abilities !== 'object' || Array.isArray(abilities)) {
            abilities = {};
        }
        if(!abilities.entries) {
            abilities.entries = [];
        }
        return abilities;
    }

    static async updateInvestigativeAbilities(creds) {
        await game.settings.set('gumshoe', 'charsheet-investigative-abilities', creds);
    }
}