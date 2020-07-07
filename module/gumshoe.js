// Import Modules
import { GumshoeActor } from "./actor/actor.js";
import { GumshoeActorSheet } from "./actor/actor-sheet.js";
import { GumshoeItem } from "./item/item.js";
import { GumshoeItemSheet } from "./item/item-sheet.js";
import {MenuCharsheetCredentials} from "./expression/settings/menuCharsheetCredentials.js";

Hooks.once('init', async function() {

  game.gumshoe = {
    GumshoeActor,
    GumshoeItem
  };

  game.settings.register("gumshoe", "charsheet-credentials", {
    name: "Credentials",
    hint: "Which Credentials apply in this game.",
    scope: "world",      // This specifies a world-level setting
    config: false,        // This specifies that the setting appears in the configuration view
    type: Object,
    default: {},         // The default value for the setting
  });
  game.settings.registerMenu("gumshoe", "menu-charsheet-credentials", {
    name: "Credentials Submenu",
    label: "Character Sheet - Credentials",      // The text label used in the button
    hint: "Choose this games Credentials.",
    icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
    type: MenuCharsheetCredentials,   // A FormApplication subclass which should be created
    restricted: true                   // Restrict this submenu to gamemaster only?
  });
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