class Shape {
    constructor(x, y, fillColor, strokeColor, borderWidth) {
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.borderWidth = borderWidth;
    }

    setProperty(context) {
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.lineWidth = this.borderWidth;

        context.beginPath();
    }

    Display(context) {
        context.fill();
        context.stroke();
        context.closePath();
    }
}

// create CanvasText
class CanvasText extends Shape {
    constructor(x, y, text, font, textAlign, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
    }

    SetText(newText) {
        this.text = newText;
    }

    setProperty(context) {
        super.setProperty(context);
        context.font = this.font;
        context.textAlign = this.textAlign;
    }

    Draw(context) {
        this.setProperty(context);
        context.fillText(this.text, this.x, this.y);
        this.Display(context);
    }
}

// creates a image 
class CanvasImage extends Shape {
    constructor(x, y, imageID) {
        super(x, y, 0, 0, 0);

        this.imageElement = document.getElementById(imageID);
        this.width = this.imageElement.width;
        this.height = this.imageElement.height;
    }

    Draw(context) {
        context.drawImage(this.imageElement, this.x, this.y, this.width, this.height);
    }
}
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
        this.catchNet = new Rectangle(this.x, this.y, this.net.width - this.width / 2, this.net.height * 2, "white", "white", 0);
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

    Draw(context) {
        var contextXOffset = this.x + this.width / 2;
        var contextYOffset = this.y + this.height / 1.4;
        context.translate(contextXOffset, contextYOffset);
        context.rotate(this.netRotation);

        if (!this.isFlipped) {
            context.scale(-1, 1);
            this.net.Draw(context);
            context.scale(-1, 1);
        } else {
            this.net.Draw(context);
        }
        context.rotate(-this.netRotation);
        context.translate(-contextXOffset, -contextYOffset);

        if (!this.isFlipped) {
            this.imageElement = this.flipped;

            super.Draw(context);
        } else {
            this.imageElement = this.normal;

            super.Draw(context);
        }

        this.leftEye.Draw(context);
        this.rightEye.Draw(context);
    }

    UpdateOtherFeatures() {
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

            this.catchNet.x = this.x + this.catchNet.rightOffset;
            this.leftEye.x = this.x + this.leftEye.leftOffset + this.netRotation * 2;
            this.rightEye.x = this.x + this.rightEye.leftOffset + this.netRotation * 2;
        } else {

            this.catchNet.x = this.x + this.catchNet.leftOffset;
            this.leftEye.x = this.x + this.leftEye.rightOffset + this.netRotation * 2;
            this.rightEye.x = this.x + this.rightEye.rightOffset + this.netRotation * 2;
        }

        this.catchNet.y = this.y + this.catchNet.yOffset;
        this.leftEye.y = this.y + this.leftEye.yOffset;
        this.rightEye.y = this.y + this.rightEye.yOffset;
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

// creates a rectangle 
class Rectangle extends Shape {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.width = width;
        this.height = height;
    }

    Draw(context) {
        this.setProperty(context);
        context.rect(this.x, this.y, this.width, this.height);
        this.Display(context)
    }
}

// creates a button 
class Button extends Rectangle {
    constructor(x, y, width, height, text, fontSize, font, fillColor, strokeColor, borderWidth) {
        super(x - width / 2, y - height / 2, width, height, fillColor, strokeColor, borderWidth);

        this.text = new CanvasText(x, this.y + this.height / 2 + fontSize / 3, text, fontSize + "px " + font, "center", "white", "white", 0);

    }

    Draw(context) {
        super.Draw(context);
        this.text.Draw(context);
    }
}

// creates a slider 
class Slider extends Rectangle {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth, sliderDescription, defaultValue, minValue, maxValue) {
        super(x, y, width, height, fillColor, strokeColor, borderWidth);
        this.box = new Rectangle(x, y, 10, height, "black", "black", 0);
        this.description = new CanvasText(x - sliderDescription.length, y + height, sliderDescription, "30px Georgia", "right", "white", "#00000000", 0);
        this.text = new CanvasText(x + width + 20, y + height, defaultValue, "30px Georgia", "left", "white", "#00000000", 0);

