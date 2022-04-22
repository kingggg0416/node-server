const express = require("express")
const { append } = require("express/lib/response")

const router = express.Router()

app.get("/", (req, res) => {
    res.send("Hello")
})


module.exports = router