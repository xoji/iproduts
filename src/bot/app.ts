import {BotController} from "./controller";
import {User} from "../model";
import jwt from "jsonwebtoken";
import {ReplyKeyboardMarkup, TGResult} from "../types";

interface Commands {
  command: string;
  callback: (context: TGResult) => void;
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

export function buildAdminKeyboard(token: string): ReplyKeyboardMarkup {
  return {
    keyboard: [
        [
          {
            text: 'Добавить продукт!'
          },
          {
            text: 'Добавить категории!',
            web_app: {
              url: `https://iproduct.uz/category?user=${token}`
            }
          }
        ],
        [
          {
            text: 'Настройки ⚙️'
          }
        ]
    ],
    resize_keyboard: true
  }
}
export const keyboard: ReplyKeyboardMarkup = {
  keyboard: [
      [
        {
          text: 'Войти'
        }
      ]
  ],
  resize_keyboard: true
}

export async function update(context: TGResult) {
  if (context.send) {
    const user = await User.findOne({ where: {chat_id: context.message!.chat.id} });
    if (user) {
      if (user.granted) {
        let success = false;
        for (const c of commands) {
          if (context.message!.text === c.command) {
            c.callback(context);
            success = true;
            break
          }
        }
        if (!success) {
          await context.send({text: 'Извините, я вас не понял! 😅', reply_markup: buildAdminKeyboard(user.token!)});
        }
      } else {
        if (context.message!.text === '31141bb6-3b4c-4d7c-badd-4a52efd596f4') {
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
          await context.send({text: 'Добро пожаловать! 😊', reply_markup: buildAdminKeyboard(user.token!)});
        } else {
          await context.send({text: 'Неправильный пароль! Попробуйте снова!', reply_markup: {remove_keyboard: true}});
        }
      }
    } else {
      let success: boolean = false;
      for (const c of commands) {
        if (!c.authRequired && c.command === context.message!.text) {
          c.callback(context);
          success = true;
          break
        }
      }
      if (!success) {
        await context.send({text: 'У вас нет доступа к этому боту!', reply_markup: keyboard});
      }
    }
  }
}