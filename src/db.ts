import {Sequelize} from "sequelize";

export const db = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'xoji1248000',
    database: 'iproduct',
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