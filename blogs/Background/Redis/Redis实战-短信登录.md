---
title: Redis实战-短信登录
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- Spring 
- SpringBoot 
- redis
categories: 
 - redis
---
# Redis实战-短信登录

## 1、基于Session实现登录

### 1.1 发送短信验证码

![image-20231025165944432](/image-20231025165944432.png)

![image-20231025170339926](/image-20231025170339926.png)

User实体类:

```java
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("tb_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 手机号码
     */
    private String phone;

    /**
     * 密码，加密存储
     */
    private String password;

    /**
     * 昵称，默认是随机字符
     */
    private String nickName;

    /**
     * 用户头像
     */
    private String icon = "";

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;


}

```



Service层：

```java
	@Override
    public Result sendCode(String phone, HttpSession session) {
        //检验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号格式错误");
        }
        //生成验证码
        String code = RandomUtil.randomNumbers(6);
        //保存到session
        session.setAttribute("phone",phone);
        session.setAttribute("code",code);
        //发送验证码
        log.info("验证码发送成功:{}",code);
        return Result.ok();
    }
```

Controller层：

```java
 @PostMapping("code")
    public Result sendCode(@RequestParam("phone") String phone, HttpSession session) {
        return userService.sendCode(phone,session);
    }
```

### 1.2 验证码登录，注册

DTO层：

```java
@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String nickName;
    private String icon;

}
```

Service层：

```java
    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        String cachePhone =(String) session.getAttribute("phone");
        String cacheCode = (String) session.getAttribute("code");
        //验证手机号
        if(!loginForm.getPhone().equals(cachePhone) || loginForm.getPhone().isEmpty()
           || !loginForm.getCode().equals(String.valueOf(cacheCode)) || loginForm.getCode().isEmpty()){
            return Result.fail("验证码错误");
        }
        //判断用户是否存在，存在则直接完成登录，不存在则自动创建用户之后再完成登录
        User user = query().eq("phone", loginForm.getPhone()).one();
        //不存在
        if(user==null){
            user= creatDefaultUser(loginForm.getPhone());
            log.info("user信息{}",user);
        }
        //使用UserDto保护敏感信息
        UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);//hutool工具类，复制user里的数据到UserDTO并返回
        //保存到session中
        session.setAttribute("user",userDTO);
        return Result.ok();
    }

    private User creatDefaultUser(String phone) {
        User user = new User();
        user.setPhone(phone);
        user.setNickName("user_"+RandomUtil.randomString(10));
        save(user);
        return user;
    }
```

ThreadHolder 工具类

> 能够隔离每个线程存入的变量

```java
public class UserHolder {
    private static final ThreadLocal<UserDTO> tl = new ThreadLocal<>();

    public static void saveUser(UserDTO user){
        tl.set(user);
    }

    public static UserDTO getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }
}
```

Controller层(登录)

```java
    /**
     * 登录功能
     * @param loginForm 登录参数，包含手机号、验证码；或者手机号、密码
     */
    @PostMapping("/login")
    public Result login(@RequestBody LoginFormDTO loginForm, HttpSession session){
        return userService.login(loginForm,session);
    }
```

#### 1.2.1 记住登录

拦截器类:

```java
@Component
@Slf4j
public class ProjectInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //获取session
        HttpSession session = request.getSession();
        //获取session的用户
        UserDTO user = (UserDTO) session.getAttribute("user");
        log.info("用户信息{}",user);
        //判断用户是否存在
        if(user==null){
            //不存在,拦截
            response.setStatus(401);
            return false;
        }
        //存在，保存信息到ThreadLocal
        UserHolder.saveUser(user);
        return true;
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}
```

拦截器配置类:

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    private final ProjectInterceptor projectInterceptor;
    @Autowired
    public WebMvcConfig(ProjectInterceptor projectInterceptor) {
        this.projectInterceptor = projectInterceptor;
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(projectInterceptor).addPathPatterns("/**")			// 最起码要排除登录路径吧
                .excludePathPatterns(
                        "/user/code/**",
                        "/user/login/**",
                        "/shop/**",
                        "/shop-type/**",
                        "/blog/hot/**",
                        "/voucher/**"
                );
    }
}

