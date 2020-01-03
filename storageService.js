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

    async setValue (key, value) {
        localStorage.setItem(key, value);
    }
    async getValue (key) {
        return localStorage.getItem(key)
    }
    listenKey (key, callback) {
        this._keyListenerCallbacks.push({
            key: key,
            callback: callback
        })
    }
}