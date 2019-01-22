const path = require('path')
const fs = require('fs-extra')
const { randomName } = require('../helpers/libs')
const { Image, Comment } = require('../models')
const sidebar = require('../helpers/sidebar')
const md5 = require('md5')

const ctrl = {}

ctrl.id = async (req, res) => {
    let viewmodel = {img: {}, comments: {}}
    const img = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (img){
        img.views = img.views + 1
        viewmodel.img = img
        await img.save()
        const comments = await Comment.find({image_id: img._id})
        viewmodel.comments = comments
        viewmodel = await sidebar(viewmodel)
        res.render('image', viewmodel)
    } else {
        res.redirect('/')
    }
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

ctrl.like = async (req, res) => {
   const image = await Image.findOne({filename: {$regex: req.params.image_id}})
   if(image){
       image.likes = image.likes + 1
       await image.save()
       res.json({likes: image.likes})
   } else {
       res.status(500).json({error: 'Image not found and cannot be liked'})
   }
}

ctrl.comment = async (req, res) => {
    const img = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(img){
        const newComment = new Comment(req.body)
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = img._id
        await newComment.save()
        res.redirect('/images/' + img.uniqueId)
    } else {
        res.redirect('/')
    }
}

ctrl.delete = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(image){
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename))
        await Comment.deleteMany({image_id: image._id})
        await image.remove()
        res.json(true)
    }
}

module.exports = ctrl