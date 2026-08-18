window.__ModuleLoader__.load({
	id: "dsh-custom-instructions",
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
  CustomInstructionsTab: () => CustomInstructionsTab,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "custom-instructions";
var zh = {
  "tab": "\u81EA\u5B9A\u4E49\u6307\u4EE4",
  "title": "\u5168\u5C40\u81EA\u5B9A\u4E49\u6307\u4EE4",
  "hint": "\u6B64\u5904\u7F16\u8F91\u7684\u5185\u5BB9\u4F1A\u4FDD\u5B58\u5230 ~/.dsh/AGENTS.md\uFF0CHarness \u5728\u6BCF\u6B21\u4F1A\u8BDD\u5F00\u59CB\u65F6\u81EA\u52A8\u52A0\u8F7D\u5E76\u9075\u5B88\u8FD9\u4E9B\u89C4\u5219\u3002\u89C4\u5219\u4E0D\u4F1A\u8986\u76D6\u7CFB\u7EDF\u3001\u5F00\u53D1\u8005\u6216\u76F4\u63A5\u7528\u6237\u6307\u4EE4\u3002",
  "placeholder": "\u5728\u6B64\u8F93\u5165\u4F60\u7684\u81EA\u5B9A\u4E49\u89C4\u5219\u2026\n\n\u4F8B\u5982\uFF1A\n- \u6BCF\u6B21\u56DE\u590D\u7528\u4E2D\u6587\n- \u4EE3\u7801\u6CE8\u91CA\u7528\u82F1\u6587\n- \u4F18\u5148\u4F7F\u7528\u51FD\u6570\u5F0F\u98CE\u683C",
  "loading": "\u6B63\u5728\u8BFB\u53D6\u6307\u4EE4\u2026",
  "loadError": "\u8BFB\u53D6\u6307\u4EE4\u5931\u8D25",
  "retry": "\u91CD\u8BD5",
  "save": "\u4FDD\u5B58",
  "saving": "\u4FDD\u5B58\u4E2D\u2026",
  "saved": "\u5DF2\u4FDD\u5B58",
  "saveError": "\u4FDD\u5B58\u5931\u8D25",
  "unsaved": "\u6709\u672A\u4FDD\u5B58\u7684\u66F4\u6539",
  "chars": "\u5B57\u7B26",
  "empty": "\u5F53\u524D\u6CA1\u6709\u81EA\u5B9A\u4E49\u6307\u4EE4\u3002\u8F93\u5165\u5185\u5BB9\u540E\u70B9\u51FB\u4FDD\u5B58\u5373\u53EF\u751F\u6548\u3002"
};
var en = {
  "tab": "Custom Instructions",
  "title": "Global Custom Instructions",
  "hint": "Content here is saved to ~/.dsh/AGENTS.md. Harness loads and follows these instructions at the start of every session. They do not override system, developer, or direct user instructions.",
  "placeholder": "Type your custom rules here\u2026\n\nExample:\n- Always respond in English\n- Write code comments in English\n- Prefer functional style",
  "loading": "Loading instructions\u2026",
  "loadError": "Failed to load instructions",
  "retry": "Retry",
  "save": "Save",
  "saving": "Saving\u2026",
  "saved": "Saved",
  "saveError": "Save failed",
  "unsaved": "Unsaved changes",
  "chars": "characters",
  "empty": "No custom instructions set. Type something and click Save to activate."
};
var panelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 760
};
var hintStyle = {
  margin: 0,
  fontSize: 12,
  color: "var(--text-muted-color, #999)",
  lineHeight: 1.6
};
var editorStyle = {
  width: "100%",
  minHeight: 320,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--line-color, rgba(127,127,127,.25))",
  background: "var(--bg-color, #fff)",
  color: "var(--text-color, #333)",
  fontSize: 13.5,
  fontFamily: "var(--mono-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)",
  lineHeight: 1.7,
  resize: "vertical",
  boxSizing: "border-box",
  outline: "none"
};
var buttonStyle = {
  padding: "6px 18px",
  borderRadius: 8,
  border: "1px solid transparent",
  background: "var(--primary-color, #4d6bfe)",
  color: "#fff",
  fontSize: 13,
  cursor: "pointer"
};
var disabledButtonStyle = {
  ...buttonStyle,
  opacity: 0.5,
  cursor: "not-allowed"
};
var statusStyle = {
  fontSize: 12,
  color: "var(--text-muted-color, #999)"
};
async function fetchInstructions() {
  const res = await fetch("/custom-instructions", { cache: "no-store" });
  const payload = await res.json();
  if (payload.ok !== true || typeof payload.content !== "string") {
    throw new Error(payload.error?.message ?? "fetch failed");
  }
  return payload.content;
}
async function saveInstructions(content) {
  const res = await fetch("/custom-instructions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  const payload = await res.json();
  if (payload.ok !== true) {
    throw new Error(payload.error?.message ?? "save failed");
  }
}
function CustomInstructionsTab({ t }) {
  const [savedContent, setSavedContent] = (0, import_react.useState)(null);
  const [draft, setDraft] = (0, import_react.useState)("");
  const [status, setStatus] = (0, import_react.useState)("loading");
  const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
  const load = () => {
    setStatus("loading");
    fetchInstructions().then(
      (content) => {
        setSavedContent(content);
        setDraft(content);
        setStatus("ready");
      },
      (err) => {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    );
  };
  (0, import_react.useEffect)(load, []);
  const dirty = savedContent !== null && draft !== savedContent;
  const save = async () => {
    setStatus("saving");
    try {
      await saveInstructions(draft);
      setSavedContent(draft);
      setStatus("saved");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("saveError");
    }
  };
  const statusText = (() => {
    if (status === "loading") return t("loading");
    if (status === "error") return `${t("loadError")}\uFF1A${errorMsg}`;
    if (status === "saving") return t("saving");
    if (status === "saved") return t("saved");
    if (status === "saveError") return `${t("saveError")}\uFF1A${errorMsg}`;
    if (dirty) return t("unsaved");
    if (draft.length === 0) return t("empty");
    return `${draft.length} ${t("chars")}`;
  })();
  const statusColor = status === "error" || status === "saveError" ? "#c92a2a" : status === "saved" ? "#2f9e44" : dirty ? "#e8590c" : "var(--text-muted-color, #999)";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: panelStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { style: { margin: 0, fontSize: 15, fontWeight: 600 }, children: t("title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hintStyle, children: t("hint") }),
    status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statusStyle, children: t("loading") }),
    status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { ...statusStyle, color: "#c92a2a" }, role: "alert", children: [
        t("loadError"),
        "\uFF1A",
        errorMsg
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: { ...buttonStyle, background: "var(--bg2-color, rgba(127,127,127,.12))", color: "var(--text-color, #333)", borderColor: "var(--line-color, rgba(127,127,127,.35))" }, onClick: load, children: t("retry") })
    ] }),
    status !== "loading" && status !== "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          style: editorStyle,
          value: draft,
          placeholder: t("placeholder"),
          onChange: (e) => {
            setDraft(e.target.value);
            if (status === "saved" || status === "saveError") setStatus("ready");
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { ...statusStyle, color: statusColor }, children: statusText }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: status === "saving" ? disabledButtonStyle : buttonStyle,
            disabled: status === "saving" || !dirty,
            onClick: () => {
              void save();
            },
            children: status === "saving" ? t("saving") : t("save")
          }
        )
      ] })
    ] })
  ] });
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-custom-instructions: copy");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "custom-instructions",
    order: 10,
    label: () => t("tab"),
    locale: NS
  }, CustomInstructionsTab));
}

		return module.exports;
	}
});
