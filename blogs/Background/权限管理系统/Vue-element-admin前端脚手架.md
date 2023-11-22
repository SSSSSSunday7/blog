---
title: Vue-element-admin前端脚手架
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- vue-element-admin
categories: 
 - Vue
---
# Vue-element-admin前端脚手架

## 登录页面

> `/views/login/index.vue`

![image-20231106092509740](/Vue-element-admin前端脚手架/image-20231106092509740.png)

无关紧要的组件

```js
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
```

## 1、去除mock

### 1.1**`vue.config.js`中**

**去除该段，配置一个代理**

![image-20231106103522193](/Vue-element-admin前端脚手架/image-20231106103522193.png)

```js
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8089/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
```

### 1.2 **`main.js`中**

```js
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
```

> 把它注释掉

### 1.3 重写`src/util`的`request.js`

```js
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    console.log(config)
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
  // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
// 50008: Illegal token; 50012: Other clients logged in; 50014: Token
// response interceptor
service.interceptors.response.use(
  /**
  * If you want to get http information such as headers or status
  * Please return response => response
  */
  /**
  * Determine the request status by custom code
  * Here is just an example
  * You can also judge the status by HTTP Status Code
  */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 50200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token
      if (res.code === 50404) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消以留在此页面，也可以重新登录', '确认注销', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 请求方法
const http = {
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  },
  getRestApi(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        console.log(key)
        console.log(params[key])
        if (Object.prototype.hasOwnProperty.call(params, key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      _params = _params.suxbstr(0, _params.length - 1)
    }
    console.log(_params)
    if (_params) {
      return service.get(`${url}${_params}`)
    } else {
      return service.get(url)
    }
  },
  delete(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
      _params = ''
    } else {
      _params = '/'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
          _params += `${params[key]}/`
        }
      }
      _params = _params.substr(0, _params.length - 1)
    }
    if (_params) {
      return service.delete(`${url}${_params}`).catch(err => {
        Message.error(x.msg)
        return Promise.reject(err)
      })
    } else {
      return service.delete(url).catch(err => {
        Message.error(err.msg)
        return Promise.reject(err)
      })
    }
  },
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  login(url, params) {
    return service.post(url, params, {
      transformRequest: [(params) => {
        return qs.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}
export default http

```

### 1.4  修改`src/api/user.js`

```js
import http from '@/utils/request'
/**
* 用户登录
* @returns
*/
export async function login(data) {
  return await http.login('/api/user/login', data)
}
/**
* 获取用户信息和权限信息
* @returns
*/
export async function getInfo() {
  return await http.get('/api/sysUser/getInfo')
}
/**
* 退出登录
* @returns
*/
export async function logout(param) {
  return await http.post('/api/sysUser/loginOut', param)
}

```

### 1.5 **编写后端退出端口**

```java

/**
* 用户退出
* @param request
* @param response
* @return
*/
@PostMapping("/logout")
public Result logout(HttpServletRequest request, HttpServletResponse response) {
//获取token
String token = request.getParameter("token");
//如果没有从头部获取token，那么从参数里面获取
if (ObjectUtils.isEmpty(token)) {
token = request.getHeader("token");
}
//获取用户相关信息
Authentication authentication =
SecurityContextHolder.getContext().getAuthentication();
if (authentication != null) {
//清空用户信息
new SecurityContextLogoutHandler().logout(request, response,
authentication);
//清空redis里面的token
String key = "token_" + token;
redisService.del(key);
}
return Result.ok().message("用户退出成功");
}
```



### 1.6 **修改.env.development和.env.production请求地址**

```js
VUE_APP_BASE_API = 'http://localhost:9999/'
```

> 改成自己的后端地址就行

### 1.7 **修改`src/store/modules/user.js`**

```js
const actions = {
  // 用户登录
  login({ commit }, userInfo) {
  // 从用户信息userInfo中解构出用户名和密码
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 调用src/api/user.js文件中的login()方法
      login({ username: username.trim(), password: password }).then(response => {
        // 从response中解构出返回的token数据
        const { token } = response
        // 将返回的token数据保存到store中，作为全局变量使用
        commit('SET_TOKEN', token)
        // 将token信息保存到cookie中
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

```

> 其实只改了token的键名

### 1.8 **编写退出登录接口`src/api/user.js`**

```js
/**
* 退出登录
* @returns
*/
export async function logout(param) {
  return await http.post('/api/user/logout', param)
}
```

