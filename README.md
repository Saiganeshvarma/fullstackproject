Got it! Let’s create a **complete, modular backend for user registration** with `name`, `email`, `password`, and `profilePic` (image upload). We will use **Express**, **Mongoose**, **Cloudinary** for image storage, and **bcryptjs** for password hashing. I’ll structure it properly with separate files for each module.

Here’s a step-by-step setup.

---

## **1. Project Structure**

```
project/
│
├─ server.js
├─ config/
│   └─ cloudinary.js
├─ models/
│   └─ User.js
├─ routes/
│   └─ auth.js
├─ controllers/
│   └─ authController.js
├─ helpers/
│   └─ cloudinaryHelper.js
├─ middleware/
│   └─ upload.js
├─ package.json
```

---

## **2. Install Dependencies**

```bash
npm init -y
npm install express mongoose bcryptjs cloudinary multer dotenv
```

---

## **3. Environment Variables (`.env`)**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## **4. Cloudinary Configuration (`config/cloudinary.js`)**

```js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

---

## **5. Cloudinary Helper (`helpers/cloudinaryHelper.js`)**

```js
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profilePics",
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

module.exports = { uploadToCloudinary };
```

---

## **6. Multer Middleware (`middleware/upload.js`)**

```js
const multer = require("multer");
const path = require("path");

// Store file temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
```

> **Note:** You need an `uploads/` folder in the root for temporary storage.

---

## **7. User Model (`models/User.js`)**

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
});

module.exports = mongoose.model("User", userSchema);
```

---

## **8. Auth Controller (`controllers/authController.js`)**

```js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // Remove file from server after upload
    fs.unlinkSync(req.file.path);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: { url, publicId },
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic.url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
```

---

## **9. Auth Routes (`routes/auth.js`)**

```js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { registerUser } = require("../controllers/authController");

router.post("/register", upload.single("profilePic"), registerUser);

module.exports = router;
```

---

## **10. Main Server File (`server.js`)**

```js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

✅ **Usage:**

* Endpoint: `POST /api/auth/register`
* Form Data (multipart/form-data):

  * `name` → string
  * `email` → string
  * `password` → string
  * `profilePic` → image file

This setup **uploads the profile pic to Cloudinary**, stores the URL and publicId in MongoDB, and hashes the password securely.

---

If you want, I can **also make it return a JWT token on registration** so the user can be logged in immediately. This is usually standard for most apps.

Do you want me to do that next?
