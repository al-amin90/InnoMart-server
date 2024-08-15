const express = require('express');
const cors = require('cors');
const app = express()


require('dotenv').config()
const port = 3000 || false;

app.get("/", (req, res) => {
    res.send("InnoMart server is running Perfectly...")
})

app.listen(port, () => {
    console.log(`the server port is running on ${port}`);
})