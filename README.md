
## Available Scripts

### `npm start`

### `npm test`

### `npm run build`

## 项目目录

    |-- officialWebsite
        |-- .gitignore
        |-- package.json
        |-- README.md
        |-- yarn.lock
        |-- config
        |   |-- env.js
        |   |-- paths.js
        |   |-- webpack.config.js
        |   |-- webpackDevServer.config.js
        |   |-- jest
        |       |-- cssTransform.js
        |       |-- fileTransform.js
        |-- public
        |   |-- favicon.ico
        |   |-- index.html
        |   |-- manifest.json
        |-- scripts
        |   |-- build.js
        |   |-- start.js
        |   |-- test.js
        |-- src
            |-- App.js
            |-- App.test.js
            |-- index.js
            |-- serviceWorker.js
            |-- components                      // 公共组件
            |   |-- Banner
            |   |   |-- Banner.jsx
            |   |   |-- index.jsx
            |   |   |-- images
            |   |       |-- banner-home.png
            |   |       |-- banner.png
            |   |-- Footer
            |   |   |-- Footer.jsx
            |   |   |-- Footer.scss
            |   |   |-- index.jsx
            |   |-- Header
            |   |   |-- Header.jsx
            |   |   |-- Header.scss
            |   |   |-- index.jsx
            |   |-- Logo
            |       |-- index.jsx
            |       |-- Logo.jsx
            |       |-- image
            |           |-- logo.png
            |-- layouts                         // 页面布局
            |   |-- HeaderFooter
            |       |-- HeaderFooter.jsx
            |       |-- index.jsx
            |-- MenuConfig                      // 导航菜单配置
            |   |-- MenuConfig.js
            |-- pages                           // 页面
            |   |-- Aboutus
            |   |   |-- Aboutus.jsx
            |   |   |-- index.jsx
            |   |   |-- images
            |   |       |-- aboutus.png
            |   |-- BackEnd
            |   |   |-- index.jsx
            |   |-- Cloud
            |   |   |-- Cloud.jsx
            |   |   |-- Cloud.scss
            |   |   |-- index.jsx
            |   |   |-- image
            |   |       |-- login.png
            |   |-- Download
            |   |   |-- Download.jsx
            |   |   |-- Download.scss
            |   |   |-- index.jsx
            |   |   |-- images
            |   |       |-- Android.jpg
            |   |       |-- app_ios.png
            |   |       |-- download-bg.png
            |   |       |-- icon_anzhuo.png
            |   |       |-- icon_cqd.png
            |   |       |-- icon_ios.png
            |   |-- Home
            |   |   |-- Home.jsx
            |   |   |-- Home.scss
            |   |   |-- index.jsx
            |   |   |-- images
            |   |       |-- bg.png
            |   |-- NotFound
            |   |   |-- index.jsx
            |   |   |-- NotFound.jsx
            |   |-- Plugin
            |       |-- index.jsx
            |       |-- Plugin.jsx
            |       |-- images
            |           |-- icon_cqd.png
            |-- router                          // 路由配置
            |   |-- index.jsx
            |   |-- routerConfig
            |       |-- index.jsx
            |       |-- routerConfig.jsx
            |-- style                           // 样式
                |-- ui.scss
                |-- helpers
                |   |-- _fn.scss
                |   |-- _helpers.scss
                |   |-- _mixin.scss
                |   |-- _variables.scss
                |-- scss
                    |-- _animate.scss
                    |-- _authlist.scss
                    |-- _common.scss
                    |-- _element-reset.scss
                    |-- _global.scss
                    |-- _icon.scss
                    |-- _lazyload.scss
                    |-- _reset.scss
