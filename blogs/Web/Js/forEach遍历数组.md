---
title: forEach()、filter()、解构案例
sidebar: 'auto' date: 2023-11-19
tags:
 - js 
 - es6
categories: 
 - js
---

# forEach()、filter()、解构案例

## forEach()语法

> 适合遍历数组对象

```js
arr.forEach(function(当前元素,元素索引号){})
```

当前元素参数必写，索引号可选

## filter() 语法

> 对符合条件的元素生成新数组返回

```js
arr.filter(function(当前元素,元素索引号){return boolean})
```

当前元素参数必写，索引号可选

如果回调函数返回的是true则将当前元素加入新数组，false则不加

## 解构案例

JSON数据格式

```json
{
    "success": true,
    "errorMsg": null,
    "data": [
        {
            "id": "100",
            "clubName": "篮球社团",
            "department": "信息学院",
            "head": "李四",
            "auditStatus": "pass",
            "phone": "15888889999"
        },
        {
            "id": "101",
            "clubName": "围棋社",
            "department": "电气学院",
            "head": "李四",
            "auditStatus": "waiting",
            "phone": "15888889999"
        },
     ]
}
```



HTML代码：

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Access-Control-Allow-Origin" content="*" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/1.5.0/axios.js"></script>
    <!-- 记得导入axios -->
</head>

<body>
    <table class="table">
        <thead id="table-head">
            <tr>
                <th>编号</th>
                <th>社团名</th>
                <th>院系</th>
                <th>负责人</th>
                <th>手机号</th>
            </tr>
        </thead>
        <tbody id="table-body">
            <!-- <tr>
                <th scope="row">${编号}</th>
                <td>${社团名}</td>
                <td>${院系}</td>
                <td>${负责人}</td>
                <td>${手机号}</td>
            </tr> -->
        </tbody>
    </table>
</body>
</html>
```

JS代码：

```js
		function getdata() {
            axios.get("http://localhost:9000/club")
                .then(res => {
                    let tbody = document.querySelector("#table-body")
                    let {data:{data:datas}}=res;//datas = res.data.data;一样的
                	//写复杂了,data没必要写成"data:datas",主要是为了重命名解构出来的变量
                    datas.forEach(item => {
                        let {id,clubName,department,head,phone}=item
                        //记得写+=
                        tbody.innerHTML += 
                        `<tr>
                            <th scope="row">${id}</th>
                            <td>${clubName}</td>
                            <td>${department}</td>
                            <td>${head}</td>
                            <td>${phone}</td>
                        </tr>`
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
        getdata();
   
```

