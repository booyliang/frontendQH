var path = require('path')
var qs = require('qs')
var fs = require('fs');
var opn = require('opn')
var axios = require('axios')
var pathToRegexp = require('path-to-regexp')
var utils = require('./utils')

function trim(str, char) {
    let reg = new RegExp(`^[${char}]+|[${char}]+$`, 'g');
    return str.replace(reg, '');
}
var plinId = utils.circleInfo.plineId || 1;
var mockGroupUrl = `http://rap.yryz.com/org/group/all.do?productlineId=${plinId}`;
var mockLoginUrl = 'http://rap.yryz.com/account/doLogin.do';
var mockAccount = {
    account: 'aiqingmin',
    password: '123456'
};
var mockApiUrl = 'http://rap.yryz.com/mock/getWhiteList.do?projectId=';
var baseHost = 'http://rap.yryz.com/mockjsdata/';
var routeApis = [];
var apiListDir = 'dist/project';
var apiListFile = path.join(__dirname, '..', apiListDir,'/apiList.js');

// 模拟用户登录，请求RAP all project mock Apis
var session = null;
let axiosInst = axios.create();
let request = require('request')
let loginParam = {
    url: mockLoginUrl,
    method: 'POST',
    headers: {
        ContentType: 'application/x-www-form-urlencoded'
    },
    form: mockAccount,
}
request(loginParam, (err, res) => {
    session = res.headers['set-cookie']; // 获取set-cookie字段值 
    getAllProjects(session)
});

// get all mock project info to a file
function getAllProjects(session) {
    let groupRequest = {
        url: mockGroupUrl,
        method: 'get',
        headers: {
            Cookie: session
        }
    }
    axiosInst.request(groupRequest)
        .then((res) => {
            let groupList = res.data && res.data.groups;
            groupList = groupList.filter((projectItem) => {
                return projectItem.projects.length;
            });

            let projects = [];
            for (let group of groupList) {
                projects.push(...group.projects)
            }
            return projects;
        }).then((data) => { //获取各个项目的相关接口
            let projectApis = data.map(item => {
                return axios.get(mockApiUrl + item.id)
            })
            axios.all(projectApis)
                .then(res => {
                    let apiList = [];
                    for (let item of res) {
                        let resPath = item.request.path;
                        let parts = resPath.split('=');
                        let pid = parts[parts.length - 1];
                        let apis = item.data
                            //.filter(api=>api.indexOf(''))
                            .map(api => {
                                let apiPath = alterPath(api), keys = [];
                                let re = pathToRegexp(apiPath, keys);
                                return { api, pid: pid, apiPath, re, keys }
                            })
                        apiList.push(...apis);
                    }
                    routeApis = apiList;
                    // todo: create apiList file if none
                    fs.writeFile(apiListFile, JSON.stringify(apiList), (err) => {
						if (err) {
							console.error('write apiList failed');
							throw err;
						}
						console.log('apiList write successfully***');
                    });
                })
        });
}
if (!fs.existsSync(apiListDir)) {
    createDir(apiListDir);
}

// read apiList and reasign re
fs.readFile(apiListFile, (err, data) => {
    if (err) {
        console.log('apiListFile', apiListFile);
        return;
    }
    let apiList = JSON.parse(data);
    for (let apiItem of apiList) {
        let keys = [];
        apiItem.re = pathToRegexp(apiItem.api, keys);
    }
    routeApis = apiList;
    
});
// replace "/{pageNo}/{pageSize}" with "/:pageNo/:pageSize" which pathToRegexp recogonized
function alterPath(pathParam) {
    let apiPath = pathParam.replace(/\{[^\}]+\}/g, (m) => {
        return ':' + m.substr(1, m.length - 2)
    });
    apiPath = '/' + trim(apiPath, '/').trim();
    return apiPath;
}
function createDir(pathToCreate) {
    pathToCreate.split(path.sep).reduce((curPath, folder) => {
        curPath += folder + path.sep;
        if (!fs.exists(curPath)) {
            fs.mkdirSync(curPath);
        }
        return curPath;
    }, '');
}

function mockMiddleWare(err, req, res, next){
    let reqPath = req.path;
    for (let route of routeApis) {
        let { re, api } = route;
        reqPath = reqPath.replace('/circle/services', '/services');
        if (re.exec(rerqPath)) {
            let mockUrl = baseHost + path.join(route.pid, route.api);
            console.log('mockUrl', mockUrl);
            return request(mockUrl).pipe(res);
        }
    }
    console.error('无法找到对应的mock接口', reqPath);
    res.end(new Error(err));
    next()  
}

utils.buildVendor(() => { 
	let app =  require('./dev-server');
	app.use(function(err,req,res,next){
		if(err){
			mockMiddleWare(err,req,res,next);
		}
	})
})
module.exports = mockMiddleWare;
