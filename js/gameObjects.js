// creates a player
class Player extends CanvasImage {
    constructor(screenUpdatePeriod, imageID, flippedImageID) {
        super(400, 250, imageID);
        this.flipped = document.getElementById(flippedImageID);
        this.normal = document.getElementById(imageID);

        this.deltaTime = screenUpdatePeriod;

        this.xSpeed = 500 * screenUpdatePeriod;
        this.ySpeed = 500 * screenUpdatePeriod;

        this.isFlipped = true;

        this.net = new CanvasImage(0, -100, "playerNet");
        this.net.rightOffset = this.width + this.xSpeed / 2;
        this.net.leftOffset = -(this.net.rightOffset + this.width) + this.xSpeed;
        this.net.yOffset = this.height / 2 - this.net.height / 2;


        // handle collisions
        this.catchNet = new Rectangle(this.x, this.y, this.net.width - this.width / 2, this.net.height * 1.2, "white", "white", 0);
        this.catchNet.rightOffset = this.catchNet.width + this.xSpeed / 2;
        this.catchNet.leftOffset = -(this.catchNet.width + this.xSpeed / 2);
        this.catchNet.yOffset = this.height / 2 - this.catchNet.height / 2;

        this.leftEye = new Arc(this.x + 2 * this.width / 5, this.y, 2, 0, 0, Math.PI * 2, false, "black", "black", 0);
        this.leftEye.leftOffset = 3 * this.width / 5 - 7;
        this.leftEye.rightOffset = this.width - this.leftEye.leftOffset;
        this.leftEye.yOffset = this.height / 3 - 17;

        this.rightEye = new Arc(this.x + 2 * this.width / 5, this.y, 2, 0, 0, Math.PI * 2, false, "black", "black", 0);
        this.rightEye.leftOffset = 7 * this.width / 10 + 4;
        this.rightEye.rightOffset = this.width - this.rightEye.leftOffset;
        this.rightEye.yOffset = this.height / 3 - 20;

        this.timeSinceLastSwing = 3.1;
        this.baseNetRotation = Math.PI / 4;
        this.netRotation = -this.baseNetRotation;

        this.CanCatchBugs = false;
    }

    draw(ctx) {
        const { x, y, width, height, leftEye, rightEye, net } = this
        var ctxXOffset = x + width / 2.2;
        var ctxYOffset = y + height / 1.7;
        ctx.translate(ctxXOffset, ctxYOffset);
        ctx.rotate(this.netRotation);

        if (!this.isFlipped) {
            ctx.scale(-1, 1);
            net.draw(ctx);
            ctx.scale(-1, 1);
        } else {
            net.draw(ctx);
        }
        ctx.rotate(-this.netRotation);
        ctx.translate(-ctxXOffset, -ctxYOffset);

        if (!this.isFlipped) {
            this.imageElement = this.flipped;

            super.draw(ctx);
        } else {
            this.imageElement = this.normal;

            super.draw(ctx);
        }

        leftEye.draw(ctx);
        rightEye.draw(ctx);
    }

    UpdateOtherFeatures() {
        const { x, y, leftEye, rightEye, catchNet } = this
        if (this.timeSinceLastSwing <= 0.785) {
            this.netRotation = (this.baseNetRotation - 0.2) * Math.cos(8 * this.timeSinceLastSwing) + 0.2;

            if (this.netRotation < 0.3) this.CanCatchBugs = true;
            else this.CanCatchBugs = false;

            if (this.isFlipped) this.netRotation = -this.netRotation;
        } else {
            this.netRotation = this.baseNetRotation;
            if (this.isFlipped) this.netRotation = -this.netRotation;
        }
        this.timeSinceLastSwing += this.deltaTime;

        if (this.isFlipped) {

            catchNet.x = x + catchNet.rightOffset;
            leftEye.x = x + leftEye.leftOffset + this.netRotation * 2;
            rightEye.x = x + rightEye.leftOffset + this.netRotation * 2;
        } else {

            catchNet.x = x + catchNet.leftOffset;
            leftEye.x = x + leftEye.rightOffset + this.netRotation * 2;
            rightEye.x = x + rightEye.rightOffset + this.netRotation * 2;
        }

        catchNet.y = y + catchNet.yOffset;
        leftEye.y = y + leftEye.yOffset;
        rightEye.y = y + rightEye.yOffset;
    }


    SwingNet() {
        if (this.timeSinceLastSwing >= 1) this.timeSinceLastSwing = 0;
    }

    Restart() {
        this.x = 400;
        this.y = 250;
        this.isFlipped = false;

        this.timeSinceLastSwing = 3.1;
        this.netRotation = -this.baseNetRotation;

        this.CanCatchBugs = false;
    }
}

// creates a bug 
class Bug extends Arc {
    constructor(x, y, deltaTime) {
        super(x, y, 0, 0, 0, Math.PI * 2, false, "white", "#00000000", 3);
        this.ghost_x = x;
        this.ghost_y = y;

        this.y_speed = 100 * deltaTime;

        this.x_multiplier = 2 * Math.PI / 2;
        this.y_multiplier = 4 * Math.PI / 2;

        this.deltaTime = deltaTime;
        this.timeAlive = 0;


        // current rgb values for the bug
        // Generate random RGB values for the bug's target color
        const randomR = RandomNumber(0, 255);
        const randomG = RandomNumber(0, 255);
        const randomB = RandomNumber(0, 255);
        this.targetColor = new Color(randomR, randomG, randomB);
        this.currentColor = new Color(255, 255, 255);
        this.colorStep = new Color((this.targetColor.r - this.currentColor.r) / (deltaTime * 6000),
            (this.targetColor.g - this.currentColor.g) / (deltaTime * 6000),
            (this.targetColor.b - this.currentColor.b) / (deltaTime * 6000));
        this.sizeStep = (15 - this.radius) / (deltaTime * 6000);
    }

