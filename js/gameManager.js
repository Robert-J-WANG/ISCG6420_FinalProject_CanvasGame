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
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.isPaused = false;
        this.isInMenu = true;
        this.isInOptionsMenu = false;
        this.isInGameOverMenu = false;

        // sounds
        this.volume = 99;
        this.collectSound = new Sound("collect.wav", canvasID);
        this.hitSound = new Sound("bug_hit.wav", canvasID);
        this.startSound = new Sound("start_sound.wav", canvasID);
        this.endSound = new Sound("end_sound.wav", canvasID);

        this.gameLength = 4;


        this.keyEvents();
        this.mouseEvents();


        this.gameScreen = new GameScreen(this.context, this.width, this.height);
        this.startScreen = new StartScreen(this.context, this.width, this.height);
        this.pauseScreen = new PauseScreen(this.context, this.width, this.height);
        this.optionScreen = new OptionScreen(this.context, this.width, this.height);
        this.gameOverScreen = new GameOverScreen(this.context, this.width, this.height);

        // starting the interval 
        setInterval(this.frameUpdate.bind(this), update_interval * 1000);
    }

    keyEvents() {
        document.addEventListener("keydown", event => {
            if (event.code == leftKey) leftKeyPressed = true;
            else if (event.code == rightKey) rightKeyPressed = true;
            else if (event.code == upKey) upKeyPressed = true;
            else if (event.code == downKey) downKeyPressed = true;
            else if (event.code == pauseKey && !pauseKeyPressed) {
                if (this.isInOptionsMenu) {
                    this.isInMenu = true;
                    this.isInOptionsMenu = false;
                } else if (this.isInGameOverMenu) {
                    this.isInGameOverMenu = false;
                    this.isInMenu = true;
                } else this.isPaused = !this.isPaused;

                this.pauseKeyPressed = true;
            }
        });
        document.addEventListener("keyup", event => {
            if (event.code == leftKey) leftKeyPressed = false;
            else if (event.code == rightKey) rightKeyPressed = false;
            else if (event.code == upKey) upKeyPressed = false;
            else if (event.code == downKey) downKeyPressed = false;
            else if (event.code == pauseKey && !pauseKeyPressed) {
                pauseKeyPressed = false;
            }
        });
        document.addEventListener("keypress", event => {
            if (event.code == catchingKey) this.gameScreen.playerObject.SwingNet();
        });
    }

    mouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            if (this.isInMenu) this.startScreen.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isInOptionsMenu) this.optionScreen.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isPaused) this.pauseScreen.ClickEvent(event.offsetX, event.offsetY);
            else if (this.isInGameOverMenu) this.gameOverScreen.ClickEvent(event.offsetX, event.offsetY);
            else this.gameScreen.ClickEvent(event.offsetX, event.offsetY);
        });
    }

    // updates the volume 
    volumeUpdate(newVolume) {
        this.volume = newVolume;
        this.collectSound.SetVolume(this.volume);
        this.hitSound.SetVolume(this.volume);
        this.startSound.SetVolume(this.volume);
        this.endSound.SetVolume(this.volume);
    }

    // updates the length 
    gameLengthUpdate(newGameLength) {
        this.gameLength = newGameLength;
    }

    // starts game button
    gameStart() {
        this.isInMenu = false;
        this.isPaused = false;
        this.isInGameOverMenu = false;
        this.startSound.Play();
        this.gameScreen.Restart();
    }

    // updates frame 
    frameUpdate() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.screenDraw();
        this.positionUpdateOnScreen();
    }

    // Draws screens 
    screenDraw() {
        if (this.isInOptionsMenu) this.optionScreen.Draw();
        else if (this.isInMenu) this.startScreen.Draw();
        else {
            this.gameScreen.Draw();
            if (this.isInGameOverMenu) this.gameOverScreen.Draw();
            if (this.isPaused) this.pauseScreen.Draw();
        }
    }

    // Updates the position
    positionUpdateOnScreen() {
        if (!this.isPaused && !this.isInMenu && !this.isInGameOverMenu && !this.isInOptionsMenu) this.gameScreen.UpdatePosition();
    }
}


