// interface class
class interfaceScreen {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    draw() { }
    Update() { }
}

// the start screen
class StartScreen extends interfaceScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);
        this.shapes = [];
        this.createShapes();
    }


    createShapes() {
        this.shapes.push(
            new CanvasText(this.width / 2, 150, " Meow Bubble!", "70px Borel", "center", "white", "white", 0)
        );

        this.startButton = new Button(this.width / 2, 270, 200, 70, "Start", 40, "Borel", "#00000055", "white", 3);
        this.shapes.push(this.startButton);
        this.optionsButton = new Button(this.width / 2, 400, 200, 70, "Option", 40, "Borel", "#00000055", "white", 3);
        this.shapes.push(this.optionsButton);
    }


    draw() {
        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
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
    constructor(ctx, width, height) {
        super(ctx, width, height);

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

        this.scoreText = new CanvasText(30, 70, "Score : 0", "25px Borel", "left", "white", "white", 0);
        this.shapes.push(this.scoreText);
        this.timeText = new CanvasText(30, 40, "Time : 0", "25px Borel", "left", "white", "white", 0);
        this.shapes.push(this.timeText);
        this.pauseButton = new Button(this.width - 40, this.height / 2, 50, 80, "|||", 30, "Borel", "#00000033", "white", 1);
        this.shapes.push(this.pauseButton);
    }


    draw() {
        this.movingShapes.forEach(shape => {
            shape.draw(this.ctx);
        });
        this.bugsHandler.draw(this.ctx);
        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
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
        this.scoreText.setText("Score: " + this.score);
    }

    // bugs hit the player body
    minusScore() {
        this.score -= 1;
        gameObject.hitSound.Play();
        this.scoreText.setText("Score: " + this.score);
    }

    // updates the time text
    UpdateTime() {
        this.time -= update_interval;

        if (this.time > 0.1) {
            var parsedTime = parseInt(this.time);
            var minutes = Math.floor(parsedTime / 60);
            var seconds = Math.floor(parsedTime - minutes * 60);
            this.timeText.setText("Time: " + minutes + ":" + seconds.toString().padStart(2, "0"));
        } else {
            gameObject.isInGameOverMenu = true;
            gameObject.gameOverScreen.SetScore(this.score, this.highScore);
            gameObject.endSound.Play();
            if (this.highScore < this.score) this.highScore = this.score;
        }
    }

    // restarts the game
    Restart() {
        this.scoreText.setText("Score: 0");
        this.score = 0;
        this.time = gameObject.gameLength * 60;
        this.playerObject.Restart();
        this.bugsHandler.Restart();
    }
}

// paused screen
class PauseScreen extends interfaceScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);
        this.shapes = [];

        this.createShapes();
    }

    createShapes() {
        this.shapes.push(new Rectangle(this.width / 5, 50, 3 * this.width / 5, this.height - 100, "#00000033", "white", 2));

        this.title = new CanvasText(this.width / 2, 100, "Paused", "50px Borel", "center", "white", "rewhited", 0);
        this.shapes.push(this.title);

        this.volumeSlider = new Slider(this.width / 2 - 50, 150, this.width / 5, 20, "#00000055", "white", 0, "Volume: ", 100, 0, 100);
        this.shapes.push(this.volumeSlider);

        this.resumeButton = new Button(this.width / 2, this.height - 225, 200, 70, "Resume", 40, "Borel", "#00000055", "white", "2");
        this.shapes.push(this.resumeButton);

        this.quitButton = new Button(this.width / 2, this.height - 100, 200, 70, "Return", 40, "Borel", "#00000055", "white", 2);
        this.shapes.push(this.quitButton);
    }


    draw() {
        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
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

class OptionScreen extends interfaceScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);
        this.shapes = [];
        this.createShapes();
    }

    createShapes() {
        const centerX = this.width / 2;
        const controlsLeftX = this.width / 5 + 30;

        this.shapes.push(
            new Rectangle(this.width / 5, 50, 3 * this.width / 5, this.height - 100, "#00000055", "white", 2),

            this.volumeSlider = new Slider(centerX - 20, 350, this.width / 5, 20, "#00000055", "white", 0, "Volume: ", 100, 0, 100),

            this.gameLengthSlider = new Slider(centerX - 20, 400, this.width / 5, 20, "#00000055", "white", 0, "Game Time: ", 4, 1, 6),

            this.backButton = new Button(this.width - 40, this.height / 2, 50, 80, "<", 30, "Borel", "#00000055", "white", 2),

            new CanvasText(controlsLeftX + 25, 125, "Arrow", "30px Borel", "left", "white", "white", 0),

            new CanvasText(controlsLeftX + 25, 150, "Keys", "30px Borel", "left", "white", "white", 0),

            new CanvasText(2 * controlsLeftX, 132, "Player Move", "30px Borel", "left", "white", "white", 0),

            new CanvasText(controlsLeftX, 200, "  Space", "30px Borel", "left", "white", "white", 0),

            new CanvasText(2 * controlsLeftX, 200, "Net Move", "30px Borel", "left", "white", "white", 0),

            new CanvasText(controlsLeftX, 250, "  Escape", "30px Borel", "left", "white", "white", 0),

            new CanvasText(2 * controlsLeftX, 250, "Pause Menu", "30px Borel", "left", "white", "white", 0)
        );
    }

    draw() {
        this.shapes.forEach(shape => shape.draw(this.ctx));
    }

    ClickEvent(x_position, y_position) {
        const { volumeSlider, gameLengthSlider, backButton } = this;

        if (RectContains(volumeSlider, x_position, y_position)) {
            volumeSlider.UpdateValue(x_position);
            gameObject.pauseScreen.volumeSlider.SetValue(volumeSlider.value);
            gameObject.volumeUpdate(volumeSlider.value);
        } else if (RectContains(gameLengthSlider, x_position, y_position)) {
            gameLengthSlider.UpdateValue(x_position);
            gameObject.gameLengthUpdate(gameLengthSlider.value);
        } else if (RectContains(backButton, x_position, y_position)) {
            gameObject.isInMenu = true;
            gameObject.isInOptionsMenu = false;
        }
    }
}
class GameOverScreen extends interfaceScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);

        this.shapes = [];
        this.createShapes();
    }

    createShapes() {
        const centerX = this.width / 2;

        this.shapes.push(
            new Rectangle(this.width / 5, 50, 3 * this.width / 5, this.height - 10, "#00000055", "white", 2),
            new CanvasText(centerX, 100, "Game Over", "50px Borel", "center", "white", "black", 0),
            this.score = new CanvasText(centerX, 150, "Your Score: 0", "30px Borel", "center", "white", "white", 0),
            this.restartButton = new Button(centerX, this.height - 200, 200, 70, "ReStart", 40, "Borel", "#00000055", "white", "2"),
            this.quitButton = new Button(centerX, this.height - 75, 200, 70, "Return", 40, "Borel", "#00000055", "white", 2)
        );
    }

    SetScore(newScore) {
        this.score.SetText("Score: " + newScore);
    }

    draw() {
        this.shapes.forEach(shape => shape.draw(this.ctx));
    }

    ClickEvent(x_position, y_position) {
        const { restartButton, quitButton } = this;

        if (RectContains(restartButton, x_position, y_position)) {
            gameObject.gameStart();
        } else if (RectContains(quitButton, x_position, y_position)) {
            gameObject.isInGameOverMenu = false;
            gameObject.isInMenu = true;
        }
    }
}