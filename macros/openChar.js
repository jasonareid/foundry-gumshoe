ui.notifications.active.forEach((li) => {
    li.remove();
});
game.actors.entities[0].sheet.position.left = 10;
game.actors.entities[0].sheet.render(true);
