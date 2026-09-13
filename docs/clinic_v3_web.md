# 怀安在线 · 网页设计风格总表

> 本文件记录**每一个网页的设计风格与实现方式**。改任何页面前先读这里，改完必须回来同步。
> 关键词树与完整通关链见 `clinic_v3_word.md`。

---

## 一、两种网页

| | **站点网页** | **关键词网页** |
|---|---|---|
| 位置 | `sites/`（6 个目录 / 7 个站点界面，共 12 页） | `truth/`（52 页，一词一页） |
| 进入方式 | 游戏一开始就给出（浏览器输入站点名直达） | **只能**靠浏览器检索 → 点结果链接进入 |
| 设计原则 | **完全照真实网站做**——布局、栏目、页脚、配色都按对应网站类型复刻 | **随剧情自由变化**，一个词一种风格；中后期加恐怖与动态特效 |
| 页内关键词 | 背景词（点击**直达**对应页面）+ 剧情入口词（点击**去检索**） | 剧情词（点击**去检索**）+ 背景词（`nav.js` 自动穿插做节奏呼吸） |
| 样式表 | 各站自带 `style.css` + 共享 `assets/base.css` | 统一 `truth/truth.css`（18 套主题 + 12 种特效） |

---

## 二、目录结构

```
client/
├─ browser.html               浏览器（检索中枢）
├─ map.html                   探索地图（进度可视化）
├─ index.html                 GitHub Pages 入口（0 秒跳转 browser.html）
│
├─ assets/
│   ├─ base.css               站点共享基础样式（reset / 字号 / 颜色变量）
│   └─ nav.js                 全站共享脚本（进度上报 / 关键词分流 / 背景穿插 / 链接新标签）
│
├─ sites/
│   ├─ archive/    index.html · intro.html · about.html · style.css
│   ├─ news/       index.html · about.html · style.css
│   ├─ tieba/      index.html · about.html · style.css
│   ├─ wx/         index.html · about.html · style.css
│   ├─ blog/       index.html
│   └─ web/        1998.html · bbs.html · style.css
│
├─ truth/
│   ├─ truth.css
│   ├─ act1/  t01–t09     表层裂缝
│   ├─ act2/  t10–t17     卫生院 · 系统
│   ├─ act3/  t18–t27     指挥部 · 公文
│   ├─ act4/  t28–t35     家庭
│   ├─ act5/  t36–t44     物证
│   └─ act6/  t45–t52     真相 · 终章
│
├─ pic/                       21 张图片资源
└─ docs/
    ├─ clinic_v3_web.md       本文件：每个网页的设计风格
    └─ clinic_v3_word.md      关键词树 + 完整通关链
```

**层级与相对路径**：`browser.html` / `map.html` / `index.html` 在根（深度 0）；`sites/*` 与 `truth/act*` 深度 2。
因此站点页与真相页统一写 `../../pic/`、`../../assets/nav.js`；站点内用自己的 `style.css`，真相页用 `../truth.css`。

---

## 三、浏览器 `browser.html`

**设计定位**：一个假的浏览器外壳，全站唯一"对话窗口"。

- **外框**：`#chrome` 顶栏 + `#viewport` 视口，深色 UI、等宽字体，像本地导航站。
- **标签栏**：`怀安在线 · 起始页` + 三个窗口控制点。
- **工具栏**：品牌区（点击回起始页）· `←` `→` 页内历史 · `⌂` 起始页 · 地址/检索输入框 · 检索按钮 · `探索地图` / `⌗ 日志` / `？帮助` / `↺ 重新开始` · 右上角进度 `n / 37`。
- **起始页**：只有「怀安在线 · 本地导航」和**四个站点卡片**（方志馆 / 新闻网 / 贴吧 / 怀安发布）。无使用说明、无推荐词。
- **结果页**：`搜索结果 · <词>` + 结果卡片列表（标题 / 路径 / 来源站名 / "点击进入查看"）。未命中只显示一句"没有找到与「…」相关的网页。"
- **行为**：

