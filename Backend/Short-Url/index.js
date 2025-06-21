const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./connect");
const {checkForAuthentication,restrictTo}= require("./middleware/auth");
const cors = require("cors");


const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const PORT = 8001;
connectDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB connected"));

const app = express();

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  credentials: true,               // Allow cookies
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // Added this line
app.use(checkForAuthentication);



// Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/",staticRoute);
app.use("/user", userRoute);

// Short URL Redirect Handler
app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error fetching URL:", error);
        return res.status(500).send("Internal server error");
    }
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

