import {SendMessage, TGResult, Update} from "../types";
import {debug} from "../debug";
import request from "request";

export type UpdateType = 'message';

export class Telegram {
    protected token: string = '';
    constructor(token: string) {
        this.token = token;
    }

    private events: {type: string, callback: (event: TGResult) => void}[] = [];

    async start(offset?: number): Promise<void> {
        try {
            request.get(`https://api.telegram.org/bot${this.token}/getUpdates?timeout=20${ offset ? `&offset=${offset}` : '' }`, (error, response, body) => {
                const data: Update = JSON.parse(body)
                if (data && data.ok) {
                    for (const update of data.result) {
                        if (update.message) {
                            update.send = async (message: SendMessage) => {
                                try {
                                    message.chat_id = update.message?.chat.id
                                    request.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {body: JSON.stringify(message), headers: { "Content-Type": "application/json" }});
                                } catch (e) {
                                    debug({message: (e as Error).message, file: 'features/bot.ts', method: 'send callback'});
                                }
                            }
                            this.events.map(event => {
                                if (event.type === 'message') {
                                    event.callback(update);
                                }
                            });
                        }
                    }
                    this.start(data.result.length ? data.result[data.result.length - 1].update_id + 1 : undefined);
                } else {
                    this.start(data.result && data.result.length ? data.result[data.result.length - 1].update_id + 1 : undefined);
                }
            });
        } catch (e) {
            debug({message: (e as Error).message, file: 'features/bot.ts', method: 'start'});
            this.start();
        }
    }

    on(event: UpdateType, callback: (event: TGResult) => void) {
        this.events.push({
            type: event,
            callback
        });
    }
}