| 输入 | 行为 |
|---|---|
| 站点名（档案馆 / 新闻主页 / 贴吧主页 / 公众号主页 / 博客 / 怀安发布…） | **新标签页**打开该站首页 |
| 任意关键词 | 本页列出**搜索结果**；点结果标题在**新标签页**打开对应网页 |
| 未命中 | "没有找到与「…」相关的网页。"（不推荐任何词） |

---

## 四、探索地图 `map.html`

**设计定位**：进度可视化面板，暗色终端风。

- 顶部统计（已解锁 / 漏了 / 通关条件）+ 进度条。
- 8 层分层流程图：`浏览器（起点）` → `背景容器（四大站点）` → `表层裂缝` → `卫生院 · 系统` → `指挥部 · 公文` → `家庭` → `物证` → `真相 · 终章`。
- 三态着色：绿=已到达、橙=当前位置、灰=未到达。
- **点击节点**：背景容器节点 → **直接打开对应网页**；真相线节点（未到达时）→ 替你在浏览器里检索该词。
- 数据来自 `localStorage['huaian1998_v3']`，监听 `storage` / `focus` 实时刷新。
- 说明文案只讲"点节点会发生什么"，不露出关键词顺序。

---

## 五、站点层（7 个站点 · 逐页设计风格）

站点层的共同规则：
- 版式、栏目名、页脚、配色都按**对应真实网站类型**复刻，读起来像真站点。
- 页内关键词分两类：**背景词**（点击直达）与**剧情入口词**（点击去检索）。
- 底部统一有 `↩ 回到浏览器`。

### 5.1 `sites/archive/` — 政务 / 档案信息网式

配色政务蓝 + 灰白，方正克制，信息密度低。

| 页面 | 设计 |
|---|---|
| `index.html` | 顶部服务条（网站首页 / 无障碍浏览 / 长者版 / 政务公开 + 简体\|繁体）→ 站头（馆徽 + 馆名中英 + 站内搜索框）→ 横向栏目导航（首页 / 本馆概况 / 馆藏资源 / 数字化项目 / 关于本站）→ 面包屑 → 左栏「馆藏与办事」+ 正文（要闻大图 banner → 通知公告列表 → **馆藏专题** items → **数字化项目** box → 快捷服务）→ 政务页脚 |
| `intro.html` | 简化站头 + 面包屑 + 左栏 + 定义列表 `dl` + 阅览厅配图 + 半透明「归档整理稿 · 林知夏」注记块 |
| `about.html` | 关于本站（纯说明页，无关键词） |

固定锚点：`#hold`（馆藏专题）、`#doing`（数字化项目）

### 5.2 `sites/news/` — 地方新闻门户式

报业红 `#C8161D`，图文列表 + 右侧栏。

| 页面 | 设计 |
|---|---|
| `index.html` | 日期/天气条 → 红色报头 + 版面导航 → 面包屑 → 正文（头条大图区 headline → 要闻速览 → **#dike 水利·堤防** → **#report 旧报影印** → **#photos 影像怀安** → **#culture 地方文化**）+ 右栏（24 小时热点榜 / 专题：永宁堤 / 相关报道）→ 版权页脚 |
| `about.html` | 关于我们（无关键词） |

固定锚点：`#dike` `#report` `#photos` `#culture`

### 5.3 `sites/tieba/` — 贴吧式

贴吧蓝 `#3B7DE0`，高信息密度。

| 页面 | 设计 |
|---|---|
| `index.html` | 顶部蓝条 + 全吧搜索 → 吧头（吧名 + 关注/帖子数 + 关注/签到按钮）→ 左侧（看帖表格列表 → **#story 老故事征集帖**（楼层卡片：头像 / 等级 / 楼中楼）→ **#dike 加固年表帖** → **#chat 闲聊帖**）+ 右栏（吧内导航 / 精品区 / 吧务团队 / 本吧公告）→ 页脚 |
| `about.html` | 关于本吧（无关键词） |