// the start screen
class StartScreen extends interfaceScreen {
    constructor(context, width, height) {
        super(context, width, height);
        this.shapes = [];
        this.createShapes();
    }


    createShapes() {
        this.shapes.push(new CanvasText(this.width / 2, 150, " Catching Bugs", "70px Georgia", "center", "#000000aa", "white", 0));
        this.startButton = new Button(this.width / 2, 270, 200, 70, "Start", 40, "Georgia", "#000000aa", "white", 3);
        this.shapes.push(this.startButton);
        this.optionsButton = new Button(this.width / 2, 400, 200, 70, "Option", 40, "Georgia", "#000000aa", "white", 3);
        this.shapes.push(this.optionsButton);
    }


    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }


    ClickEvent(x_position, y_position) {
        if (RectContains(this.startButton, x_position, y_position)) {
            gameObject.gameStart();
        } else if (RectContains(this.optionsButton, x_position, y_position)) {
            gameObject.isInOptionsMenu = true;
            gameObject.isInMenu = false;
        }
    }
}

// the main game Screen
class GameScreen extends interfaceScreen {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];
        this.movingShapes = [];
        this.bugCount = 35;
        this.bugsHandler = new BugsHandler(this.bugCount, update_interval);
        this.score = 0;
        this.highScore = 0;
        this.time = 0;

        this.createShapes();
    }


    createShapes() {
        this.playerObject = new Player(update_interval, "player", "playerFlipped");
        this.playerObject.xBound = this.width - this.playerObject.width;
        this.playerObject.yBound = this.height - this.playerObject.height - 75;

        this.playerObject.UpdatePosition = function () {
            if (leftKeyPressed) {
                this.x -= this.xSpeed;
                this.isFlipped = false;
            }
            if (rightKeyPressed) {
                this.x += this.xSpeed;
                this.isFlipped = true;
            }
            if (upKeyPressed) this.y -= this.ySpeed;
            if (downKeyPressed) this.y += this.ySpeed;

            if (this.x > this.xBound) this.x = this.xBound;
            else if (this.x < 0) this.x = 0;

            if (this.y > this.yBound) this.y = this.yBound;
            else if (this.y < 0) this.y = 0;

            this.UpdateOtherFeatures();
        }
        this.movingShapes.push(this.playerObject);

        this.scoreText = new CanvasText(30, 70, "Score : 0", "25px Georgia", "left", "white", "white", 0);
        this.shapes.push(this.scoreText);
        this.timeText = new CanvasText(30, 40, "Time : 0", "25px Georgia", "left", "white", "white", 0);
        this.shapes.push(this.timeText);
        this.pauseButton = new Button(this.width - 40, this.height / 2, 50, 80, "| |", 30, "Georgia", "#00000022", "white", 2);
        this.shapes.push(this.pauseButton);
    }


    Draw() {
        this.movingShapes.forEach(shape => {
            shape.Draw(this.context);
        });
        this.bugsHandler.Draw(this.context);
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    // updates the position 
    UpdatePosition() {
        this.movingShapes.forEach(shape => {
            shape.UpdatePosition();
        });
        this.bugsHandler.UpdatePosition(this.playerObject);
        this.bugsHandler.GenerateBug();

        this.UpdateTime();
    }

    // click events
    ClickEvent(x_position, y_position) {
        if (RectContains(this.pauseButton, x_position, y_position)) gameObject.isPaused = true;
    }

    //  player catching the bugs
    addScore() {
        this.score += 1;
        gameObject.collectSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }

    // bugs hit the player body
    minusScore() {
        this.score -= 1;
        gameObject.hitSound.Play();
        this.scoreText.SetText("Score: " + this.score);
    }

    // updates the time text
    UpdateTime() {
        this.time -= update_interval;

        if (this.time > 0.1) {
            var parsedTime = parseInt(this.time);
            var minutes = Math.floor(parsedTime / 60);
            var seconds = Math.floor(parsedTime - minutes * 60);
            this.timeText.SetText("Time: " + minutes + ":" + seconds.toString().padStart(2, "0"));
        } else {
            gameObject.isInGameOverMenu = true;
            gameObject.gameOverScreen.SetScore(this.score, this.highScore);
            gameObject.endSound.Play();
            if (this.highScore < this.score) this.highScore = this.score;
        }
    }

    // restarts the game
    Restart() {
        this.scoreText.SetText("Score: 0");
        this.score = 0;
        this.time = gameObject.gameLength * 60;
        this.playerObject.Restart();
        this.bugsHandler.Restart();
    }
}

