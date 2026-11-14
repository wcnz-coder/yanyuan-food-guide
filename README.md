# 燕园美食红黑榜

一份可离线打开的校园试吃手记，收录 79 条个人评价。支持菜名模糊搜索、地点和星级筛选、收藏与红榜随机点菜。评分和口味仅代表作者的个人感受。

[在线浏览燕园美食红黑榜](https://wcnz-coder.github.io/yanyuan-food-guide/)

## 使用

下载 [index.html](./index.html) 后，用浏览器打开。只需这一个文件，头像和数据都已内嵌。禁用 JavaScript 时仍可阅读完整榜单；搜索和收藏需要 JavaScript。收藏只保存在当前浏览器。

## 本地开发

菜品、评价与搜索逻辑在 [src/yanyuan.canvas.tsx](./src/yanyuan.canvas.tsx) 中。头像资源在 `assets/` 中。构建脚本会将互动页面和无脚本阅读版合并为单文件 `index.html`。

~~~sh
npm ci
npx playwright-core install chromium
npm run build
npm test
~~~

## 许可

项目代码采用 [MIT](./LICENSE) 许可。作者头像与试吃文字不随代码许可授权。
