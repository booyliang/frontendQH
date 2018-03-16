let HappyPack = require('happypack')
const os = require('os');
const happThreadPool = HappyPack.ThreadPool({
	size: os.cpus().length
});
let packs = [
	new HappyPack({
		id: '1',	
		loaders: ['vue-loader'],
		threadPool: happThreadPool
	}),
	new HappyPack({
		id: 'eslint',	
		loaders: ['eslint-loader'],
		threadPool: happThreadPool
	}),
	new HappyPack({
		id: 'babel',	
		loaders: ['babel-loader'],
		threadPool: happThreadPool
	})
	// , new HappyPack({
	//     id: 'css',   
	//     loaders: ['vue-style-loader','css-loader','postcss-loader']
	// 	})
	//  	new HappyPack({
	//     id: 'css',   
	//     loaders: [ 'css-loader?mportLoaders=1' ]
	//   })
]


module.exports = packs