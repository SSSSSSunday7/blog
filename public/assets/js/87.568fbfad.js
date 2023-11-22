(window.webpackJsonp=window.webpackJsonp||[]).push([[87],{507:function(s,t,a){"use strict";a.r(t);var n=a(2),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"webpack入门"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack入门"}},[s._v("#")]),s._v(" WebPack入门")]),s._v(" "),t("h2",{attrs:{id:"一、创建配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、创建配置"}},[s._v("#")]),s._v(" 一、创建配置")]),s._v(" "),t("blockquote",[t("p",[s._v("先简单的写一个隔行变色的demo")])]),s._v(" "),t("ul",[t("li",[t("p",[s._v("在新项目目录下输入"),t("code",[s._v("npm init -y")]),s._v("，会生成一个"),t("code",[s._v("package.json")])])]),s._v(" "),t("li",[t("p",[s._v("然后新建"),t("code",[s._v("src")]),s._v("目录")])]),s._v(" "),t("li",[t("p",[s._v("在该"),t("code",[s._v("src")]),s._v("中创建"),t("code",[s._v("index.html")]),s._v("和"),t("code",[s._v("index.js")])])]),s._v(" "),t("li",[t("p",[s._v("把html结构写好")])]),s._v(" "),t("li",[t("p",[s._v("运行"),t("code",[s._v("npm install jquery -S")]),s._v("命令安装jQuery")]),s._v(" "),t("blockquote",[t("p",[t("code",[s._v("-S")]),s._v(" 也可以写 "),t("code",[s._v("--save")]),s._v(" ，作用是将安装的依赖添加到"),t("code",[s._v("package.json")]),s._v("的"),t("code",[s._v("dependencies")]),s._v("下（不写也会加入）")]),s._v(" "),t("p",[s._v("这时项目中会出现node_modules文件夹，和"),t("code",[s._v("package-lock.json")])])])]),s._v(" "),t("li",[t("p",[s._v("通过ES6模块化导入jQuery")]),s._v(" "),t("blockquote",[t("p",[s._v("在index.js中写入"),t("code",[s._v("import $ from 'jqeury'")])]),s._v(" "),t("p",[s._v("但是import是es6的语法，浏览器不一定支持，所以需要 使用webpack")])]),s._v(" "),t("ul",[t("li",[t("p",[s._v("安装webpack "),t("code",[s._v("npm install webpack webpack-cli -D")]),s._v("或者"),t("code",[s._v("yarn add webpack webpack-cli --dev")])]),s._v(" "),t("blockquote",[t("p",[s._v("这里的-D是"),t("code",[s._v("--save-dev")]),s._v("的简写，是指将安装的依赖加入devDependencies，也就是开发依赖，并不会加入常规的dependencies")])])])]),s._v(" "),t("p",[t("strong",[s._v("以上步骤和webpack没关系")])])]),s._v(" "),t("li",[t("p",[s._v("实现隔行变色")]),s._v(" "),t("div",{staticClass:"language-javascript line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" $ "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("from")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'jquery'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("$")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("$")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'li:odd'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("css")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'background-color'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'red'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("$")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'li:even'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("css")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'background-color'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'pink'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])])])]),s._v(" "),t("h3",{attrs:{id:"_1-1在项目中配置webpack"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-1在项目中配置webpack"}},[s._v("#")]),s._v(" 1.1在项目中配置webpack")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("在项目根目录下创建"),t("code",[s._v("webpack.config.js")]),s._v("的webpack配置文件并如下初始化")]),s._v(" "),t("div",{staticClass:"language-javascript line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("mode")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'development'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//mode用来指定构建模式，可选的有development和production")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])])]),s._v(" "),t("li",[t("p",[s._v("在package.json的script节点中新增dev脚本如下")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])])])]),s._v(" "),t("p",[s._v("然后在终端就可以使用"),t("code",[s._v("yarn run dev")]),s._v("或"),t("code",[s._v("npm run dev")]),s._v("就能运行了。")]),s._v(" "),t("p",[s._v("运行后会在项目根目录下生成一个名为"),t("strong",[s._v("dist")]),s._v("的文件夹，里面的"),t("strong",[s._v("main.js")]),s._v("就是经过webpack处理过的js文件。将html中的路径切换位dist文件夹的main.js即可")]),s._v(" "),t("p",[t("img",{attrs:{src:"/image-20231011235339611.png",alt:"image-20231011235339611"}})]),s._v(" "),t("p",[s._v("终端指出了处理了哪些js文件")]),s._v(" "),t("h2",{attrs:{id:"_1-2-详解development和production模式的区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-详解development和production模式的区别"}},[s._v("#")]),s._v(" 1.2 详解development和production模式的区别")]),s._v(" "),t("h3",{attrs:{id:"一、production模式和development模式的主要差异"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、production模式和development模式的主要差异"}},[s._v("#")]),s._v(" 一、production模式和development模式的主要差异")]),s._v(" "),t("ol",[t("li",[t("p",[s._v("开发环境中，"),t("code",[s._v("source map")]),s._v("是非常全的，这样可以在调试过程中快速定位问题。\n而生产环境中的"),t("code",[s._v("source map")]),s._v("不是那么重要了，就可以更加简洁一些，\n或者生产环境中的"),t("code",[s._v("source map")]),s._v("我们可以生成一个"),t("code",[s._v(".map")]),s._v("文件来进行存储。")])]),s._v(" "),t("li",[t("p",[s._v("开发环境下，我们的代码一般打包生成之后，不需要进行压缩，\n因为在开发环境下，我们希望不压缩代码，\n可以看到打包生成的内容，\n比较明显的看到里边一些具体的说明项；")])])]),s._v(" "),t("blockquote",[t("p",[s._v("可以看到两种模式的打包时间快慢和打包文件大小")])]),s._v(" "),t("ul",[t("li",[s._v("development")])]),s._v(" "),t("p",[t("img",{attrs:{src:"/image-20231012000349443.png",alt:"image-20231012000349443"}})]),s._v(" "),t("ul",[t("li",[s._v("production")])]),s._v(" "),t("p",[t("img",{attrs:{src:"/image-20231012000521296.png",alt:"image-20231012000521296"}})]),s._v(" "),t("p",[s._v("development打包快，文件大，因为没有压缩")]),s._v(" "),t("p",[s._v("production打包慢，文件小")]),s._v(" "),t("p",[s._v("很符合语义，开发环境和生产环境")]),s._v(" "),t("h2",{attrs:{id:"_1-3-webpack的entry和output"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-webpack的entry和output"}},[s._v("#")]),s._v(" 1.3 webpack的entry和output")]),s._v(" "),t("h3",{attrs:{id:"_1-3-1-webpack中的默认约定"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-1-webpack中的默认约定"}},[s._v("#")]),s._v(" 1.3.1 webpack中的默认约定")]),s._v(" "),t("ul",[t("li",[s._v("在webpack4.x和5.x中，有如下约定：\n"),t("ul",[t("li",[s._v("默认打包入口，"),t("em",[s._v("src->index.js")])]),s._v(" "),t("li",[s._v("默认输出路径，"),t("em",[s._v("dist->main.js")])])])])]),s._v(" "),t("blockquote",[t("p",[s._v("可以在webpack.config.js中修改路径")])]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" path "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'path'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//导入node.js中操作路径的模块")]),s._v("\nmodule"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("mode")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'development'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//mode用来指定构建模式，可选的有development和production")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("entry")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./src/index.js'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 打包入口文件路径")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("output")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" \n        "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("path")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./dist'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件的存放路径")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("filename")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"bundle.js"')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件的名称")]),s._v("\n\t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br")])]),t("blockquote",[t("p",[s._v("提一句path.join()")]),s._v(" "),t("p",[s._v("使用path.join()方法，可以把多个路径片段拼接为完整的路径字符串，")]),s._v(" "),t("p",[t("code",[s._v("__dirname")]),s._v("指的是当前目录")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" pathStr1 "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/a'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/b/c'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'../../'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./d'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/e'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nconsole"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("pathStr1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 返回结果 \\a\\b\\e")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("p",[t("strong",[s._v("注意：凡是涉及到路径拼接的操作，都要使用path.join()方法进行处理。不要直接使用+进行字符串的拼接")])])]),s._v(" "),t("h2",{attrs:{id:"_1-4-webpack-dev-server插件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-webpack-dev-server插件"}},[s._v("#")]),s._v(" 1.4 webpack-dev-server插件")]),s._v(" "),t("h3",{attrs:{id:"_1-4-1功能"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-1功能"}},[s._v("#")]),s._v(" 1.4.1功能")]),s._v(" "),t("p",[s._v("每当修改源代码都会自动进行打包和构建")]),s._v(" "),t("blockquote",[t("p",[s._v("该插件会自动生成一个HTTP服务器，通过8080端口访问")]),s._v(" "),t("p",[t("strong",[s._v("注意，只有通过http服务器才能实时看到改变")])])]),s._v(" "),t("h3",{attrs:{id:"_1-4-2-安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-2-安装"}},[s._v("#")]),s._v(" 1.4.2 安装")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("在package.json的script节点中修改dev脚本如下")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack serve"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])])])]),s._v(" "),t("p",[s._v("通过"),t("code",[s._v("yarn run dev")]),s._v("或"),t("code",[s._v("npm run dev")]),s._v("运行")]),s._v(" "),t("p",[s._v("高版本的webpack-dev-server插件需要在webpack.config.js下做如下修改")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("devServer")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t\t"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("static")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"./"')]),s._v("\n\t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("h3",{attrs:{id:"_1-4-3-解决无实时变更问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-3-解决无实时变更问题"}},[s._v("#")]),s._v(" 1.4.3 解决无实时变更问题")]),s._v(" "),t("p",[t("strong",[s._v("注意，只有通过http服务器才能实时看到改变")])]),s._v(" "),t("p",[s._v("该插件会将生成的js文件放到"),t("strong",[s._v("内存")]),s._v("里，相对于html则是在项目根目录，所以应该是在"),t("code",[s._v("../")]),s._v("路径下")]),s._v(" "),t("h2",{attrs:{id:"_1-5-html-webpack-plugin插件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-5-html-webpack-plugin插件"}},[s._v("#")]),s._v(" 1.5 html-webpack-plugin插件")]),s._v(" "),t("p",[s._v("如果你想进入"),t("code",[s._v("localhost:8080")]),s._v("，立刻就看见"),t("code",[s._v("src")]),s._v("下的"),t("code",[s._v("index.html")]),s._v("，不想让路径变成"),t("code",[s._v("localhost:8080/src")]),s._v("，就需要这款插件。")]),s._v(" "),t("p",[s._v("在"),t("code",[s._v("webpack.config.js")]),s._v("中导入")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" HtmlPlugin"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'html-webpack-plugin'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//导入该插件")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//创建HtmlPlugin的实例对象")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" htmlPlugin  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("HtmlPlugin")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("template")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./src/index.html'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//原文件存放路径")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("filename")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./index.html'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//指定生成路径")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br")])]),t("p",[s._v("并在"),t("code",[s._v("module.exports = {}")]),s._v("中加入")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("plugins")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("htmlPlugin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//通过plugins节点使其生效")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])])])}),[],!1,null,null,null);t.default=e.exports}}]);