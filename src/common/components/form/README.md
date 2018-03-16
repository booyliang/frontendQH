## 说明
通过已提供y-form-input, y-form-select, y-form-editor等表单控件组装自己的表单， 这些表单控件支持原有组件属性，并且扩充了一些通用验证属性
（以下标明通用代表表单控件通用）
## Props

| 名称			| 类型			  | 说明 | 是否必填 | 默认值 |
| ---			| ---				 | ---	  | --- | ---
| `required`	| -	Boolean			 | 通用， 是否必填| 否 	|
| `maxlength`	| -	Number			 | 通用， 最大长度	| 否		|
| `minlength`	| - Number			 | 通用， 最小长度	| 否		|
| `regex`		| -	String， Regex	| 通用， 正则   | 否		|
| `requiredMsg`	| -	String		     | 通用， 必填错误信息	| 否 | 请输入{title}	|
| `maxlengthMsg`| -	String		| 通用， 超过最大长度错误信息	| 否 | {field}最大不超过{maxlength}字		| 
| `minlengthMsg`| -	String		| 通用， 小于最小长度错误信息	| 否 | {field}不少于{minlength}字	|
| `regexMsg`	| -	String		| 通用， 正则错误信息	| 否 | 请输入正确格式的{title}	|
| `field`		| -	String		| 通用	| 是	| |
| `title`		| -	String		| 通用	| 是	| |
| *`withLabel`	| -	Boolean		| input属性(是否在字段前显示Label)  | 否 |	默认为false |
| *`optionsData`| -	Array   	| select属性(select选项)	 | 否 |	默认为false |
| *`clickable`	| -	Boolean		| select属性(select默认可点)	 | 否 |	默认为true |


## [Example](http://localhost/demo/form)

[load-more-remote]: ../load-more-remote