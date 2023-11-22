---
title: axios拦截器
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---
# axios拦截器

> 拦截器可以配置多个，但是请求拦截器是**后配置的先执行**，而响应拦截器是**先配置的先执行**，如果有[1号**请求**拦截器,2号**请求**拦截器]和[1号**响应**拦截器,2号**响应**拦截器],那么则是先执行 2号**请求**拦截器 ，1号**响应**拦截器 ，1号**请求**拦截器，2号**响应**拦截器

## 1.请求拦截器(request interceptors)

官方文档：

```js
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
```

作用：在请求前使用一些回调也就是函数，来对请求内容做判断，判断是否发送

### 1.1 config

可以在返回时更改config

比如可以在拦截器中写`config.params={a:100}`"那么返回后，config中就会多一个参数

## 2.响应拦截器(response interceptors)

官方文档：

```js
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

作用：在服务器返回后，对返回结果格式化，或者执行一些日志记录，或者判断格式是否正确，有问题就在响应拦截器里处理

### 2.1 简洁响应

如果不需要状态码之类的，只需要数据那么就把`return response`改为`return response.data`

## 3. 实例

假设

```js
axios.interceptors.request.use(function (config) {
            console.log(" 请求拦截器 成功");
            //return config;
    		throw '异常'
        }, function (error) {
            console.log(" 请求拦截器 失败");
            return Promise.reject(error);
        });
```

手动在成功类写了异常，那么在后面的响应拦截器中，是不会走成功那一步函数的

## 