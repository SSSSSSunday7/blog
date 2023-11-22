(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{439:function(t,r,a){"use strict";a.r(r);var s=a(2),e=Object(s.a)({},(function(){var t=this,r=t._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"hyperloglog"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#hyperloglog"}},[t._v("#")]),t._v(" HyperLogLog")]),t._v(" "),r("blockquote",[r("p",[t._v("HyperLogLog是一种用来做基数统计的算法，并不是redis独有的")])]),t._v(" "),r("h2",{attrs:{id:"用处"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#用处"}},[t._v("#")]),t._v(" 用处")]),t._v(" "),r("p",[r("em",[r("strong",[t._v("基数的概念")])]),t._v("：如果集合中每个元素都是唯一且不重复的，那么这个集合的基数就是集合中元素的个数，如果"),r("strong",[t._v("一个集合有多个相同的数，也只算一个基数")])]),t._v(" "),r("p",[r("strong",[t._v("HyperLogLog就是用来计算这个基数的")])]),t._v(" "),r("h2",{attrs:{id:"原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),r("p",[t._v("通过随机算法来计算技术，会有一定误差，但是占用内存小，适合精确度要求不高的情况，而且统计量非常大的工作。")]),t._v(" "),r("p",[t._v("比如统计某个网站的uv，统计某个词的搜索次数...")]),t._v(" "),r("h2",{attrs:{id:"用法"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#用法"}},[t._v("#")]),t._v(" 用法")]),t._v(" "),r("p",[t._v("命令都以PF开头")]),t._v(" "),r("h3",{attrs:{id:"_1、添加"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1、添加"}},[t._v("#")]),t._v(" 1、添加")]),t._v(" "),r("p",[r("code",[t._v("PFADD key 元素1 元素2 元素3...")])]),t._v(" "),r("h3",{attrs:{id:"_2、统计"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2、统计"}},[t._v("#")]),t._v(" 2、统计")]),t._v(" "),r("p",[r("code",[t._v("PFCOUNT key")])]),t._v(" "),r("h3",{attrs:{id:"_3、合并多个hyperloglog"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3、合并多个hyperloglog"}},[t._v("#")]),t._v(" 3、合并多个HyperLogLog")]),t._v(" "),r("p",[r("code",[t._v("PFMERGE 返回的集合 集合1 集合2 ...")])])])}),[],!1,null,null,null);r.default=e.exports}}]);