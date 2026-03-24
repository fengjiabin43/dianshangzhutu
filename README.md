# 电商主图修图专家

一个基于 React + Vite 的前端小工具，支持用户自行输入 Gemini API Key，对上传的商品图进行 AI 修图和尺寸导出。

## 在线体验

- GitHub Pages: `https://fengjiabin43.github.io/dianshangzhutu/`

## 功能

- 上传商品图片
- 在页面中手动输入自己的 Gemini API Key
- 使用 Gemini 图像模型进行修图
- 选择输出尺寸，支持自定义宽高
- 一键下载处理后的图片

## 技术栈

- React 19
- TypeScript
- Vite
- `@google/genai`
- Tailwind CSS CDN

## 本地运行

### 前置条件

- Node.js 18+

### 安装和启动

```bash
npm install
npm run dev
```

打开终端提示的本地地址后，先上传图片，再在页面里输入自己的 Gemini API Key。

## GitHub Pages 部署

这个项目已经配置为可直接部署到 GitHub Pages。

### 部署方式

1. 把代码推送到仓库的 `main` 分支。
2. 进入 GitHub 仓库的 `Settings` > `Pages`。
3. 将 `Build and deployment` 的来源设置为 `GitHub Actions`。
4. 之后每次向 `main` 分支推送代码，都会自动触发构建并发布。

### 发布文件

- 构建产物会输出到 `dist/`
- GitHub Actions 工作流位于 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

### 发布地址

- `https://fengjiabin43.github.io/dianshangzhutu/`

## 使用说明

1. 打开页面。
2. 上传一张商品图。
3. 输入你自己的 Gemini API Key。
4. 选择目标尺寸。
5. 点击生成并下载结果。

## 注意事项

- API Key 是由用户自己在页面中输入的，不会写入仓库。
- 这是纯前端应用，调用 Gemini 接口时需要浏览器能正常访问外网。
- 如果你要公开给别人使用，建议提醒使用者自行承担自己的 API 额度与密钥安全。

## 本地预览构建结果

```bash
npm run build
npm run preview
```

## 目录说明

- `App.tsx` 主界面逻辑
- `components/` 页面组件
- `services/` Gemini 调用逻辑
- `constants.tsx` 提示词配置
- `vite.config.ts` 构建配置
