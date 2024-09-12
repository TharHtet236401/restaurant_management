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


// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Welcome to the restaurant management system");
//   bot.sendMessage(chatId, "Please register your restaurant name");
// });

let userState = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (!userState[chatId]) {
    userState[chatId] = { state: "initial" };
  }



  switch (userState[chatId].state) {
    case "initial":
      if (message.toLowerCase() === "register") {
        await bot.sendMessage(chatId, "Welcome to the restaurant management system");
        await bot.sendMessage(chatId, "Please enter your restaurant name to register:");
        userState[chatId].state = "awaitingName";
      } else {
        await bot.sendMessage(chatId, "Please type 'register' to start the registration process.");
      }
      break;

    case "awaitingName":
      userState[chatId].restaurantName = message;
      await bot.sendMessage(chatId, `Are you sure you want to register "${message}" as your restaurant name?`);
      await bot.sendMessage(chatId, "Please respond with 'yes' to confirm or 'no' to change the name.");
      userState[chatId].state = "confirmingName";
      break;

    case "confirmingName":
      if (message.toLowerCase() === "yes") {
        await bot.sendMessage(chatId, `Restaurant name "${userState[chatId].restaurantName}" registered successfully!`);
        // TODO: Save the restaurant name to the database
        userState[chatId].state = "initial";
      } else if (message.toLowerCase() === "no") {
        await bot.sendMessage(chatId, "Please enter a new name for your restaurant:");
        userState[chatId].state = "awaitingName";
      } else {
        await bot.sendMessage(chatId, "Please respond with 'yes' to confirm or 'no' to change the name.");
      }
      break;

    default:
      await bot.sendMessage(chatId, "An error occurred. Please type 'register' to start over.");
      userState[chatId].state = "initial";
  }
});



app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
