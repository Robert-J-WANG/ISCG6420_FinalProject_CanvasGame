
const optionScreenElements = [
    {
        type: "Rectangle",
        params: [this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#00000055", "white", 3]
    },
    {
        type: "Slider",
        params: [centerX - 20, 350, this.width / 5, 20, "#00000055", "white", 0, "Volume: ", 100, 0, 100],
        property: "volumeSlider"
    },

    {
        type: "Slider",
        params: [centerX - 20, 400, this.width / 5, 20, "#00000055", "white", 0, "Game Time: ", 4, 1, 6],
        property: "gameLengthSlider"
    },

    {
        type: "Button",
        params: [this.width - 40, this.height / 2, 50, 80, "<", 30, "Borel", "#00000055", "white", 2],
        property: "backButton"
    },

    {
        type: "CanvasText",
        params: [controlsLeftX + 25, 125, "Arrow", "30px Borel", "left", "white", "white", 0],
    },

    {
        type: "CanvasText",
        params: [controlsLeftX + 25, 150, "Keys", "30px Borel", "left", "white", "white", 0],
    },
    {
        type: "CanvasText",
        params: [controlsLeftX, 200, "  Space", "30px Borel", "left", "white", "white", 0],
    },
    {
        type: "CanvasText",
        params: [2 * controlsLeftX, 200, "Net Move", "30px Borel", "left", "white", "white", 0],
    },
    {
        type: "CanvasText",
        params: [controlsLeftX, 250, "  Escape", "30px Borel", "left", "white", "white", 0],
    },
    {
        type: "CanvasText",
        params: [2 * controlsLeftX, 250, "Pause Menu", "30px Borel", "left", "white", "white", 0],
    },
    // ... 添加其他元素
];







