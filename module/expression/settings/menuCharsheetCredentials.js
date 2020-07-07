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

    getData() {
        let data = {};
        data.setting = game.settings.get('gumshoe', 'charsheet-credentials');
        if(!data.setting.entries) {
            data.setting.entries = [];
        }
        return data;
    }

    activateListeners(doc) {
        super.activateListeners(doc);

        doc.find('.credential-add').on('click', () => {
            let lastCredential = doc.find('.credentials-list').children().last();
            if(lastCredential.hasClass('credential-add')) return;

            let newCredId = randomID(24);
            let html =
                `<li class="credential credential-add flexrow line-item" data-credential-id="${newCredId}">
                    <select class="compendium-select">
                        <option value="">Choose compendium...</option>`;

            for(let key of game.packs.keys()) {
                let compendium = game.packs.get(key);
                if(compendium.metadata.name.indexOf('credential') === 0) {
                    html +=
                        `<option value=${key}>${compendium.metadata.name}</option>`;
                }
            }

            html += `</select>
                    <h4 class="credential-name placeholder line-item-datum"></h4>
                    <div class="line-item-controls">
                        <a class="credential-save" title="Save Credential"><i class="fas fa-check"></i></a>
                        <a class="credential-delete" title="Delete Credential"><i class="fas fa-trash"></i></a>
                    </div>
                </li>`

            lastCredential.after(
                html
            );
        });

        doc.on('change', '.compendium-select', async (ev) => {
            let $compendiumSelect = $(ev.currentTarget);
            let compendiumId = $compendiumSelect.val();
            if(compendiumId === '') {
                let html = `<h4 class="credential-name placeholder line-item-datum"></h4>`;
                $compendiumSelect.closest('.credential-add').find('.compendium-item-select').replaceWith(html);
            } else {
                let items = await game.packs.get(compendiumId).getContent();
                let html = `<select class="compendium-item-select">
                                <option value="">Choose credential...</option>`;

                for(let i = 0; i < items.length; i++) {
                    let item = items[i];
                    html +=
                        `<option value=${item._id}>${item.name}</option>`;
                }

                html += `</select>`;
                $compendiumSelect.closest('.credential-add').find('.placeholder').replaceWith(html);
            }
        });

        doc.on('click', '.credential-save', async (ev) => {
            let $saveLine = $(ev.currentTarget).closest('.credential');
            let id = $saveLine.data('credentialId');
            console.log("Saving");
            let sourceId = $saveLine.find('.compendium-select').val();
            console.log(sourceId);
            if(!sourceId) return;
            let sourceName = $saveLine.find('.compendium-select').find('option:selected').text();
            console.log(sourceName);
            let itemId = $saveLine.find('.compendium-item-select').val();
            console.log(itemId);
            if(!itemId) return;
            let itemName = $saveLine.find('.compendium-item-select').find('option:selected').text();
            console.log(itemName);
            console.log(id);
            let credentialRef = {
                _id: id,
                type: 'credentialRef',
                source: {
                    _id: sourceId,
                    name: sourceName,
                },
                item: {
                    _id: itemId,
                    name: itemName,
                },
            }
            let data = this.getData();
            let setting = data.setting;
            setting.entries.push(credentialRef);
            await game.settings.set('gumshoe', 'charsheet-credentials', setting);
            setTimeout(() => {
                this.render(true);
            }, 1);
            console.log("done saving");
        });

    }
}