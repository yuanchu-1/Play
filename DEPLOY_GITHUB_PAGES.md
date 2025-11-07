# 使用 GitHub Pages 部署

本指南帮助你把 `play/` 目录部署为可公开访问的静态站点。

## 1. 推送代码到 GitHub

1. 在 GitHub 新建一个仓库（例如 `warm-gift`）。
2. 在本地把仓库的 `main` 分支与远程关联：
   ```bash
   git init
   git remote add origin https://github.com/<your-username>/warm-gift.git
   git add .
   git commit -m "Init site"
   git push -u origin main
   ```

> 注：如果你的项目已有 Git 历史，直接把 `play/` 与工作流文件推送到 `main` 即可。

## 2. 启用 GitHub Pages

1. 打开 GitHub 仓库的 `Settings` → `Pages`。
2. 把 `Source` 选择为 `GitHub Actions`（因为我们已添加工作流 `play/.github/workflows/pages.yml`）。
3. 等待工作流完成后，页面会显示站点地址（通常是 `https://<your-username>.github.io/<repo>/`）。

## 3. 站点路径与链接

- 工作流会把 `play/` 目录作为站点根部署。
- 我们已把站点中的链接改为相对路径（如 `../index.html`），并在分享页脚本中根据当前路径推断仓库子路径生成正确的分享链接。

访问入口：
- 首页：`https://<user>.github.io/<repo>/site/index.html`
- 互动礼物页：`https://<user>.github.io/<repo>/index.html`
- 分享页：`https://<user>.github.io/<repo>/site/share.html`

## 4. 自定义仓库名或页面

- 若你想把站点部署到用户主页（不含 `<repo>` 子路径），可以用特殊仓库名：`<your-username>.github.io`。此时所有链接会是 `https://<your-username>.github.io/` 开头。
- 如果改动了目录结构或页面路径，记得相应更新 `site/` 下的链接与 `share.js` 的推断逻辑。

## 5. 常见问题

- 访问出现 404：确认 `Pages` 环境已完成部署，并且访问的 URL 包含仓库子路径。
- 链接仍是 `localhost`：这是本地预览时的正常情况，部署后会自动替换为你的线上域名。
- 分享图为空白：尝试刷新页面；若浏览器禁用了某些 2D API，需换浏览器或允许相关权限。

---
部署完成后就可以把链接分享给朋友啦。需要我帮你自动创建 Git 仓库并推送吗？我也可以生成二维码或自定义分享封面图。