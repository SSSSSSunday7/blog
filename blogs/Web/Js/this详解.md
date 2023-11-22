---
title: this详解
sidebar: 'auto' date: 2023-11-19
tags:
 - js 
 - es6
categories: 
 - js
---

# this详解

## 普通函数

>  普通函数没有明确调用者时`this`为`window`
>
> 严格模式下没有调用者时为`undefined`

## 箭头函数

> 箭头函数中的 this 与普通函数完全不同，也不受调用方式的影响，事实上箭头函数中并不存在 this !
>
> + 1.箭头函数会默认帮我们绑定外层 this 的值，所以在箭头函数中 this 的值和外层的 this 是一样的
> + 2.箭头函数中的this引用的就是最近作用域中的this
> + 3.向外层作用域中，一层一层查找this，直到有this的定义

> 基于原型的面向对象不推荐采用箭头函数

## 改变this指向

有三种方式 call(),apply(),bind()

### 1. call()

使用call调用函数，同时指定被调用的函数中this的值

语法：`fun.call(thisArg,arg1,arg2,...)`

`thisArg`在fun函数运行时指定的this值

`arg1,arg2`：传递的其他参数

返回值就等于函数的返回值,因为他就是调用函数

> 总的来说就两个作用，调用函数并改变this指向

```js
        let obj={name:"john"};
        function fn(x,y){
            console.log(this);//obj:{name:"john"}
            console.log(x+y);//1+2=3
        }
        fn.call(obj,1,2);
```

### 2、apply()

使用apply调用函数，同时指定被调用的函数中this的值

语法：`fun.call(thisArg,[argsArray])`

+ `thisArg`: 在fun函数运行时指定的 this 值
+ `argsArray`: 传递的值，必须包含在数组里面
+ 返回值就是函数的返回值，因为它就是调用函数
+ 因此 apply 主要跟数组有关系，比如使用 `Math.max()`求数组的最大值

```js
        let obj={name:"john"};
        function fn(x,y){
            console.log(this);//obj:{name:"john"}
            console.log(x+y);//1+2=3
        }
        fn.apply(obj,[1,2])
```

### 3. bind()

bind不会调用函数，能改变函数中this的指向

语法：`fun.bind(thisArg,arg1,arg2,...)`

+ `thisArg`:在 fun 函数运行时指定的 this 值
+ `arg1，arg2`:传递的其他参数

+ **返回值**:由指定的 this 值和初始化参数改造的 **原函数拷贝 (新函数)**
+ 因此当我们只是想改变 this 指向，并且不想调用这个函数的时候，可以使用 bind，比如改变定时器内部的this指向.

```js
        let obj={name:"john"};
        function fn(x,y){
            console.log(this);//obj:{name:"john"}
            console.log(x+y);//1+2=3
        }
        let fun=fn.bind(obj,1,2);
        fun();
```

两秒禁用按钮案例:

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
    <button>两秒禁用按钮</button>
<body>

    <script>
        let btn=document.querySelector("button")
        btn.addEventListener("click",function(){
            this.disabled=true;
            setTimeout(function(){
                this.disabled=false;
            }.bind(btn),2000)//参数改为this来指向外层this也是一样的
        })
    </script>
</body>

</html>
```