```

Controller层(记住登录)

```java
    @GetMapping("/me")
    public Result me(){
        UserDTO user =UserHolder.getUser();
        return Result.ok(user);
    }
```

### 1.3 集群间的session共享问题

> 在集群中，每个tomcat服务的session信息是不共享的，所以需要redis来代替session，实现集群session同步

 #### 1.3.1 重设计

**验证码：**不能因为先前设置code到session里，理所应当的认为redis中的键值对也是这样存储的，而是应该**用一个唯一的键来存储对应的验证码，推荐使用手机号作为键**

**用户信息：**推荐使用hash来保存，因为用户信息是json格式键值对，虽然可以直接用**String类型存储**，但是**修改起来性能低**，而且**内存占用大**，所以更推荐用hash

**会话ID：**为了**保证会话的唯一性**，这个无感登录需要重做，tomcat会自动发送session的id给客户端，能够保证会话唯一性，但是用redis就无法帮我们做到，所以需要**手动生成一个token来保证会话唯一性**，**token作为键，用户信息作为值。**

![image-20231026101323869](/image-20231026101323869.png)

#### 1.3.2 代码实现

Service层(发送验证码)

```java
private final StringRedisTemplate stringRedisTemplate;
@Autowired
public UserServiceImpl(StringRedisTemplate stringRedisTemplate) {
    this.stringRedisTemplate = stringRedisTemplate;
}

    @Override
    public Result sendCode(String phone, HttpSession session) {
        //检验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号格式错误");
        }
        //生成验证码
        String code = RandomUtil.randomNumbers(6);
        //保存到redis，键为手机号，值为验证码
        //建议给手机号加个前缀区分业务,因为其他业务可能也用手机号存储,会发生冲突
        //建议设置有效期,一般5分钟
        //像前缀和过期时间建议设置常量,防止其他地方写错，也方便统一修改
        log.info("redis信息{}",stringRedisTemplate);
        stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY+phone,code,Duration.ofMinutes(LOGIN_CODE_TTL));
        //发送验证码
        log.info("验证码发送成功:{}",code);
        return Result.ok();
    }
```

Service层(登录校验)：

```java
    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        String cacheCode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + loginForm.getPhone());
        //验证手机号
        if(RegexUtils.isPhoneInvalid(loginForm.getPhone())){
            return Result.fail("手机号格式错误");
        }
        //验证码验证
        if(!loginForm.getCode().equals(cacheCode) || loginForm.getCode().isEmpty()){
            return Result.fail("验证码错误");
        }
        //判断用户是否存在，存在则存入redis，不存在则自动创建用户之后再存入redis
        User user = query().eq("phone", loginForm.getPhone()).one();
        //不存在
        if(user==null){
            user= creatDefaultUser(loginForm.getPhone());
            log.info("user信息{}",user);
        }
        //使用UserDto保护敏感信息
        UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);//hutool工具类，复制user里的数据到UserDTO并返回
        //对象转map
        Map<String, Object> userMap = BeanUtil.beanToMap(userDTO);
        //解决long类型id无法自动转为String的问题
        userMap.put("id",userDTO.getId().toString());
        //保存到redis中
        //生成UUID,随机token
        String token = UUID.randomUUID().toString(true);
        //存到redis为hash类型,键为token,值为dto信息
        stringRedisTemplate.opsForHash().putAll(LOGIN_USER_KEY+token,userMap);
        //建议设置有效期,并且只要用户还在在线,能发送请求,就必须刷新有效期为30分钟,需要在拦截器里设置
        stringRedisTemplate.expire(LOGIN_USER_KEY+token,Duration.ofMinutes(LOGIN_USER_TTL));
        //返回值里填token,这样前端才能存储token发送请求
        return Result.ok(token);
    }
