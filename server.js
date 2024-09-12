import dotenv from "dotenv";
import express from "express";
import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";

import { connectDB } from "./config/connectMongo.js";

dotenv.config();

const app = express();

app.use(express.json());

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
app.use(express.static("public"));

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  bot.sendMessage(chatId, `You said: ${message}`);
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
