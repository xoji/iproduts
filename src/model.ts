import {Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, DataTypes} from "sequelize";
import {db} from "./db";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare chat_id: string;
    declare isAdmin: boolean;
    declare isGroup: boolean;
    declare granted: CreationOptional<boolean>;
    declare token: CreationOptional<string | null>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare image: string;
    declare desc?: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare category_id: ForeignKey<Category["id"]>;
}

export class Option extends Model<InferAttributes<Option>, InferCreationAttributes<Option>> {
    declare id: CreationOptional<number>;
    declare key: string;
    declare value: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare product_id: ForeignKey<Product["id"]>;
}

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare number: string;
    declare comment?: string;
    declare products: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}


User.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, unique: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    chat_id: { type: DataTypes.TEXT, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
    isGroup: { type: DataTypes.BOOLEAN, allowNull: false },
    granted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    token: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'users', sequelize: db });

Category.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, unique: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'categories', sequelize: db });

Product.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, unique: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'products', sequelize: db });

Option.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, unique: true, allowNull: false, primaryKey: true },
    key: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'options', sequelize: db });

Order.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, unique: true, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    products: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'orders', sequelize: db });



Product.hasMany(Option, { foreignKey: { name: 'product_id', allowNull: false } });
Option.belongsTo(Product, { foreignKey: { name: 'product_id', allowNull: false } });

Category.hasMany(Product, { foreignKey: { name: 'category_id', allowNull: false } });
Product.belongsTo(Category, { foreignKey: { name: 'category_id', allowNull: false } });