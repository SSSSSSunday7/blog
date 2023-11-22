(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{470:function(_,t,v){"use strict";v.r(t);var a=v(2),s=Object(a.a)({},(function(){var _=this,t=_._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[t("h1",{attrs:{id:"二、架构演进"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、架构演进"}},[_._v("#")]),_._v(" 二、架构演进")]),_._v(" "),t("h2",{attrs:{id:"_1-单体架构"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-单体架构"}},[_._v("#")]),_._v(" 1.单体架构")]),_._v(" "),t("h3",{attrs:{id:"单体项目"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#单体项目"}},[_._v("#")]),_._v(" 单体项目")]),_._v(" "),t("p",[_._v("就是指前后端不分离项目，使用同一个服务器，不好做负载均衡，静态资源和动态资源无法分开，tomcat对静态资源的访问效率不高。")]),_._v(" "),t("p",[t("strong",[_._v("例如")])]),_._v(" "),t("p",[_._v("一个网页有50张图片，那么就要向tomcat发50次请求，效率低")]),_._v(" "),t("h2",{attrs:{id:"_2-前后端分离"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-前后端分离"}},[_._v("#")]),_._v(" 2.前后端分离")]),_._v(" "),t("ul",[t("li",[_._v("指前端和后端分开开发和部署（前端和后端项目在不同服务器上）")]),_._v(" "),t("li",[_._v("优点：对静态资源访问和接口访问分离，tomcat只负责数据服务的访问")])]),_._v(" "),t("h2",{attrs:{id:"_3-集群搭建-分布式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-集群搭建-分布式"}},[_._v("#")]),_._v(" 3.集群搭建（分布式）")]),_._v(" "),t("p",[_._v("通过负载均衡和增加服务器来解决高并发问题")]),_._v(" "),t("p",[_._v("有")]),_._v(" "),t("ul",[t("li",[_._v("应用服务器集群")]),_._v(" "),t("li",[_._v("Redis集群")]),_._v(" "),t("li",[_._v("分布式数据库")])]),_._v(" "),t("p",[_._v("等集群，还涉及到mycat(分布式数据库)，ElasticSearch(数据库检索中间件)，rabbitMQ(消息中间件)")]),_._v(" "),t("h2",{attrs:{id:"_4-分布式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-分布式"}},[_._v("#")]),_._v(" 4.分布式")]),_._v(" "),t("p",[_._v("单纯的集群是增加tomcat服务器和物理硬件性能之类的来解决问题，但是容易出现其他问题。")]),_._v(" "),t("p",[_._v("数据库也有负载均衡服务器：mycat，和nginx的思路差不多")]),_._v(" "),t("p",[_._v("比如数据库的单机锁不生效，当多个线程或者说多个服务器同时访问一个资源，容易出现错误。")]),_._v(" "),t("p",[t("strong",[_._v("例如：")])]),_._v(" "),t("p",[_._v("A、B、C都要购买"),t("em",[_._v("同一种商品")]),_._v("，但是商品只有"),t("em",[_._v("两件")])]),_._v(" "),t("p",[_._v("如果他们"),t("em",[_._v("同时下单")]),_._v("，因为他们被负载均衡到了多个服务器（线程）三个服务器"),t("em",[_._v("同时访问")]),_._v("，则会导致每个人"),t("em",[_._v("都能成功")]),_._v("，因为返回的结果都是还剩"),t("em",[_._v("两件")])]),_._v(" "),t("p",[_._v("这时就需要分布式锁了")]),_._v(" "),t("h2",{attrs:{id:"_4-1基于redis的分布式锁"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-1基于redis的分布式锁"}},[_._v("#")]),_._v(" 4.1基于redis的分布式锁")]),_._v(" "),t("p",[_._v("购买商品之前先在redis中设置一个id，虽说是同时操作，但是一定有时间差，redis的响应是毫秒级的，所以后面的服务器在操作之前发现如果redis中有id存在了，故触发分布式锁。（看视频写的自己的理解，可能有误）")]),_._v(" "),t("h2",{attrs:{id:"_5-微服务"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-微服务"}},[_._v("#")]),_._v(" 5.微服务")]),_._v(" "),t("p",[_._v("功能的增加，必然会导致系统整体出现故障的可能性提高，如果所有的功能都捆绑在一起，那么一个小模块出现故障，会导致整个系统无法正常运行*（就像你写的 java代码但凡一处有错误，整个项目都不能运行）*，所以就出现了微服务，将每个功能都分开部署，进一步解耦合。")]),_._v(" "),t("p",[t("strong",[_._v("更多是解决可用性问题而不是并发问题。")])]),_._v(" "),t("p",[_._v("并且进一步优化了集群，如果你只有一个模块有高并发需求，那么只需要给那一个模块单独做集群就行了。")]),_._v(" "),t("p",[_._v("不过这样会出现一个模块间通信问题，这样的系统设计的更加复杂，对水平要求更高")])])}),[],!1,null,null,null);t.default=s.exports}}]);