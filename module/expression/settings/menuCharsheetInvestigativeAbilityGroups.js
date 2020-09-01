import {SystemExpression} from "../expression.js";

export class MenuCharsheetInvestigativeAbilityGroups extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "Investigative Ability Groups",
            classes: ["gumshoe", "sheet", "investigative-ability-groups"],
            template: "systems/gumshoe/templates/settings/charsheet-investigative-ability-groups-sheet.html",
            width: 640,
            height: 480,
        });
    }

    getData() {
        let data = {};
        data.setting = SystemExpression.investigativeAbilityGroups;
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

        doc.find('.group-add').on('click', () => {
            let lastInvestigativeGroup = doc.find('.abilities-list').children().last();
            if(lastInvestigativeGroup.hasClass('group-add')) return;

            let newGroupId = randomID(24);
            let html =
                `<li class="group group-add flexrow line-item" data-group-id="${newGroupId}">
                    <input class="group-text-entry" type="text" />
                    <div class="line-item-controls">
                        <a class="group-save" title="Save Investigative Ability Group"><i class="fas fa-check"></i></a>
                        <a class="group-delete" title="Delete Investigative Ability Group"><i class="fas fa-trash"></i></a>
                    </div>
                </li>`

            lastInvestigativeGroup.after(
                html
            );
        });

        doc.on('click', '.group-delete', async (ev) => {
            let $groupLine = $(ev.currentTarget).closest('.group');
            if($groupLine.hasClass('group-add')) {
                $groupLine.remove();
            } else {
                let id = $groupLine.data('groupId');
                let data = this.getData();
                let abilities = data.setting;
                abilities.entries = [].concat(abilities.entries.filter(entry => entry._id !== id));
                await SystemExpression.updateInvestigativeAbilities(abilities);
                setTimeout(() => {
                    this.render(true);
                }, 1);
            }
        });

        doc.on('click', '.group-save', async (ev) => {
            let $saveLine = $(ev.currentTarget).closest('.group');
            let id = $saveLine.data('groupId');
            let group = $saveLine.find('.group-text-entry').val();
            let investigativeAbilityGroupRef = {
                _id: id,
                type: 'investigativeAbilityGroupRef',
                group: group,
            }
            let data = this.getData();
            let groups = data.setting;
            groups.entries.push(investigativeAbilityGroupRef);
            await SystemExpression.updateInvestigativeAbilityGroups(groups);
            setTimeout(() => {
                this.render(true);
            }, 1);
        });

    }
}