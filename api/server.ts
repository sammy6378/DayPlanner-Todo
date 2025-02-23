import { app } from "./app";
import { setReminder } from "./controllers/events.controller";
import { reminderTaskExpiry } from "./controllers/tasks.controller";
import connectDB from "./utils/db";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
    reminderTaskExpiry();
    setReminder();
})