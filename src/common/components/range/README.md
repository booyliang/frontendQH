## Range 


## [Example](http://localhost/demo/range)

### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------------- | ------------- |------|
| value | 滑块的值 | Number | —— | —— | 是 |
| min	| 最小值	| Number	| ——	|	0	|	——	|
| max	| 最大值	| Number	| ——	|	100	|	——	|
| disabled	| 是否禁用	| Boolean	| true/false	|	false	|	——	|
| lineHeight	| 滑槽的线宽（单位：像素）	| Number	| ——	|	1	|	——	|



### Slots

|	名称		|	说明	|	备注	|
|-------------|--------|----------|
|	` start `	|	滑块左侧 DOM	|	——	|
|	` end `	|	滑块右侧 DOM	|	——	|

### Events
| 事件名         | 说明                                                                 | 参数 |
|----------------|---------------------------------------------------------------------|------|
| drag-start | 滑动开始 | ——    |
| change | 值修改，滑动结束	|	——	|