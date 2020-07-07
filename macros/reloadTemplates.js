for(let key in _templateCache) {
    if(_templateCache.hasOwnProperty(key)) {
        delete _templateCache[key];
    }
}
for(let key in ui.windows) {
    if(ui.windows.hasOwnProperty(key)) {
        ui.windows[key].render(true);
    }
}
