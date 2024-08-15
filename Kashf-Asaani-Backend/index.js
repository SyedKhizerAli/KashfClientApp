const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
// const multer = require("multer");

require("dotenv").config();
const { PORT } = require("./Env");

const db = require("./config/db");

async function main() {
    try {
        const connection = await db.getConnection(); // Using the getConnection function

        console.log("Connected to database.");
        // You can now use 'connection' to execute queries, etc.

    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
}

main();

app.use(cors());

require("./config/routes")(app);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.send("Kashf backend is working !!!"); 
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT || 8006, "0.0.0.0", () =>
  console.log(`listening on port ${PORT}`)
);

const { getConnection } = require("./config/db")
console.log(1)
console.log(getConnection)