        this.minValue = minValue;
        this.maxValue = maxValue - 1;
        this.value = defaultValue;

        this.updatePosition();
    }

    Draw(context) {
        super.Draw(context);
        this.box.Draw(context);
        this.text.Draw(context);
        this.description.Draw(context);
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
        this.text.SetText(this.value);
        this.updatePosition();
    }

    updateSliderValue() {
        this.value = ((this.box.x - this.x) / (this.width - this.box.width)) * this.maxValue + this.minValue;
        this.value = parseInt(this.value);
        this.text.SetText(this.value);
    }

    updatePosition() {
        this.box.x = ((this.value - this.minValue) * (this.width - this.box.width)) / (this.maxValue) + this.x;
    }
}

// creates a circular
class Arc extends Shape {
    constructor(x, y, radius, rotation, startAngle, endAngle, isCounterClockwise, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.radius = radius;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.isCounterClockwise = isCounterClockwise;
    }

    Draw(context) {
        this.setProperty(context);
        context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.isCounterClockwise);
        this.Display(context);
    }
}

// creates a bug 
class Bug extends Arc {
    constructor(x, y, deltaTime) {
        super(x, y, 0, 0, 0, Math.PI * 2, false, "yellow", "#00000000", 3);
        this.ghost_x = x;
        this.ghost_y = y;

        this.y_speed = 100 * deltaTime;

        this.x_multiplier = 2 * Math.PI / 2;
        this.y_multiplier = 4 * Math.PI / 2;

        this.deltaTime = deltaTime;
        this.timeAlive = 0;

        // current rgb values for the bug
        this.targetColor = new Color(255, 0, 0);
        this.currentColor = new Color(255, 255, 0);
        this.colorStep = new Color((this.targetColor.r - this.currentColor.r) / (deltaTime * 6000),
            (this.targetColor.g - this.currentColor.g) / (deltaTime * 6000),
            (this.targetColor.b - this.currentColor.b) / (deltaTime * 6000));
        this.sizeStep = (15 - this.radius) / (deltaTime * 6000);
    }

    UpdatePosition() {
        this.timeAlive += this.deltaTime;

        if (this.timeAlive <= 1) this.radius += 4 * this.deltaTime;
        else if (this.timeAlive <= 2) {} else if (this.timeAlive <= 5) {
            // changing color and growing
            this.currentColor.add(this.colorStep);
            this.radius += this.sizeStep;
            this.fillColor = this.currentColor.toHex();
        } else if (this.timeAlive <= 9) {
            // idly moving around in the spot
            this.flyAway();
        } else if (this.timeAlive <= 15) {
            this.flyAway();
            this.ghost_y -= this.y_speed;
        }
    }

    StillInBounds() {
        return this.ghost_y + 2 * this.radius <= 0;
    }

    CheckCollision(playerObject) {
        if (playerObject.CanCatchBugs) {
            if (TestPlayerBugCollision(playerObject.catchNet.x, playerObject.catchNet.y, playerObject.catchNet.width, playerObject.catchNet.height, this))
                return 1;
        } else if (TestPlayerBugCollision(playerObject.x, playerObject.y, playerObject.width, playerObject.height, this))
            return -1;
        return 0;
    }

    flyAway() {
        this.x = this.ghost_x + 20 * Math.sin((this.timeAlive - 5) * this.x_multiplier);
        this.y = this.ghost_y + 5 * Math.sin((this.timeAlive - 5) * this.y_multiplier);
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
class Color {
    constructor(r, g, b) {
        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
    }

    add(anotherColor) {
        this.r += anotherColor.r;
        if (this.r > 255) this.r = 255;
        else if (this.r < 0) this.r = 0;

        this.g += anotherColor.g;
        if (this.g > 255) this.g = 255;
        else if (this.g < 0) this.g = 0;

        this.b += anotherColor.b;
        if (this.b > 255) this.b = 255;
        else if (this.b < 0) this.b = 0;
    }

    toHex() {
        return "#" + this.r.toString(16).padStart(2, "0") + this.g.toString(16).padStart(2, "0") + this.b.toString(16).padStart(2, "0")
    }
}