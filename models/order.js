import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    clientNames: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    sessionType: {
      type: String,
      enum: ["Newborn", "3 month", "1 year", "Family", "Pregnant", "Custom"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["certificate", "personal"],
      required: true,
    },

    sessionDate: {
      type: Date,
      required: null,
    },

    photoCount: {
      type: Number,
      required: null,
      min: 1,
      max: 200,
    },

    publishPermission: {
      type: String,
      enum: ["yes", "no", "after_christening"],
      default: "no",
    },

    comments: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "draft",        // Попередні
        "waiting",      // Чекаємо зйомку
        "raw_ready",    // Готуємо фото на відбір
        "editing",      // Обробка
        "edited",       // Оброблено (готові для скачування)
        "completed"     // Завершено
        ],
      default: "draft"
    },

    photos: [{ type: String }],
    folderId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
