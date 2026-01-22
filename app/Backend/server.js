require("dotenv").config({ quiet: true })
const app = require("./app")

const PORT = process.env.PORT || 6769
const HOST = process.env.Docker_Active != "false" ? "0.0.0.0":"localhost"

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)
})
