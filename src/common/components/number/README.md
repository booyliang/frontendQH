### Number输入框

#### 示例

[Example](http://localhost/demo/number)

#### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------- | ------------- |------|
| value         | 绑定值(v-model)                         | Number| —           | 0           | 是|
| max     | 最大输入值                            | Number   | —    | —         |		否	|
| min     | 最小输入值                            | Number   | —    | —         |		否	|
| disabled      | 禁用                                   | Boolean  | true/false           | false |	否 |


#### Events

| 事件名称          | 说明                                    | 回调参数         |
|---------------| -------------------------------------- | ------- |
| change             | 数值发生变化时                   | ` value `: 当前输入值  |