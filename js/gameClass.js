/* The Shape class is a JavaScript class that represents a shape with properties such as position, fill
color, stroke color, and border width, and provides methods to set these properties and display the
shape on a canvas context. */
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

/* The CanvasText class is a subclass of Shape that represents a text element on a canvas with
properties such as font, text alignment, and fill/stroke colors. */
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