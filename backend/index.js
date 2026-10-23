
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const parkingRoutes = require("./routes/parkingRoute");
const messageRoutes = require("./routes/messageRoute");
const favoriteRoutes = require("./routes/favoriteRoute");
const userRoutes = require("./routes/userRoute");
const ownerRoutes = require("./routes/ownerRoute");
const occupancyRoutes = require("./routes/occupancyRoute");
const reviewRoutes = require("./routes/reviewRoute");


const adminAnalyticsRoutes = require(
  "./routes/adminAnalyticsRoute"
);

const {
  adminRouter: adminNotificationsRoutes,
  publicRouter: publicNotificationsRoutes,
} = require("./routes/adminNotificationsRoute");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

const PORT = Number(process.env.PORT || 3000);

const APP_ORIGIN =
  process.env.APP_ORIGIN ||
  "http://localhost:5173";

// Validate port
if (
  !Number.isInteger(PORT) ||
  PORT < 1 ||
  PORT > 65535
) {
  throw new Error(
    "PORT 1–65535 аралығында болуы керек."
  );
}

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));



app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/parkings", parkingRoutes);

app.use("/api/v1/messages", messageRoutes);


app.use("/api/v1/favorites", favoriteRoutes);

app.use("/api/v1/reviews", reviewRoutes);


app.use("/api/v1/admin/users", userRoutes);

app.use("/api/v1/admin/owners", ownerRoutes);

app.use(
  "/api/v1/admin/occupancy",
  occupancyRoutes
);

app.use(
  "/api/v1/admin/analytics",
  adminAnalyticsRoutes
);

app.use(
  "/api/v1/admin/notifications",
  adminNotificationsRoutes
);


// Барлық қолданушыларға арналған жария хабарландырулар
app.use(
  "/api/v1/notifications",
  publicNotificationsRoutes
);

app.get("/api/v1/health", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(
      "Дерекқорға қосылу қатесі:",
      error.code
    );

    return res.status(503).json({
      status: "error",
      database: "disconnected",
      message:
        "Деректер қорына қосылу мүмкін емес.",
    });
  }
});

app.use(notFound);



app.use(errorHandler);


app.listen(PORT, () => {
  console.log("================================");

  console.log("ORYN BACKEND SERVER");

  console.log(`Server: http://localhost:${PORT}`);

  console.log(
    `Health: http://localhost:${PORT}/api/v1/health`
  );

  console.log(
    `Analytics: http://localhost:${PORT}/api/v1/admin/analytics`
  );

  console.log(
    `Notifications: http://localhost:${PORT}/api/v1/notifications`
  );

  console.log("================================");
});
