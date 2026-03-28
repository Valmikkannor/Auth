require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: [

            "https://auth-frontend-ten-tau.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 4000;



app.use("/", authRoute)


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});