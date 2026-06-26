import bcrypt from "bcrypt";
import sequelize from "../config/connection.js";
import User from "../features/users/user.model.js";

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Sync only Users table (won't drop existing data)
    await User.sync({ alter: false });

    const adminEmail = "admin@hospital.com";
    const adminPassword = "Admin@123";

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (existing) {
      console.log(`Admin already exists with email: ${adminEmail}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      roles: "admin",
      isActive: true,
    });

    console.log("Admin seeded successfully:");
    console.log(`   Email   : ${admin.email}`);
    console.log(
      `   Password: ${adminPassword}  ← change this after first login!`,
    );
    console.log(`   Role    : ${admin.roles}`);
  } catch (error) {
    console.error("Seeder failed:", error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedAdmin();