    UpdatePosition() {

        this.timeAlive += this.deltaTime;

        if (this.timeAlive <= 1) this.radius += 4 * this.deltaTime;
        else if (this.timeAlive <= 2) { } else if (this.timeAlive <= 5) {
            // changing color and growing
            this.currentColor.add(this.colorStep);
            this.radius += this.sizeStep;
            this.fillColor = this.currentColor.toHex();
        } else if (this.timeAlive <= 9) {
            // idly moving around in the spot
        } else if (this.timeAlive <= 15) {
            this.flyAway();
            this.ghost_y -= this.y_speed;
        }
    }

    StillInBounds() {
        return this.ghost_y + 2 * this.radius <= 0;
    }

    CheckCollision(playerObject) {
        const { catchNet, x, y, width, height } = playerObject;
        if (playerObject.CanCatchBugs) {
            if (TestPlayerBugCollision(catchNet.x, catchNet.y, catchNet.width, catchNet.height, this))
                return 1;
        } else if (TestPlayerBugCollision(x, y, width, height, this))
            return -1;
        return 0;
    }

    flyAway() {
        this.x = this.ghost_x + 20 * Math.sin((this.timeAlive - 5) * this.x_multiplier);
        this.y = this.ghost_y + 5 * Math.sin((this.timeAlive - 5) * this.y_multiplier);
    }
}

// creates a button 
class Button extends Rectangle {
    constructor(x, y, width, height, text, fontSize, font, fillColor, strokeColor, borderWidth) {
        super(x - width / 2, y - height / 2, width, height, fillColor, strokeColor, borderWidth);

        this.text = new CanvasText(x, this.y + this.height / 2 + fontSize / 3, text, fontSize + "px " + font, "center", "white", "white", 0);

    }

    draw(ctx) {
        super.draw(ctx);
        this.text.draw(ctx);
    }
}

// creates a slider 
class Slider extends Rectangle {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth, sliderDescription, defaultValue, minValue, maxValue) {
        super(x, y, width, height, fillColor, strokeColor, borderWidth);
        this.box = new Rectangle(x, y, 10, height, "black", "black", 0);
        this.description = new CanvasText(x - sliderDescription.length, y + height, sliderDescription, "30px Borel", "right", "white", "#00000000", 0);
        this.text = new CanvasText(x + width + 20, y + height, defaultValue, "30px Borel", "left", "white", "#00000000", 0);

        this.minValue = minValue;
        this.maxValue = maxValue - 1;
        this.value = defaultValue;

        this.updatePosition();
    }

    draw(ctx) {
        super.draw(ctx);
        this.box.draw(ctx);
        this.text.draw(ctx);
        this.description.draw(ctx);
    }

    UpdateValue(xCoord) {
        this.box.x = xCoord;
        if (this.box.x < this.x) this.box.x = this.x;
        else if (this.box.x + this.box.width > this.x + this.width) this.box.x = this.x + this.width - this.box.width;

        this.updateSliderValue();
        this.updatePosition();
    }

    SetValue(newValue) {
        this.value = newValue;
        this.text.setText(this.value);
        this.updatePosition();
    }

    updateSliderValue() {
        this.value = ((this.box.x - this.x) / (this.width - this.box.width)) * this.maxValue + this.minValue;
        this.value = parseInt(this.value);
        this.text.setText(this.value);
    }

    updatePosition() {
        this.box.x = ((this.value - this.minValue) * (this.width - this.box.width)) / (this.maxValue) + this.x;
    }
}


class BugsHandler {
    constructor(max_bugs_allowed, deltaTime) {
        this.max_bugs_allowed = max_bugs_allowed;
        this.deltaTime = deltaTime;
        this.timeSinceLastSpawn = 1;

        this.bugs = [];
    }


    draw(ctx) {
        this.bugs.forEach(bug => {
            bug.draw(ctx);
        });
    }


    GenerateBug() {
        this.timeSinceLastSpawn += this.deltaTime;
        const maxBugsAllowed = this.max_bugs_allowed;
        const spawnCooldown = 0.75;

        const shouldSpawnBug = this.bugs.length < maxBugsAllowed && this.timeSinceLastSpawn > spawnCooldown;

        if (shouldSpawnBug) {
            const xPosition = RandomNumber(20, 780);
            const yPosition = 480;
            const newBug = new Bug(xPosition, yPosition, this.deltaTime);

            this.bugs.push(newBug);
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

class Sound {
    constructor(fileName, canvasID) {
        this.sound = document.createElement("audio");
        this.sound.src = "sounds/" + fileName;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";

        document.getElementById(canvasID).appendChild(this.sound);
    }

    Play() {
        this.sound.currentTime = 0;
        this.sound.play();
    }

    Pause() {
        this.sound.pause();
    }

    SetVolume(newVolume) {
        this.sound.volume = newVolume / 100;
    }
}

// other functions     
function TestPlayerBugCollision(playerX, playerY, playerWidth, playerHeight, bug) {
    var horizontal_edge = !(playerX + playerWidth < bug.x - bug.radius || playerX > bug.x + bug.radius);
    var vertical_edge = !(playerY + playerHeight < bug.y - bug.radius || playerY > bug.y + bug.radius);
    return horizontal_edge && vertical_edge;
}

function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function RectContains(shape, x, y) {
    var horizontal_edge = (shape.x < x && shape.x + shape.width > x);
    var vertical_edge = (shape.y < y && shape.y + shape.height > y);
    return horizontal_edge && vertical_edge;
}
