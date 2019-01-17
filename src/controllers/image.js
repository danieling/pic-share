const path = require('path')
const fs = require('fs-extra')
const { randomName } = require('../helpers/libs')
const { Image, Comment } = require('../models')
const md5 = require('md5')

const ctrl = {}

ctrl.id = async (req, res) => {
    const img = await Image.findOne({filename: {$regex: req.params.image_id}})
    res.render('image', {img})
}

ctrl.create = (req, res) => {
    const saveImage = async () => {
        const name = randomName()
        const images = await Image.find( { filename: name})
        if(images.length > 0){
            saveImage()
        } else {
            const ext = path.extname(req.file.originalname).toLowerCase()
            const imgPath = req.file.path
            const targetPath = path.resolve(`src/public/upload/${name}${ext}`)
            if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
                await fs.rename(imgPath, targetPath)
                const newImg = new Image({
                    title: req.body.title,
                    filename: name + ext,
                    description: req.body.description
                })
                const imgSave = await newImg.save()
                res.redirect('/images/' + name)
            } else {
                await fs.unlink(imgPath)
                res.status(500).json({ error: 'Only images are Allowed'})
            }
        }
    }
    saveImage()
}

ctrl.like = (req, res) => {

}

ctrl.comment = async (req, res) => {
    const img = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(img){
        const newComment = new Comment(req.body)
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = img._id
        await newComment.save()
        res.redirect('/images/' + img.uniqueId)
    }
}

ctrl.delete = (req, res) => {
    
}

module.exports = ctrl