// paused screen
class PauseScreen extends interfaceScreen {
    constructor(context, width, height) {
        super(context, width, height);
        this.shapes = [];

        this.createShapes();
    }


    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#00000022", "white", 3));

        this.title = new CanvasText(this.width / 2, 100, "Paused", "50px Georgia", "center", "white", "black", 0);
        this.shapes.push(this.title);

        this.volumeSlider = new Slider(this.width / 2 - 50, 150, this.width / 5, 20, "#000000aa", "white", 0, "Volume: ", 100, 0, 100);
        this.shapes.push(this.volumeSlider);

        this.resumeButton = new Button(this.width / 2, this.height - 225, 200, 70, "Resume", 40, "Georgia", "#000000aa", "white", "3");
        this.shapes.push(this.resumeButton);
        this.quitButton = new Button(this.width / 2, this.height - 100, 200, 70, "Return", 40, "Georgia", "#000000aa", "white", 3);
        this.shapes.push(this.quitButton);
    }


    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    //click events
    ClickEvent(x_position, y_position) {
        if (RectContains(this.volumeSlider, x_position, y_position)) {
            this.volumeSlider.UpdateValue(x_position);
            gameObject.optionScreen.volumeSlider.SetValue(this.volumeSlider.value);
            gameObject.volumeUpdate(this.volumeSlider.value);
        } else if (RectContains(this.resumeButton, x_position, y_position)) {
            gameObject.isPaused = false;
        } else if (RectContains(this.quitButton, x_position, y_position)) {
            gameObject.isPaused = false;
            gameObject.isInMenu = true;
        }

    }
}

// option screen
class OptionScreen extends interfaceScreen {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];

        this.createShapes();
    }


    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#00000022", "white", 3));


        this.volumeSlider = new Slider(this.width / 2 - 20, 350, this.width / 5, 20, "#000000aa", "white", 0, "Volume: ", 100, 0, 100);
        this.shapes.push(this.volumeSlider);

        this.gameLengthSlider = new Slider(this.width / 2 - 20, 400, this.width / 5, 20, "#000000aa", "white", 0, "Game Time: ", 4, 1, 6);
        this.shapes.push(this.gameLengthSlider);

        this.backButton = new Button(this.width - 40, this.height / 2, 50, 80, "<", 30, "Georgia", "#00000022", "white", 2);
        this.shapes.push(this.backButton);

        var controlsLeftX = this.width / 5 + 30;

        this.shapes.push(new CanvasText(controlsLeftX + 25, 125, "Arrow", "30px Georgia", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX + 25, 150, "Keys", "30px Georgia", "left", "white", "white", 0))
        this.shapes.push(new CanvasText(2 * controlsLeftX, 132, "Player Move", "30px Georgia", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX, 200, "  Space", "30px Georgia", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(2 * controlsLeftX, 200, "Net Move", "30px Georgia", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(controlsLeftX, 250, "  Escape", "30px Georgia", "left", "white", "white", 0));
        this.shapes.push(new CanvasText(2 * controlsLeftX, 250, "Pause Menu", "30px Georgia", "left", "white", "white", 0));
    }


    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }

    //click events
    ClickEvent(x_position, y_position) {
        if (RectContains(this.volumeSlider, x_position, y_position)) {
            this.volumeSlider.UpdateValue(x_position);
            gameObject.pauseScreen.volumeSlider.SetValue(this.volumeSlider.value);
            gameObject.volumeUpdate(this.volumeSlider.value);
        } else if (RectContains(this.gameLengthSlider, x_position, y_position)) {
            this.gameLengthSlider.UpdateValue(x_position);
            gameObject.gameLengthUpdate(this.gameLengthSlider.value);
        } else if (RectContains(this.backButton, x_position, y_position)) {
            gameObject.isInMenu = true;
            gameObject.isInOptionsMenu = false;
        }
    }
}

