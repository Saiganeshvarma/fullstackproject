require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
var productRoutes = require("./routes/productRoutes")
const connectToDatabase = require("./database/db");

const app = express();

// ✅ CORS FIRST
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);

app.use("/api/products",productRoutes)

// Connect MongoDB
connectToDatabase();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
