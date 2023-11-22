---
title: Security流程
sidebar: 'auto' date: 2023-11-19
tags:
- Spring 
- SpringSecurity
categories: 
 - SpringSecurity
---
# Security流程

## 1、介绍

+ Spring Security是基于Spring生态圈的，用于提供安全访问控制解决方案的框架。Spring Securitv的安全管理有**两个重要概念**，分别是**Authentication (认证)和Authorization(授权)。**
+ 为了方便Spring Boot项目的安全管理，Spring Boot对Spring Security安全框架进行了整合支持，并提供了通用的自动化配置，从而实现了Spring Security安全框架中包含的多数安全管理功能。
+ Spring Security**登录认证主要涉及两个重要的接口 UserDetailService和UserDetails接口。**
+ UserDetailService接口主要定义了一个方法**loadUserByUsername(String usermame)用于完成用户信息的查询**，其中**username就是登录时的登录名称**，登录认证时，需要**自定义一个实现类实现UserDetalService接口**，**完成数据库查询**，该接口**返回UserDetail.**
  UserDetail主要用于**封装认证成功时的用户信息**，即UserDetailService返回的用户信息，可以用Spring自己的User对象，但是**最好是实现UserDetail接口，自定义用户对象。**

## 2、步骤

+ 1.自定UserDetails类:当实体对象字段不满足时需要自定义UserDetails，
  一般都要自定义UserDetails。
+ 2.自定义UserDetailsService类，主要用于从数据库查询用户信息。
+ 3.创建登录认证成功处理器，认证成功后需要返回JSON数据，菜单权限等。
+ 4.创建登录认证失败处理器，认证失败需要返回ISON数据，给前端判断。
+ 5.创建匿名用户访问无权限资源时处理器，匿名用户访问时，需要提示JSON.
+ 6.创建认证过的用户访问无权限资源时的处理器，无权限访问时，需要提示ISON。
+ 7.配置Spring Security配置类，把上面自定义的处理器交给Spring Security

## 3、自定义UserDetails类

当实体对象字段不满足时Spring Security认证时，需要自定义UserDetails。

1. 将User类实现UserDetails接口
2. 将原有的isAccountNonExpired、isAccountNonLocked、isCredentialsNonExpired和isEnabled属性修改成boolean类型，同时添加authorities属性（List类型）
3. 注意: 上述4个属性只能是非包装类的boolean类型属性，且默认值设置为true（改成true调试的时候方便）。

### 3.1 封装UserService方法

```java

public interface IUserService extends IService<User> {

    /**
     * 根据用户名查询用户信息
     * @param userName
     * @return
     */
    User findUserByUserName(String userName);

}
```

```java
@Service
@Transactional
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    /**
     * 根据用户名查询用户信息
     * @param userName
     * @return
     */
    @Override
    public User findUserByUserName(String userName) {
        //创建条件构造器
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        //用户名
        queryWrapper.eq("username",userName);
        //返回查询记录
        return baseMapper.selectOne(queryWrapper);
    }
}

```

### 3.2 自定义UserDetailService

```java
@Component
public class CustomerUserDetailService implements UserDetailsService {
    @Resource
    private UserServiceImpl UserService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =UserService.findUserByUserName(username);
        if(user == null){
            throw new UsernameNotFoundException("用户名或密码错误");
        }
        return user;
    }
}
```

## 4 、四种状态的处理器

### 4.1 创建认证成功处理器

>创建登录认证成功处理器，认证成功后需要返回JSON数据，菜单权限等。

```java
@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        //获取当前登陆信息
        SysUser user = (SysUser) authentication.getPrincipal();
        //转换为JSON格式
        String jsonUser = objectMapper.writeValueAsString(user);
        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(jsonUser.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }   
}
```

### 4.2 创建认证失败处理器

```java
@Component
public class LoginFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        //定义变量,保存异常信息
        String message =null;
        //判断异常类型
        if(exception instanceof AccountExpiredException) {
            message="账户过期登录失败";
        } else if (exception instanceof BadCredentialsException) {
            message="用户名或密码错误,登录失败";
        } else if (exception instanceof CredentialsExpiredException) {
            message ="密码过期,登录失败";
        } else if (exception instanceof DisabledException) {
            message ="账户被禁用,登录失败";
        }else if (exception instanceof LockedException) {
            message ="账户被锁定,登录失败";
        }else if (exception instanceof InternalAuthenticationServiceException) {
            message ="账户不存在,登录失败";
        }else {
            message ="登录失败";
        }
        String result = objectMapper.writeValueAsString(Result.fail(LOGIN_ERR_CODE,message));
        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }
}

```

