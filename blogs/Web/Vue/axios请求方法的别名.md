---
title: axios请求方法的别名
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---
# axios请求方法的别名

> `[]`内表示可选参数



##  1.request方法发送请求

和正常发送请求一样

### 1.1 语法：axios.request(config)

但是**axios的request方法可以发送HTTP请求，并且可以设置请求参数、请求头、请求类型等参数**

```js
axios.request({
                method : 'GET',
                url: 'http://localhost:3000/posts/1'
            }).then(response=>{
                console.log(response);
            })
```



## 2. post方法发送请求

### 2.1 语法：axios.post(url[,[data, config\]])

