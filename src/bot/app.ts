import {InlineKeyboard, Keyboard, KeyboardBuilder, MessageContext, Telegram} from "puregram"

export const bot = Telegram.fromToken("6032230275:AAFn5BwIeL-TRAsUdo_gBfzQvil6_phaIrI");

bot.updates.on("message", async (context) => {
  const keyboard = new KeyboardBuilder().textButton('Добавить продукт!').textButton('Добавить категории!').row().textButton('Настройки ⚙️').resize();

  await context.send("Hi i'm bot", {reply_markup: keyboard});
});