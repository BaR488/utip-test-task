export class StorageService {
    _keyListenerCallbacks = [];

    constructor() {
        globalThis.onstorage = event => {
            this._keyListenerCallbacks.forEach(function (keyMeta) {
                if (event.key === keyMeta.key) {
                    keyMeta.callback();
                }
            })
        };
    }

    setValue (key, value) {
        localStorage.setItem(key, value);
    }
    getValue (key) {
        return localStorage.getItem(key)
    }
    listenKey (key, callback) {
        this._keyListenerCallbacks.push({
            key: key,
            callback: callback
        })
    }
}