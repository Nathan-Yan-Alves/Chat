import mongoose from "mongoose";

export const db = {
    dbRun: () =>
        mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@clusterforstudy.i2srm.mongodb.net/ChatDB?retryWrites=true&w=majority`
        ),
};
