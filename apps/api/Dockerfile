# 基础镜像
FROM node:20

# 配置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置工作目录
WORKDIR /apps

# 将package.json文件复制到工作目录
COPY package.json ./

# 将依赖包安装到工作目录
COPY node_modules ./node_modules

# 将编译后的代码复制到工作目录
COPY dist/apps/api ./dist/apps/api

# 指定服务端口为80
EXPOSE 80

# 启动应用程序
CMD ["node","dist/apps/api/main.js"]