### 4.3创建已认证用户访问无权限资源时处理器

```java
/**
 * 已认证用户无权限访问
 */@Component
public class CustomerAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        String result = objectMapper.writeValueAsString(Result.fail(AUTH_ERR_CODE, "无权限访问,请联系管理员"));

        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }
}

```

### 4.4 创建匿名用户访问无权限资源时处理器

```java
/**
 * 匿名用户无权限访问
 */
@Component
public class AnonymousAuthenticationHandler implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        String result = objectMapper.writeValueAsString(Result.fail(NOLOGIN_ERR_CODE, "无权限访问,请联系管理员"));

        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }
}

```

## 5、Spring Security配置类（整合处理器）

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final LoginSuccessHandler loginSuccessHandler;
    private final LoginFailureHandler loginFailureHandler;
    private final CustomerAccessDeniedHandler customerAccessDeniedHandler;
    private final AnonymousAuthenticationHandler anonymousAuthenticationHandler;
    private final CustomerUserDetailService userDetailService;

    @Autowired
    public SecurityConfig(LoginSuccessHandler loginSuccessHandler, LoginFailureHandler loginFailureHandler, CustomerAccessDeniedHandler customerAccessDeniedHandler, AnonymousAuthenticationHandler anonymousAuthenticationHandler, CustomerUserDetailService userDetailService) {
        this.loginSuccessHandler = loginSuccessHandler;
        this.loginFailureHandler = loginFailureHandler;
        this.customerAccessDeniedHandler = customerAccessDeniedHandler;
        this.anonymousAuthenticationHandler = anonymousAuthenticationHandler;
        this.userDetailService = userDetailService;

    }
    //加密器
    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.formLogin()
                .loginProcessingUrl("/api/user/login")
                .successHandler(loginSuccessHandler)
                .failureHandler(loginFailureHandler)
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) //不创建session
                .and()
                .authorizeRequests() //设置要拦截的请求
                .antMatchers("/api/user/login").permitAll() //放行的请求
                .anyRequest().authenticated() //其他请求一律进行验证
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(anonymousAuthenticationHandler)
                .accessDeniedHandler(customerAccessDeniedHandler)
                .and()
                .cors();
    }
	//注册自定义的UserDetailService
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailService).passwordEncoder(passwordEncoder());
    }
}
```

## 6、认证成功返回token 

> token是在你登录成功后记录你状态的一个令牌，后续的请求只要携带token就能实现免登录

### 6.1 封装token的返回类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {
    private Long id;
    private int code;
    private String token;
    private Long expireTime;
}

```

### 6.2 token工具类的编写(io.jsonwebtoken的0.9.1版本)

```java
@Component
@Data
@ConfigurationProperties(prefix = "jwt") // ！！！只有加了这个才能在springboot配置文件里配置数据
public class JWTUtils {
    private String secret;
    // 过期时间 毫秒
    private Long expiration;
    /**
     * 从数据声明生成令牌
     * @param claims 数据声明
     * @return 令牌
     */
    private String generateToken(Map<String, Object> claims) {
        Date expirationDate = new Date(System.currentTimeMillis() + expiration);
        return Jwts.builder().setClaims(claims).setExpiration(expirationDate).signWith(SignatureAlgorithm.HS512, secret).compact();
    }
    /**
     * 从令牌中获取数据声明
     * @param token 令牌
     * @return 数据声明
     */
    public Claims getClaimsFromToken(String token) {
        Claims claims;
        try {
            claims =
                    Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            claims = null;
        }
        return claims;
    }
    /**
     * 生成令牌
     *
     * @param userDetails 用户
     * @return 令牌
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>(2);
        claims.put(Claims.SUBJECT, userDetails.getUsername());
        claims.put(Claims.ISSUED_AT, new Date());
        return generateToken(claims);
    }
    /**
     * 从令牌中获取用户名
     *
     * @param token 令牌
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        String username;
        try {
            Claims claims = getClaimsFromToken(token);
            username = claims.getSubject();
        } catch (Exception e) {
            username = null;
        }
        return username;
    }

}
```

**配置文件:**

```yaml
jwt:
  secret: "=!7B9H7vt625"
  expiration: 180000
```

### 6.3 在登陆成功处理器中加入有关jwt的代码

