---
title: Data是一个函数
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
categories: 
 - Vue 
---
# Data是一个函数

对于组件来说，data必须是一个函数，

用于保证每个组件实例都能维持**独立**的数据对象

 每次创建新组件实例，都是执行一次data函数，得到一个新对象 

每次操作只影响该组件对象内的数据

```js
data(){
	return {
		count :100
	}
},
```

