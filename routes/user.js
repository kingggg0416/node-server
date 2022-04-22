const express = require("express")
const { append } = require("express/lib/response")

const router = express.Router()

append.get("/", (req, res) => {
    res.send("Hello")
})


module.exports = router