```

拦截器：

```java
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //获取请求头中的token,前端发的请求头叫这个"authorization"
        String token = request.getHeader("authorization");
        //判断token是否存在
        if (StrUtil.isBlank(token)) {
            //不存在,拦截
            response.setStatus(401);
            return false;
        }
        //基于token获取redis中的用户
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(LOGIN_USER_KEY + token);
        //判断用户是否存在
        if (userMap.isEmpty()) {
            //不存在,拦截
            response.setStatus(401);
            return false;
        }
        //将从redis查到的hash数据转换为对象
        UserDTO user = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
        //存在，保存信息到ThreadLocal
        UserHolder.saveUser(user);
        //刷新token有效期
        stringRedisTemplate.expire(LOGIN_USER_KEY + token, Duration.ofMinutes(LOGIN_USER_TTL));
        return true;
    }
```

> 像前缀和过期时间建议**设置常量**,防止**其他地方写错**，也方便统一修改

常量类：

```java
package com.hmdp.utils;

public class RedisConstants {
    public static final String LOGIN_CODE_KEY = "login:code:";
    public static final Long LOGIN_CODE_TTL = 2L;
    public static final String LOGIN_USER_KEY = "login:token:";
    public static final Long LOGIN_USER_TTL = 30L;
    public static final Long CACHE_NULL_TTL = 2L;
    public static final Long CACHE_SHOP_TTL = 30L;
    public static final String CACHE_SHOP_KEY = "cache:shop:";
    public static final String LOCK_SHOP_KEY = "lock:shop:";
    public static final Long LOCK_SHOP_TTL = 10L;
    public static final String SECKILL_STOCK_KEY = "seckill:stock:";
    public static final String BLOG_LIKED_KEY = "blog:liked:";
    public static final String FEED_KEY = "feed:";
    public static final String SHOP_GEO_KEY = "shop:geo:";
    public static final String USER_SIGN_KEY = "sign:";
}
```

#### **1.3.3 token时间刷新问题**

> 现在拦截器只拦截需要登录的部分，如果用户一直访问的不需要登录的部分，那么则会突然断开登录

解决：再新增一个拦截器，默认放行，只执行新增

拦截器1:

```java
@Component
public class RefreshTokenInterceptor implements HandlerInterceptor {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("authorization");
        //不存在则直接放行
        if(token==null){
            return true;
        }
        //基于token获取redis中的用户
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(LOGIN_USER_KEY + token);
        //不存在则直接放行
        if(userMap.isEmpty()){
            return true;
        }
        //将从redis查到的hash数据转换为对象
        UserDTO user = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
        //存在，保存信息到ThreadLocal
        UserHolder.saveUser(user);
        //刷新token有效期
        stringRedisTemplate.expire(LOGIN_USER_KEY + token, Duration.ofMinutes(LOGIN_USER_TTL));
        return true;
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}

```

拦截器2:

```java
@Component
@Slf4j
public class LoginInterceptor implements HandlerInterceptor {
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //通过ThreadLocal获取redis中的用户
        UserDTO user =UserHolder.getUser();
        //判断用户是否存在
        if (user==null) {
            //不存在,拦截
            response.setStatus(401);
            return false;
        }
        //有用户,放行
        return true;
    }
}
```

配置类:

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    private final LoginInterceptor loginInterceptor;
    private final RefreshTokenInterceptor refreshTokenInterceptor;
    @Autowired
    public WebMvcConfig(LoginInterceptor loginInterceptor, RefreshTokenInterceptor refreshTokenInterceptor) {
        this.loginInterceptor = loginInterceptor;
        this.refreshTokenInterceptor = refreshTokenInterceptor;
    }
    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(refreshTokenInterceptor).addPathPatterns("/**");
        registry.addInterceptor(loginInterceptor).addPathPatterns("/**")
                .excludePathPatterns(
                        "/user/code/**",
                        "/user/login/**",
                        "/shop/**",
                        "/shop-type/**",
                        "/blog/hot/**",
                        "/voucher/**"
                );
    }
}
```

