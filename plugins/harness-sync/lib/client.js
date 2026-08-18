window.__ModuleLoader__.load({
	id: "dsh-harness-sync",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  HarnessSyncTab: () => HarnessSyncTab,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var panelStyle = { display: "flex", flexDirection: "column", gap: 12, maxWidth: 720 };
var buttonStyle = { padding: "8px 14px", borderRadius: 8, border: "1px solid #aaa", cursor: "pointer" };
async function status() {
  const response = await fetch("/harness-sync/status");
  const payload = await response.json();
  if (payload.ok !== true) throw new Error(payload.error?.message ?? "\u64CD\u4F5C\u5931\u8D25");
  return "\u540C\u6B65\u670D\u52A1\u5DF2\u5C31\u7EEA\u3002";
}
async function start(action) {
  const response = await fetch(`/harness-sync/operations/${action}`, { method: "POST" });
  const payload = await response.json();
  if (payload.ok !== true || payload.operation === void 0) throw new Error(payload.error?.message ?? "\u65E0\u6CD5\u542F\u52A8\u540C\u6B65\u4EFB\u52A1");
  return payload.operation;
}
async function readOperation(id) {
  const response = await fetch(`/harness-sync/operations/${id}`);
  const payload = await response.json();
  if (payload.ok !== true || payload.operation === void 0) throw new Error(payload.error?.message ?? "\u65E0\u6CD5\u8BFB\u53D6\u540C\u6B65\u8FDB\u5EA6");
  return payload.operation;
}
function HarnessSyncTab() {
  const [message, setMessage] = (0, import_react.useState)("\u6B63\u5728\u8BFB\u53D6\u540C\u6B65\u72B6\u6001\u2026");
  const [operation, setOperation] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const run = async (action) => {
    setBusy(true);
    setMessage("\u5DF2\u542F\u52A8\u540C\u6B65\u4EFB\u52A1\uFF0C\u6B63\u5728\u516C\u5F00\u6BCF\u4E00\u6B65\u8FDB\u5EA6\u2026");
    try {
      let current = await start(action);
      setOperation(current);
      while (current.state === "running") {
        await new Promise((resolve) => setTimeout(resolve, 600));
        current = await readOperation(current.id);
        setOperation(current);
      }
      setMessage(current.state === "success" ? action === "restore" ? "Git \u540C\u6B65\u5B8C\u6210\uFF0C\u8BF7\u91CD\u542F Harness\u3002" : "\u5907\u4EFD\u4E0E\u63A8\u9001\u5B8C\u6210\u3002" : `\u540C\u6B65\u5931\u8D25\uFF1A${current.error ?? "\u8BF7\u67E5\u770B\u5931\u8D25\u6B65\u9AA4\u3002"}`);
    } catch (error) {
      setMessage(`\u64CD\u4F5C\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setBusy(false);
    }
  };
  (0, import_react.useEffect)(() => {
    void status().then(setMessage, (error) => setMessage(`\u65E0\u6CD5\u8BFB\u53D6\u72B6\u6001\uFF1A${String(error)}`));
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: panelStyle, "aria-busy": busy, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u914D\u7F6E\u540C\u6B65" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u540C\u6B65\u81EA\u5B9A\u4E49\u63D2\u4EF6\u4E0E Harness Web \u914D\u7F6E\uFF1B\u4E0D\u4F1A\u4E0A\u4F20 API Key\u3001\u51ED\u636E\u3001\u4F1A\u8BDD\u6216\u6D4F\u89C8\u5668\u6570\u636E\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void run("backup"), children: "\u5907\u4EFD\u5230 Git" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void run("restore"), children: "\u540C\u6B65 Git" })
    ] }),
    operation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: { border: "1px solid #ddd", borderRadius: 8, padding: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: operation.kind === "restore" ? "Git \u540C\u6B65\u8FDB\u5EA6" : "\u5907\u4EFD\u8FDB\u5EA6" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { style: { margin: "8px 0 0", paddingLeft: 20 }, children: operation.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { style: { margin: "6px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: step.state === "running" ? "\u5904\u7406\u4E2D" : step.state === "success" ? "\u5B8C\u6210" : step.state === "skipped" ? "\u8DF3\u8FC7" : "\u5931\u8D25" }),
        "\uFF1A",
        step.title,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#666" }, children: step.error ?? step.detail })
      ] }, `${step.title}-${index}`)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#666", fontSize: 13 }, children: "\u5B89\u5168\u8BF4\u660E\uFF1A\u65E5\u5FD7\u4E0D\u4F1A\u663E\u793A API Key\u3001\u4EE4\u724C\u6216\u51ED\u636E\u5185\u5BB9\uFF1B\u5DF2\u6392\u9664\u4F1A\u8BDD\u3001\u6D4F\u89C8\u5668\u7F13\u5B58\u4E0E\u4F9D\u8D56\u76EE\u5F55\u3002" })
  ] });
}
var inject = ["slots"];
function apply(ctx) {
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "harness-sync",
    order: 30,
    label: () => "\u914D\u7F6E\u540C\u6B65"
  }, HarnessSyncTab));
}

		return module.exports;
	}
});
