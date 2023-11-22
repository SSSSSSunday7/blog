---
title: "yarn : 无法加载文件vscode中运行yarn报错yarn : 无法加载文件 yarn.ps1因为在此系统上禁止运行脚本"
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- yarn
categories: 
 - Vue
---
# yarn : 无法加载文件 、vscode中运行yarn报错、yarn : 无法加载文件 C:\Program Files\nodejs\yarn.ps1，因为在此系统上禁止运行脚本

## 一、安装完yarn后，在vscode中运行yarn报错问题
yarn : 无法加载文件 C:\Program Files\nodejs\yarn.ps1，因为在此系统上禁止运行脚本。

在cmd中运行yarn是可以成功的
## 二、错误原因
PowerShell 执行策略，默认设置为 Restricted不加载配置文件或运行脚本。需变更设置为RemoteSigned。

（简言之：因为电脑系统阻止了这个脚本的运行，对这个脚本不信任，所以我们要更改系统的权限）

## 三、解决方法

1、在开始菜单找到 PowerShell，右键 “以管理员身份运行”

2、输入` set-ExecutionPolicy RemoteSigned `命令， 更改 PowerShell 执行策略。是否更改执行策略，输入 A（全是）

3、输入命令验证是否生效 yarn --version ：查看yarn的版本


4.在vscode中运行项目，查看项目是否正常运行

