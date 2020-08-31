import {SystemExpression} from "../expression.js";

export class MenuCharsheetInvestigativeAbilities extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Investigative Abilities",
            classes: ["gumshoe", "sheet", "investigative-abilities"],
            template: "systems/gumshoe/templates/settings/charsheet-investigative-abilities-sheet.html",
            width: 500,
            height: 400,
        });
    }

    getData() {
        let data = {};
        data.setting = SystemExpression.investigativeAbilities;
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

        doc.find('.investigative-ability-add').on('click', () => {
            let lastInvestigativeAbility = doc.find('.investigative-abilities-list').children().last();
            if(lastInvestigativeAbility.hasClass('investigative-ability-add')) return;

            let newAbilityId = randomID(24);
            let html =
                `<li class="investigative-ability investigative-ability-add flexrow line-item" data-investigative-ability-id="${newAbilityId}">
                    <select class="compendium-select">
                        <option value="">Choose compendium...</option>`;

            for(let key of game.packs.keys()) {
                let compendium = game.packs.get(key);
                if(compendium.metadata.name.indexOf('investigative') !== -1) {
                    html +=
                        `<option value=${key}>${compendium.metadata.name}</option>`;
                }
            }

            html += `</select>
                    <h4 class="investigative-ability-name placeholder line-item-datum"></h4>
                    <div class="line-item-controls">
                        <a class="investigative-ability-save" title="Save Investigative Ability"><i class="fas fa-check"></i></a>
                        <a class="investigative-ability-delete" title="Delete Investigative Ability"><i class="fas fa-trash"></i></a>
                    </div>
                </li>`

            lastInvestigativeAbility.after(
                html
            );
        });

        doc.on('change', '.compendium-select', async (ev) => {
            let $compendiumSelect = $(ev.currentTarget);
            let compendiumId = $compendiumSelect.val();
            if(compendiumId === '') {
                let html = `<h4 class="investigative-ability-name placeholder line-item-datum"></h4>`;
                $compendiumSelect.closest('.investigative-ability-add').find('.compendium-item-select').replaceWith(html);
            } else {
                let items = await game.packs.get(compendiumId).getContent();
                let html = `<select class="compendium-item-select">
                                <option value="">Choose investigative ability...</option>`;

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
                $compendiumSelect.closest('.investigative-ability-add').find('.placeholder').replaceWith(html);
            }
        });

        doc.on('click', '.investigative-ability-delete', async (ev) => {
            let $abilityLine = $(ev.currentTarget).closest('.investigative-ability');
            if($abilityLine.hasClass('investigative-ability-add')) {
                $abilityLine.remove();
            } else {
                let id = $abilityLine.data('investigativeAbilityId');
                let data = this.getData();
                let abilities = data.setting;
                abilities.entries = [].concat(abilities.entries.filter(entry => entry._id !== id));
                await SystemExpression.updateInvestigativeAbilities(abilities);
                setTimeout(() => {
                    this.render(true);
                }, 1);
            }
        });

        doc.on('click', '.investigative-ability-save', async (ev) => {
            let $saveLine = $(ev.currentTarget).closest('.investigative-ability');
            let id = $saveLine.data('investigativeAbilityId');
            let sourceId = $saveLine.find('.compendium-select').val();
            if(!sourceId) return;
            let sourceName = $saveLine.find('.compendium-select').find('option:selected').text();
            let itemId = $saveLine.find('.compendium-item-select').val();
            if(!itemId) return;
            let itemName = $saveLine.find('.compendium-item-select').find('option:selected').text();
            let investigativeAbilityRef = {
                _id: id,
                type: 'investigativeAbilityRef',
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
            let abilities = data.setting;
            abilities.entries.push(investigativeAbilityRef);
            await SystemExpression.updateInvestigativeAbilities(abilities);
            setTimeout(() => {
                this.render(true);
            }, 1);
        });

    }
}