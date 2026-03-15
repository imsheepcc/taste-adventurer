# GitHub Pages 部署指南

## 🚀 完整操作步骤

### 1. 创建GitHub仓库
- 访问 https://github.com
- 点击右上角 "+" → "New repository"
- 仓库名：`taste-adventurer`（或其他你喜欢的名字）
- 描述：`🍜 味觉冒险家 - 智能美食推荐平台`
- 设置为 **Public**
- **不要**勾选 "Add a README file"
- 点击 "Create repository"

### 2. 记录仓库信息
创建完成后，GitHub会显示仓库URL，格式如下：
```
https://github.com/你的用户名/taste-adventurer.git
```
请记录这个URL，下面会用到。

### 3. 本地Git操作
在终端中执行以下命令（已经完成的部分可以跳过）：

```bash
# 初始化Git仓库（已完成）
git init

# 添加文件（已完成）
git add index.html app.js README.md

# 提交（已完成）
git commit -m "Initial commit: 味觉冒险家 - 智能美食推荐平台"

# 设置主分支（已完成）
git branch -M main

# 连接到GitHub仓库（请替换为你的仓库URL）
git remote add origin https://github.com/你的用户名/taste-adventurer.git

# 推送到GitHub
git push -u origin main
```

### 4. 启用GitHub Pages
1. 在GitHub仓库页面，点击 "Settings"
2. 在左侧菜单找到 "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. Folder 保持 "/ (root)"
6. 点击 "Save"

### 5. 获取访问链接
几分钟后，你的网站将在以下地址可访问：
```
https://你的用户名.github.io/taste-adventurer
```

## ⚠️ 注意事项
- 仓库必须设置为 Public
- 首次部署可能需要5-10分钟生效
- 每次更新代码后，网站会自动更新

## 🎯 提交给美团
部署完成后，将获得的链接提交给美团测评平台即可！