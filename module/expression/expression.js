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
}