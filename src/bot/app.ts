import {KeyboardBuilder, MessageContext, Telegram} from "puregram"
import {BotController} from "./controller";
import {User} from "../model";

export const bot = Telegram.fromToken("6032230275:AAFn5BwIeL-TRAsUdo_gBfzQvil6_phaIrI");

interface Commands {
  command: string;
  callback: (context: MessageContext) => void;
  authRequired: boolean;
}
const controller = new BotController()
const commands: Commands[] = [
  {
    command: 'Добавить категории!',
    callback: controller.addCategory,
    authRequired: true
  },
  {
    command: 'Войти',
    callback: controller.login,
    authRequired: false
  }
]

export const adminkeyboard = new KeyboardBuilder().textButton('Добавить продукт!').textButton('Добавить категории!').row().textButton('Настройки ⚙️').resize();
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
        await context.send('Извините, я вас не понял! 😅', {reply_markup: adminkeyboard});
      }
    } else {
      if (context.text === '31141bb6-3b4c-4d7c-badd-4a52efd596f4') {
        await user.update({
          granted: true, updatedAt: new Date()
        });
        await context.send('Добро пожаловать! 😊', {reply_markup: adminkeyboard});
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