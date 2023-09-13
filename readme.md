关于Canvas的理解：

1. Canvas只是一个标签名，它本身不能做绘画.

    1. 只能设置画布（ 绘画区域）的静态属性（css样式）

       ```html
       <canvas id="testCanvas" width="800" height="500" style="border: 5px solid red;"></canvas>
       ```

    2. 操作绘画只能在JS代码中执行

       ```javascript
       const canvas=document.getElementById("canvas")
       ```

2. 调用其身上的一个对象（context对象）来执行绘画操作

3. context对象有2种，2d平面绘画的对象和3d绘画的对象

4. 使用方法getContext( ) 这个方法就能创建（获得）这个对象： getContext('2d ') 和    getContext('webgl ') 

   ```javascript
   const ctx=canvas. getContext( '2d '  )
   ```

   

5. 得到context对象(ctx)后，就可以操作这个对象身上的属性和方法来绘制了（线段，图形，文字，动画）

    基本使用，4个步骤：

    1. 申明开始

        ```javascript
        ctx.beginPath();
        ```

    2. 申明画什么

        ```javascript
        ctx.arc(100, 100, 3, 0, Math.PI * 2); // 画个小圆点
        ```

    3. 开始画

        ```javascript
        ctx.fill();
        ```
        
    4. 申明结束

        ```javascript
        ctx.closePath();
        ```
           

6. 绘制简单的规则的形状：使用对应的绘制的方法：
    ctx.stroke()： 按设定的路径画（直线，多边形）；
    ctx.strokeRect()：画矩形（正方形）；
    ctx.arc()： 画圆形（圆点，圆弧）；
    ctx.quadraticCurveTo()： 画弯曲线；
    ctx.fillText(): 绘制文字；
    ctx.drawImage(): 绘制图像；



    可以使用显式的ctx.beginPath()和ctx.closePath()方法，特定的绘制方法已经隐式封装了申明开始和结束的功能; 

    1. 画一条粗线为10px, 长度为100px, 红色的直线：

        ```javascript
            // 设置一条直线直线的样式
        ctx.strokeStyle = "red"; // 画笔颜色
        ctx.lineWidth = 10; // 粗细为10px
        
        // 开始画
            ctx.beginPath(); // 可以不用申明
        ctx.moveTo(startX, startY); //起始点位置 
        ctx.lineTo(endX, endY); // 结束点位置
        ctx.lineTo(endX, endY); // 可以连着画
        ctx.lineTo(endX, endY); // 画几段折线
        // 按当前路径画
        ctx.stroke();
        ctx.closePath(); // 可以不用申明
        ```

    2. 画一个等边三角形：

        ```javascript
            // 设置三角形的边长和高度
        const sideLength = 100;
        const triangleHeight = (Math.sqrt(3) / 2) * sideLength;

        // 设置三角形的顶点坐标
        const topX = canvas.width / 2;
        const topY = (canvas.height - triangleHeight) / 2;
        const leftX = topX - sideLength / 2;
        const leftY = topY + triangleHeight;
        const rightX = topX + sideLength / 2;
        const rightY = topY + triangleHeight;

        // 设置三角形的样式
        ctx.fillStyle = "purple"; // 填充颜色

        // 绘制等边三角形
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.fill();
        ```

    3. 画一绿色矩形：

        ```javascript
            // 设置矩形的位置和尺寸
        const x = 50;
        const y = 50;
        const width = 200;
        const height = 100;
        
        // 设置矩形的样式
        ctx.strokeStyle = "red"; // 边框颜色
        ctx.fillStyle = "green";   // 填充颜色
        ctx.lineWidth = 10;        // 边框宽度
        
        // 绘制矩形的边框
        ctx.strokeRect(x, y, width, height);
        
        // 填充矩形内部
        ctx.fillRect(x + context.lineWidth, y + context.lineWidth, width - 2 * context.lineWidth, height - 2 * ctx.lineWidth); // fillRect() 适用于绘制填充矩形,fill()适用于填充自定义路径所围绕的区域(其他多边形，圆形等)
        
        ```



    4. 画一个圆形

        ```javascript
                // 设置圆的样式
        ctx.fillStyle = "yellow"; // 填充颜色
        
        // 简单绘制圆形
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill(); // fill()适用于填充自定义路径所围绕的区域，可以绘制任意形状,fillRect() 适用于绘制填充矩形
        
        // 可用beginPath() 和 closePath() 包裹，来隔绝和中断与其他图形的关联
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        ```


    5. 画一段圆弧

        ```javascript
        // 可用beginPath() 和 closePath() 包裹，来隔绝和中断与其他图形的关联
        ctx.beginPath();
        // 绘制圆弧
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
        ctx.closePath();
        
        ```

    
    6. 画一条弯曲的线

        ```javascript
        // 设置控制点和终点坐标
        const startX = 50;
        const startY = 100;
        const controlX = 150;
        const controlY = 30;
        const endX = 250;
        const endY = 100;

        // 设置线条样式
        ctx.strokeStyle = "green";
        ctx.lineWidth = 3;

        // 绘制弯曲线
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        
        ```


    7. 绘制文字

        ```javascript
        // 设置文字样式
        ctx.font = "30px Arial";
        ctx.fillStyle = "blue";
        ctx.textAlign = 'center';

        // 绘制文字
        const text = "Hello, Canvas!";
        const x = 50;
        const y = 100;
        ctx.fillText(text, x, y);
        
        ```
​		
    8. 绘制一个图像：需要创建一个Image对象，并使用image.onload方法，是个异步操作

        ```javascript
        // 创建一个Image对象
        const image = new Image();
        image.src = "image.jpg"; // 图片的URL

        // 图像加载完成后执行绘制
        image.onload = function() {
            // 绘制图像
            context.drawImage(image, 50, 50, image.width, image.height);
        };
        
        ```
​				

总结：经常使用到的Canvas上下文属性和方法有：

        ```javascript
        // 设置文字样式
        ctx.font = "30px Arial";
        ctx.fillStyle = "blue";
        ctx.textAlign = 'center';

        // 绘制文字
        const text = "Hello, Canvas!";
        const x = 50;
        const y = 100;
        ctx.fillText(text, x, y);
        
        ```

    属性：
   
        ```javascript

        fillStyle：设置填充颜色
        strokeStyle：设置描边（画笔）的颜色、渐变或图案
        lineWidth：设置线条宽度
        font：设置文字的字体样式
        globalAlpha：设置绘制的全局透明度

        ```

    方法：
   
        ```javascript
        
        beginPath()：开始新的路径
        moveTo(x, y)：将绘图游标移动到指定坐标
        lineTo(x, y)：从当前点绘制一条直线到指定坐标
        arc(x, y, radius, startAngle, endAngle, anticlockwise)：绘制弧线
        arcTo(x1, y1, x2, y2, radius)：绘制弧线，连接两个点并使用半径定义曲线
        quadraticCurveTo(cpX, cpY, x, y)：绘制二次贝塞尔曲线
        drawImage(image, x, y, width, height)：绘制图
        fill()：填充当前路径
        stroke()：绘制当前路径的描边
        closePath()：闭合路径
        fillRect(x, y, width, height)：绘制填充矩形

        ```
