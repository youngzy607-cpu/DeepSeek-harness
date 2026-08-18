# dsh-custom-instructions

DeepSeek Harness 全局自定义指令编辑器。

当前版本：`v0.1.0`

在「设置 → 插件 → 我的插件 → 自定义指令」中提供文本编辑器，编辑 `~/.dsh/AGENTS.md`。

Harness 内置的 `dsh-agent-instructions` 会在每个会话首步自动加载该文件并注入为 agent 指令，无需手动重复说明规则。

指令不会覆盖系统、开发者或直接用户指令。
