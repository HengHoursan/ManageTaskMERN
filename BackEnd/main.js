const express = require("express");
const MongoConnection = require("./src/util/MongoConnection");
const cors = require("cors");
const AuthRoute  = require("./src/routes/auth.routes");
const TaskRoute = require("./src/routes/task.routes");
const bodyParser = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use("/api/auth", AuthRoute);
app.use("/api/tasks", TaskRoute);

MongoConnection();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
