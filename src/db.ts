import {Sequelize} from "sequelize";

export const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'iproduct_admin',
    password: 'rBcN_fa5DgPA_uE',
    database: 'iproduct_db',
    logging: false
});

// REMOTE
// username: iproduct_admin
// password: rBcN_fa5DgPA_uE
// database: iproduct_db

// LOCAL
// username: root
// password: xoji1248000
// database: iproduct