```java
@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Resource
    private JWTUtils jwtUtils;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        //获取当前登陆信息
        User user = (User) authentication.getPrincipal();
        //获取token
        TokenDTO tokenDTO = tokenGenerator(user);
        //转换为JSON格式
        String token = objectMapper.writeValueAsString(tokenDTO);
        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(token.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }
    private TokenDTO tokenGenerator(User user){
        String token = jwtUtils.generateToken(user);
        long expire = Jwts.parser() //获取过期时间返回给前端
                .setSigningKey(jwtUtils.getSecret())
                .parseClaimsJws(token)
                .getBody().getExpiration().getTime();
        return new TokenDTO(user.getId(),SUCCESS_CODE,token,expire);
    }
}
```

jwt实例

```java
    @Test
    public void parse(){
        String token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6InVzZXIiLCJzdWIiOiJhZG1pbi10ZXN0IiwiZXhwIjoxNjQ2NjM2MjY5LCJqdGkiOiJkMzVlZmJlNC1hZjM4LTQ1MjYtYTc5Yi01MTgzNjc5NzJiZmUifQ.2m-a7NnLVrdqlrce8Bfci28-THYQSxuJiGZpyuLh51M";
        JwtParser jwtParser=Jwts.parser();
        //setSigningKey设置签名，parseClaimsJws解析token
        Jws<Claims> claimsJws = jwtParser.setSigningKey(signature).parseClaimsJws(token);
        Claims claims=claimsJws.getBody();
        System.out.println(claims.getId());//获取ID
        System.out.println(claims.get("username"));//获取用户名
        System.out.println(claims.get("role"));
        System.out.println(claims.getSubject());
        System.out.println(claims.getExpiration());//获取有效期
        
    }
```

## 7、用户授权

> 每个菜单的对应关系都在数据库表中写好了，也就是说一个菜单下面有几个子菜单，都是记录在数据库表中的

给Promission实体类加上三个属性（不对应数据库表）

```java
/**
* 子菜单列表
*/
@JsonInclude(JsonInclude.Include.NON_NULL) //属性值为null不进行序列化操作
@TableField(exist = false)
private List<Permission> children = new ArrayList<Permission>();
/**
* 用于前端判断是菜单、目录或按钮
*/
@TableField(exist = false)
private String value;
/**
* 是否展开
*/
@TableField(exist = false)
private Boolean open;

```

### 7.1 编写Mapper 

> 需要通过id来查找用户权限菜单列表

mapper层：

```java
public interface PermissionMapper extends BaseMapper<Permission> {
    /**
     * 根据用户ID查询权限列表
     * @param userId
     * @return
     */
    List<Permission> findPermissionListByUserId(Long userId);

}
```

接口层：

```java
public interface IPermissionService extends IService<Permission> {
    /**
     * 根据用户ID查询权限列表
     * @param userId
     * @return
     */
    List<Permission> findPermissionListByUserId(Long userId);
```

业务层：

```java
@Service
public class PermissionServiceImpl extends ServiceImpl<PermissionMapper, Permission> implements IPermissionService {
    @Override
    public List<Permission> findPermissionListByUserId(Long userId) {

        return baseMapper.findPermissionListByUserId(userId);
    }
}
```

### 7.2 修改UserDetailService实现类

加入权限验证

```java
@Component
public class CustomerUserDetailService implements UserDetailsService {
    @Resource
    private UserServiceImpl UserService;
    @Resource
    private PermissionServiceImpl permissionService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =UserService.findUserByUserName(username);
        if(user == null){
            throw new UsernameNotFoundException("用户名或密码错误");
        }
        //获取当前登录用户拥有的权限列表
        List<Permission> permissionList = permissionService.findPermissionListByUserId(user.getId());
        //获取权限编码
        String [] codeList = permissionList.stream()
                .filter(Objects::nonNull)
                .map(Permission::getCode)
                .filter(Objects::nonNull).toArray(String[]::new);
        //要求传数组
        //设置权限列表
        List<GrantedAuthority> authorityList = AuthorityUtils.createAuthorityList(codeList);
        //把权限列表设置给user
        user.setAuthorities(authorityList);
        //设置用户拥有的菜单信息
        user.setPermissionList(permissionList);
        return user;
    }
}
```

### 7.3  token验证

#### 7.3.1 token验证过滤器类(继承OncePerRequestFilter)

