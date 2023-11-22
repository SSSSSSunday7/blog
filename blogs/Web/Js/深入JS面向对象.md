---
title: 深入JS面向对象
sidebar: 'auto' date: 2023-11-19
tags:
 - js 
 - es6
categories: 
 - js
---

# 深入JS面向对象

## 编程思想

### 1.面向过程

> 分析解决问题需要的步骤，然后用函数一步一步的解决，然后依次调用就行了

性能和开发速度比面向对象高

### 2.面向对象

> 把事物分解成一个个对象，然后让对象之间分工合作完成任务

+ 面向对象以对象功能来划分问题，而不是步骤
+ 更适合开发大型项目
+ 每一个对象都是功能中心，有明确分工
+ 灵活性强，代码复用率高

 

## 构造函数存在的问题

```js
        function Person(name,age){
            this.name=name;
            this.age=age;
            this.eat=function(){
                console.log("eating...");
            }
        }
        let man =new Person("john",18);
        let woman =new Person("june",19);
        console.log(woman.eat===man.eat);//false
```

明明两个eat方法一样，但是却不相等，因为内存中开辟了两个空间，两个实例对象的内存地址不同，其方法对应的地址也不同。

这样会造成内存的浪费。

## 原型

> 能使用原型对象实现方法共享

+ 构造函数通过原型分配的函数是所有对象所共享的
+ JavaScript 规定，**每一个构造函数都有一个 prototype 属性**，指向另一个对象，所以我们也称为原型对象
+ 这个对象**可以挂载函数**，对象实例化**不会多次创建原型上函数**，节约内存
+ 我们可以把那些**不变的方法**，**直接定义在 prototype 对象上**，这样**所有对象的实例就可以共享这些方法**
+ **构造函数和原型对象中的this 都指向 实例化的对象**

原型示例

```js
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        Person.prototype.eat = function () {
            console.log("eating...");
        }
        let man = new Person("john", 18);
        let woman = new Person("june", 19);
        console.log(woman.eat === man.eat); //true
```

## Constructor

> 每一个原型对象(prototype)里都有一个constructor函数，作用是指向构造函数

```js
 function Person(name, age) {
            this.name = name;
            this.age = age;
        }
 console.log(Person.prototype.constructor===Person); //true
```

## 在原型上批量定义方法

普通写法：

```js
        Person.prototype.eat = function () {
            console.log("eating...");
        }
        Person.prototype.sleep = function () {
            console.log("sleeping...");
        }
```

批量写法：

```js
        Person.prototype={
            eat:function(){console.log("eating...")},
            sleep:function(){console.log("sleeping...")}
        }
```

> 记得用逗号隔开每个方法

这样写，原来prototype里的constructor方法就没了，这样就不知道这个prototype指向的是谁

**所以正确写法如下**

```js
        Person.prototype={
            constructor: Person,
            eat:function(){console.log("eating...")},
            sleep:function(){console.log("sleeping...")}
        }
```

## 对象原型\__proto__

思考底层原理，为什么创建实例对象时能指向prototype

![image-20231022203233466](/image-20231022203233466.png)



> 每个对象都有一个属性\__proto__(两边都是两个下划线)，会指向prototype 

![image-20231022204855192](/image-20231022204855192.png)

```js
        function Person(name, age) {
            this.name = name;
            this.age = age;
        }
        let man =new Person("john",18)
		console.log(man.__proto__===Person.prototype);//true
//实例对象的原型对象(__proto__)指向的是对象原型(prototype)
```



**注意:**

+ \_\_proto\_\_是JS非标准属性
+ [[prototype]]和_proto_意义相同
+ 用来表明当前实例对象指向哪个原型对象prototype
+ \_\_proto\_\_对象原型里面也有一个constructor属性，**指向创建该实例对象的构造函数**

### 总结

对象原型(\__proto__)和原型对象(prototype)都是属于构造函数(Person)的。