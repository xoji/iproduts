import Express, {json, Request, urlencoded} from "express";
import "./model";
import cors from "cors";
import {create} from "express-handlebars"
import * as path from "path";
import {update} from "./bot/app";
import {db} from "./db";
import {debug} from "./debug";
import jwt from "jsonwebtoken"
import {Category, Images, Option, Prices, Product, User} from "./model";
import {SendMessage, TGResult} from "./types";
import axios, {AxiosResponse} from "axios";
import fileUpload from "express-fileupload";

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
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '..', '/static/tmp')
}))

app.use('/', Express.static(path.resolve(__dirname, '..', 'static')))

app.get('/', async (req, res) => {
  const result: any[] = [];
  const categories = await Category.findAll({raw: true});
  for (const c of categories) {
    const products = await Product.findAll({where: { category_id: c.id }, raw: true});
    const prod: any[] = [];
    for (const p of products) {
      const options = await Option.findAll({ where: { product_id: p.id }, raw: true });
      const image = await Images.findOne({ where: { product_id: p.id }, raw: true });
      p.desc = p.desc!.length > 500 ? `${p.desc?.slice(0, 500)} ...` : p.desc;
      prod.push({
        product: p,
        options: options,
        image: image
      });
    }
    result.push({
      category: c,
      products: prod
    });
  }

  res.render('index', {
    data: result
  });
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
    res.render('category');
  } catch (e) {
    res.redirect('/')
  }
});

app.get('/set-product', async (req, res) => {
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
    res.render('product');
  } catch (e) {
    res.redirect('/');
  }
})

app.get('/product/:id', async (req, res) => {
  const prod = await Product.findOne({ where: {id: req.params.id}, raw: true });
  if (!prod) {
    res.redirect('/');
    return
  }
  const prices = await Prices.findAll({ where: { product_id: prod.id }, raw: true });
  for (let i = 0; i < prices.length; i++) {
    (prices[i].general_price as any) = prices[i].general_price.toLocaleString('ru-RU');
    (prices[i].per_month as any) = prices[i].per_month.toLocaleString('ru-RU');
  }
  (prod.price as any) = prod.price.toLocaleString('ru-RU');
  (prod.colors as any) = JSON.parse(prod.colors as any);
  (prod as any).options = await Option.findAll({ where: { product_id: prod.id }, raw: true });
  (prod as any).prices = prices;
  (prod as any).images = await Images.findAll({ where: { product_id: prod.id }, raw: true });
  res.render('single-post', {
    product: prod,
    prod_as_string: JSON.stringify(prod)
  });
})

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

app.get('/get/categories', async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json({
    status: true,
    data: categories
  });
});

app.post('/product/create', async (req, res) => {
  try {
    if (!req.files) {
      res.status(200).json({
        status: false,
        message: 'Вы не выбрали файл!'
      });
      return
    }
    let { name, desc, category_id, price, prices, colors, chars } = req.body;
    if (!name || !desc || !category_id || !price || !prices || !colors || !chars) {
      res.status(200).json({
        status: false,
        message: 'Необходимо заполнить все поля!'
      });
      return
    }

    category_id = parseInt(category_id);
    price = parseInt(price);
    prices = JSON.parse(prices);
    colors = JSON.parse(colors);
    chars = JSON.parse(chars);

    const prod = await Product.create({
      name, desc, category_id, price, colors
    });
    if (Array.isArray(req.files.images)) {
      for (const i of req.files.images) {
        const fileName = new Date().getTime();
        await i.mv(path.resolve(__dirname, '..', 'static', 'assets', `${fileName}${path.extname(i.name)}`));
        await Images.create({
          link: `/assets/${fileName}${path.extname(i.name)}`,
          product_id: prod.id
        });
      }
    } else {
      const fileName = new Date().getTime();
      await req.files.images.mv(path.resolve(__dirname, '..', 'static', 'assets', `${fileName}${path.extname(req.files.images.name)}`));
      await Images.create({
        link: `/assets/${fileName}${path.extname(req.files.images.name)}`,
        product_id: prod.id
      });
    }
    for (const p of prices) {
      await Prices.create({
        months: p.months,
        general_price: p.general_price,
        per_month: p.per_month,
        product_id: prod.id
      });
    }

    for (const ch of chars) {
      await Option.create({
        key: ch.key,
        value: ch.value,
        product_id: prod.id
      });
    }
    res.status(200).json({
      status: true
    });
  } catch (e) {
    console.log((e as Error).toString(), (e as Error).stack);
    debug({message: (e as Error).message, file: 'app.ts', method: '/product/create'});
  }
});

app.post('/send-order', async (req, res) => {
  try {
    const { products, name, phone } = req.body;
    let content = '';

    for (const p of products) {
      content += `<b>${p.name}</b>\n <b>Цена:</b> ${p.price} Сум\n количество: ${p.count}\n <b>Цены в рассрочку</b>\n`;
      for (const price of p.prices) {
        content += `<pre>  • <b>Мес.: ${price.months}</b>, <b>За мес.: ${price.per_month} Сум</b></pre>\n`
      }
      content += '<b>Цвета: </b>\n';
      for (const c of p.colors) {
        content += `<pre>  • <b style="color: ${c.hex}">${c.name}</b></pre>\n`
      }
    }
    content += `\n\n\n<b>Имя: ${name}</b>\n`;
    content += `<b>Телефон: ${phone}</b>`;

    const users = await User.findAll({ where: { isGroup: true } });

    for (const u of users) {
      await axios.post<any, AxiosResponse<any, any>, SendMessage>('https://api.telegram.org/bot6032230275:AAFn5BwIeL-TRAsUdo_gBfzQvil6_phaIrI/sendMessage', {
        chat_id: u.chat_id,
        text: content,
        parse_mode: 'HTML'
      });
    }
    res.status(200).json({
      status: true,
      message: 'Успешно!'
    })
  } catch (e) {

  }
})

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