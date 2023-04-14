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
// database: iproduct_db
// username: iproduct_admin
// password: rBcN_fa5DgPA_uE

// LOCAL
// database: iproduct
// username: root
// password: xoji1248000