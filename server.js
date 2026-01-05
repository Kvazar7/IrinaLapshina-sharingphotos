import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB(); // ✅ ЄДИНЕ підключення до MongoDB

app.use("/api/orders", ordersRouter);
app.use("/admin", express.static("admin"));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
