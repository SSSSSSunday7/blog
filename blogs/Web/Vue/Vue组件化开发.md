---
title: Vue组件化开发
sidebar: 'auto' date: 2023-11-19
tags:
- vue
categories: 
 - Vue
---
#  Vue组件化开发

## 1、由三部分组成

### 1.1 结构(`<template>`标签中的内容)

`<template>`标签中只能有一个根元素(vue2特性)

```vue
<template>
</template>
```

### 1.2 逻辑(`<script>`标签中的内容)

```vue
<script>
</script>
```

​	可以通过`export default {}`导出当前组件的配置项

​	**例如**

+ data(特殊)是一个函数
+ methods
+ computed
+ watch
+ 生命周期函数

### 1.3样式(`<style>`标签中的内容)

>可以加入 scoped 属性，表示只影响当前组件
>
>组件内所有元素都会加入一个自定义属性，data-v-hash码，用于表示唯一性
>
>并且所有的css选择器都会跟上一个属性选择[data-v-hash码]

如果想让style支持less 需要给style标签加入`lang=“less”`属性

并且安装依赖 less和less-loader

```vue
<style>
</style>
```

