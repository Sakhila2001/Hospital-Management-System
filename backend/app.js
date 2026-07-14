import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectionDB } from "./config/index.js";
import authRouter from "./features/auth/auth.routes.js";
import departmentRouter from "./features/departments/department.route.js";
import receptionistRouter from "./features/receptionists/receptionist.route.js";
import doctorRouter from "./features/doctors/doctor.route.js";
import patientRouter from "./features/patients/patient.route.js";
import userRouter from "./features/users/user.routes.js";
import appointmentRouter from "./features/appointments/appointment.route.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://hms.vercel.app",
];

const corsOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

await connectionDB();
app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/receptionists", receptionistRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/patients", patientRouter);
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);

app.get("/", (req, res) => {
  res.send("Express server is running on port 5900");
});
app.listen(5900, () => {
  console.log("Server is running on port 5900");
});
