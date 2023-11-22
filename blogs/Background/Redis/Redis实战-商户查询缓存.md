---
title: Redis实战-商户查询缓存
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- Spring 
- SpringBoot 
- redis
categories: 
 - redis
---
# Redis实战-商户查询缓存

> 缓存时数据交换的缓冲区，是存储数据的临时地方，一般读写性能较高

## 1、添加商户缓存

基本思路:

+ 查询redis缓存，命中直接返回
+ 未命中查询数据库
+ 数据库查询失败，则直接返回错误信息
+ 查询成功，先存入redis再返回数据

controller层

```java
@GetMapping("/{id}")
    public Result queryShopById(@PathVariable("id") Long id) {
        return shopService.queryById(id);
    }
```

service层：

```java
@Service
public class ShopServiceImpl extends ServiceImpl<ShopMapper, Shop> implements IShopService {
    private final StringRedisTemplate stringRedisTemplate;
    @Autowired
    public ShopServiceImpl(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public Result queryById(Long id) {
        String key =CACHE_SHOP_KEY + id;
        //redis查询缓存
        String cacheShop = stringRedisTemplate.opsForValue().get(key);
        //判断命中
        if (StrUtil.isNotBlank(cacheShop)) {
            //命中,返回
            Shop shop = JSONUtil.toBean(cacheShop, Shop.class);
            return Result.ok(shop);
        }
        //未命中,查询数据库
        Shop shop=getById(id);
        //数据库查询是否存在
        if(shop==null){
            //不存在,返回错误
            return Result.fail("店铺不存在");
        }
        //存在,返回并写入redis
        stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop));
        return Result.ok(shop);
    }
}
```

### 1.1 商户类型缓存查询

service层：

> 这里直接用String存储List集合（JSON），其实可以用redis的List类型来存储，但是这样会复杂很多

service层:

```java
    @Override
    public Result queryViaCache() {
        //查询redis
        String jsonShopType = stringRedisTemplate.opsForValue().get(CACHE_SHOPTYPE_KEY);
        //命中直接返回
        if(jsonShopType!=null){
            List<ShopType> list = JSONUtil.toList(jsonShopType, ShopType.class);
            return Result.ok(list);
        }
        //没有命中去查询数据库
        List<ShopType> typeList = query().orderByAsc("sort").list();
        //数据库没找到直接返回
        if(typeList.isEmpty()){
            return Result.fail("数据库查询失败");
        }
        //找到了就先存入redis
        String jsonShopTypeDTO = JSONUtil.toJsonStr(typeList);
        stringRedisTemplate.opsForValue().set(CACHE_SHOPTYPE_KEY,jsonShopTypeDTO);
        return Result.ok(typeList);
    }
}
```

redis存List类型示例一：

```java
public static void main(String[] args) {
    List<Student> studentsAll = new ArrayList<>();
    StringRedisTemplate stringRedisTemplate = new StringRedisTemplate();
    List<Student> students = new ArrayList<>();
    for (Student students : students) {
        stringRedisTemplate.opsForList().rightPush("student", JSON.toJSONString(students));
    }
    List<String> studentList = stringRedisTemplate.opsForList()
        .range("student", 0, -1);
    // 将redis中的数据转换为对象集合
    for (String studentString : studentList) {
        studentsAll.add(BeanUtils.copyProperties(studentString,Student.class));
    }
}
```

示例二：

```java
public class JsonUtils{
    private static final ObjectMapper om = createObjectMapper();

    public static ObjectMapper createObjectMapper() {
        ObjectMapper om = new ObjectMapper();

        // 反序列化时，忽略Javabean中不存在的属性，而不是抛出异常
        om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        // 忽略入参没有任何属性导致的序列化报错
        om.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS,false);

        return om;
    }

    public static <T> List<T> toListOfObject(String json, Class<T> clazz, ObjectMapper om) {
        try {
            @SuppressWarnings("unchecked") Class<T[]> arrayClass = (Class<T[]>) Class
                .forName("[L" + clazz.getName() + ";");
            return Lists.newArrayList(om.readValue(json, arrayClass));
        } catch (IOException | ClassNotFoundException e) {
            log.error("json={}, clazz={}", json, clazz, e);
            throw new JsonException(e);
        }
    }
}
```

## 2、缓存更新解决方案

> redis会在内存不够时自动清除一部分，或者设置过期时间，还可以主动设规则，称为主动更新

写在前面：主动更新的最佳实现方案

