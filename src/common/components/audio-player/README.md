## AudioPlayer 


## [Example](http://localhost/demo/audio-player)

### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------------- | ------------- |------|
| title | 标题 | String | —— | —— | 是 |
| src | 音频资源地址 | String | —— | —— | 是 |
| time	| 音频时长	| Number	| ——	|	——	|	是	|
| size	| 音频大小(单位kb)	| Number	| ——	|	——	|	——	|


### Events
| 事件名         | 说明                                                                 | 参数 |
|----------------|---------------------------------------------------------------------|------|
| play | 播放开始 | ——    |
| pause | 播放暂停 | ` time ` :当前播放时间    |
| ended | 播放结束 | —    |