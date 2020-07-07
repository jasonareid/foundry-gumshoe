( async () => {
    for(let item of game.items) {
        await Item.delete(item._id);
    }
    ui.sidebar.activateTab('compendium')
    for(let actor of game.actors) {
        for(let item of actor.items) {
            await actor.deleteOwnedItem(item._id);
        }
    }
    const compendiums = ['credentials-default', 'investigativeAbilities-srd', 'generalAbilities-srd'];
    for(let i = 0; i < compendiums.length; i++) {
        const kind = compendiums[i];
        const folder = await Folder.create({type: "Item", parent: null, name: (kind[0].toUpperCase() + kind.slice(1))})
        const pack = game.packs.find(p => p.collection === `gumshoe.${kind}`);
        await pack.configure({locked: false});
        const existingContent = await pack.getContent();
        for(const entry of existingContent) {
            await pack.deleteEntity(entry._id);
        }
        const response = await fetch(`systems/gumshoe/compendium-src/${kind}.json`);
        const content = await response.json();
        const created = await Item.create(content.entries.map((entry) => {
            entry.type = content.itemType;
            return entry;
        }), {temporary: true});
        if(created.data) {
            const entity = await pack.importEntity(created);
            console.log(`Imported Item ${created.name} into Compendium pack ${pack.collection}`);
        } else {
            for ( let i of created ) {
                const entity = await pack.importEntity(i);
                console.log(`Imported Item ${i.name} into Compendium pack ${pack.collection}`);
            }
        }
        await pack.configure({locked: true});
    }
    game.items.directory.render();
})()