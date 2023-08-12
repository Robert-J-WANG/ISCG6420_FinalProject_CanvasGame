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
    ctx.stroke()： 按设定的路径画；
    ctx.strokeRect()：画矩形；
    ctx.arc()： 画圆形；

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


    2. 画一绿色矩形：

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



    3. 画一个圆形

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


    4. 画一段圆弧

        ```javascript
        // 可用beginPath() 和 closePath() 包裹，来隔绝和中断与其他图形的关联
        ctx.beginPath();
        // 绘制圆弧
        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.stroke();
        ctx.closePath();
        
        ```





​		

​				




1. `fillStyle`：设置填充的颜色、渐变或图案

   ```javascript
   ctx.fillStyle = "rgba(255,165,0,1)"; // 填充颜色
   ```

  2. `strokeStyle`：设置描边（画笔）的颜色、渐变或图案

     ```javascript
     ctx.strokeStyle = "#FFA500"; //正常颜色
     ```

  3. `lineWidth`：设置线条的宽度

     ```javascript
     ctx.lineWidth = 15; //15px
     ```

  4. `font`：设置绘制文本的字体样式

     ```javascript
     ctx.font = "48px Microsoft YaHei" // 字体越大越清晰
     ```

     

  5. `textAlign`：设置文本的水平对齐方式

     ```javascript
     ctx.textAlign = 'center'	重要的属性有：
     ```

