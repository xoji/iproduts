import {MessageContext} from "puregram";
import {User} from "../model";
import {adminkeyboard, buildAdminKeyboard} from "./app";
import {debug} from "../debug";

export class BotController {
    async addCategory(context: MessageContext) {

    }

    async settings(context: MessageContext) {
        try {
            await context.send('Извините но настройки сейчас недоступно!');
        } catch (e) {

        }
    }

    async login(context: MessageContext) {
        try {
            const user = await User.findOne({ where: { chat_id: context.chatId } });
            if (user && user.granted) {
                await context.send('Вы уже в системе! 😉', {reply_markup: buildAdminKeyboard(user.token!)});
            }
            const created = await User.create({
                name: context.chat.firstName || '',
                chat_id: `${context.chatId}`,
                isAdmin: true,
                isGroup: false,
                granted: false
            });
            if (!created) {
                await context.send('Что-то пошло не так, попробуйте снова! 😅');
                return
            }
            await context.send('Отправте пароль для входа!', {reply_markup: {remove_keyboard: true}});
            return
        } catch (e: any) {
            debug({message: `${e.message}`, method: 'login', file: 'bot/controller.ts'});
            await context.send('Произошла ошибка! Попробуйте позже! 😅');
        }
    }
}