### 1.9 **编写清空sessionStorage方法 在`src/utils/auth.js`中添加如下方法：**

```js
/**
* 清空sessionStorage
*/
export function clearStorage(){
return sessionStorage.clear();
}
```

### 1.10**修改`src/layout/component/Navbar.vue`**

把原来的`layout()`

```js
async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
```

改为

```js
    logout() {
      this.$confirm('确定退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 请求参数
        const params = { token: getToken() }
        // 发送退出请求
        const res = await logout(params)
        // 判断是否成功
        if (res.success) {
          // 清空token
          removeToken()
          clearStorage()
          // 跳转到登录页面
          window.location.href = '/login'
        }
      })
    }
```

### 1.11 在`src/utils`包下创建`myconfirm.js`文件

```js
import { MessageBox } from 'element-ui'
// 删除弹框
export default function myconfirm(text) {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(text, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  }).catch(() => {
  })
}

```

### 1.12 封装信息确认提示框，在src/utils目录下创建myconfirm.js文件

```js
import { MessageBox } from 'element-ui'
// 删除弹框
export default function myconfirm(text) {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(text, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  }).catch(() => {
  })
}
```

在main.js中加入

```js
import myconfirm from '@/utils/myconfirm'

Vue.prototype.$myconfirm = myconfirm
```

## 2 、动态路由菜单

往`src/api/user.js`里添加

```js
/**
* 获取菜单数据
*/
export async function getMenuList(){
return await http.get("/api/sysUser/getMenuList");
}
```

找到`src/store/permission.js`的`generateRoutes()`

`*import* { asyncRoutes, constantRoutes } *from* '@/router'`

其中`asyncRoutes`表示实时路由信息，重要信息格式和实体类应该是对应的，根据用户拥有的权限来生成

`constantRoutes`是表示不变的路由信息

```js
generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getMenuList().then(
        res => {
          console.log(res.data)
          // 存放的路由表
          let accessedRoutes
          // 判断成功
          if (res.code === 50200) {
            console.log(res.data)
            accessedRoutes = filterAsyncRoutes(res.data, roles)
          }
          // 将信息保存到store中
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      ).catch(
        err => {
          reject(err)
        }
      )
    })
  }
```

在`src/store/permission.js`里导入`import Layout from '@/layout'`

找到`src/store/permission.js`的**`filterAsyncRoutes()`**

修改为

```js
/**
 * Filter asynchronous routing tables by recursion
 * 动态生成路由信息
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // 判断是否有权限
    if (hasPermission(roles, tmp)) {
      // 获取该路由对应的组件
      const component = tmp.component
      // 先判断是否存在组件
      if (route.component) {
        // 再判断是否为根组件
        if (component === 'Layout') {
          tmp.component = Layout
        } else {
          // 获取对应的组件信息
          // 按照懒加载路由的格式导入的
          tmp.component = (resolve) => require([`@/views${component}`], resolve)
        }
      }
      // 判断是否有子菜单
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  console.log(res)
  return res
}
```

删除`src/router/index.js`中`constantRoutes`不需要的路由信息

## 3、部门管理

因为前端有需求，需要有能展开的部门列表

后端`department`实体类新增属性"子部门"，"是否展开"

```java
/**
* 是否展开
*/
@TableField(exist = false)
private Boolean open;
/**
* 子部门
*/
@TableField(exist = false)
private List<Department> children = new ArrayList<Department>();
```

部门树工具类

```java
/**
 * 生成部门树
 */
public class DepartmentTree {

    public static List<Department> makeDepartmentTree(List<Department> departments,Long pid){
        //保存部门信息表
        ArrayList<Department> departmentList = new ArrayList<>();
        //判断部门列表是否未空,如果不为空则使用部门列表,否则创建一个新的集合对象
        Optional.ofNullable(departments).orElse(new ArrayList<>())
                .stream().filter(item -> item != null && Objects.equals(item.getPid(), pid))
                .forEach(item ->{
                    Department department= new Department();
                    //复制属性
                    BeanUtils.copyProperties(item,department);
                    //读取每个item的子部门,递归生成部门树
                    List<Department> children = makeDepartmentTree(departmentList , item.getPid());
                    department.setChildren(children);
                    departmentList.add(department);
                });
        return departmentList;
    }
}
```

部门服务类

