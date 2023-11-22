---
title: axios取消请求
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---
# axios取消请求

> 用于在请求时间过久时取消请求

在axios请求配置中加入`cancelToken`属性，` cancelToken : new axios.CancelToken(function(c){}`新建一个函数，然后拿到第一个形参`c`

把`c`赋值给函数外的一个例如 `let cancel =null;`的变量

这时`cancel`就变成了一个函数

```js
   axios({
                method: 'GET',
                url: 'http://localhost:3000/posts/1',
                cancelToken : new axios.CancelToken(function(c){
                    cancel=c;
                })
            }).then(response => {
                console.log(response);
            })
```



调用cancel函数，即可取消请求

```js
 btns[1].onclick = function(){
            cancel();
        }
```

## 测试 

可以用json-server

在参数里加 `-delay 时间` 或`-d 时间`设置响应延迟，毫秒为单位

## 判断上一次请求成功与否

在请求最后回调函数里将cancel变为空

```js
then(response => {
                console.log(response);
                cancel =null;
            })
```

然后在请求前写一个判断

如果上一次请求没结束，则取消上一次的请求

![image-20231013114549032](/image-20231013114549032.png)
