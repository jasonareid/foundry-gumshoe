// Import Modules
import { GumshoeActor } from "./actor/actor.js";
import { GumshoeActorSheet } from "./actor/actor-sheet.js";
import { GumshoeItem } from "./item/item.js";
import { GumshoeItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.gumshoe = {
    GumshoeActor,
    GumshoeItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = GumshoeActor;
  CONFIG.Item.entityClass = GumshoeItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("gumshoe", GumshoeActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("gumshoe", GumshoeItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});