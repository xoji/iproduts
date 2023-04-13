import {Sequelize} from "sequelize";

export const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'myappleu_iprod',
    password: 'XNVnPacHfjyJa8x',
    database: 'myappleu_iproduct',
    logging: false
});

// REMOTE
// database: myappleu_iproduct
// username: myappleu_iprod
// password: XNVnPacHfjyJa8x

// LOCAL
// database: iproduct
// username: root
// password: xoji1248000