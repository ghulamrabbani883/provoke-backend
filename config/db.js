const mongoose = require("mongoose");

mongoose
  .connect(process.env.URI, { useNewUrlParser: true })
  .then(() => console.log(`Database connected`))
  .catch((error) => console.log(`Error in connecting DB -${error}`));
