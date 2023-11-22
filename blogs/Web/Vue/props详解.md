---
title: props详解
sidebar: 'auto' date: 2023-11-19
tags:
- vue
categories: 
 - Vue 
---
# props详解

> props可以传递任意类型和任意数量的值给子元素

## 1、props校验

### 1.1类型校验

```js
props{
    校验的属性：类型 //Number,String,Boolean
}
```

这样类型不匹配就会有报错提示

### 1.2 校验完整写法

```js
props : {
    属性名 :{
        type :校验的类型, //等于类型校验
        required: true // 非空校验true为开启
        default: 0 //设置值为空时的默认值 和非空校验冲突
        validator(value){
            if(value!=null){
                return true; //vlaue就是这个属性的值
            }
            return true; //自定义写法(函数名固定)，可以自定义逻辑，只要不返回true就在控制台报错
        }
        
    }
}
```

### 1.3 props&data、单向数据流

**共同点：**能给组件提供数据

**区别：**

+ data的数据是自己的，可以随便改
+ prop的数据是外部的，不能随便改，要遵循**单向数据流**

如果不遵循子传父那一套东西（$emit)，直接改，就会报错。

![image-20231012113245370](/image-20231012113245370.png)

> 写法能参考

单向数据流是流动的，所以父组件改自己的数据也会影响子组件props里的数据，向下流动