```java
@EqualsAndHashCode(callSuper = true)
@Data
@Component
@Slf4j
public class CheckTokenFilter extends OncePerRequestFilter {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Resource
    private JWTUtils jwtUtils;
    @Resource
    private CustomerUserDetailService customerUserDetailService;
    @Resource
    private LoginFailureHandler loginFailureHandler;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //获取当前请求的url
        String requestURI = request.getRequestURI();
        try {
            //判断是否是登录请求,如果不是则需要验证token
            if (!requestURI.equals(LOGIN_URL)) {
                this.verifyToken(request);
            }
        }catch (AuthenticationException e){
            loginFailureHandler.onAuthenticationFailure(request,response,e);
        }
        doFilter(request,response,filterChain);
    }

    /**
     * 验证token
     */
    private void verifyToken(HttpServletRequest request) {
        //从headers获取
        String token = request.getHeader("token");
        //从参数里获取
        if(ObjectUtils.isEmpty(token)) {
            token = request.getParameter("token");
        }
        //如果为空直接报异常
        if (ObjectUtils.isEmpty(token)){
            throw new CustomerAuthenticationException("token不存在");
        }
        String username = jwtUtils.getUsernameFromToken(token);
        String tokenKey = TOKEN_PREFIX + username;
        //存在的话,从redis里查有没有对应的
        String redisToken = stringRedisTemplate.opsForValue().get(tokenKey);
        if(ObjectUtils.isEmpty(redisToken)){
            throw new CustomerAuthenticationException("token已过期");
        }
        if(!token.equals(redisToken)){
            throw new CustomerAuthenticationException("token无效");
        }
        UserDetails userDetails= customerUserDetailService.loadUserByUsername(username);
        //如果用户未查到
        if(ObjectUtils.isEmpty(userDetails)){
            throw new CustomerAuthenticationException("token无效");
        }
        //创建用户身份验证对象
        //第一个参数是用户信息,第二个参数是密码,第三个参数是权限列表
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
        //设置请求信息
        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        //将验证的信息交给Spring Security
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }
}
```

#### 7.3.2 在配置类添加过滤器

注入过滤器依赖

加一句`http.addFilterBefore(checkTokenFilter, UsernamePasswordAuthenticationFilter.class);`

```java
   @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(checkTokenFilter, UsernamePasswordAuthenticationFilter.class);
        http.formLogin()
                .loginProcessingUrl("/api/user/login")
                .successHandler(loginSuccessHandler)
                .failureHandler(loginFailureHandler)
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) //不创建session
                .and()
                .authorizeRequests() //设置要拦截的请求
                .antMatchers("/api/user/login").permitAll() //放行的请求
                .anyRequest().authenticated() //其他请求一律进行验证
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(anonymousAuthenticationHandler)
                .accessDeniedHandler(customerAccessDeniedHandler)
                .and()
                .cors();
    }
```

#### 7.3.3 修改登录失败处理器

多加个`else if`

加个错误代码的变化

```java
@Component
public class LoginFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        //定义变量,保存异常信息
        String message;
        Integer code=LOGIN_ERR_CODE;
        //判断异常类型
        if(exception instanceof AccountExpiredException) {
            message="账户过期登录失败";
        } else if (exception instanceof BadCredentialsException) {
            message="用户名或密码错误,登录失败";
        } else if (exception instanceof CredentialsExpiredException) {
            message ="密码过期,登录失败";
        } else if (exception instanceof DisabledException) {
            message ="账户被禁用,登录失败";
        }else if (exception instanceof LockedException) {
            message ="账户被锁定,登录失败";
        }else if (exception instanceof InternalAuthenticationServiceException) {
            message ="账户不存在,登录失败";
        }else if (exception instanceof CustomerAuthenticationException) {
            message =exception.getMessage();
        }else {
            message ="登录失败";
            code=TOKEN_ERR_CODE;
        }
        String result = objectMapper.writeValueAsString(Result.fail(code,message));
        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
    }
}
```

#### 7.3.4修改登陆成功处理器

成功后将token保存到redis

