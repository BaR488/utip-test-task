import {CanvasComponent} from "./canvasComponent.js"
import {StorageService} from "./storageService.js"
import {ArrayCompressor} from "./utils.js";

const DATA_KEY = "canvasData";
const colors = [
    "red",
    "blue",
    "yellow",
    "green",
    "black"
];
const width = 300;
const height = 150;
const mainView = document.getElementById("mainView");
const storage = new StorageService();

globalThis.onload = async () => {
    let component = CanvasComponent.init(mainView, await ArrayCompressor.decopmress(await storage.getValue(DATA_KEY)), {
        width,
        height,
        colors,
        thicknesses: [5, 10, 15],
        saveCallback: async (data) => {
            await storage.setValue(DATA_KEY, data);
        }
    });

    storage.listenKey(DATA_KEY,  async () => {
        component.updateData(await ArrayCompressor.decopmress(await storage.getValue(DATA_KEY)));
    })
};
