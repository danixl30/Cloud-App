const multer = require('multer');
const pathRoute = require('path')
const fs = require('fs');
const { stream } = require('express-form-data');

exports.upload = upload = (req, res) => {
    let route = req.params.path || '';
    if (route == '*') route = '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    console.log(route)
    route = '../public/'+route; 
    const storage = multer.diskStorage({
        destination: pathRoute.join(__dirname, route),
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });
    const uploadFile = multer({
        storage
    }).single('file');

    uploadFile(req, res, (err) => {
        if(!err){
            res.json({state: true, msg: ""})
        }else{
            res.json({state: false, msg: "error"})
        }
    });
}

exports.createDir = async (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    await fs.mkdir(route, (err) => {
        if(err){
            return res.json({state: false, msg: 'error'});
        }else{
            return res.json({state: true, msg: ''});
        }
    })
}

exports.deleteFile = async (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    console.log(route)
    route = pathRoute.join(__dirname, '../public/'+route);
    await fs.unlink(route, (err) => {
        if(err){
            console.log(err);
            return res.json({state: false, msg: 'error'});
        }else{
            return res.json({state: true, msg: ''});
        }
    })
}

exports.moveFile = async (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    const {newpath} = req.body || '';
    let newroute = newpath.replace('|', '/');
    while (newroute.indexOf('|') !== -1)
        newroute = newroute.replace('|', '/');
    newroute = pathRoute.join(__dirname, '../public/'+newroute)
    console.log(newroute)
    await fs.rename(route, newroute, (err) =>{
        if(err){
            return res.json({state: false, msg: 'error'});
        }else{
            return res.json({state: true, msg: ''});
        }
    })
}

exports.copyFile = async (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    const {newPath} = req.body || '';
    let newroute = newPath;
    while (newroute.indexOf('|') !== -1)
        newroute = newroute.replace('|', '/');
    console.log(route);
    console.log(newroute)
    newroute = pathRoute.join(__dirname, '../public/'+newroute)
    await fs.copyFile(route, newroute, (err) =>{
        if(err){
            return res.json({state: false, msg: 'error'});
        }else{
            return res.json({state: true, msg: ''});
        }
    })
}

exports.deleteDir = async (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    console.log(route)
    route = pathRoute.join(__dirname, '../public/'+route);
    await fs.rmdir(route, (err) => {
        if(err){
            return res.json({state: false, msg: 'error'});
        }else{
            return res.json({state: true, msg: ''});
        }
    })
}

exports.readDir = async (req, res) => {
    let route = req.params.path || '';
    if (route == '*') route = '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    let files = [];
    let folders = [];
    try {
        const filesName = fs.readdirSync(route)
        console.log(filesName)
        for(let i = 0; i < filesName.length; i++){
            if (filesName[i].indexOf('.') == -1){
                folders.push(filesName[i]);
            }else{
                files.push(filesName[i]);
            }
        }
        res.json({state: true, folders, files});
    } catch (error) {
       return res.json({state: false, folders, files});
    }
}

exports.downloadFile = (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    res.download(route);
}

exports.getPropeties = (req, res) => {
    let route = req.params.path || '';
    while (route.indexOf('|') !== -1)
        route= route.replace('|', '/');
    route = pathRoute.join(__dirname, '../public/'+route);
    const stats = fs.statSync(route);
    res.json({state: true, stats});
}

exports.getTree = (req, res) => {
    let matrix = [];
    function crawl(dir, parent, level){
        //console.log(dir);
        //console.log(level);
        //console.log(parent);
        let route = pathRoute.join(__dirname, '../public/'+dir);
        let items = fs.readdirSync(route);
        console.log(items);
        for (let i = 0; i < items.length; i++){
            let item = items[i];
            if (item.indexOf('.') === -1){
                //console.log(item);
                let object = {
                    name: item,
                    path: dir,
                    parent
                }
                if (matrix[level]){
                    let arrayTemp = matrix[level];
                    arrayTemp.push(object);
                    matrix[level] = arrayTemp;
                }else{
                    let arrayTemp = [];
                    arrayTemp.push(object);
                    matrix[level] = arrayTemp;
                }
                if (dir === ''){
                    crawl(item, item, level+1);
                }else{
                    crawl(dir+'/'+item, item, level+1);
                }
            }
        }

    }
    crawl('', '', 0);    
    res.json({matrix});
}