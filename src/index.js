require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");
const cloudinary = require("./cloudinary");

const server = createServer();

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  // console.log(req.cookies);

  const { token } = req.cookies;
  // console.log(">>>>>>>>>>>>> FROM EXPRESS: ", token);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

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
