const mongoose = require("mongoose");
const User = require("./models/User");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const fixUsers = async () => {
  try {
    await connectDB();

    const users = await User.find().lean();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      if (user.username === "admin") {
        await User.findByIdAndUpdate(user._id, {
          roles: ["Admin", "User"],
        });
        console.log("Updated admin user roles");
      } else {
        await User.findByIdAndUpdate(user._id, {
          roles: ["User"],
        });
        console.log(`Updated ${user.username} user roles`);
      }
    }

    console.log("All users updated successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing users:", error);
    process.exit(1);
  }
};

fixUsers();
