---
title: Vuex入门
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- Vuex
categories: 
 - Vue
---
# Vuex入门


![image-20231030101723797](/image-20231030101723797.png)

## 1、初始化仓库

![image-20231030112508663](/Vuex入门/image-20231030112508663.png)

![image-20231030112625243](/Vuex入门/image-20231030112625243.png)

![image-20231030112652695](/Vuex入门/image-20231030112652695.png)

![image-20231030112800066](/Vuex入门/image-20231030112800066.png)

> 能看到说明配置仓库成功

## 2、核心概念-state状态

![image-20231030112921463](/Vuex入门/image-20231030112921463.png)

![image-20231030113016022](/Vuex入门/image-20231030113016022.png)

### 2.1 案例1

根组件（App）：

```vue
<template>
    <div id="Son1">
        <div class="box">
            <h2>son1 子组件</h2>
            从vue中获取的值<label>{{ $store.state.count }}</label>
            <br />
            <button @click="$store.state.count++">值+1</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Son1Com'
}
</script>

<style lang="scss" scoped>
.box {
    border: 3px solid #ccc;
    width: 400px;
    padding: 10px;
    margin: 20px;
}

h2 {
    margin-top: 10px;
}
</style>

```



组件1（Son1）：

```vue
<template>
    <div id="Son1">
        <div class="box">
            <h2>son1 子组件</h2>
            从vue中获取的值<label>{{ $store.state.count }}</label>
            <br />
            <button @click="$store.state.count++">值+1</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Son1Com'
}
</script>

<style lang="scss" scoped>
.box {
    border: 3px solid #ccc;
    width: 400px;
    padding: 10px;
    margin: 20px;
}

h2 {
    margin-top: 10px;
}
</style>

```

组件2（Son2）：

```vue
<template>
    <div id="Son2">
        <div class="box">
            <h2>son2 子组件</h2>
            从vue中获取的值<label>{{ $store.state.count }}</label>
            <br />
            <button @click="$store.state.count--">值-1</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Son2Com'
}
</script>

<style scoped>
.box {
    border: 3px solid #ccc;
    width: 400px;
    padding: 10px;
    margin: 20px;
}

h2 {
    margin-top: 10px;
}
</style>

```

仓库：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'state标题',
    count: 0
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

效果:

![image-20231030114508076](/Vuex入门/image-20231030114508076.png)

### 2.2 函数简化访问(MapState)

![image-20231030143308003](/Vuex入门/image-20231030143308003.png)

+ 使用计算属性，本质还是通过，`this.$store.state.count`这样的方式来获取，但是是给他丢到了计算属性里，所以能够直接`{{ 属性名 }}`这样的方式来获取。
+ mapState会返回一个计算属性的函数，所以需要在计算属性里使用
+ mapState函数的可以接受一个对象Object<string | function>。对象中可以包含字符串或函数。mapState()函数的**返回结果是一个对象**。

**MapState用法**

```js
computed: mapState({
    count: 'count',  // string    映射 this.count 为 store.state.count的值
    // 箭头函数可使代码更简练
    name: (state) => state.name, // function   映射 this.name 为 store.state.name的值
    nameAlias: 'name', // string   映射 this.nameAlias 为 store.state.name的值
    countplustempcount: function (state) { // 用普通函数this指向vue实例,但是在箭头函数中this就不是指向vue实例了，所以这里必须用普通哈数
      return this.tempcount + state.count
    },
    countplustempcount2 (state) {
      return this.tempcount2 + state.count
    } 
})
```

**等同于：**

```js
computed:
{ // 这个对象就是mapState的返回值
    count () {
       return this.$store.state.count
    },
    name () {
        return this.$store.state.name
    }
    nameAlias () {
        return this.$store.state.name
    }
    countplustempcount: function (state) {
      return this.tempcount + this.$store.state.count
    },
    countplustempcount2 (state) {
      return this.tempcount2 + this.$store.state.count
    } 
}
```

