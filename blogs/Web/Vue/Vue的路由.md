---
title: Vue的路由
sidebar: 'auto' date: 2023-11-19
tags:
- vue
categories: 
 - Vue
---
# Vue的路由

> 主要用来做单页应用（就是一个网页提供多个功能，不依赖跳转到多个页面实现功能）

![image-20231012172814288](/image-20231012172814288.png)

单页应用，重点是**页面性能高**，**开发效率**高

+ 单页应用
  + 系统类网站
  + 内部网站
  + 文档类网站
  + 移动端站点

+ 多页应用
  + 公司官网
  + 电商类网站

## 1、Vue中路由介绍

> 主要是**路径**和**组件**的映射关系，通过路径来切换组件

## 2、安装配置过程

![image-20231012180519697](/image-20231012180519697.png)

还有两个步骤

+ 创建views目录，将路由组件放置在其中，配置路由规则

+ 配置导航，配置路由出口（路径匹配的组件显示的位置）

  > 配置路由规则要在`main.js`，如图

![image-20231012182457736](/image-20231012182457736.png)

![image-20231012182552395](/image-20231012182552395.png)

`router-view标签是路由展示的位置`

> 如果导入vue组件时报错提示：vue名字必须为多个单词
>
> 可以在组件里写类似`name:MyName`就可以解决报错又不用改名

### 2.1 组件存放目录问题

+ src/views文件夹
  + **页面组件** -页面展示 -配合路由

+ src/components文件夹
  + **复用组件**-展示数据-用于复用

## 3. 进阶路由

![image-20231012195219187](/image-20231012195219187.png)

### 3.1 封装router配置

和直接写在main.js比，只有路径区别和**要在最后写导出模块**

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Find from "../views/FInd.vue"
import Music from "../views/Music.vue"
import Friend from "../views/Friend.vue"

Vue.use(VueRouter)
const router =new VueRouter({
  routes : [
    {path:"/find", component: Find},
    {path:"/music", component: Music},
    {path:"/friend", component: Friend}
  ]
}

);
export default router
```

> 如果文件层级较深，用相对路径 .. 来定位过于繁琐，Vue支持一个一定程度上的绝对路径，`@`，表示src的绝对路径

### 3.2 快速实现导航高亮

![image-20231012200257945](/image-20231012200257945.png)

关于路由的跳转，a标签可以全部换成`<router-link to="/路径"> </router-link>`

![image-20231012203219859](/image-20231012203219859.png)

`<router-link> </router-link>`本质和a标签没区别

但是被选中的标签会加入两个类`router-link-exact-active` `router-link-active`可以修改这两个类的样式，来实现高亮。

#### 3.2.1 两个类

##### 3.2.1.1 router-link-exact-active

**精准匹配**，按照`to=""`属性的路径，进行匹配

如果完全匹配则加入这个类

##### 3.2.1.2 router-link-active

**模糊匹配**（用的多），例如`to="/my"  `可以匹配 `/my`，`/my/a`，`/my/b`等

#### 3.2.2 自定义类名

`router-link-exact-active` `router-link-active`如果觉得太长了也可以定制

![image-20231012221649102](/image-20231012221649102.png)

可以在router的构造方法里加入两个属性

### 3.3跳转时传参

> 在跳转路由时，进行传值

#### 3.3.1 查询参数传参语法

+ 语法如下
  + `to="/path?参数名=值"`

+ 对应页面组件接收组件传的值
  + $route.query.参数名
  + 在方法里需要this.$route.query.参数名

#### 3.3.2 动态路由传参语法

![image-20231012222903425](/image-20231012222903425.png)

主要是在路由的构造函数里加入如`path:"/search/:words"`一定要是`:words`

这样的变量才是动态的。 

例如：像/search/study，/search/le，等任何路径都可以匹配

![image-20231012223939766](/image-20231012223939766.png)

> 总结：查询传参适合传多个参数，动态路由传参适合简洁的传单个参数

### 3.4 路由-重定向

> 网页打开时大概率是默认`/`路径，不会匹配任何组件，会导致空白

重定向能匹配到 path时，强制跳转到指定path路径 

语法:`{path: 匹配路径,redirect: 重定向到的路径}`,也是写在router的构造函数里

![image-20231012225352714](/image-20231012225352714.png)

### 3.5 路由-404

> 当路径找不到匹配的路由组件时，返回404

位置：配置在路由最后

语法：`path:"*",component:404组件`前面不匹配就会匹配这个

### 3.6 路由-模式设置

> 路由的路径看起来不自然，有#，例如`http://localhost:8080/#/home`

因为默认是

+ hash模式（默认） `http://localhost:8080/#/home`
+ history模式（常用）`http://localhost:8080/home`（需要上线后服务器支持）

语法：还是在router构造函数里，`mode:"history"`就切换成功了

### 3.7 路由-编程式导航-跳转

> 点击按钮如何跳转路由

语法1 ：

![image-20231012230503974](/image-20231012230503974.png)

语法2 ：

![image-20231012230714417](/image-20231012230714417.png)

语法2需要去router构造函数里的路由配置里给指定路由加`name:""`才有路由名

#### 3.7.1 跳转传参

语法1：

算是有两种，第一种适合一般少量参数传递

第二种是接收对象或多个参数：`query:{}`里是用来接收对象要更清晰

获取参数用`$route.query.key`，方法里加上`this.`

![image-20231012232640859](/image-20231012232640859.png)

> 而且同样支持动态路由传参，也就是`path:"/search/:words"`这样的配置，解析也是从`$route.query.key`变成`$route.params.key`

+ 语法2：
+ ![image-20231012232549822](/image-20231012232549822.png)

## 3.8 二级路由

![image-20231029201545564](/Vue的路由/image-20231029201545564.png)

> 在作为一级路由的组件下面添加`<router-view></router-view>`显示的是二级路由的内容，通过这样实现嵌套显示

