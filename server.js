const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors");
require("dotenv").config();

const app = express()
app.use(cors({
  origin: "http://localhost:5173", // React dev server URL
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json())


const authRouter = require("./router/auth")
app.use("/api/auth" , authRouter)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
