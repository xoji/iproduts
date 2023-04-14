import {KeyboardBuilder, MessageContext, Telegram} from "puregram"
import {BotController} from "./controller";
import {User} from "../model";
import jwt from "jsonwebtoken";

export const bot = Telegram.fromToken("6032230275:AAFn5BwIeL-TRAsUdo_gBfzQvil6_phaIrI");

interface Commands {
  command: string;
  callback: (context: MessageContext) => void;
  authRequired: boolean;
}
const controller = new BotController()
const commands: Commands[] = [
  {
    command: 'Настройки ⚙️',
    callback: controller.settings,
    authRequired: true
  },
  {
    command: 'Войти',
    callback: controller.login,
    authRequired: false
  }
]

export const adminkeyboard = new KeyboardBuilder().textButton('Добавить продукт!').webAppButton("Добавить категории!", "https://iproduct.uz/category?user").row().textButton('Настройки ⚙️').resize();

export function buildAdminKeyboard(token: string) {
  return new KeyboardBuilder().textButton('Добавить продукт!').webAppButton("Добавить категории!", `https://iproduct.uz/category?user=${token}`).row().textButton('Настройки ⚙️').resize()
}
export const keyboard = new KeyboardBuilder().textButton('Войти').resize()

bot.updates.on("message", async (context: MessageContext) => {
  const user = await User.findOne({ where: {chat_id: context.chatId} });
  if (user) {
    if (user.granted) {
      let success = false;
      for (const c of commands) {
        if (context.text === c.command) {
          c.callback(context);
          success = true;
          break
        }
      }
      if (!success) {
        await context.send('Извините, я вас не понял! 😅', {reply_markup: buildAdminKeyboard(user.token!)});
      }
    } else {
      if (context.text === '31141bb6-3b4c-4d7c-badd-4a52efd596f4') {
        const token = jwt.sign({
          id: user.id,
          name: user.name,
          admin: user.isAdmin,
          createdAt: user.createdAt
        }, 'bearer');
        await user.update({
          granted: true, updatedAt: new Date(),
          token
        });
        await context.send('Добро пожаловать! 😊', {reply_markup: buildAdminKeyboard(user.token!)});
      } else {
        await context.send('Неправильный пароль! Попробуйте снова!', {reply_markup: {remove_keyboard: true}});
      }
    }
  } else {
    let success: boolean = false;
    for (const c of commands) {
      if (!c.authRequired && c.command === context.text) {
        c.callback(context);
        success = true;
        break
      }
    }
    if (!success) {
      await context.send("У вас нет доступа к этому боту!", {reply_markup: keyboard});
    }
  }

});