```java
@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Resource
    private JWTUtils jwtUtils;
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //设置响应的编码格式
        response.setContentType("application/json;charset=utf-8");
        //获取当前登陆信息
        User user = (User) authentication.getPrincipal();
        //获取token
        TokenDTO tokenDTO = tokenGenerator(user);
        //转换为JSON格式
        String token = objectMapper.writeValueAsString(tokenDTO);
        //获取输出流
        ServletOutputStream outputStream = response.getOutputStream();
        outputStream.write(token.getBytes(StandardCharsets.UTF_8));
        //关闭流
        outputStream.flush();
        outputStream.close();
        //获得过期时间,因为原来是毫秒存储,所以需要除1000
        LocalDateTime expire =LocalDateTime.ofInstant(Instant.ofEpochSecond(tokenDTO.getExpireTime()/1000), ZoneId.systemDefault());
        //计算与现在的时间差
        Duration duration= Duration.between(LocalDateTime.now(),expire);
        stringRedisTemplate.opsForValue().set(TOKEN_PREFIX+user.getUsername(),tokenDTO.getToken(),duration);

    }
    private TokenDTO tokenGenerator(User user){
        String token = jwtUtils.generateToken(user);
        long expire = Jwts.parser() //获取过期时间返回给前端
                .setSigningKey(jwtUtils.getSecret())
                .parseClaimsJws(token)
                .getBody().getExpiration().getTime();
        return new TokenDTO(user.getId(),SUCCESS_CODE,token,expire);
    }
}
```

#### 7.3.5 刷新token

新建vo

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenVo {
    private Long expireTime;
    private String token;
}

```

修改Controller

```java
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Resource
    private UserServiceImpl userService;
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Resource
    private JWTUtils jwtUtils;

    /**
     * 查询所有用户列表
     *
     * @return
     */
    @GetMapping("/listAll")
    public Result listAll() {
        return Result.ok(userService.list());
    }

    /**
     * 刷新token
     *
     * @param request
     * @return
     */
    @PostMapping("/refreshToken")
    public Result refreshToken(HttpServletRequest request) {
        //从header中获取前端提交的token
        String token = request.getHeader("token");
        //如果header中没有token，则从参数中获取
        if (ObjectUtils.isEmpty(token)) {
            token = request.getParameter("token");
        }
        //从Spring Security上下文获取用户信息
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        //获取身份信息
        UserDetails details = (UserDetails) authentication.getPrincipal();
        //重新生成token
        String reToken = "";
        //验证原来的token是否合法
        if (jwtUtils.validateToken(token, details)) {
            //生成新的token
            reToken = jwtUtils.refreshToken(token);
        }
        //获取本次token的到期时间，交给前端做判断
        long expireTime = Jwts.parser().setSigningKey(jwtUtils.getSecret())
                .parseClaimsJws(reToken.replace("jwt_", ""))
                .getBody().getExpiration().getTime();
        String username = jwtUtils.getUsernameFromToken(token);
        String tokenKey = TOKEN_PREFIX + username;
        //存储新的token
        //获得过期时间,因为原来是毫秒存储,所以需要除1000
        LocalDateTime expire =LocalDateTime.ofInstant(Instant.ofEpochSecond(expireTime/1000), ZoneId.systemDefault());
        //计算与现在的时间差
        Duration duration= Duration.between(LocalDateTime.now(),expire);
        stringRedisTemplate.opsForValue().set(tokenKey,reToken,duration);
        //创建TokenVo对象
        TokenVo tokenVo = new TokenVo(expireTime, reToken);
        //返回数据
        return Result.ok(tokenVo,"token生成成功");
    }
}
```

## 8、获取登录用户的信息

> 封装一个实体类，和前端页面需要显示的数据属性一致

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo implements Serializable {
private Long id;//用户ID
private String name;//用户名称
private String avatar;//头像
private String introduction;//介绍
private Object[] roles;//角色权限集合
}
```

接口:

```java
 /**
     * 获取用户信息
     *
     * @return
     */
    @GetMapping("/getInfo")
    public Result getInfo() {
        //从Spring Security上下文获取用户信息
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        //判断authentication对象是否为空
        if (authentication == null) {
            return Result.fail(ERR_CODE, "用户信息查询失败");
        }
        //获取用户信息
        User user = (User) authentication.getPrincipal();
        //用户权限集合
        List<Permission> permissionList = user.getPermissionList();
        //获取角色权限编码字段
        Object[] roles =
                permissionList.stream()
                        .filter(Objects::nonNull)
                        .map(Permission::getCode).toArray();
        //创建用户信息对象
        UserInfo userInfo = new UserInfo(user.getId(), user.getNickName(),
                user.getAvatar(), null, roles);
        //返回数据
        return Result.ok(userInfo, "用户信息查询成功");
    }

```

## 9、获取用户权限列表

### 9.1 设置实体类对应路由设置

