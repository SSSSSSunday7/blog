---
title: 防抖(debounce)
sidebar: 'auto' date: 2023-11-19
tags:
 - js 
 - es6
categories: 
 - js
---
# 防抖(debounce)

> 单位时间内，频繁触发事件，只执行最后一次

## 问题:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .outer{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;
            background-color: gray;
        }
        span{
            font-size: 20px;
            color:white;
        }
    </style>
</head>
<body>
    <div class="outer">
        <span>1</span>
    </div>
    <script>
        let div=document.querySelector("div");
        let num=1;
        div.addEventListener("mousemove",
        function(){
            div.innerHTML=`<span>${num++}</span>`
        })
    </script>
</body>
</html>
```

> 示例代码中，每当鼠标滑过，div中的数会飞速增长，这不是我们想要的，我们想要它在一段时间内只执行一次

## 核心思路

> 通过`setTimeout`来实现
>
> + 声明一个定时器变量
> + 每当鼠标滑动都先判断是否有**定时器**，如果有定时器**先清除以前的定时器**
> + 如果没有就存一个定时器到变量里
> + 在定时器里调用要执行的函数

## 解决代码

```js
        function debounce(fn,t){
            let timer;
            return function(){//return函数使得事件运行的是该函数体里的函数
                if(timer) clearTimeout(timer);
                timer=setTimeout(function(){
                    fn();
                },t)
            }
        }
        
        let div=document.querySelector("div");
        let num=1;
        div.addEventListener("mousemove",debounce(function(){
            div.innerHTML=`<span>${num++}</span>`
        },200))
```

