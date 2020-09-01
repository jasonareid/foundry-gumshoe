import {SystemExpression} from "../expression.js";

export class MenuCharsheetCredentials extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Credentials",
            classes: ["gumshoe", "sheet", "credentials"],
            template: "systems/gumshoe/templates/settings/charsheet-credentials-sheet.html",
            width: 640,
            height: 480,
        });
    }

    getData() {
        let data = {};
        data.setting = SystemExpression.credentials;
        return data;
    }

    existingContentEntries() {
        let contentEntries = {};
        let entries = this.getData().setting.entries;
        for(let i = 0; i < entries.length; i++) {
            contentEntries[entries[i].item._id] = true;
        }
        return contentEntries;
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
                if(compendium.metadata.name.indexOf('credential') !== -1) {
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

                let existingEntries = this.existingContentEntries();
                items = items.filter(item =>
                    !existingEntries.hasOwnProperty(item._id)
                )
                for(let i = 0; i < items.length; i++) {
                    let item = items[i];
                    html +=
                        `<option value=${item._id}>${item.name}</option>`;
                }

                html += `</select>`;
                $compendiumSelect.closest('.credential-add').find('.placeholder').replaceWith(html);
            }
        });

        doc.on('click', '.credential-delete', async (ev) => {
            let $credLine = $(ev.currentTarget).closest('.credential');
            if($credLine.hasClass('credential-add')) {
                $credLine.remove();
            } else {
                let id = $credLine.data('credentialId');
                let data = this.getData();
                let creds = data.setting;
                creds.entries = [].concat(creds.entries.filter(entry => entry._id !== id));
                await SystemExpression.updateCredentials(creds);
                setTimeout(() => {
                    this.render(true);
                }, 1);
            }
        });

        doc.on('click', '.credential-save', async (ev) => {
            let $saveLine = $(ev.currentTarget).closest('.credential');
            let id = $saveLine.data('credentialId');
            let sourceId = $saveLine.find('.compendium-select').val();
            if(!sourceId) return;
            let sourceName = $saveLine.find('.compendium-select').find('option:selected').text();
            let itemId = $saveLine.find('.compendium-item-select').val();
            if(!itemId) return;
            let itemName = $saveLine.find('.compendium-item-select').find('option:selected').text();
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
            let creds = data.setting;
            creds.entries.push(credentialRef);
            await SystemExpression.updateCredentials(creds);
            setTimeout(() => {
                this.render(true);
            }, 1);
        });

    }
}