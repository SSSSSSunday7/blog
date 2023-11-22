---
title: axios入门
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---
# axios入门

## 1.GET入门

先简单的使用cdn导入写一个demo

get用来**获取**数据

```js
axios({
    method : 'GET',
	url: 'http://localhost:3000/posts/1'
}).then(response=>{console.log(response);}).catch(error=>{console.log(error);})
```

这是一个简单的axios的GET请求

其中，then()和catch()分别表示请求成功和请求失败的方法，并且都有一个参数，表示响应值



## 2. POST入门

遵循Restful API风格，post用来**添加**数据

axios里的post请求：

```js
		axios({
                method : 'POST',
                url: 'http://localhost:3000/posts',
                data: {
                    title: "深夜敲代码",
                    author: "sunday"
                }
            }).then(response=>{
                console.log(response);
            })
```

## 3 .PUT入门

遵循Restful API风格，put用来**更新**数据

axios里的put请求：

```js
axios({
                method : 'PUT',
                url: 'http://localhost:3000/posts/3',
                data: {
                    title: "深夜敲代码",
                    author: "SSSSSSunday"
                }
            }).then(response=>{
                console.log(response);
            }).catch(error=>{console.log(error);})
```

## 4. DELETE入门

遵循Restful API风格，delete用**删除**数据

axios里的delete请求：

```js
 axios({
                method : 'DELETE',
                url: 'http://localhost:3000/posts/3'
            }).then(response=>{
                console.log(response);
            }).catch(error=>{console.log(error);})
```