固定锚点：`#story` `#dike` `#chat`

### 5.4 `sites/wx/` — 微信公众号文章式

微信绿 `#07C160`，手机外壳，正文 17px / 行高 1.75。

| 页面 | 设计 |
|---|---|
| `index.html` | `.phone` 手机外壳 + 状态栏 → 顶栏（‹ / 怀安发布 / ···）→ 公众号名片（头像 + 名称 + 关注）→ 历史消息按月分组 → 三篇文章（**#dike** 堤防纪实 / **#photo** 旧照征集 / **#memory** 守堤回忆），含标题 / 来源 / 正文 / 配图 / 引用块 / 留言区 → 底部导航 + 号内搜浮层 |
| `about.html` | 关于（无关键词） |

固定锚点：`#dike` `#photo` `#memory`

### 5.5 `sites/blog/` — 个人博客式（江边旧事 · 博主林知夏）

米白纸感，长文 + 评论区。

| 页面 | 设计 |
|---|---|
| `index.html` | 博主名片（头像 / 简介 / 统计 / 关注）→ 文章流：**#ferry 我爹是摆渡的** → **#lamp 江边那盏灯** → **#vest 工具箱底层的那件衣** → **#duanwu 端午的江和船** → **#oldnews 那张 98 年的旧报纸** → **#about 关于本博**，每篇含 `h2` + 元信息 + 正文 + 配图 + 评论（含博主回复）→ 右栏（简介 / 标签云 / 热门日志） |

固定锚点：`#ferry` `#lamp` `#vest` `#duanwu` `#oldnews` `#about`

### 5.6 `sites/web/` — 历史存档 / 旧站镜像式

暗底黄字，复古。

| 页面 | 设计 |
|---|---|
| `1998.html` | 水务局汛情专题存档：站头 + 面包屑 + 单卡片（综述 → 正文 → **灾情摘录表格** → 人员情况说明 + 存档件印章 → 存档注记 box → 相关背景 items）→ 页脚 |
| `bbs.html` | 怀安之声 BBS 1998 版镜像：站头（老站复活计划 · 第 3 次抓取）+ 面包屑 + 单卡片（版块导航表格 → 版务说明 → 镜像者按 box → 热门旧帖 items）→ 页脚 |

---

## 六、真相层 `truth/`（52 页 · 逐页风格）

**共同结构**：顶栏（图标 + `未公开整理稿` + 类型标签 + `↩ 浏览器`）→ `h1` 标题 → `.meta` 元信息 → 正文段落 / 专属块 → 末尾「地情背景」注记（`nav.js` 自动追加）。
关键词为空没有锚点依赖，页面自成一体。

**18 套主题**（`body` 类名）：`th-paper` 纸质档案 · `th-doc` 官方公文 · `th-med` 病历/系统单据 · `th-log` 值班横格纸 · `th-term` 内网终端（绿字 CRT）· `th-forum` 论坛帖 · `th-family` 家庭（暖调但不安）· `th-photo` 照片查看器 · `th-audio` 录音转写（声波）· `th-tag` 物证标签 · `th-table` 数据表 · `th-list` 名单 · `th-news` 报纸 · `th-diary` 手写日记 · `th-radio` 广播 · `th-map` 地图 · `th-notice` 通告/寻人 · `th-relic` 遗物

**17 种特效**，分两种用法：

*加在 `<body>` 上（整页氛围，12 种）*：
`fx-clock` 时钟异动 · `fx-flicker` 闪烁 · `fx-drift` 漂移 · `fx-scan` 扫描线 · `fx-watch` 被注视 · `fx-shake` 抖动 · `fx-drain` 褪色 · `fx-vig` 晕影 · `fx-breathe` 呼吸 · `fx-noise` 噪点 · `fx-water` 水波 · `fx-glitch-page` 整页故障（`t46` 起脚本按时间自行改动页面）