```java
/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author sunday
 * @since 2023-11-01
 */
@Service
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, Department> implements IDepartmentService {
    @Resource
    private UserMapper userMapper;

    /**
     * 查询部门列表
     *
     * @param departmentQueryVo
     * @return
     */
    @Override
    public List<Department> findDepartmentList(DepartmentQueryVo departmentQueryVo) {
        QueryWrapper<Department> queryWrapper =new QueryWrapper<>();
        // 根据部门名称来查找
        queryWrapper.like(ObjectUtils.isEmpty(departmentQueryVo.getDepartment()),"department_name",departmentQueryVo.getDepartment());
        // 并且排序
        queryWrapper.orderByAsc("order_num");
        // 查询部门列表
        List<Department> departments =baseMapper.selectList(queryWrapper);
        // 生成部门树并返回
        return DepartmentTree.makeDepartmentTree(departments,0L);
    }

    /**
     * 查询上级部门列表
     *
     * @return
     */
    @Override
    public List<Department> findParentDepartment() {
        QueryWrapper<Department> queryWrapper =new QueryWrapper<>();
        queryWrapper.orderByAsc("order_num");
        // 查询部门列表
        List<Department> departments =baseMapper.selectList(queryWrapper);
        // 创建部门对象
        Department department = new Department();
        department.setId(0L);
        department.setDepartment("顶级部门");
        department.setPid(-1L);

        List<Department> departmentTree = DepartmentTree.makeDepartmentTree(departments, -1L);
        departments.add(department);

        return departmentTree;
    }

    /**
     * 判断部门下是否有子部门
     *
     * @param id
     * @return
     */
    @Override
    public boolean hasChildrenOfDepartment(Long id) {
        //创建条件构造器对象
        QueryWrapper<Department> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("pid",id);
        //如果数量大于0，表示存在
        return baseMapper.selectCount(queryWrapper) > 0;
    }

    /**
     * 判断部门下是否存在用户
     *
     * @param id
     * @return
     */
    @Override
    public boolean hasUserOfDepartment(Long id) {
        //创建条件构造器对象
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("department_id",id);
        //如果数量大于0，表示存在
        return userMapper.selectCount(queryWrapper) > 0;
    }
}
```

Controller层

```java
@RestController
@RequestMapping("/api/department")
public class DepartmentController {
    @Resource
    private DepartmentServiceImpl departmentService;

    /**
     * 查询部门列表
     *
     * @param departmentQueryVo
     * @return
     */
    @GetMapping("/list")
    public Result list(DepartmentQueryVo departmentQueryVo) {
        //调用查询部门列表方法
        List<Department> departmentList =
                departmentService.findDepartmentList(departmentQueryVo);
        //返回数据
        return Result.ok(departmentList);
    }

    /**
     * 查询上级部门列表
     *
     * @return
     */
    @GetMapping("/parent/list")
    public Result getParentDepartment() {
        //调用查询上级部门列表方法
        List<Department> departmentList =
                departmentService.findParentDepartment();
        //返回数据
        return Result.ok(departmentList);
    }

    /**
     * 添加部门
     *
     * @param department
     * @return
     */
    @PostMapping("/add")
    public Result add(@RequestBody Department department) {
        if (departmentService.save(department)) {
            return Result.ok(null, "部门添加成功");
        }
        return Result.fail(ERR_CODE, "部门添加失败");
    }

    /**
     * 修改部门
     *
     * @param department
     * @return
     */
    @PutMapping("/update")
    public Result update(@RequestBody Department department) {
        if (departmentService.updateById(department)) {
            return Result.ok(null, "部门修改成功");
        }
        return Result.fail(ERR_CODE, "部门修改失败");
    }

    /**
     * 查询某个部门下是否存在子部门
     *
     * @param id
     * @return
     */
    @GetMapping("/check/{id}")
    public Result check(@PathVariable Long id) {
        //调用查询部门下是否存在子部门的方法
        if (departmentService.hasChildrenOfDepartment(id)) {
            return Result.fail(EXIST_ERR_CODE, "该部门下存在子部门，无法删除");
        }
        //调用查询部门下是否存在用户的方法
        if (departmentService.hasUserOfDepartment(id)) {
            return Result.fail(EXIST_ERR_CODE, "该部门下存在用户，无法删除");
        }
        return Result.ok();
    }

    /**
     * 删除部门
     *
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Long id) {
        if (departmentService.removeById(id)) {
            return Result.ok("部门删除成功");
        }
        return Result.fail(ERR_CODE, "部门删除失败");
    }

}
```

