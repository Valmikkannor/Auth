require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use("/", authRoute)


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send("Server working ✅");
});
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});