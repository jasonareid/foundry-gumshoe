(async () => {
    for (let actor of game.actors) {
        if(actor.data.type === 'PC') {
            for(let item of actor.items) {
                await actor.removeItemFromInventory(item._id);
            }
            const credentials = game.packs.find(p => p.collection === 'gumshoe.credentials');
            let content = await credentials.getContent();
            for (const entry of content) {
                // if(entry.data.name === 'Some Cred') {
                //     let cred = await actor.importItemFromCollection('gumshoe.credentials', entry._id);
                //     await cred.update({
                //       data: {...}
                //     });
                // }
            }
        }
    }
})()