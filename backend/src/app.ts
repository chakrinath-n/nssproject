import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/reports.routes";
import authRoutes from "./routes/auth.routes";
import imageRoutes from "./routes/images.routes";
import notificationRoutes from "./routes/notifications.routes";
import adminRoutes from "./routes/admin.routes";
import activityRoutes from "./routes/activities.routes";
import nssUnitRoutes from "./routes/nssUnits.routes";
import aboutRoutes from "./routes/about.routes";
import officerRoutes from "./routes/officer.routes";
import volunteerRoutes from "./routes/volunteer.routes";
import activityTypeRoutes from "./routes/activityType.routes";
import officerActivityRoutes from "./routes/officerActivity.routes";
import specialCampRoutes from "./routes/specialCamp.routes";
import socialLinksRoutes from "./routes/socialLinks.routes";
import nssDigestRoutes from "./routes/nssDigest.routes";
import awardsRoutes from "./routes/awards.routes";





const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/images", imageRoutes);
app.use("/api/nss-units", nssUnitRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/awards", awardsRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/officer", volunteerRoutes);
app.use("/api/activity-types",activityTypeRoutes);
app.use("/api/officer", officerActivityRoutes);
app.use("/api/officer/special-camps", specialCampRoutes);
app.use("/api/officer/social-links", socialLinksRoutes);
app.use("/api/nss-digest", nssDigestRoutes);
app.use("/uploads", express.static("uploads"));
export default app;
