---
title: axios 配置对象详解
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---

# axios 配置对象详解

> 也就是config参数
>
> 附github仓库的readme.md下的解释(去除大部分注释)

```js
{
	//和baseURL是相对的，接在baseURL后方
  url: '/user',

	//设置请求类型
  method: 'get', // default

	//和url是相对的，主要是为了减少重复
  baseURL: 'https://some-domain.com/api/',

//对请求的数据做处理，在处理后再发送给服务器
  transformRequest: [function (data, headers) {
    return data;
  }],
//对响应回来的数据做处理，处理完，才会进入回调
  transformResponse: [function (data) {
    return data;
  }],

//对请求头做配置 可以加token
  headers: {'X-Requested-With': 'XMLHttpRequest'},

//配置url参数，可以配多个，会自动注入到url后方
  params: {
    ID: 12345
  },
  
//参数序列化，对请求的参数做一个序列化，转化成字符串
//比如将"/post?a=100&b=200"转化成"/post/a/100/b/200"或者"/post/a.100/b.200"
  paramsSerializer: {


    encode?: (param: string): string => { /* Do custom operations here and return transformed string */ }, 
    

    serialize?: (params: Record<string, any>, options?: ParamsSerializerOptions ), 
    
   
    indexes: false 
  },

  //请求体,对象形式，自动转换成json传递
  data: {
    firstName: 'Fred'
  },

 //请求体，字符串形式（表单形式），axios直接传递字符串
  data: 'Country=Brasil&City=Belo Horizonte',

  //请求超时事件
  timeout: 1000, // default is `0` (no timeout)

   //跨域请求时对cookie的携带做的设置，默认false不携带
  withCredentials: false, // default

  //对请求适配做设置，一种发送ajax，另一种是在node里发送http请求
  adapter: function (config) {
    /* ... */
  },

 //请求验证，设置用户名密码（偏少使用） 
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

 //对响应体结果的格式设置，默认服务器返回json，会自动转换
  responseType: 'json', // default

//字符集设置
  responseEncoding: 'utf8', // default

//跨域请求时，对cookie的名字进行设置
  xsrfCookieName: 'XSRF-TOKEN', // default

//跨域请求时，对cookie的头信息进行设置
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
      
//上传时的回调
  onUploadProgress: function ({loaded, total, progress, bytes, estimated, rate, upload = true}) {

  },

//下载时的回调
  onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
    
  },

  //设置http响应体的最大尺寸，单位，字节
  maxContentLength: 2000,

  //请求体的最大尺寸，单位，字节
  maxBodyLength: 2000,

//对响应结果的成功做设置，什么时候判断为成功
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default，也就是状态码大于200小于300时判断成功
  },
	//也就是请求可能会跳转到其他请求，最大允许的跳转次数
     //只能在node环境下
  maxRedirects: 21, // default

  beforeRedirect: (options, { headers }) => {
    if (options.hostname === "example.com") {
      options.auth = "user:password";
    }
  },
//设置socket文件的位置，主要是用在docker，向dokcer的守护进程发送请求的
 //如果设置了socketPath又设置了proxy时，优先使用socketPath
  socketPath: null, // default
  

  transport: undefined, // default
//对http客户端的设置，比如是否保持连接
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

//代理设置
//做爬虫程序常用，可以通过代理来隐藏ip，从而减少被识别为机器人的概率
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  cancelToken: new CancelToken(function (cancel) {
  }),


  signal: new AbortController().signal,


  decompress: true // default


  insecureHTTPParser: undefined // default

  transitional: {

    silentJSONParsing: true, // default value for the current Axios version

  
    forcedJSONParsing: true,


    clarifyTimeoutError: false,
  },

  env: {
    
    FormData: window?.FormData || global?.FormData
  },

  formSerializer: {
      visitor: (value, key, path, helpers) => {}; // custom visitor function to serialize form values
      dots: boolean; // use dots instead of brackets format
      metaTokens: boolean; // keep special endings like {} in parameter key
      indexes: boolean; // array indexes format null - no brackets, false - empty brackets, true - brackets with indexes
  },

  // http adapter only (node.js)
  maxRate: [
    100 * 1024, // 100KB/s upload limit,
    100 * 1024  // 100KB/s download limit
  ]
}
```