+ 读操作
  + 缓存命中直接返回
  + 未命中则查询数据库，并写入缓存，**加入超时时间**
+ 写操作
  + 先写数据库，再删除缓存
  + 要确保数据库和缓存操作的原子性，

### 2.1 Cache Aside Pattern（大部分时候使用该方案）

> 由缓存的调用者，在更新数据库的同时更新缓存

+ 问题

  + 删除缓存还是更新缓存？

    + 更新缓存：每次更新数据库都要更新缓存，无效操作多（假设写一百次，但是只有一两个数据需要读，这时会浪费缓存空间）
    + 删除缓存：更新数据库的时候让缓存失效，查询时再更新缓存（通常选择该方案）

  + 如何保证数据库和缓存的操作同时成功和失败（原子性）？

    + 单体系统：将缓存和数据科技操作放在一个事务里
    + 分布式系统：利用TCC等分布式事务方案

  + 先操作缓存还是先操作数据库？（线程安全问题）

    + 先删缓存，再操作数据库。

      ![image-20231027093433918](/image-20231027093433918.png)

      > 并行运行时，因为没有加锁，所以容易出现，更新还未完成，但是另一个线程，把缓存先更新了，然后第一个线程才更新完数据库，这样数据库的数据和缓存的数据是不一致的。

    + 先操作数据库，再删缓存。（主要选该方案，发生概率低）

      ![image-20231027093811808](/image-20231027093811808.png)

      > 如果第一个线程查询缓存的时候，缓存因为过期之类的问题，导致未命中，这时会去查询数据库，在查询数据库的同时，线程二去更新数据库了，那么线程一已经查到的值是落后的，这时线程一会去写入缓存，这时缓存和数据库数据又不一致了

      需要在每次写入缓存时加一个超时线程作为兜底，几乎可以解决方案二的线程安全问题，因为方案二触发问题的条件多，概率低

### 2.2 Read/Write Through Pattern

> 缓存和数据库整合为同一个服务，由服务来维护一致性。调用者无需关心缓存一致性的问题。

### 2.3 Write Behind Caching Pattern

> 调用者只操作缓存，由其他线程异步的将缓存数据持久化到数据库，保证一致

## 3、更新缓存案例

小插曲：没有在jdbc链接里写`useUnicode=true&characterEncoding=utf8`导致从mybatisplus传入数据的时候乱码

查询（其实就加了个过期时间）：

```java
    @Override
    public Result queryById(Long id) {
        String key =CACHE_SHOP_KEY + id;
        //redis查询缓存
        String cacheShop = stringRedisTemplate.opsForValue().get(key);
        //判断命中
        if (StrUtil.isNotBlank(cacheShop)) {
            //命中,返回
            Shop shop = JSONUtil.toBean(cacheShop, Shop.class);
            return Result.ok(shop);
        }
        //未命中,查询数据库
        Shop shop=getById(id);
        //数据库查询是否存在
        if(shop==null){
            //不存在,返回错误
            return Result.fail("店铺不存在");
        }
        //存在,返回并写入redis
        stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop), Duration.ofMinutes(CACHE_SHOP_TTL));
        return Result.ok(shop);
    }
```

更新：

```java
    /**
     *  主动更新,更新商品操作，同时删除Redis缓存
     */
    @Override
    @Transactional //记得设置事务回滚,假设数据库设置成功了,缓存删除没成功,就能回滚
    public Result updateShop(Shop shop) {
        //判断id是否存在
        if(shop.getId()==null){
            return Result.fail("店铺id不能为空 ");
        }
        //先更新数据库
        updateById(shop);
        //删除缓存
        stringRedisTemplate.delete(CACHE_SHOP_KEY + shop.getId());
        return Result.ok();
    }
```

## 4、缓存穿透

> 缓存穿透是指客户端请求的数据在缓存和数据库中都不存在，这样缓存永远不会生效，这些请求都会打到数据库

+ 解决方案
  + 缓存空对象
    + 哪怕请求的数据不存在，也缓存一个null，这样就不会直接到达数据库
    + 缺点
      + 造成额外的内存消耗（可以设置短TTL，这样就可以减轻内存消耗问题）
      + 可能造成数据短期不一致（因为有TTL，所以哪怕数据已经存在了，也不能及时返回）
  + 布隆过滤（准确度不能保证百分百，但是绝对不会在有数据的情况不放行）
    + 在请求redis之前先请求布隆过滤器，如果值为空则直接拒绝请求，有则放行
    + 优点：内存占用少
    + 缺点：实现较复杂（好在redis自带BitMap），存在误判可能

