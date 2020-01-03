import {CanvasComponent} from "./canvasComponent.js"
import {StorageService} from "./storageService.js"

const mainView = document.getElementById("mainView");
const storage = new StorageService();

globalThis.onload = async () => {
    let component = CanvasComponent.init(mainView, await storage.getValue("canvasData"), {
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
        saveCallback: async (data) => {
            await storage.setValue("canvasData", data);
        }
    });

    storage.listenKey("canvasData",  async () => {
        component.updateData(await storage.getValue("canvasData"));
    })
};
