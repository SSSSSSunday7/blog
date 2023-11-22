---
title: axios创建实例对象
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---

# axios创建实例对象

> 可以先用 `axios.created()`创建一个实例对象，然后这个实例对象和直接用aixos({})写请求一样
>
> **作用：可以作为某一类请求的默认配置，而不是所有请求的默认配置**

创建实例对象：

```js
 //创建实例对象
        const axiosObject = axios.create({
                baseURL:'http://localhost:3000', 
                timeout: 2000
            })
```

调用实例对象：

```js
axiosObject({
            url:'/posts/1',
        }).then(response=>{console.log(response);})
```

```js
axiosObject.get('/posts/1').then(response=>{console.log(response);})
```

两种一样的