+ 主动防御
  + 增加id复杂度，避免被猜测
  + 做好数据的基础格式校验（比如id=0，不可能存在）
  + 加强用户权限校验
  + 热点参数做限流

### 4.1 实际案例

![image-20231027112524057](/image-20231027112524057.png)

#### 4.1.1 缓存空对象

hutool的`StrUtil.isNotBlank()`在字符串为换行符`\t`,空值`null`,空字符串`""`时都返回false，所以使用这个方法时，我们要再加一个判断去专门返回空对象

```java 
if(StrUtil.isBlank(cacheShop)){
            return Result.fail("数据为空");
        }
```

## 5、缓存雪崩

> 同一时间段大量缓存key失效或者reids服务宕机，大量请求到达数据库，带来巨大压力

解决方案：

+ 给不同keyTTL添加随机值
+ 利用redis集群提高服务可用性
+ 给缓存业务添加降级限流策略
+ 给业务添加多级缓存（nginx缓存，浏览器缓存）

## 6、缓存击穿

> 部分key过期导致的问题，这部分key是热点访问key，在**高并发访问**业务下并且**缓存重建业务较复杂**的情况下

![image-20231027144619891](/image-20231027144619891.png)

> 如图所示，重建缓存的时间很长，这个时候又有很多用户访问，每一个用户在缓存成功写入前都会发送一个请求，这个时候就会发生缓存击穿。

**解决方案**：

### 6.1 **互斥锁**![image-20231027145035424](/image-20231027145035424.png)

> 如图所示，建立了一个互斥锁，当第一个线程获取互斥锁成功，开始重建缓存的时间里，第二个线程访问的时候获取互斥锁失败，这个时候就设置它阻塞一小会，然后再让他获取信息，直到缓存命中

### 6.2 **逻辑过期**

>  因为设置了TTL所以会失效，那不设置不就完了吗，当然还是需要一个类似的东西来保证它能过期，一般在数据里加上expire字段记录过期时间，一般是当前时间戳加上类似三十分钟的过期时间

![image-20231027150536275](/image-20231027150536275.png)

> 如图线程1如果发现逻辑时间已过期，则先获取互斥锁，然后开启一个新的子线程来帮他处理数据库重建缓存，然后写入缓存，重置过期时间，线程1在构建期间可以直接返回过期数据，**注意：过期数据不等于失效数据，可能和过期前一模一样，但是逻辑上需要他过期重建，所以直接返回没有问题**，其他线程也会去获取互斥锁，此时会发现有线程在修改，就可以直接拿过期数据返回

### 6.3 **两者优缺点**

![image-20231027151859812](/image-20231027151859812.png)

### 6.4 案例解决

#### 6.4.1 互斥锁解决

流程图：

![image-20231027152555988](/image-20231027152555988.png)

> redis中的String类型有一个命令`setnx key value`只有第一次赋值可以成功，非常**适合用来当互斥锁还有分布式锁**，但是如果程序出问题了，锁一直没有被释放，那么就会出问题，所以一般会设置一个短的有效期，比如10s

**代码：**

```java
public Shop queryWithMutex(Long id){
        String key =CACHE_SHOP_KEY + id;
        //redis查询缓存
        String cacheShop = stringRedisTemplate.opsForValue().get(key);
        //判断命中
        if (StrUtil.isNotBlank(cacheShop)) {
            //命中,返回
            return JSONUtil.toBean(cacheShop, Shop.class);
        }
        //判断空对象
        if(cacheShop!=null){
            return null;
        }
        //实现缓存重建

        try {
            //获取互斥锁
            boolean isLock = tryLock(LOCK_SHOP_KEY + id);
            //判断是否获取成功
            if(!isLock){
            //失败,休眠并重试
                Thread.sleep(50);
                //递归直到有返回值，记得返回回去
                return queryWithMutex(id);
            }
            //成功,查询数据库
            Shop shop=getById(id);
            Thread.sleep(200);
            //数据库查询是否存在
            if(shop==null){
                //不存在,返回错误
                //同时把空值写入缓存
                stringRedisTemplate.opsForValue().set(key,"",Duration.ofMinutes(CACHE_NULL_TTL));
                return null;
            }
            //存在,返回并写入redis
            stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop), Duration.ofMinutes(CACHE_SHOP_TTL));
            return shop;
        }catch (InterruptedException e) {
                throw new RuntimeException(e);
            }finally {
            //一定要执行一遍释放锁
            unlock(LOCK_SHOP_KEY + id);
        }
    }
```