*加在正文元素上（局部，5 种）*：
`fx-ghost` 幽灵字（20 页）· `fx-redact` 涂黑可擦（T13/T15/T17/T19/T22）· `fx-jump` 字在跳（T05/T20/T21/T39）· `fx-type` 打字机（T45）· `fx-reveal` 逐字显形（**CSS 已定义，当前无页面使用**）

`@media (prefers-reduced-motion: reduce)` 关闭全部动画。

### 逐页对照表

| 页 | 文件 | 主题 | 特效 | 视觉风格 | 页内关键词 |
|---|---|---|---|---|---|
| T01 | `act1/t01-oldfile.html` | `th-paper` | — | 纸质档案：泛黄横格、归档员手记 | 防汛失踪案 |
| T02 | `act1/t02-case.html` | `th-doc` | — | 官方公文：红头、宋体、编号栏 | 已安全转移安置 / 决口夜直播帖 |
| T03 | `act1/t03-live.html` | `th-forum` | `fx-clock` | 论坛直播帖：楼层 + 时间戳异动 | 郑晓棠 / 堤上那盏灯 |
| T04 | `act1/t04-lamp.html` | `th-photo` | `fx-flicker` | 照片查看器：一帧夜景，灯在闪 | 目击者老船工 / 决口夜照片 |
| T05 | `act1/t05-witness.html` | `th-paper` | `fx-drift` | 口述记录纸，字迹在飘 | 救生衣编号 / 决口夜录音 |
| T06 | `act1/t06-broadcaster.html` | `th-radio` | — | 广播稿 + 波形 | 郑晓棠 / 决口夜直播帖 / 洪水退去之后 |
| T07 | `act1/t07-after.html` | `th-forum` | — | 灾后论坛帖 | 删帖公告 / 等一个人回家 |
| T08 | `act1/t08-delete.html` | `th-notice` | — | 系统删帖通告 | 论坛版规 / 卫生院系统 |
| T09 | `act1/t09-rules.html` | `th-doc` | — | 论坛版规公文 | 限流 / 决口夜直播帖 / 删帖公告 |
| T10 | `act2/t10-hospital.html` | `th-med` | — | 卫生院系统门户 | 卫字003号接诊单 / 卫字017号接诊单 |
| T11 | `act2/t11-clinic003.html` | `th-med` | — | 接诊单（卫字003） | 救生衣编号 / 匿名接诊记录 |
| T12 | `act2/t12-clinic017.html` | `th-med` | — | 接诊单（卫字017） | 值班医生留言 / 匿名接诊记录 |
| T13 | `act2/t13-anon.html` | `th-med` | `fx-scan` | 匿名记录，扫描线扫过 | 值班医生留言 / 失访记录 |
| T14 | `act2/t14-doctor.html` | `th-diary` | — | 值班医生手记 | 遗物袋 / 药品申领单 |
| T15 | `act2/t15-meds.html` | `th-table` | — | 药品申领数据表 | 救生衣编号 / 防汛队名册 |
| T16 | `act2/t16-hisinfo.html` | `th-med` | — | 卫生院概况 | 卫生院系统 / 失访记录 |
| T17 | `act2/t17-lost.html` | `th-med` | `fx-watch` | 失访记录，像有人在看 | 周文斌 / 生还者日记 |
| T18 | `act3/t18-intranet.html` | `th-term` | — | 防汛内网绿字终端 | 结案报告 / 防汛日志 7月20日 |
| T19 | `act3/t19-log0720.html` | `th-log` | — | 值班横格纸（7.20） | 水文站数据 / 防汛日志 7月21日 |
| T20 | `act3/t20-log0721.html` | `th-log` | `fx-shake` | 横格纸（7.21），纸在抖 | 决口记录 / 结案报告 |
| T21 | `act3/t21-breach.html` | `th-log` | — | 决口记录 + 位置示意 | 堤上那盏灯 / 结案报告 |
| T22 | `act3/t22-report.html` | `th-doc` | `fx-drain` | 结案报告，墨色在褪 | 指挥部工单 / 县长批示 |
| T23 | `act3/t23-order.html` | `th-doc` | — | 指挥部工单 | 县长批示 / 慰问金 |
| T24 | `act3/t24-mayor.html` | `th-doc` | `fx-vig` | 县长批示，四周发暗 | 等一个人回家 / 立功喜报 |
| T25 | `act3/t25-roster.html` | `th-table` | `fx-drain` | 防汛队名册，字在淡 | 救生衣编号 / 决口记录 |
| T26 | `act3/t26-money.html` | `th-table` | — | 慰问金发放表 | 指挥部工单 / 立功喜报 |
| T27 | `act3/t27-honor.html` | `th-notice` | — | 立功喜报 | 结案报告 / 三人名单 |
| T28 | `act4/t28-forum.html` | `th-family` | — | 寻亲论坛首页 | 队员甲/乙/丙 的帖 |
| T29 | `act4/t29-wife.html` | `th-family` | `fx-breathe` | 妻子的帖，暖调呼吸 | 队员乙 母亲的帖 / 二十年后的回帖 |
| T30 | `act4/t30-mother.html` | `th-family` | — | 母亲的帖 | 队员丙 弟弟的帖 / 寻人启事 |
| T31 | `act4/t31-brother.html` | `th-family` | `fx-watch` | 弟弟的帖，被注视感 | 周文斌 / 寻人启事 / 生还者日记 |
| T32 | `act4/t32-notice.html` | `th-notice` | — | 寻人启事 | 二十年后的回帖 / 媒体报道 |
| T33 | `act4/t33-reply20y.html` | `th-forum` | `fx-noise` | 二十年后回帖，噪点浮现 | 怀安旧档 / 周文斌 |
| T34 | `act4/t34-volunteer.html` | `th-forum` | — | 志愿者帖 | 队员甲 妻子的帖 / 怀安旧档 |
| T35 | `act4/t35-media.html` | `th-news` | — | 剪报合集 | 等一个人回家 / 怀安旧档 |
| T36 | `act5/t36-scanroom.html` | `th-relic` | `fx-scan` | 旧档扫描室 | 决口夜照片 / 遗物袋 |
| T37 | `act5/t37-photo.html` | `th-photo` | `fx-flicker` `fx-vig` | 决口夜现场照，闪 + 暗角 | 决口夜录音 / 救生衣编号 |
| T38 | `act5/t38-tape.html` | `th-audio` | `fx-water` | 录音转写，水声波形 | 三人名单 / 决口夜真相 |
| T39 | `act5/t39-signsheet.html` | `th-paper` | — | 涂改的签到表 | 指挥部工单 / 防汛队名册 |
| T40 | `act5/t40-vest.html` | `th-tag` | `fx-watch` | 救生衣物证标签 | 水文站数据 / 三人名单 |
| T41 | `act5/t41-hydro.html` | `th-table` | `fx-breathe` | 水文站数据表，缓慢起伏 | 落闸 / 结案报告 |
| T42 | `act5/t42-relic.html` | `th-relic` | `fx-vig` | 遗物袋陈列，暗角 | 决口夜录音 / 周文斌 |
| T43 | `act5/t43-map.html` | `th-map` | — | 决口位置图 | 落闸 / 水文站数据 |
| T44 | `act5/t44-newspaper.html` | `th-news` | `fx-scan` | 旧报纸影印，扫描线 | 等一个人回家 / 媒体报道 |
| T45 | `act6/t45-list.html` | `th-list` | `fx-noise` | 三人名单，噪点 | 决口夜真相 / 生还者日记 |
| T46 | `act6/t46-truth.html` | `th-term` | `fx-glitch-page` | **整页故障**，自行变化 | 水文站数据 / 决口夜录音 / 生还者日记 / 三人名单 / 落闸 |
| T47 | `act6/t47-diary.html` | `th-diary` | `fx-water` | 生还者日记，字被水泡开 | 生还者的后来 / 决口夜真相 |
| T48 | `act6/t48-later.html` | `th-family` | `fx-breathe` | 生还者的后来 | 周年生的后人 / 终章 |
| T49 | `act6/t49-heir.html` | `th-diary` | — | 后人的日记 | 生还者的后来 / 终章 |
| T50 | `act6/t50-gate.html` | `th-map` | `fx-water` `fx-vig` | 落闸图，水面在动 | 探照灯 / 终章 |
| T51 | `act6/t51-light.html` | `th-photo` | `fx-flicker` `fx-scan` | 探照灯最后一帧 | 落闸 / 终章 |
| T52 | `act6/t52-final.html` | `th-relic` | — | 终章：遗物归于安静 | 三人名单 / 决口夜真相 |