但是因为mapState返回的是一个完整的对象，所以像下面的代码一样，你不能直接，`let n={ z, c:5 ,b:6 }`必须得遍历对象并赋值出来才行，所以要使用扩展运算符将mapState返回的对象遍历出来，才能加其他的计算属性

```js
let z = { a: 3, b: 4 };
let n = { ...z }; // 对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中
n // { a: 3, b: 4 }
```

**mapState函数结合对象的扩展运算符运算符使用 对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。为什么要用扩展运算符呢，我们观察到上面直接将mapState函数的返回值赋给computed对象的话，那么computed中就只有对vuex状态的获取，而没有了当前组件的局部状态，比如tempCountPlusTempCount2就没地方放了，所以我们用扩展运算符。**

```js
computed:{
    ...mapState({
        count: 'count',  // string    映射 this.count 为 store.state.count的值
        // 箭头函数可使代码更简练
        name: (state) => state.name, // function   映射 this.name 为 store.state.name的值
        nameAlias: 'name', // string   映射 this.nameAlias 为 store.state.name的值
        countplustempcount: function (state) { // 用普通函数this指向vue实例,但是在箭头函数中this就不是指向vue实例了，所以这里必须用普通哈数
          return this.tempcount + state.count
        },
        countplustempcount2 (state) {
          return this.tempcount2 + state.count
        } 
    })
}
```

**接收数组写法：**

> 当映射的**计算属性的名称**与 **state 的子节点名称相同**时，我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count',
  'name'
])
```

**等同于:**

```js
computed: {
    count () {
       return this.$store.state.count
    },
    name () {
        return this.$store.state.name
    }
}
```

## 3、核心概念 - mutations

> 用来提供修改数据的方法

像**案例1的写法其实是错误**的，没有遵循单向数据流，但是因为开启检查错误需要消耗大量性能所以vue没有检查，可以手动开启，在Vuex的构造函数里`strict: true`

![image-20231030153054550](/Vuex入门/image-20231030153054550.png)

定义mutations对象：

![image-20231030154729373](/Vuex入门/image-20231030154729373.png)

### 3.1 案例1：

store仓库：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    title: 'state标题',
    count: 0
  },
  getters: {
  },
  mutations: {
    addCount1 (state) {
      state.count += 1
    },
    addCount5 (state) {
      state.count += 5
    },
    reduceCount1 (state) {
      state.count -= 1
    }

  },
  actions: {
  },
  modules: {
  }
})

```

App：

```js
<template>
  <div id="app">
    <div>
      <h2>
        根组件
        - {{ $store.state.title }}
        - {{ $store.state.co }}
      </h2><label></label>
      <input type="text">
      <Son1Vue></Son1Vue>
      <Son2Vue></Son2Vue>
    </div>
  </div>
</template>
<script>
import Son1Vue from './components/Son1.vue'
import Son2Vue from './components/Son2.vue'

export default {
  components: {
    Son1Vue,
    Son2Vue
  }
}
</script>

<style lang="scss">

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

```

Son1：

```js
<template>
    <div id="Son1">
        <div class="box">
            <h2>son1 子组件</h2>
            从vue中获取的值<label>{{ $store.state.count }}</label>
            <br />
            <button @click="handleAdd1()">值+1</button>
            <button @click="handleAdd5()">值+5</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Son1Com',
  methods: {
    handleAdd1 () {
      this.$store.commit('addCount1')
    },
    handleAdd5 () {
      this.$store.commit('addCount5')
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
    border: 3px solid #ccc;
    width: 400px;
    padding: 10px;
    margin: 20px;
}

h2 {
    margin-top: 10px;
}
</style>

```

Son2：