互斥锁方法:

```java
 /**
     * 互斥锁上锁
     * @param key
     * @return 互斥锁是否存在
     */
    private boolean tryLock(String key){
        Boolean b = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", Duration.ofSeconds(10L));
        return BooleanUtil.isTrue(b);
    }
    /**
     * 互斥锁释放
     * @param key
     */
    private void unlock(String key){
        stringRedisTemplate.delete(key);
    }
```

#### 6.4.2 逻辑过期

流程图：

![image-20231028150742431](/image-20231028150742431.png)

 

可以先建一个类，用来存到Redis里

```java
@Data
public class RedisData {
    private LocalDateTime expireTime;
    private Object data;
}
```

功能实现

```java
private static final ExecutorService CACHE_REBUILD_EXECUTOR= Executors.newFixedThreadPool(100); 
/**
     * 缓存击穿解决(逻辑过期)
     * @param id
     * @return
     */
    public Shop queryWithLogicalExpire(Long id){
        String key =CACHE_SHOP_KEY + id;
        //redis查询缓存
        String cacheShop = stringRedisTemplate.opsForValue().get(key);
        //判断是否能命中缓存
        if(StrUtil.isBlank(cacheShop)){
            //未命中,返回null
            return null;
        }
        //命中，解析json，判断过期时间
        RedisData redisData = JSONUtil.toBean(cacheShop, RedisData.class);
        Shop shop= JSONUtil.toBean((JSONObject) redisData.getData(), Shop.class);
        //如果未过期,则返回缓存
        if(LocalDateTime.now().isBefore(redisData.getExpireTime())) {
            return shop;
        }
            //已过期
            //实现缓存重建
            //获取互斥锁
            boolean isLock = tryLock(LOCK_SHOP_KEY + id);
            //判断是否获取成功
            if(isLock){
                //记得再次检查过期时间,因为另一个线程可能已经刚释放锁并更新了时间
                String cacheShop2 = stringRedisTemplate.opsForValue().get(key);
                RedisData redisData2 = JSONUtil.toBean(cacheShop2, RedisData.class);
                Shop shop2= JSONUtil.toBean((JSONObject) redisData2.getData(), Shop.class);
                //如果未过期,则返回缓存
                if(LocalDateTime.now().isBefore(redisData2.getExpireTime())) {
                    return shop2;
                }
                //成功,开启独立线程
                CACHE_REBUILD_EXECUTOR.submit(()->{
                    //写入redis
                    try {
                        this.saveShopRedis(id,600L);
                    }catch (Exception e) {
                        throw new RuntimeException(e);
                    }finally {
                        //一定要执行一遍释放锁
                        unlock(LOCK_SHOP_KEY + id);
                    }
                });
            }
            //失败,直接返回旧数据
            return shop;
        }
```

预热缓存:

```java
/**
     * 预热缓存
     * @param id
     */
    public void saveShopRedis(Long id,Long expireSeconds)  {
        Shop shop = getById(id);

        //封装过期时间
        RedisData redisData =new RedisData();
        redisData.setData(shop);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(expireSeconds));
        //存入redis
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(redisData));
    }
```

## 7、封装缓存工具类

