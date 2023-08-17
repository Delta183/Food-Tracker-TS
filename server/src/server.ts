import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";


// Port is effectively a connection point for the observer
// React uses 3000 by default hence the need for using another port which is 4000 in this case
const port = env.PORT;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        });
    })
    .catch(console.error);
    // then is for the Promise being successful and catch is for when it fails