// Game Over screen
class GameOverScreen extends interfaceScreen {
    constructor(context, width, height) {
        super(context, width, height);

        this.shapes = [];

        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, -5, 3 * this.width / 5, this.height + 10, "#00000022", "white", 3));

        this.shapes.push(new CanvasText(this.width / 2, 100, "Game Over", "50px Georgia", "center", "white", "black", 0));

        this.score = new CanvasText(this.width / 2, 150, "Your Score: 0", "30px Georgia", "center", "white", "white", 0);
        this.shapes.push(this.score);

        this.restartButton = new Button(this.width / 2, this.height - 200, 200, 70, "ReStart ", 40, "Georgia", "#000000aa", "white", "3");
        this.shapes.push(this.restartButton);
        this.quitButton = new Button(this.width / 2, this.height - 75, 200, 70, "Return", 40, "Georgia", "#000000aa", "white", 3);
        this.shapes.push(this.quitButton);
    }

    // setting score 
    SetScore(newScore) {
        this.score.SetText("Score: " + newScore);
    }

    Draw() {
        this.shapes.forEach(shape => {
            shape.Draw(this.context);
        });
    }


    ClickEvent(x_position, y_position) {
        if (RectContains(this.restartButton, x_position, y_position)) {
            gameObject.gameStart();
        } else if (RectContains(this.quitButton, x_position, y_position)) {
            gameObject.isInGameOverMenu = false;
            gameObject.isInMenu = true;
        }
    }
}

class BugsHandler {
    constructor(max_bugs_allowed, deltaTime) {
        this.max_bugs_allowed = max_bugs_allowed;
        this.deltaTime = deltaTime;
        this.timeSinceLastSpawn = 1;

        this.bugs = [];
    }


    Draw(context) {
        this.bugs.forEach(bug => {
            bug.Draw(context);
        });
    }


    GenerateBug() {
        this.timeSinceLastSpawn += this.deltaTime;

        if (this.bugs.length < this.max_bugs_allowed && this.timeSinceLastSpawn > 0.75) {
            this.bugs.push(new Bug(RandomNumber(20, 780), 480, this.deltaTime));
            this.timeSinceLastSpawn = 0;
        }
    }


    // restarts the sequence of bugs
    Restart() {
        this.bugs = [];
        this.timeSinceLastSpawn = 1;
    }


    UpdatePosition(playerObject) {
        for (let i = 0; i < this.bugs.length; i++) {
            let bug = this.bugs[i];
            let bugCollision = bug.CheckCollision(playerObject);
            // 0 = no collision, -1 = collision with player, 1 = collision with net
            if (bugCollision != 0) {
                this.bugs.splice(i, 1);
                i--;

                if (bugCollision == 1) {
                    gameObject.gameScreen.addScore();
                } else if (bugCollision == -1) {
                    gameObject.gameScreen.minusScore();
                }
            } else {
                bug.UpdatePosition();

                if (bug.StillInBounds()) {
                    this.bugs.splice(i, 1);
                    i--;
                }
            }
        }
    }
}