class Brush {
    color = null;
    thickness = null;
    isDraw = false;
    position = {
        x: 0,
        y: 0
    };

    constructor(color, thickness) {
        this.color = color;
        this.thickness = thickness;
    }
}

export class CanvasComponent {
    _options = null;
    _canvas = null;
    _brush = null;
    _activeControlClass = " active ";

    constructor(canvas, {colors, thicknesses, saveBtn, clearBtn, ...options}) {
        this._options = options;
        this._canvas = canvas;

        let defaultColor = colors.keys().next().value;
        let defaultThickness = thicknesses.keys().next().value;

        defaultColor.className += this._activeControlClass;
        defaultThickness.className += this._activeControlClass;

        this._brush = new Brush(colors.get(defaultColor), thicknesses.get(defaultThickness));

        let ctx = this._canvas.getContext("2d");

        this._canvas.addEventListener("mousedown", event => {
            if (event.which === 1) {
                this._brush.position.x = event.pageX - this._canvas.offsetLeft;
                this._brush.position.y = event.pageY - this._canvas.offsetTop;
                this._brush.isDraw = true;
                ctx.lineWidth = this._brush.thickness;
                ctx.strokeStyle = this._brush.color;
                ctx.beginPath();
                ctx.moveTo(this._brush.position.x, this._brush.position.y);
                ctx.stroke();
            }
        });

        this._canvas.addEventListener("mousemove", event => {
            if (event.which === 1 && this._brush.isDraw) {
                this._brush.position.x = event.pageX - this._canvas.offsetLeft;
                this._brush.position.y = event.pageY - this._canvas.offsetTop;
                ctx.strokeStyle = this._brush.color;
                ctx.lineWidth = this._brush.thickness;
                ctx.lineTo(this._brush.position.x, this._brush.position.y);
                ctx.stroke();
            }
        });

        this._canvas.addEventListener("mouseup", event => {
            if (event.which === 1) {
                this._brush.position.x = event.pageX - this._canvas.offsetLeft;
                this._brush.position.y = event.pageY - this._canvas.offsetTop;
                this._brush.isDraw = false;
                ctx.strokeStyle = this._brush.color;
                ctx.lineWidth = this._brush.thickness;
                ctx.lineTo(this._brush.position.x, this._brush.position.y);
                ctx.stroke();
                ctx.closePath();
            }
        });

        colors.forEach((color, colorItem) =>
            colorItem.addEventListener("click", () => {
                colors.forEach((value, key) => key.className = key.className.replace(this._activeControlClass,""));
                this._brush.color = color;
                colorItem.className += this._activeControlClass
            }, false));

        thicknesses.forEach((thickness, thicknessItem) =>
            thicknessItem.addEventListener("click", () => {
                thicknesses.forEach((value, key) => key.className = key.className.replace(this._activeControlClass,""));
                this._brush.thickness = thickness;
                thicknessItem.className += this._activeControlClass
            }, false));

        saveBtn.addEventListener("click", () =>
            this._options.saveCallback(JSON.stringify(ctx.getImageData(0, 0, this._options.width, this._options.height))), false);

        clearBtn.addEventListener("click", () =>
            ctx.clearRect(0, 0, this._options.width, this._options.height), false);
    }

    async updateData(data) {
        if (data) {
            let ctx = this._canvas.getContext("2d");
            let newData = Object.values(JSON.parse(data).data);

            let currentData = ctx.getImageData(0, 0, this._options.width, this._options.height);

            for (let i = 0; i < currentData.data.length; i += 4) {
                if (!currentData.data[i] && !currentData.data[i + 1] && !currentData.data[i + 2]) {
                    currentData.data[i] = newData[i];
                    currentData.data[i + 1] = newData[i + 1];
                    currentData.data[i + 2] = newData[i + 2];
                    currentData.data[i + 3] = newData[i + 3];
                }
            }

            ctx.putImageData(currentData, 0, 0);
        }
    }

    static init(container, initialData, options) {
        let canvas = document.createElement("canvas");

        canvas.id = "canvas";
        container.append(canvas);

        let controls = document.createElement("div");
        controls.id = "controls";
        container.append(controls);

        let colorPicker = document.createElement("div");
        colorPicker.id = "colorPicker";
        controls.append(colorPicker);

        let colors = new Map(options.colors.map(color => {
            let colorDiv = document.createElement("div");
            colorDiv.className = "colorItem";
            colorDiv.style.backgroundColor = color;
            colorPicker.append(colorDiv);
            return [
                colorDiv,
                color,
            ]
        }));

        let brushPicker = document.createElement("div");
        brushPicker.id = "brushPicker";
        controls.append(brushPicker);

        let thicknesses = new Map(options.thicknesses.map(thickness => {
            let brushDiv = document.createElement("div");
            let brushSpan = document.createElement("span");
            brushSpan.innerText = thickness;
            brushDiv.className = "brushItem";
            brushDiv.append(brushSpan);
            brushPicker.append(brushDiv);
            return [
                brushDiv,
                thickness,
            ];
        }));

        let saveBtn = document.createElement("button");
        saveBtn.id = "saveBtn";
        saveBtn.innerText = "Save";
        controls.append(saveBtn);

        let clearBtn = document.createElement("button");
        clearBtn.id = "clearBtn";
        clearBtn.innerText = "Clear";
        controls.append(clearBtn);

        let canvasComponent = new this(canvas, Object.assign(options, {
            colors,
            thicknesses,
            saveBtn,
            clearBtn
        }));
        canvasComponent.updateData(initialData);

        return canvasComponent;
    }
}
