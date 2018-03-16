# 悠然一指圈子前端
<!-- TOC -->

- [悠然一指圈子前端](#悠然一指圈子前端)
	- [项目结构说明](#项目结构说明)
	- [公用组件库](#公用组件库)
	- [环境变量说明 env](#环境变量说明-env)
	- [圈子属性说明 circle](#圈子属性说明-circle)
	- [CSS 命名规范](#css-命名规范)
			- [规则](#规则)
			- [示例](#示例)
	- [文件及路由命名规范](#文件及路由命名规范)
			- [示例(以下命名仅提供参考)：](#示例以下命名仅提供参考)
	- [工具类](#工具类)
		- [vscode](#vscode)
	- [共享书籍目录](#共享书籍目录)
		- [CSS+HTML](#csshtml)
		- [JavaScript](#javascript)
		- [框架库](#框架库)
		- [性能优化](#性能优化)
		- [HTTP](#http)
		- [数学，数据结构，算法](#数学数据结构算法)
		- [Node.js](#nodejs)
		- [设计模式](#设计模式)

<!-- /TOC -->
## 项目结构说明

```
├─build								//webpack打包构建配置文件目录
├─config							//项目配置文件
└─src
    ├─circle						//圈子业务库
    │  └─cyq						//具体圈子(示例为创业圈)
    └─common						//项目公用库
        ├─assets					//静态文件
        ├─components				//组件库
        ├─css						//公用CSS文件
        ├─js
        ├─utils						//工具类js文件
        └─views						//公用板块页面
            ├─components			//组件示例
            ├─not-found				//404等页面
            ├─redirect				//页面重定向
            └─removed				//内容被删除显示页面
```

## 公用组件库

[组件文档地址](./src/common/components/README.md)


## 环境变量说明 env
组件内通过` this.$env `访问,全局通过` Vue.env `访问


| 属性名 | 说明 			| 类型 | 取值范围 | 默认值 |
| ------ | ------------ | ----| ------- | ------ |
| token | 接口访问凭证 | String | 无	| 无 |
| appVersion | APP版本 | String | 无	| 无 |
| devType | 设备类型 | String | `1`: Andriod <br> `2`: iOS <br> `3`: PC | 无 |
| devName | 设备名称 | String | 无 | 无 |
| devId | 当前访问设备id | String | 无 | 无 |
| ip | 网络ip | String | 无 | 无 |
| net | 网络环境 | String | `wwan`: 移动网络 <br> `wifi`: wifi <br> `notReachable`: 无网络 | 无 | 无 |
| custId | 平台用户id | String | 无 | 无 |

## 圈子属性说明 circle
组件内通过` this.$circle ` 访问，全局通过` Vue.circle `访问


|	属性			|	说明					| 类型 |
|---------------|----------------------| ---- |
|	appId		|	应用id			| mr23mxjmqbeb |
|	adminUrl	|	圈子管理后台地址	| String |
|	circleName	|	圈子名称			| String |
|	circleUrl	|	圈子地址 			| String |
|	circleIntro	|	圈子简介			| String |
|	circleMsg	|	圈子信息			| String |


## CSS 命名规范

思想参照 [BEM 规范](http://getbem.com/naming/)，根据实际情况进行了调整和优化。

#### 规则

* 1 个 `class` 最多包含 3 个部分——block、element、modifier；
* element 前缀为 `-`，modifier 前缀为 `--`。
* block 永远在首位，element 和 modifier 可选。

基本结构：`block-element--modifier`；

各部分如果含有词组：`block_name-element_name--modifier_name`。

#### 示例

```css
/* block */
.dialog

/* block-element */
.list-item

/* block--modifier */
.menu--visible

/* block-element--modifier */
.form-field--disabled

/* block_name */
.nav_bar

/* block_name-element_name */
.project_detail-pub_time

/* block_name--modifier_name */
.my_page--modal_opened

/* block_name-element_name--modifier_name */
.member_list-user_name--is_myself
```

> 通用工具类选择器（如 `.clearfix`、`.active` 等）不必遵守上述规范。文件及路由路由

## 文件及路由命名规范
* 不允许使用中文命名。如有需要，请在router.js页面通过注释标记。	
* 避免使用拼音命名，除了已经约定俗成已经演化为单词的拼音，例如baike。
* 一律使用单数。为了便于管理和查询，单词一律使用单数形式。					
* 词组用中划线(-)连接。					
* 对于常见单词可以使用缩写形式，例如：intr、info、edu、img、org。如果不常用尽量使用全拼。		
* 模块主入口一律用index.vue。
* 文件命名和路由应体现层级关系，便于归类和查找。					

#### 示例(以下命名仅提供参考)：
| 中文含义 | 文件名 | 路由名 |
| ------ | ------- | ------ |
| 栏目入口页 | index | 	/xxxx/index | 
| 详情页 | detail | /xxxx/detail/:id | 
| 发布页 | new | /xxxx/new | /xxxx/new | 
| 编辑页 | edit | /xxxx/edit/:id | 
| 选择分类 | new-category/edit-category | /xxxx/new/category | 
| 联系人 | edit-contact | /xxxx/edit/contact | 
| 联系人手机号/电话 | edit-phone | /xxxx/edit/phone | 
| 简介 | edit-intr | /xxxx/edit/intr | 
| 机构 | edit-org | /xxxx/edit/org | 	
| 职位 | edit-position | /xxxx/edit/position | 
| 金额 | edit-amount | /xxxx/edit/amount | 
| 观点 | edit-viewpoint | /xxxx/edit/viewpoint | 
| 案例 | edit-case | /xxxx/edit/case | 
| 选择城市 | edit-city | /xxxx/edit/city | 
| 关注领域 | edit-focus | /xxxx/edit/focus | 
| 投资阶段 | edit-stage | /xxxx/edit/stage | 
| 行业领域 | edit-area | /xxxx/edit/area | 
| 合伙人需求 | edit-partner | /xxxx/edit/partner | 
| 教育背景 | edit-education | /xxxx/edit/education | 
| 任职公司 | edit-company | /xxxx/edit/company | 
| 项目经历 | edit-experience | /xxxx/edit/experience | 
| 生日 | edit-birthday | /xxxx/edit/birthday | 
| 合伙人标签 | edit-tag | /xxxx/edit/tag | 
| 擅长领域 | edit-expertise | /xxxx/edit/expertise | 
| 资格证种类 | edit-certificate | /xxxx/edit/certificate | 
| 身份证 | edit-id | /xxxx/edit/id | 
| 提问 | ask |/xxxx/ask | 
| 回答 | answer | /xxxx/answer | 	
| 编辑回答 | answer-edit | /xxxx/answer/edit | 
| 快速回答 | answer-quick | /xxxx/answer/quick | 
| 圈子主页 | index | /user/index/:id | 
| 他人主页 | other | /user/other/:id | 

## 工具类

### vscode

* 下载插件` Syncing ` 查看插件使用说明，通过以下数据获取编辑器的同步
* ` shift + alt + d ` 下载配置，` shift + alt + u ` 上传配置
* token: ` 34e494365cbf5b9a3cfca3896668d6e1bbde1a20 `
* gits id: ` 483bd60daf6260c3163cd2ba790679d9 `

## 共享书籍目录

为方便知识资源共享，特将大家愿意出借并与编程相关的书籍整理如下，各位童鞋可互相借阅，请保持他人书籍的整洁，谢谢。

### CSS+HTML
* [《css权威指南》](https://book.douban.com/subject/2308234/) => 叶凡
* [《HTML5程序设计》](https://book.douban.com/subject/10608238/) => 尹志强
* [《HTML 5 与 CSS 3 权威指南》](https://book.douban.com/subject/6025285/) => 尹志强
* [《高性能HTML5》](https://book.douban.com/subject/25868275/) => 王泊宁
* [《CSS揭秘》](https://book.douban.com/subject/26745943/) => 王泊宁，余兰（电子版）
* [《众妙之门——精通CSS》](https://book.douban.com/subject/24546948/) => 王泊宁
* [《HTML5 Canvas核心技术》](https://book.douban.com/subject/24533314/) => 韦薇
* [《HTML5程序设计（第2版）》](https://book.douban.com/subject/10608238/) => 韦薇
* [《精通CSS》](https://book.douban.com/subject/4736167/)（电子版） => 余兰

### JavaScript
* [《JavaScript权威指南》](https://book.douban.com/subject/10549733/) => 胡亮，夏凯，程思远
* [《JavaScript高级程序设计》](https://book.douban.com/subject/10546125/) => 王名归，夏凯，余兰，刘霞, 程思远
* [《JavaScript语言精粹》](https://book.douban.com/subject/11874748/) => 王名归，余兰（电子版）
* [《JavaScript忍者秘籍》](https://book.douban.com/subject/26638316/) => 艾青敏
* [《JavaScript DOM编程艺术》](https://book.douban.com/subject/1921890/) => 谢根，夏凯，余兰, 程思远
* [《编写可维护的JavaScript》](https://book.douban.com/subject/21792530/) => 王泊宁
* [《JavaScript面向对象编程指南》](https://book.douban.com/subject/26302623/) => 王泊宁
* [《JavaScript面向对象精要》](https://book.douban.com/subject/26352658/) => 王泊宁
* [《你不知道的JavaScript（上卷）》](https://book.douban.com/subject/26351021/) => 王泊宁
* [《你不知道的JavaScript（中卷）》](https://book.douban.com/subject/26854244/) => 王泊宁
* [《JavaScript高效图形编程 (修订版)》](https://book.douban.com/subject/26897714/) => 王泊宁
* [《编写可测试的JavaScript代码》](https://book.douban.com/subject/26348084/) => 王泊宁
* [《JavaScript 函数式编程》](https://book.douban.com/subject/26579320/) => 王泊宁
* [《响应式Web》](https://book.douban.com/subject/26663635/) => 王泊宁, 程思远
* [《DOM启蒙》](https://book.douban.com/subject/25882606/) => 胡亮，王泊宁
* [《ES6 标准入门（第2版）》](https://book.douban.com/subject/26708954/) => 王名归
* [《JavaScript从入门到精通》](https://book.douban.com/subject/26368348/) => 夏凯

### 框架库
* [《Angular.js权威指南》](https://book.douban.com/subject/25945442/)(1.x) => 叶凡
* [《Vue.js 前端开发 快速入门与专业应用》](https://book.douban.com/subject/26994869/) => 王名归
* [《Vue.js权威指南》](https://book.douban.com/subject/26869340/) => 刘霞
* [《jQuery应用开发实践指南》](https://book.douban.com/subject/26184678/) => 韦薇
* [《锋利的jQuery》](https://book.douban.com/subject/10792216/) => 韦薇
* [《用AngularJS开发下一代Web应用》](https://book.douban.com/subject/25752512/) => 韦薇
* [《jQuery权威指南》](https://book.douban.com/subject/25774789/)（电子版） => 余兰

### 性能优化
* [《高性能网站进阶版》](https://book.douban.com/subject/4719162/) => 余兰

### HTTP
* [《图解HTTP》](https://book.douban.com/subject/25863515/) => 王泊宁
* [《HTTP权威指南》](https://book.douban.com/subject/10746113/)（电子版） => 余兰

### 数学，数据结构，算法
* [《离散数学及其应用（原书第7版）》](https://book.douban.com/subject/26316200/) => 王泊宁

### Node.js
* [《深入浅出Node.js》](https://book.douban.com/subject/25768396/) => 王名归
* [《Node与Express开发》](https://book.douban.com/subject/26301434/) => 王名归
* [《Node.js实战》](https://book.douban.com/subject/25870705/) => 韦薇

### 设计模式
* [《Head First 设计模式》](https://book.douban.com/subject/2243615/) => 叶凡
* [《JavaScript设计模式》](https://book.douban.com/subject/24744217/) => 谢根，韦薇
