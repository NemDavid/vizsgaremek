require("dotenv").config({ quiet: true })
const app = require("./app")

const PORT = process.env.PORT || 6769
const HOST = process.env.HOST || (process.env.NODE_ENV === "development" ? "localhost" : "0.0.0.0")


app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})
