(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{512:function(_,v,t){"use strict";t.r(v);var e=t(2),a=Object(e.a)({},(function(){var _=this,v=_._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h1",{attrs:{id:"组件间通信"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#组件间通信"}},[_._v("#")]),_._v(" 组件间通信")]),_._v(" "),v("p",[_._v("组件间的"),v("strong",[_._v("数据是独立")]),_._v("的，无法直接访问其他组件的数据")]),_._v(" "),v("blockquote",[v("p",[_._v("参考"),v("em",[_._v("Data是一个函数.md")])])]),_._v(" "),v("p",[_._v("想和其他组件通信需要建立通信")]),_._v(" "),v("h3",{attrs:{id:"_1、父子关系"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1、父子关系"}},[_._v("#")]),_._v(" 1、父子关系")]),_._v(" "),v("p",[_._v("通过"),v("code",[_._v("props")]),_._v("和"),v("code",[_._v("$emit")])]),_._v(" "),v("p",[_._v("非父子用"),v("code",[_._v("provide")]),_._v("和"),v("code",[_._v("inject")]),_._v("或者"),v("code",[_._v("eventbus")])]),_._v(" "),v("p",[_._v("还可以通过vuex解决更复杂的场景")]),_._v(" "),v("h3",{attrs:{id:"_1-1-父传子"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-父传子"}},[_._v("#")]),_._v(" "),v("strong",[_._v("1.1 父传子")])]),_._v(" "),v("p",[v("img",{attrs:{src:"/image-20231012105153984.png",alt:"image-20231012105153984"}})]),_._v(" "),v("p",[v("img",{attrs:{src:"/image-20231012105239506.png",alt:"image-20231012105239506"}})]),_._v(" "),v("ul",[v("li",[v("p",[_._v("在"),v("strong",[_._v("父组件内部")]),_._v("给"),v("strong",[_._v("子组件标签")]),_._v("加上属性"),v("code",[_._v(':属性名="父组件的值"')]),_._v("（父组件的值是父组件所能访问到的值）")])]),_._v(" "),v("li",[v("p",[_._v("子组件通过在"),v("code",[_._v("props :['属性名']")]),_._v("来接收，然后在结构层使用"),v("code",[_._v(_._s(_.属性名))]),_._v("来使用")])])]),_._v(" "),v("h3",{attrs:{id:"_1-2子传父"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-2子传父"}},[_._v("#")]),_._v(" 1.2子传父")]),_._v(" "),v("p",[v("img",{attrs:{src:"/image-20231012110026526.png",alt:"image-20231012110026526"}})]),_._v(" "),v("blockquote",[v("p",[_._v("因为数据是属于父组件的，所以不能直接修改")])]),_._v(" "),v("p",[_._v("每次修改都要通过"),v("code",[_._v("$emit()")]),_._v("事件")]),_._v(" "),v("p",[_._v("如图，父组件中的子组件标签中写一个"),v("code",[_._v("@属性名=父组件的方法")]),_._v("子组件的"),v("code",[_._v('$emit("属性名","需要传的值")')])]),_._v(" "),v("p",[_._v("子组件写一个方法，用来触发"),v("code",[_._v("$emit")]),_._v("，父组件也写一个方法，用来将"),v("code",[_._v("$emit")]),_._v("的第二个参数，也就是子组件传的值赋值给父组件的data值。")])])}),[],!1,null,null,null);v.default=a.exports}}]);