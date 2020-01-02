import {CanvasComponent} from "./canvasComponent.js"
import {StorageService} from "./storageService.js"

const mainView = document.getElementById("mainView");
const storage = new StorageService();

globalThis.onload = function() {
    let component = CanvasComponent.init(mainView, storage.getValue("canvasData"), {
        width: 300,
        height: 150,
        colors: [
            "red",
            "blue",
            "yellow",
            "green",
            "black"
        ],
        thicknesses: [5, 10, 15],
        saveCallback: function (data) {
            storage.setValue("canvasData", data);
        }
    });

    storage.listenKey("canvasData",  () => {
        component.updateData(storage.getValue("canvasData"));
    })
};
