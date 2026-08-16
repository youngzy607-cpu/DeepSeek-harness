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
async function request(action) {
  const response = await fetch(`/harness-sync/${action}`, { method: action === "status" ? "GET" : "POST" });
  const payload = await response.json();
  if (payload.ok !== true) throw new Error(payload.error?.message ?? "\u64CD\u4F5C\u5931\u8D25");
  if (action === "restore") return `\u6062\u590D\u5B8C\u6210\u3002\u672C\u673A\u65E7\u914D\u7F6E\u5DF2\u5907\u4EFD\u5230\uFF1A${payload.backup}\uFF1B\u8BF7\u91CD\u542F Harness\u3002`;
  if (action === "backup") return "\u5907\u4EFD\u5E76\u63A8\u9001\u5B8C\u6210\u3002";
  return "\u540C\u6B65\u670D\u52A1\u5DF2\u5C31\u7EEA\u3002";
}
function HarnessSyncTab() {
  const [message, setMessage] = (0, import_react.useState)("\u6B63\u5728\u8BFB\u53D6\u540C\u6B65\u72B6\u6001\u2026");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const run = async (action) => {
    setBusy(true);
    setMessage("\u5904\u7406\u4E2D\u2026");
    try {
      setMessage(await request(action));
    } catch (error) {
      setMessage(`\u64CD\u4F5C\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setBusy(false);
    }
  };
  (0, import_react.useEffect)(() => {
    void run("status");
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: panelStyle, "aria-busy": busy, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u914D\u7F6E\u540C\u6B65" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u540C\u6B65\u81EA\u5B9A\u4E49\u63D2\u4EF6\u4E0E Harness Web \u914D\u7F6E\uFF1B\u4E0D\u4F1A\u4E0A\u4F20 API Key\u3001\u51ED\u636E\u3001\u4F1A\u8BDD\u6216\u6D4F\u89C8\u5668\u6570\u636E\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void run("backup"), children: "\u5907\u4EFD\u5230 Git" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: buttonStyle, disabled: busy, onClick: () => void run("restore"), children: "\u4ECE Git \u6062\u590D" })
    ] })
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
