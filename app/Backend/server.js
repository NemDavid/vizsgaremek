require("dotenv").config({ quiet: true });
const app = require("./app");

const PORT = process.env.PORT || 6769;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});