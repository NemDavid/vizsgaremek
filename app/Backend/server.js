require("dotenv").config({ quiet: true })
const app = require("./app")

const PORT = process.env.PORT || 6769
const HOST = "127.0.0.1"

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})
