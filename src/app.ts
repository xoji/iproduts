import Express, {json, Request, urlencoded} from "express";
import "./model";
import cors from "cors";
import {create} from "express-handlebars"
import * as path from "path";
import {update} from "./bot/app";
import {db} from "./db";
import {debug} from "./debug";
import jwt from "jsonwebtoken"
import {Category} from "./model";
import {SendMessage, TGResult} from "./types";
import axios from "axios";

const app = Express();

const hbs = create({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: path.join(__dirname, '..', 'views/layouts/'),
  partialsDir: [path.join(__dirname, '..', 'views/partials')],
  helpers: {
    if_eq: (a: any, b: string, options: any) => {
      if (a == b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    concat: (...strings: any) => {
      let con: string = '';
      for (let i = 0; i < strings.length; i++) {
        if (i != strings.length - 1) {
          con += `${strings[i]}`;
        }
      }
      return con
    },
    includes: (a: string, b: string, options: any) => {
      if (a.includes(b)) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('views', ['views', 'views/pages']);
app.set('view engine', 'hbs');
app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/', Express.static(path.resolve(__dirname, '..', 'static')))

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/category', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      res.redirect('/');
      return
    }
    const token = jwt.verify((user as string), 'bearer');
    if (!token) {
      res.redirect('/');
      return
    }
    res.render('category.hbs');
  } catch (e) {
    res.redirect('/')
  }
});

app.post('/api/category', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(200).json({
        status: false,
        message: "No required data!"
      });
      return
    }
    const created = await Category.create({
      name: name.text
    });
    if (!created) {
      res.status(200).json({
        status: false,
        message: "try again!"
      });
      return
    }

    res.status(200).json({
      status: true,
      message: "Success!"
    });
  } catch (e) {
    debug({
      message: (e as any).message,
      file: 'app.ts',
      method: '/api/category'
    });
    res.status(200).json({
      status: false,
      message: "Something went wrong!"
    });
  }
});

app.post('/tg/update', async (req: Request<any, any, TGResult>, res) => {
  try {
    req.body.send = async (message: SendMessage) => {
      message.chat_id = req.body.message?.chat.id ||
        req.body.chat_member?.chat.id ||
        req.body.channel_post?.chat.id ||
        req.body.chat_join_request?.chat.id ||
        req.body.edited_channel_post?.chat.id ||
        req.body.edited_message?.chat.id;
      await axios.post('https://api.telegram.org/bot6032230275:AAFn5BwIeL-TRAsUdo_gBfzQvil6_phaIrI/sendMessage', message);
    }
    await update(req.body);
    res.status(200).json({
      ok: true
    });
  } catch (e) {
    debug({message: (e as Error).message, file: 'src/app.ts', method: '/tg/update'});
    res.status(200).json({
      ok: false
    });
  }
});

db.authenticate().then(() => {
  console.log('Database is authenticated!');
  db.sync().then(() => {
    console.log('Database synchronized!');
    app.listen(4000, "localhost", () => {
      console.log("app started on host: http://localhost:4000");
    });
  }).catch((e) => {
    debug({
      message: `Database sync failed! error: ${e.message}`,
      method: 'db.sync()',
      file: 'app.ts'
    });
  });
}).catch((e) => {
  debug({
    message: `Database authenticate failed! error: ${e.message}`,
    method: 'db.authenticate()',
    file: 'app.ts'
  });
});