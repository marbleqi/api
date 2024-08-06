# 共享模块项目

## 项目介绍

封装通用功能，供其他项目的类继承，或直接被其他项目调用。

## 对象清单

### common

封装了通用抽象类，供其他类继承或引用。
包括控制器类CommonController，封装了通用的swagger配置。
嵌入实体类CreateEntity，UpdateEntity，LogEntity。
服务类CommonService，封装了通用的增删改查操作。

### operate

封装了操作记录的类，供其他项目调用。

### option

封装了配置项的类，供其他项目调用。

### queue

封装了队列的类，供其他项目调用。

### reids

封装了redis的类，供其他项目调用。

### req

封装了请求的类，供其他项目调用。

### setting

封装了设置项的类，供其他项目调用。

### sort

封装了排序的类，供其他项目调用。
