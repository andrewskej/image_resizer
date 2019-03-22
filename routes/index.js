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
router.post('/resize', upload.single('file'), fileResize)


function initPage(req,res){
    res.render('index.html');
}


function fileResize(req,res){
    const {rewidth, reheight} = req.body
    const {file} = req;
    const resizedFilePath = 'uploads/resized_'+file.filename
    let result = {}
    sharp(file.path)
    .resize({ width: Number(rewidth), height:Number(reheight) })
    .toFile(resizedFilePath)
    .then((done)=> {
        console.log('resizing done')
        result.data = done
        result.path = resizedFilePath
        res.send(result)
    })
}




module.exports = router;