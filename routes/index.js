const express = require('express');
const router = express.Router();
const sharp = require('sharp');  //img resizer
const multer = require('multer'); //img uploader
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});


router.get('/', initPage)
router.post('/upload', upload.single('file'), fileUpload)
router.post('/resize', upload.single('file'), fileResize)
router.post('/clearFile', clearFile)


function initPage(req,res){
    res.render('index.html');
}

function fileUpload(req,res){
  const {file} = req;
  console.log(`file upload`)
  res.send({result:'upload success'})
}

function fileResize(req,res){
    const {rewidth, reheight, rename, retype} = req.body
    const {file} = req;
    const resizedFileName = rename
    const resizedFilePath = 'uploads/resized_'+file.filename
    let result = {}
    sharp(file.path)
    .resize({ width: Number(rewidth), height:Number(reheight) })
    .toFile(resizedFilePath)
    .then((done)=> {
        console.log('resizing done')
        result.data = done
        result.name = resizedFileName
        result.path = resizedFilePath
        
        //리사이징 후 서버에서 원본 파일 자동 삭제
        deleteFile(file.path) 

        res.send({result})
    })
}


function deleteFile(filePath){
  console.log(`del...${filePath}`)
  const fs = require('fs')
  fs.unlink(filePath, (err, result)=> {
    if(err) console.log(err)
    return;
  })
}


//요청시 로컬의 리사이즈 파일 삭제
function clearFile(req,res){
  const {filePath} = req.body
  deleteFile(filePath)
  res.send({result:'deleted'})
}


module.exports = router;