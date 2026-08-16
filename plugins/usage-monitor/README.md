# dsh-usage-monitor

DeepSeek Harness 用量监控插件：**实时查看 token 消耗 + 随时查看账户余额**，不用再打开官网或平台后台。

- 余额：自动复用 Harness 现有的 `DEEPSEEK_API_KEY` 凭据，调 DeepSeek 官方余额接口
- 用量：基于 Harness 内置 token-meter 的会话投影（`tokenUsage`），实时、含历史会话
- 密钥只在本机服务端使用，**不进入浏览器、不发送给任何第三方**

## 功能

| 位置 | 内容 |
|---|---|
| 会话头部（右上角） | 紧凑读数：`余额 ¥4.47 · 本会话 1.2万 · 金额 ¥0.03`，随回复实时更新；悬停可看明细。余额低于 ¥1.5 时底色变红提醒充值，点击可直接跳转 DeepSeek 充值页 |
| 设置 → 用量监控 | 余额明细（总余额/赠金/充值/可用状态）、全部会话 token 汇总（含今日近似）、费用估算、刷新间隔与价格配置 |

- 余额自动刷新：默认每 5 分钟（可在设置页改为 1/5/10/30/60 分钟），另有手动刷新按钮
- 用量统计：输入（未缓存）/ 输出 / 缓存读 / 缓存写 分开展示，支持「全部会话 / 今日（近似）」切换
- 费用估算：按 DeepSeek 官方价格换算 ¥，默认 deepseek-v4-flash 空闲时段基准价（高峰时段 ×2，自动按北京时间判断），明确标注「估算」；可在设置页切换 v4-pro 或自定义价格表
- 配置保存在浏览器 localStorage，仅本机

## 架构

一个 npm 包，两部分：

- **Host 半边**（`lib/index.js`，零依赖）：注册 `GET /usage-monitor/balance` 路由，
  通过 cordis 服务注入（`webServer`、`credentials`）用 Harness 现有凭据调
  `https://api.deepseek.com/user/balance`，把结果以 JSON 返回浏览器。
- **Client 半边**（`src/client.tsx` → `lib/client.js`）：浏览器 UI，注册到
  `conversation.session.header.utilities`（会话头部摘要）与 `settings.section`（设置页）。

## 安装

已安装到 `~/.dsh/profiles/web`：

```bash
# 1. 包链接进 profile（link: 协议，改代码即时生效）
cd ~/.dsh/profiles/web
pnpm add "link:/Users/jy/Documents/DeepSeek harness/usage-monitor"

# 2. 在 profile 的 cordis.patch.yml 中插入（已插入）：
# - insert:
#     - id: usage-monitor
#       name: 'dsh-usage-monitor'
#       config:
#         baseUrl: 'https://api.deepseek.com'

# 3. 重启 dsh web 生效
```

`config.baseUrl` 可改为你的 API 网关地址（默认 DeepSeek 官方）。

## 使用

1. 重启 `dsh web`（本次安装需要重启一次）
2. 打开任意会话 → 右上角可见「余额 ¥x.xx · 本会话 x 万 · 金额 ¥x.xx」；余额低于 ¥1.5 时底色变红，点击可跳转 DeepSeek 充值页
3. 设置 → 用量监控 → 余额明细、全部会话汇总、费用估算与配置

## 配置项（设置页）

| 配置 | 默认 | 说明 |
|---|---|---|
| 余额自动刷新间隔 | 5 分钟 | 1/5/10/30/60 分钟 |
| 估算模型 | deepseek-v4-flash | 或 v4-pro / 自定义价格（元/百万 tokens） |
| 自定义价格 | 命中 0.05 / 未命中 1.5 / 输出 4.5 | 输入·缓存命中、未命中、输出；缓存写默认免费 |

## 数据与隐私

- 余额数据来自 DeepSeek 官方接口 `GET /user/balance`；请求由本机 Harness 进程发起，
  凭据（API Key）只在服务端解析，浏览器拿到的只有余额 JSON
- 用量数据来自 Harness 本地会话记录（token-meter 投影），不额外调用任何接口
- 配置仅存浏览器 localStorage

## 卸载

```bash
# 1. 从 cordis.patch.yml 删除 usage-monitor 条目
# 2. 移除依赖
cd ~/.dsh/profiles/web
pnpm remove dsh-usage-monitor
# 3. 重启 dsh web
```

## 开发

```bash
# 在包目录
npm i -D esbuild --cache /tmp/npm-cache   # ~/.npm 写权限受限时用临时缓存
npm run build                              # src/client.tsx → lib/client.js
```

改动 `lib/client.js` 后，运行的 Harness 会轮询到 rev 变化并热更新浏览器插件（无需重启）；
改动 host 半边（`lib/index.js`）需要重启 `dsh web`。
