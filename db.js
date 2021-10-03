const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/graph",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Unable to connect to database.");
      process.exit(1);
    } else {
      console.log("Successfully connected to the database.");
    }
  }
);
