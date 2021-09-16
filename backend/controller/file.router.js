const { Router } = require('express')
const router = new Router();

const {upload, createDir, deleteFile, moveFile, copyFile, readDir, downloadFile, getPropeties, deleteDir, getTree} = require('../service/file.service');

router.post('/upload/:path', upload);

router.post('/createdir/:path', createDir);

router.delete('/deletefile/:path', deleteFile)

router.delete('/deletedir/:path', deleteDir)

router.put('/movefile/:path', moveFile);

router.post('/copyfile/:path', copyFile);

router.get('/getdir/:path', readDir);

router.get('/file/:path', downloadFile);

router.get('/props/:path', getPropeties);

router.get('/gettree', getTree);

module.exports = router;