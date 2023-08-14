
let fps = 50;
let update_interval = (1 / fps);

let leftKey = "ArrowLeft";
let rightKey = "ArrowRight";
let upKey = "ArrowUp";
let downKey = "ArrowDown";
let catchingKey = "Space";
let pauseKey = "Escape";

let leftKeyPressed = false;
let rightKeyPressed = false;
let upKeyPressed = false;
let downKeyPressed = false;
let pauseKeyPressed = false;

let gameObject = null;

// html页面挂载完毕就执行
// 加载游戏界面
window.onload = () => {
    gameObject = new GameObject("canvas");
}

class GameObject {
    constructor(canvasID) {
        const canvas = document.getElementById(canvasID);
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
        const { width, height } = this.canvas
        this.width = width;
        this.height = height;

        this.isPaused = false;
        this.isInMenu = true;
        this.isInOptionsMenu = false;
        this.isInGameOverMenu = false;

        this.gameLength = 4;
        // sounds
        this.volume = 99;
        this.collectSound = new Sound("collect.wav", canvasID);
        this.hitSound = new Sound("bug_hit.wav", canvasID);
        this.startSound = new Sound("start_sound.wav", canvasID);
        this.endSound = new Sound("end_sound.wav", canvasID);

        this.gameScreen = new GameScreen(ctx, width, height);
        this.startScreen = new StartScreen(ctx, width, height);
        this.pauseScreen = new PauseScreen(ctx, width, height);
        this.optionScreen = new OptionScreen(ctx, width, height);
        this.gameOverScreen = new GameOverScreen(ctx, width, height);

        // starting the interval 
        setInterval(this.frameUpdate.bind(this), update_interval * 1000);
        this.keyEvents();
        this.mouseEvents();


    }

    keyEvents() {

        const { isInOptionsMenu, isInMenu, isInGameOverMenu, isPaused, pauseKeyPressed, gameScreen } = this;

        document.addEventListener("keydown", event => {
            const { code } = event;
            if (code == leftKey) leftKeyPressed = true;
            else if (code == rightKey) rightKeyPressed = true;
            else if (code == upKey) upKeyPressed = true;
            else if (code == downKey) downKeyPressed = true;
            else if (code == pauseKey && !pauseKeyPressed) {
                if (isInOptionsMenu) {
                    isInMenu = true;
                    isInOptionsMenu = false;
                } else if (isInGameOverMenu) {
                    isInGameOverMenu = false;
                    isInMenu = true;
                } else isPaused = !isPaused;

                pauseKeyPressed = true;
            }
        });
        document.addEventListener("keyup", event => {
            const { code } = event;
            if (code == leftKey) leftKeyPressed = false;
            else if (code == rightKey) rightKeyPressed = false;
            else if (code == upKey) upKeyPressed = false;
            else if (code == downKey) downKeyPressed = false;
            else if (code == pauseKey && !pauseKeyPressed) {
                pauseKeyPressed = false;
            }
        });
        document.addEventListener("keypress", event => {
            if (event.code == catchingKey) gameScreen.playerObject.SwingNet();
        });
    }

    mouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            const { offsetX, offsetY } = event;
            const { isInOptionsMenu, isInMenu, isInGameOverMenu, isPaused, gameScreen, startScreen, optionScreen, pauseScreen, gameOverScreen } = this;
            if (isInMenu) startScreen.ClickEvent(offsetX, offsetY);
            else if (isInOptionsMenu) optionScreen.ClickEvent(offsetX, offsetY);
            else if (isPaused) pauseScreen.ClickEvent(offsetX, offsetY);
            else if (isInGameOverMenu) gameOverScreen.ClickEvent(offsetX, offsetY);
            else gameScreen.ClickEvent(offsetX, offsetY);
        });
    }

    // updates the volume 
    volumeUpdate(newVolume) {
        const { volume, collectSound, hitSound, startSound, endSound } = this
        volume = newVolume;
        collectSound.SetVolume(volume);
        hitSound.SetVolume(volume);
        startSound.SetVolume(volume);
        endSound.SetVolume(volume);
    }

    // updates the length 
    gameLengthUpdate(newGameLength) {
        this.gameLength = newGameLength;
    }

    // starts game button
    gameStart() {
        const { startSound, gameScreen } = this
        this.isInMenu = false;
        this.isPaused = false;
        this.isInGameOverMenu = false;
        startSound.Play();
        gameScreen.Restart();
    }

    // updates frame 
    frameUpdate() {
        const { width, height } = this
        this.ctx.clearRect(0, 0, width, height);
        this.screenDraw();
        this.positionUpdateOnScreen();
    }

    // Draws screens 
    screenDraw() {
        const { isInOptionsMenu, isInMenu, isInGameOverMenu, isPaused, gameScreen, startScreen, optionScreen, pauseScreen, gameOverScreen } = this;
        if (isInOptionsMenu) optionScreen.draw();
        else if (isInMenu) startScreen.draw();
        else {
            gameScreen.draw();
            if (isInGameOverMenu) gameOverScreen.draw();
            if (isPaused) pauseScreen.draw();
        }
    }

    // Updates the position
    positionUpdateOnScreen() {
        const { isInOptionsMenu, isInMenu, isInGameOverMenu, isPaused, gameScreen } = this;
        if (!isPaused && !isInMenu && !isInGameOverMenu && !isInOptionsMenu) gameScreen.UpdatePosition();
    }
}
