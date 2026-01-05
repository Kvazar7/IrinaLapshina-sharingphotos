import express from "express";
import Order from "../models/order.js";
import fs from "fs/promises";
import path from "path";
import { createMulterForFolder } from "../config/multer.js";

const router = express.Router();

// GET all orders (для тесту)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});
// створення нового замовлення
router.post("/create", async (req, res) => {
  try {
    const { 
      clientNames,
      phone,
      sessionType,
      orderType,
      sessionDate,
      photoCount,
      publishPermission,
      comments
    } = req.body;

    const folderId = Date.now().toString(); // унікальний ID(треба змінити логіку генерації на більш надійну)

    const base = path.join("uploads", folderId);
    await fs.mkdir(path.join(base, "raw"), { recursive: true });
    await fs.mkdir(path.join(base, "selected"), { recursive: true });
    await fs.mkdir(path.join(base, "edited"), { recursive: true });

    const order = await Order.create({
      clientNames,
      phone,
      sessionType,
      orderType,
      sessionDate,
      photoCount,
      publishPermission,
      comments,
      folderId,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
// Завантаження RAW фото
router.post("/:id/upload-raw", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    // шлях до папки raw
    const rawFolder = path.join("uploads", order.folderId, "raw");
    // створюємо multer саме для цієї папки
    const upload = createMulterForFolder(rawFolder).array("photos", 50); // можна завантажити до 50 файлів за раз
    
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload error" });
      }
      // зберігаємо масив файлів у БД
      const fileNames = req.files.map(f => f.filename);
      order.rawPhotos.push(...fileNames);
      await order.save();

      res.json({
        success: true,
        uploaded: fileNames,
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
