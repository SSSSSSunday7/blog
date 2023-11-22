---
title: Spring Security入门
sidebar: 'auto' date: 2023-11-19
tags:
- SpringSecurity 
- Spring
categories: 
 - SpringSecurity
---
# Spring Security入门

## 1、导入依赖

在springboot项目构造器中加入Spring security依赖

通过构造器菜单中的Security->Spring Security来选择

+ 在导入依赖后,web项目在访问资源的时候会自动生成一个登录页面
+ 如果不配置账号密码，则账号是user，密码会在控制台里生成
+ 配置账号密码如下

```properties
spring.security.user.name=sunday
spring.security.user.password=123456
```

## 2、SpringSecurity的基本组件,流程分析

+ Spring Security**通过一系列的过滤器**完成了用户身份认证及其授权工作，每个过滤器都有不同分工。
+ 然这些过滤器**并不是全部都一起工作**，而是根据我们**需要**什么功能，才会**选取对应的过滤器**加入。
  当然这些过滤器**并不是直接加入web的过滤器**中，而是通过一个**过滤器代理**完成。
+ web过滤器中**只会加入一个或多个过滤器代理**，然后由这些**代理负责管理哪些Security Filter需要加入**进来。

### 2.1 组件介绍

 #### 2.1.1 `Authentication(Principal)`

封装用户身份信息，顶层接口，主要实现如下

+ `AbstractAuthenticationToken()`
  + `RememberMeAuthenticationToken` remember Me登陆后封装的身份信息
  +  `UsernamePasswordAuthenticationToken `用户名密码登录后封装的身份信息

#### 2.1.2 `AuthenticationManager`
身份认证器的代理，主要负责多个认证器的代理，管理多个`AuthenticationProvider`,主要实现如下

+ `ProviderManager (authenticate)`

#### 2.1.3 `AuthenticationProvider`

+ 真正实现认证工作，多个provider受`AuthenticationManager`管理，主要实现如下

+ `AbstractUserDetailsAuthenticationProvider`
  + `DaoAuthenticationProvide`
  + `RememberMeAuthenticationProvider`

####  2.1.4 `UserDetailsService`
负责定义用户信息的来源，从不同来源加载用户信息，唯一的方法: `loadUserByUsername`，主要实
类:

+ `UserDetailsManager`
  + `InMemoryUserDetailsManager`
  + `JdbcUserDetailsManager`

+ 自定义

#### 2.1.5 `UserDetails`
定义用户身份信息，比Authentication 信息更详细，主要实现

+ User

一般我们自定义

#### 2.1.6 `SecurityContextHolder`

存放和获取用户身份信息的帮助类
#### 2.1.6 `FilterChainProxy`
`Spring Securty Filter`的入口，`FilterChainProxy`管理多个filter

#### 2.1.7 `AbstractHttpConfigurer`

构建所有过滤器的核心组件，主要方法`init()`和`configure()`,

主要实现类

+ `FormLoginConfigurer`
+ `CorsConfigurer`
+ `CsrfConfigurer`
+ `HttpBasicConfigurer`
+ `LogoutConfigurer` ...

### 2.2 认证流程图

![image-20231019094532569](/image-20231019094532569.png)



### 2.3 Security配置类

```java
@Configuration
public class SecurityConfig{
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(//开启权限配置
                auth->{
                    try{
                            auth.anyRequest().authenticated()//所有请求都要验证
                                    .and()//从头开始配置
                                    .formLogin()//开启表单登录,引入表单登录过滤器
                                    .loginPage("/login.html")//自定义登录页面
                                    .loginProcessingUrl("/login")//定义登录提交的接口地址

                                    /*
                                     *  设置登录失败跳转的地址,不携带参数，需要参数可以用
                                     *  .failureForwardUrl("controller层的地址")
                                     */
                                    .failureUrl("/login.html")
                                    /*
                                     *  设置成功时返回的json,
                                     *  如果想设置失败返回的Json可以用
                                     *  .failureHandler(),用法和下面一样
                                     */
                                    .successHandler(new AuthenticationSuccessHandler() {
                                        @Override
                                        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                                            HashMap<String, Object> map =new HashMap<>();
                                            map.put("code",0);
                                            map.put("msg","登录成功");
                                            map.put("data",authentication);
                                            response.setContentType("application/json;charset=utf-8");
                                            try{
                                                response.getWriter().println(JSON.toJSONString(map));
                                            }catch (Exception e){
                                                throw  new RuntimeException(e);
                                            }
                                        }
                                    })
                                    .defaultSuccessUrl("/hello")//设置成功后跳转的地址,要写在successHandler下面
                                    .permitAll()//允许这些地址不需要认证
                                    .and()//从头开始配置
                                    .csrf().disable();//security支持csrf防护.,默认开启,这里需要关闭
                    }catch (Exception e){
                        throw new RuntimeException(e);
                    }
                }
        );
        return http.build();
    }
}
```

## 3、获取登录信息

### 1、SecurityContextHolder

```java
    @RequestMapping("/")//不配置defaultSuccessUrl和successHandler默认登录成功到根目录
    public String loginInfo(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        return JSON.toJSONString(authentication);
    }
```

### 2 、参数里自动注入Authentication

```java
@RequestMapping("/auth")
    public String auth(Authentication authentication){
        return JSON.toJSONString(authentication);
    }
```



### 3、异步线程情况下获取登录信息

在异步线程中拿不到登录信息，这个其实可以通过调整他的策略来实现在异步线程中获取用
户信息。

#### SecurityContextHolder 主要有三种策略:

##### MODE THREADLOCAL

默认策略，使用THREADLOCAL实现，只在当前线程中保存用户信息
##### MODEINHERITABLETHREADLOCAL
支持在多线程中传递用户信息，使用这种策略，当我们启动新线程时，security会将当前线程的用户信
息拷贝一份到新线程中

用法：在虚拟机参数里加上`-Dspring.security,strategy=MODE_INHERITABLETHREADLOCAL`

##### MODE GLOBAL
security将数据保存在一个全局变量中，也能解决多线程问题，一般很少用
如果使用默认策略，在异步线程中获取用户信息，返回为空:

## 4、基于多种方式配置登录用户：memory、jdbc，mybatis

### 基于内存

```java
@Bean
public InMemoryUserDetailsManager inMemoryUserDetailsManager(){
    UserDetails userDetails1 = User.withUsername("memory1").password("{noop}memory1").roles("roles1").build();
    UserDetails userDetails2 = User.withUsername("memory2").password("{noop}memory2").roles("roles2").build();
    return new InMemoryUserDetailsManager(userDetails1,userDetails2);
}
```

> {noop}指的是不加密的形式传递密码

### 基于mybatis

