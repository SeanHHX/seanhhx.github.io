---
title: Hexo 常用命令
---
Hexo 发布文章四步走：创建 post，本地运行预览，生成静态页面，部署到 github。

## 发布文章

### 创建新的 post

``` bash
$ hexo new [post] "My New Post Title"
```

详见官网： [Writing](https://hexo.io/docs/writing.html)

### 本地服务器运行预览

``` bash
$ hexo server
```

详见官网： [Server](https://hexo.io/docs/server.html)

### 生成静态文件

``` bash
$ hexo generate
```

详见官网： [Generating](https://hexo.io/docs/generating.html)

### 部署到网站

``` bash
$ hexo deploy
```

生成后自动部署（以下命令是等价的）

``` bash
$ hexo g -d
$ hexo d -g
```

详见官网： [Deployment](https://hexo.io/docs/one-command-deployment.html)
