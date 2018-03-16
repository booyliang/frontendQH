// node addCss.js 运行代码后自动将src/circle/圈子/assets/column中的图片 添加到 src/circle/圈子/css/app.css中

let fs = require('fs');
let path = require("path");

function task() {
	let sourceDir = path.join(__dirname, "..", "src/circle")
	let files = fs.readdirSync(sourceDir);
	for (let file of files) {
		let columnPath = path.join(sourceDir, file, 'assets', 'column');
		if (!fs.existsSync(columnPath))
			continue; // 如果不存在跳出此次循环 此时不执行后面的
		let images = fs.readdirSync(columnPath);
		let cssFile = path.join(__dirname, "../src/circle/" + file + "/css/app.css");
		let content = fs.readFileSync(cssFile, 'utf-8').toString();
		let cssRules = images
		.filter(img => !content.includes(img))
		.map((img) => ".column-item ." + img.slice(0, img.lastIndexOf('.')) + "{ background-image: url(../assets/column/" + img + ")}");	
		if (cssRules.length > 0){
				console.log('cssRules', cssRules);
				fs.appendFileSync(cssFile, '\n' + cssRules.join('\n'));
		}
			
	}


}

task();
