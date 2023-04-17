// import {MessageContext} from "puregram";
import {User} from "../model";
// import {adminkeyboard, buildAdminKeyboard} from "./app";
import {debug} from "../debug";
import {TGResult} from "../types";
import {buildAdminKeyboard} from "./app";

export class BotController {
    async addCategory(context: TGResult) {

    }

    async settings(context: TGResult) {
        try {
            if (context.send) {
                await context.send({text: 'Извините но настройки сейчас недоступно!'});
            }
        } catch (e) {

        }
    }

    async login(context: TGResult) {
        if (context.send) {
            try {
                const user = await User.findOne({ where: { chat_id: context.message!.chat.id } });
                if (user && user.granted) {
                    await context.send({ text: 'Вы уже в системе! 😉', reply_markup: buildAdminKeyboard(user.token!)});
                }
                const created = await User.create({
                    name: context.message!.from!.first_name || '',
                    chat_id: `${context.message!.chat.id}`,
                    isAdmin: true,
                    isGroup: false,
                    granted: false
                });
                if (!created) {
                    await context.send({text: 'Что-то пошло не так, попробуйте снова! 😅'});
                    return
                }
                await context.send({text: 'Отправте пароль для входа!', reply_markup: {remove_keyboard: true}});
                return
            } catch (e: any) {
                debug({message: `${e.message}`, method: 'login', file: 'bot/controller.ts'});
                await context.send({text: 'Произошла ошибка! Попробуйте позже! 😅'});
            }
        }
    }
}