```js
<template>
    <div id="Son2">
        <div class="box">
            <h2>son2 子组件</h2>
            从vue中获取的值<label>{{ $store.state.count }}</label>
            <br />
            <button @click="reducu()">值-1</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Son2Com',
  methods: {
    reducu () {
      this.$store.commit('reduceCount1')
    }
  }
}
</script>

<style scoped>
.box {
    border: 3px solid #ccc;
    width: 400px;
    padding: 10px;
    margin: 20px;
}

h2 {
    margin-top: 10px;
}
</style>

```

###  3.2传参

![image-20231030160614035](/Vuex入门/image-20231030160614035.png)

> 如果要传递多个参数需要传递对象

**双向绑定**

![image-20231030161204458](/Vuex入门/image-20231030161204458.png)

![image-20231030161535218](/Vuex入门/image-20231030161535218.png)

![image-20231030161511523](/Vuex入门/image-20231030161511523.png)

### 3.3 函数简化访问(MapMutations)

![image-20231030161823661](/Vuex入门/image-20231030161823661.png)

## 4、核心概念 - actions

![image-20231030162435064](/Vuex入门/image-20231030162435064.png)

![image-20231030162534593](/Vuex入门/image-20231030162534593.png)

> actions里的方法的第一个参数`context`指的是整个，

### 4.1 辅助函数（MapActions）

![image-20231030162707979](/Vuex入门/image-20231030162707979.png)

#### tips:可以同时传多个Map映射：![image-20231030162734473](/Vuex入门/image-20231030162734473.png)

## 5、核心概念-getters

![image-20231030163056017](/Vuex入门/image-20231030163056017.png)

## 6、核心概念-模块 module（进阶语法）

![image-20231030163353398](/Vuex入门/image-20231030163353398.png)

### 6.1模块创建

![image-20231030163613372](/Vuex入门/image-20231030163613372.png)

user.js

```js
const state = {}
const mutations = {}
const actions = {}
const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}

```

### 6.2 module中`state`的访问方法

![image-20231030171032059](/Vuex入门/image-20231030171032059.png)

**访问方式1：**

![image-20231030171205876](/Vuex入门/image-20231030171205876.png)

**访问方式2：**

duser是模块名)

![image-20231030171800176](/Vuex入门/image-20231030171800176.png)

![image-20231030171417641](/Vuex入门/image-20231030171417641.png)

记得给模块加上`namespaced=true`设置为开启(不是`namespace`,记得加个`d`)

![image-20231030171736413](/Vuex入门/image-20231030171736413.png)

**不然会报错**

![image-20231030171953554](/Vuex入门/image-20231030171953554.png)

这样就可以直接访问了

**总结**

![image-20231030172027032](/Vuex入门/image-20231030172027032.png)

### 6.3 module中`getter`的访问方法

![image-20231030172629390](/Vuex入门/image-20231030172629390.png)

**错误示范**

![image-20231030172645287](/Vuex入门/image-20231030172645287.png)

**正确案例**

![image-20231031090625951](/Vuex入门/image-20231031090625951.png)

> getter和state不一样，state是完全通过对象存储的，而getter如下，有两个计算属性，而这个属性带有特殊字符`/`所以如果你想获取需要`obj['属性名']，中括号配合单引号使用

![image-20231031090913765](/Vuex入门/image-20231031090913765.png)

![image-20231031091316174](/Vuex入门/image-20231031091316174.png)

### 6.4 module中的`mutations`的访问方法

![image-20231031102843953](/Vuex入门/image-20231031102843953.png)

### 6.5 module中的`actions`的访问方法

![image-20231031103052790](/Vuex入门/image-20231031103052790.png)

![image-20231031103125244](/Vuex入门/image-20231031103125244.png)

错误写法，（不需要`user/`

![image-20231031103144546](/Vuex入门/image-20231031103144546.png)

正确写法:

![image-20231031103400828](/Vuex入门/image-20231031103400828.png)

![image-20231031103709324](/Vuex入门/image-20231031103709324.png)
