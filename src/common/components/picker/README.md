此组件继承了 [`Popup`][popup]，请先去[这里][popup]查看相关信息。

## Props

| 名称		| 类型				| 说明																				|
| ---		| ---				| ---																				|
| `options`	| -					| 基础选项参见 [`Popup`](../popup#options)。覆盖值及特有选项参见 [`options`](#options)。	|
| `selects`	| `Array<Object>`	| 需要启用的选择控件。																	|

### `options`

| 名称			| 默认值		|
| ---			| ---		|
| `blankClose`	| `false`	|

### `selects`

由选择控件组成的数组，每个选择控件包含以下属性（思路参考 HTML select）：

| 名称		| 类型				| 说明		|
| ---		| ---				| ---		|
| `name`	| `String`			| 字段名。	|
| `options`	| `Array<String>`	| 所有选项。	|

## Directives

| 名称		| 绑定值类型	| 绑定值说明								|
| ---		| ---		| ---									|
| `model`	| `Object`	| 属性名为选择控件字段名；属性值为已选选项。	|

## [Example](http://localhost/demo/picker)

[popup]: ../popup