// 创建一个基类
class BaseShape {
    // 定义基类的属性
    constructor(x, y, fillColor, strokeColor, borderWidth) {
        this.x = x;  //起始点x
        this.y = y; //起始点y
        this.fillColor = fillColor;  // 填充的颜色
        this.strokeColor = strokeColor;  // 画笔（边框）的颜色
        this.borderWidth = borderWidth;  // 画笔（边框）的宽度
    }

    // 设置ctx对象的属性
    setProperties(ctx) {
        const { fillColor, strokeColor, borderWidth } = this
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = borderWidth;
        ctx.beginPath();
    }
    // 定义ctx对象的draw方法
    display(ctx) {
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

/* The CanvasText class is a subclass of BaseShape that represents a text element on a canvas with
properties such as font, text alignment, and fill/stroke colors. */
// create CanvasText
class CanvasText extends BaseShape {
    constructor(x, y, text, font, textAlign, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
    }

    setText(newText) {
        this.text = newText;
    }

    setProperties(ctx) {
        super.setProperties(ctx);
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
    }

    draw(ctx) {
        this.setProperties(ctx);
        ctx.fillText(this.text, this.x, this.y);
        this.display(ctx);
    }
}

// creates a image 
class CanvasImage extends BaseShape {
    constructor(x, y, imageID) {
        super(x, y, 0, 0, 0);

        this.imageElement = document.getElementById(imageID);
        this.width = this.imageElement.width;
        this.height = this.imageElement.height;
    }

    draw(ctx) {
        ctx.drawImage(this.imageElement, this.x, this.y, this.width, this.height);
    }
}


// creates a rectangle 
class Rectangle extends BaseShape {
    constructor(x, y, width, height, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        this.setProperties(ctx);
        ctx.rect(this.x, this.y, this.width, this.height);
        this.display(ctx)
    }
}



// creates a circular
class Arc extends BaseShape {
    constructor(x, y, radius, rotation, startAngle, endAngle, isCounterClockwise, fillColor, strokeColor, borderWidth) {
        super(x, y, fillColor, strokeColor, borderWidth);
        this.radius = radius;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.isCounterClockwise = isCounterClockwise;
    }

    draw(ctx) {
        this.setProperties(ctx);
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.isCounterClockwise);
        this.display(ctx);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = Math.round(r);
        this.g = Math.round(g);
        this.b = Math.round(b);
        this.a = 0.7;
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

        // Set the alpha (transparency) to 0.3
        this.a = 0.7;
    }

    toHex() {
        const alphaHex = Math.round(this.a * 255).toString(16).padStart(2, "0");
        return "#" + this.r.toString(16).padStart(2, "0") + this.g.toString(16).padStart(2, "0") + this.b.toString(16).padStart(2, "0") + alphaHex;
    }
};