---

## 七、共享资源

### `assets/base.css`
站点层公用的基础样式：`*{box-sizing}`、`html,body` 归零、字体栈、`img` 自适应、`.backbar`（`↩ 回到浏览器` 底条）。各站 `style.css` 在此之上做自己的视觉。

### `assets/nav.js`（全站唯一脚本，站点页与真相页都引）
| 功能 | 说明 |
|---|---|
| 进度上报 | 读 `?node=<id>` 写入 `localStorage['huaian1998_v3'].f`；无参数时按「相对根路径 + 锚点」唯一匹配兜底 |
| 相对路径自适应 | 由自身 `document.currentScript.src` 反推项目根，算出当前页的 `../` 前缀，任意层级无需硬编码 |
| **关键词分流** | `KW_BG` 表命中 = **背景词 → 直接打开对应网页**（带锚点）；未命中 = **剧情词 → 新标签回浏览器检索** |
| 本页自指 | 目标就是本页某板块时**就地滚动**，不开重复标签页 |
| 链接新标签 | `a[href*=".html"]` 自动加 `target="_blank"`，原页面不覆盖 |
| **背景呼吸** | 仅 `truth/` 生效：把正文里出现的地情名就地变成可点背景链接；整页没有地情名的，末尾追加一行「地情背景」注记 |

