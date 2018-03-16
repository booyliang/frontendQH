## Props

| 名称		| 类型				| 说明										|
| ---		| ---				| ---										|
| `tags`	| `Array<String>`	| 所有 tag。只能包含文本。与默认 `slot` 互斥。	|

## Slots

| 名称		| 说明													|
| ---		| ---													|
| `default`	| 自行调用 [`Tag`](../tag) 传入。与 `prop` `tags` 互斥。	|

## [Example](http://localhost/demo/tag-list)