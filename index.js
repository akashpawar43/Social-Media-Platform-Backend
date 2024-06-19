import express from "express";
import connectToMongo from "./db/db.js";
import rootRoutes from "./routes/index.js";
import "dotenv/config";

// swagger 
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert {type: "json"};


connectToMongo();

const PORT = process.env.PORT;
const app = express();

// middleware 
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Health checkup point!"
    })
});

// Routes
app.use("/api/v1", rootRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
    console.log(`Server is connected to Port http://localhost:${PORT}`);
})