import Express, {json, urlencoded} from "express";
import "./model";
import cors from "cors";
import {create} from "express-handlebars"
import * as path from "path";
import {bot} from "./bot/app";
import {db} from "./db";
import {debug} from "./debug";

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


bot.updates.startPolling().then(() => {
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
}).catch((e) => {
  debug({
    message: `Start bot polling failed! error: ${e.message}`,
    method: 'startPolling()',
    file: 'app.ts'
  });
});