直接上代码好吧

 ```java
 package com.hmdp.utils;
 
 import cn.hutool.core.util.BooleanUtil;
 import cn.hutool.core.util.StrUtil;
 import cn.hutool.json.JSONObject;
 import cn.hutool.json.JSONUtil;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.data.redis.core.StringRedisTemplate;
 import org.springframework.stereotype.Component;
 
 import java.time.Duration;
 import java.time.LocalDateTime;
 import java.util.concurrent.ExecutorService;
 import java.util.concurrent.Executors;
 import java.util.function.Function;
 
 
 import static com.hmdp.utils.RedisConstants.*;
 
 
 @Component
 public class CacheUntil {
     private static final ExecutorService CACHE_REBUILD_EXECUTOR= Executors.newFixedThreadPool(100);
     private final StringRedisTemplate stringRedisTemplate;
     @Autowired
     public CacheUntil(StringRedisTemplate stringRedisTemplate) {
         this.stringRedisTemplate = stringRedisTemplate;
     }
 
     public void set(String key , Object value, Duration duration){
         stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(value),duration);
     }
 
     /**
      * 逻辑过期的缓存预热
      * @param keyPrefix 键的前缀
      * @param id 键
      * @param expireSeconds 过期的秒数
      * @param value 需要预热的值
      * @param <ID> 传入的id类型不确定,使用泛型
      */
     public <ID> void setLogicalExpire(String keyPrefix,ID id,Long expireSeconds,Object value)  {
         String key =keyPrefix+id.toString();
         //封装过期时间
         RedisData redisData =new RedisData();
         redisData.setData(value);
         redisData.setExpireTime(LocalDateTime.now().plusSeconds(expireSeconds));
         //存入redis
         stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(redisData));
     }
 
     /**
      * 防止缓存穿透查询工具类
      * @param keyPrefix 查询键的前缀
      * @param id    查询的键
      * @param type 传入参数的类型
      * @param function 查询的逻辑
      * @param time 过期的分钟数
      * @return 查询的数据
      * @param <R> 返回类型的泛型
      * @param <ID> 传入的id类型不确定,使用泛型
      */
     public <R,ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID,R> function,Long time){
         String key =keyPrefix+id.toString();
         //查询缓存
         String json = stringRedisTemplate.opsForValue().get(key);
         //判断缓存是否命中
         if(StrUtil.isNotBlank(json)){
             return JSONUtil.toBean(json,type);
         }
         if(json==null){
             stringRedisTemplate.opsForValue().set(key,"",Duration.ofMinutes(CACHE_NULL_TTL));
             return null;
         }
         R r =function.apply(id);
         stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(r),Duration.ofMinutes(time));
         return r;
     }
 
     /**
      * 防止缓存击穿查询工具类(逻辑过期)
      * @param keyPrefix 查询键的前缀
      * @param id 查询的键
      * @param type 传入参数的类型
      * @param lockPrefix 互斥锁的前缀
      * @param function 查询的逻辑
      * @param time 过期的秒数
      * @return 查询的数据
      * @param <R> 返回类型的泛型
      * @param <ID> 传入的id类型不确定,使用泛型
      */
     public <R,ID> R queryWithLogicalExpire(String keyPrefix ,ID id, Class<R> type,String lockPrefix,Function<ID,R> function,Long time){
         String key =keyPrefix+id.toString();
         //redis查询缓存
         String cacheShop = stringRedisTemplate.opsForValue().get(key);
         //判断是否能命中缓存
         if(StrUtil.isBlank(cacheShop)){
             //未命中,返回null
             return null;
         }
         //命中，解析json，判断过期时间
         RedisData redisData = JSONUtil.toBean(cacheShop, RedisData.class);
         R r= JSONUtil.toBean((JSONObject) redisData.getData(), type);
         //如果未过期,则返回缓存
         if(LocalDateTime.now().isBefore(redisData.getExpireTime())) {
             return r;
         }
         //已过期
         //实现缓存重建
         //获取互斥锁
         boolean isLock = tryLock(lockPrefix + id);
         //判断是否获取成功
         if(isLock){
             //记得再次检查过期时间,因为另一个线程可能已经刚释放锁并更新了时间
             String cacheShop2 = stringRedisTemplate.opsForValue().get(key);
             RedisData redisData2 = JSONUtil.toBean(cacheShop2, RedisData.class);
             R r1= JSONUtil.toBean((JSONObject) redisData2.getData(), type);
             //如果未过期,则返回缓存
             if(LocalDateTime.now().isBefore(redisData2.getExpireTime())) {
                 return r1;
             }
             //成功,开启独立线程
             CACHE_REBUILD_EXECUTOR.submit(()->{
                 //写入redis
                 try {
                     R r2=function.apply(id);
                     this.setLogicalExpire(keyPrefix,id,time,r2);
                 }catch (Exception e) {
                     throw new RuntimeException(e);
                 }finally {
                     //一定要执行一遍释放锁
                     unlock(lockPrefix+id);
                 }
             });
         }
         //失败,直接返回旧数据
         return r;
     }
     /**
      * 互斥锁上锁
      * @param key
      * @return 互斥锁是否存在
      */
     private boolean tryLock(String key){
         Boolean b = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", Duration.ofSeconds(10L));
         return BooleanUtil.isTrue(b);
     }
     /**
      * 互斥锁释放
      * @param key
      */
     private void unlock(String key){
         stringRedisTemplate.delete(key);
     }
 
 
 
 }
 
 ```

