const express = require('express')
const router = express.Router()

router.post('/', (req, res, next)=>{
    const nickName = req.body.nickName
    console.log(nickName)
})

module.exports = router