### `truth/truth.css`
18 套 `body` 主题 + 12 种特效 + 关键词样式 `.kw` + 通用块 `.box / .note / .foot / .viewer` + 地情注 `.bg-note`。主题均以 CSS 变量（`--ink --dim --line --acc`）定义，地情注等公共块自动适配所有主题。

---

## 八、设计红线

1. **游戏内不出现任何攻略式提醒**——没有"点击蓝色关键词"提示条、没有"另见 / 下一层"清单、没有推荐词、没有"推荐主线"。顺序只写在 `clinic_v3_word.md`。
2. **站点页必须像真网站**——不要为了塞关键词而写出不像政务站 / 新闻门户的文案；入口词要埋在合理栏目里。
3. **关键词网页只能靠检索进入**——`truth/` 页面里不放任何指向其它 `truth/` 页的 `<a href>`，站点页也不引用 `truth/`。
4. **锚点不得删改**：`news #dike #report #photos #culture`、`tieba #story #dike #chat`、`wx #dike #photo #memory`、`archive #hold #doing`、`blog #ferry #lamp #vest #duanwu #oldnews`。
5. **不留自指链接**：页面正文里指向**自己这一页**的关键词必须去掉 `.kw`——点了只会原地打转（再开一个同样的标签页 / 滚回顶部）。已按此规则清理 `truth/act1/t02-case.html`、`t06-broadcaster.html`、`t09-rules.html` 与 `sites/web/1998.html`。**例外**：带锚点的同页导航（`sites/news/index.html` 的 `永宁堤 → #dike`、`sites/tieba/index.html` 的 `渡口村 → #story`）由 `nav.js` 就地滚动到板块，保留。
6. **新增/修改任何页面后，回来同步本文件**（页面风格表）与 `clinic_v3_word.md`（关键词树）。
