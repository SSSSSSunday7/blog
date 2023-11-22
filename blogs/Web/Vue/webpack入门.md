---
title: WebPack入门
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- WebPack
categories: 
 - Vue
---
# WebPack入门

## 一、创建配置

> 先简单的写一个隔行变色的demo

+ 在新项目目录下输入`npm init -y`，会生成一个`package.json`

+ 然后新建`src`目录

+ 在该`src`中创建`index.html`和`index.js`

+ 把html结构写好

+ 运行`npm install jquery -S`命令安装jQuery

  > `-S` 也可以写 `--save` ，作用是将安装的依赖添加到`package.json`的`dependencies`下（不写也会加入）
  >
  > 这时项目中会出现node_modules文件夹，和`package-lock.json`

+ 通过ES6模块化导入jQuery

  > 在index.js中写入`import $ from 'jqeury'`
  >
  > 但是import是es6的语法，浏览器不一定支持，所以需要 使用webpack

  + 安装webpack `npm install webpack webpack-cli -D`或者`yarn add webpack webpack-cli --dev`

    > 这里的-D是`--save-dev`的简写，是指将安装的依赖加入devDependencies，也就是开发依赖，并不会加入常规的dependencies

  **以上步骤和webpack没关系**

+ 实现隔行变色

  ```javascript
  import $ from 'jquery'
  $(
      function(){
          $('li:odd').css('background-color','red');
          $('li:even').css('background-color','pink');
      }
  )
  ```

### 1.1在项目中配置webpack

+ 在项目根目录下创建`webpack.config.js`的webpack配置文件并如下初始化

  ```javascript
  module.exports = {
      mode: 'development' //mode用来指定构建模式，可选的有development和production
  }
  ```

+ 在package.json的script节点中新增dev脚本如下

  ```json
  "scripts": {
      "dev": "webpack"
    }

然后在终端就可以使用`yarn run dev`或`npm run dev`就能运行了。

运行后会在项目根目录下生成一个名为**dist**的文件夹，里面的**main.js**就是经过webpack处理过的js文件。将html中的路径切换位dist文件夹的main.js即可

![image-20231011235339611](/image-20231011235339611.png)

终端指出了处理了哪些js文件

## 1.2 详解development和production模式的区别

### 一、production模式和development模式的主要差异

1. 开发环境中，`source map`是非常全的，这样可以在调试过程中快速定位问题。
    而生产环境中的`source map`不是那么重要了，就可以更加简洁一些，
    或者生产环境中的`source map`我们可以生成一个`.map`文件来进行存储。

2. 开发环境下，我们的代码一般打包生成之后，不需要进行压缩，
    因为在开发环境下，我们希望不压缩代码，
    可以看到打包生成的内容，
    比较明显的看到里边一些具体的说明项；



> 可以看到两种模式的打包时间快慢和打包文件大小

+ development

![image-20231012000349443](/image-20231012000349443.png)

+ production

![image-20231012000521296](/image-20231012000521296.png)

development打包快，文件大，因为没有压缩

production打包慢，文件小

很符合语义，开发环境和生产环境

## 1.3 webpack的entry和output

### 1.3.1 webpack中的默认约定

+ 在webpack4.x和5.x中，有如下约定：
  + 默认打包入口，*src->index.js*
  + 默认输出路径，*dist->main.js*

> 可以在webpack.config.js中修改路径

```js
const path =require('path');//导入node.js中操作路径的模块
module.exports = {
    mode: 'development', //mode用来指定构建模式，可选的有development和production
    entry : path.join(__dirname,'./src/index.js'), // 打包入口文件路径
    output :{ 
        path : path.join(__dirname, './dist'), //输出文件的存放路径
        filename: "bundle.js" //输出文件的名称
	}
}
```

> 提一句path.join()
>
> 使用path.join()方法，可以把多个路径片段拼接为完整的路径字符串，
>
> `__dirname`指的是当前目录
>
> ```js
> const pathStr1 = path.join('/a', '/b/c', '../../', './d', '/e')
> console.log(pathStr1); // 返回结果 \a\b\e
> ```
>
> **注意：凡是涉及到路径拼接的操作，都要使用path.join()方法进行处理。不要直接使用+进行字符串的拼接**

## 1.4 webpack-dev-server插件

### 1.4.1功能

每当修改源代码都会自动进行打包和构建

> 该插件会自动生成一个HTTP服务器，通过8080端口访问
>
> **注意，只有通过http服务器才能实时看到改变**

### 1.4.2 安装

+ 在package.json的script节点中修改dev脚本如下

  ```json
  "scripts": {
      "dev": "webpack serve"
    }
  ```

通过`yarn run dev`或`npm run dev`运行

高版本的webpack-dev-server插件需要在webpack.config.js下做如下修改

```js
devServer: {
		static: "./"
	}
```

### 1.4.3 解决无实时变更问题

**注意，只有通过http服务器才能实时看到改变**

该插件会将生成的js文件放到**内存**里，相对于html则是在项目根目录，所以应该是在`../`路径下

## 1.5 html-webpack-plugin插件

如果你想进入`localhost:8080`，立刻就看见`src`下的`index.html`，不想让路径变成`localhost:8080/src`，就需要这款插件。

在`webpack.config.js`中导入

```js
const HtmlPlugin=require('html-webpack-plugin');//导入该插件
//创建HtmlPlugin的实例对象
const htmlPlugin  =new HtmlPlugin({
    template : './src/index.html', //原文件存放路径
    filename  : './index.html' //指定生成路径
})
```

并在`module.exports = {}`中加入

```js
plugins: [htmlPlugin] //通过plugins节点使其生效
```

