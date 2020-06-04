require("dotenv").config();
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");
const cloudinary = require("./cloudinary");

const server = createServer();

// TODO Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request

// TODO Use express middlware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: [process.env.FRONTEND_URL],
    },
  },
  (deets) => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
