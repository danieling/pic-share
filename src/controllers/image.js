const path = require('path')
const fs = require('fs-extra')
const { randomName } = require('../helpers/libs')
const ctrl = {}

ctrl.id = (req, res) => {

}

ctrl.create = async (req, res) => {
    const name = randomName()
    const ext = path.extname(req.file.originalname).toLowerCase()
    const imgPath = req.file.path
    const targetPath = path.resolve(`src/public/upload/${name}${ext}`)
    if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
        await fs.rename(imgPath, targetPath)
    }
    res.send('Works')
}

ctrl.like = (req, res) => {

}

ctrl.comment = (req, res) => {

}

ctrl.delete = (req, res) => {
    
}

module.exports = ctrl