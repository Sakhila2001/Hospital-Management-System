import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const dbConnection = process.env.DATABASE_URL;
const sequelize = new Sequelize(dbConnection, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export default sequelize;
