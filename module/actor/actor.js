/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
import {SystemExpression} from "../expression/expression.js";

export class GumshoeActor extends Actor {

  static async create(data, options) {
    let gsActor = await super.create(data, options);
    if(gsActor.data.type === 'PC') {
      let creds = SystemExpression.credentials;
      for(let i = 0; i < creds.entries.length; i++) {
        let entry = creds.entries[i];
        if(entry.type === 'credentialRef') {
          let compendium = game.packs.get(entry.source._id);
          console.log(entry);
          let item = await compendium.getEntity(entry.item._id);
          console.log(item);
          delete item.data._id;
          item.data.data.sortOrder = i;
          gsActor.createOwnedItem(item.data);
        }
      }
      // console.log("Do some PC stuff");
    } else if(gsActor.data.type === 'NPC') {
      // console.log("Do some NPC stuff");
    }
  }

  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'PC') this._preparePCData(actorData);
    else if(actorData.type === 'NPC') this._prepareNPCData(actorData);
  }

  _preparePCData(actorData) {
    const data = actorData.data;
  }

  _prepareNPCData(actorData) {
    const data = actorData.data;
  }

}