vue-element-admin的路由信息表

```js
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index', //重定向地址，在面包屑中点击会重定向去的地址
  hidden: true, // 不在侧边栏线上
  alwaysShow: true, //一直显示根路由
  meta: { roles: ['admin','editor'] }, //你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
  children: [{
    path: 'index',
    component: ()=>import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock', //图标
      role: ['admin','editor'], //或者你可以给每一个子路由设置自己的权限
      noCache: true // 不会被 <keep-alive> 缓存
    }
  }]
}
```

对应实体类

```java
@Data
public class RouteVo {
    //路由地址
    private String path;
    //路由对应的组件
    private String component;
    //是否显示
    private boolean alwaysShow;
    //路由名称
    private String name;
    //路由meta信息
    private Meta meta;
    @Data
    @AllArgsConstructor
    public class Meta {
        private String title;//标题
        private String icon;//图标
        private Object[] roles;//角色列表
    }
    //子路由
    private List<RouteVo> children = new ArrayList<>();
}
```

### 9.2编写获取路由地址的工具类(MenuTree)

```java
public class MenuTree {
    /**
     * 生成路由
     *
     * @param meuList 菜单列表
     * @param pid 父级菜单
     * @return
     */
    public static List<RouteVo> makeRouter(List<Permission> meuList, Long pid) {
        //创建集合保存路由列表
        List<RouteVo> routerList = new ArrayList<>();
        //如果menuList菜单列表不为空，则使用菜单列表，否则创建集合对象
        List<Permission> permissions = Optional.ofNullable(meuList).orElse(new ArrayList<>());
        //筛选不为空的菜单及菜单父id相同的数据
                permissions.stream().filter(item -> item != null && Objects.equals(item.getParentId(), pid))
                .forEach(item -> {
                    //创建路由对象
                    RouteVo router = new RouteVo();
                    router.setName(item.getName());//路由名称
                    router.setPath(item.getPath());//路由地址
                    //判断是否是一级菜单
                    if (item.getParentId() == 0L) {
                        router.setComponent("Layout");//一级菜单组件
                        router.setAlwaysShow(true);//显示路由
                    } else {
                        router.setComponent(item.getUrl());//具体的组件
                        router.setAlwaysShow(false);//折叠路由
                    }
                    //设置meta信息
                    router.setMeta(router.new Meta(
                            item.getLabel(),
                            item.getIcon(),
                            item.getCode().split(",")));
                    //递归生成路由
                    List<RouteVo> children = makeRouter(meuList, item.getId());
                    router.setChildren(children);//设置子路由到路由对象中
                    //将路由信息添加到集合中
                    routerList.add(router);
                });
        return routerList;
    }
    /**
     * 生成菜单树
     *
     * @param meuList
     * @param pid
     * @return
     */
    public static List<Permission> makeMenuTree(List<Permission> meuList, Long
            pid) {
        //创建集合保存菜单
        List<Permission> permissionList = new ArrayList<Permission>();
        //如果menuList菜单列表不为空，则使用菜单列表，否则创建集合对象
        Optional.ofNullable(meuList).orElse(new ArrayList<Permission>())
                .stream().filter(item -> item != null &&
                        Objects.equals(item.getParentId(), pid))
                .forEach(item -> {
                    //创建菜单权限对象
                    Permission permission = new Permission();
                    //复制属性
                    BeanUtils.copyProperties(item, permission);
                    //获取每一个item的下级菜单,递归生成菜单树
                    List<Permission> children = makeMenuTree(meuList,
                            item.getId());
                    //设置子菜单
                    permission.setChildren(children);
                    //将菜单对象添加到集合
                    permissionList.add(permission);
                });
        return permissionList;
    }
}
```



### 9.3 编写获取权限列表的接口



```java
    @GetMapping("/getMenuInfo")
    public Result getMenuInfo(){
        //从Spring Security上下文获取用户信息
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        //获取用户信息
        User user = (User) authentication.getPrincipal();
        //获取相应的权限
        List<Permission> permissionList = user.getPermissionList();
        //筛选目录和菜单
        List<Permission> collect = permissionList.stream()
                .filter(item -> item != null && item.getType() !=2)
                .collect(Collectors.toList());
        //生成路由数据
        List<RouteVo> routerVoList = MenuTree.makeRouter(collect, 0L);
        //返回数据
        return Result.ok(routerVoList,  "菜单数据获取成功");
    }
```



