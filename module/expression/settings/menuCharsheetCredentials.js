export class MenuCharsheetCredentials extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Credentials",
            classes: ["gumshoe", "sheet", "credentials"],
            template: "systems/gumshoe/templates/settings/charsheet-credentials-sheet.html",
            width: 500,
            height: 400,
        });
    }

    constructor(options) {
        let setting = game.settings.get('gumshoe', 'charsheet-credentials');
        if(setting) {
            setting = setting.filter(item => item.type === 'credentialRef');
        }
        super(setting, options);
    }

    async getData() {
        let data = super.getData();
        console.log(data);
        return data;
    }
}