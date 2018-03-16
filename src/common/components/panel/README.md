## Props

| 名称			| 类型					| 说明							| 取值																																																							| 默认值		|
| ---			| ---					| ---							| ---																																																							| ---		|
| `colorful`	| `Boolean`				| 彩色面板，头部带有主题色边框。	| -																																																								| `false`	|
| `icon`		| `String`				| 头部的图标。					| 图标的 `class` （不含前缀）																																																		| -			|
| `more`		| `String` / `Object`	| “查看更多”的链接。				| 1. [`RouterLink`][router-link] 的 `to` 可接受的值；<br>2. 一个对象：`more.link`：[`RouterLink`][router-link] 的 `to` 可接受的值；`more.text`：链接的文字。																			| -			|
| `title`		| `String`				| 标题。							| -																																																								| -			|

> 可传入 [`<router-link>` 相关 `props`][router-link]。

## Slots

| 名称		| 说明		|
| ---		| ---		|
| `default`	| 主体区域。	|
| `title`	| 标题区域。	|

## [Example](http://localhost/demo/panel)

[router-link]: http://router.vuejs.org/zh-cn/api/router-link.html