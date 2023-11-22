(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{454:function(s,t,e){"use strict";e.r(t);var n=e(2),r=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"哨兵模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#哨兵模式"}},[s._v("#")]),s._v(" 哨兵模式")]),s._v(" "),t("blockquote",[t("p",[s._v("虽然主从模式已经提高了可用性，但是如果主节点宕机了还是要手动提升从节点为主节点，这样离高可用还是差远了，哨兵模式就是自动实现故障转移的解决方案")])]),s._v(" "),t("p",[s._v("哨兵会以一个独立进程运行在redis集群中")]),s._v(" "),t("p",[s._v("一般会配置三个哨兵节点，他们自己会选举领导者")]),s._v(" "),t("p",[s._v("主要执行下面几个功能：")]),s._v(" "),t("ul",[t("li",[t("strong",[s._v("监控：不断的发送命令来检查redis节点是否正常")])]),s._v(" "),t("li",[t("strong",[s._v("通知：如果某个节点出现问题,哨兵就会通过发布订阅模式来通知其他节点")])]),s._v(" "),t("li",[t("strong",[s._v("自动故障转移：当主节点不能正常工作时，自动将一个节点提升为新的主节点，然后再将其他的从节点指向新的主节点")])])]),s._v(" "),t("h2",{attrs:{id:"配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#配置"}},[s._v("#")]),s._v(" 配置")]),s._v(" "),t("blockquote",[t("p",[s._v("先在redis集群中先配置一个redis节点作为哨兵节点")])]),s._v(" "),t("p",[s._v("可以使用"),t("code",[s._v("redis-sentinel 配置文件")]),s._v("来启动哨兵节点，需要添加一个配置文件"),t("code",[s._v("sentinel.conf")])]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("sentinel monitor master host port 1\n#这里的master是监控的主节点名称,可以自己定义\n#最后的1表示只要一个哨兵节点同意就可以进行故障转移\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])])])}),[],!1,null,null,null);t.default=r.exports}}]);