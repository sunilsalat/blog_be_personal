import mongoose from "mongoose";
import { app } from "./";
import { seedData } from "./services/seeder";


const startServer = async () => {
    const uri = process.env.MONGO_URI
    try {
        await mongoose.connect(uri!);

        await seedData()

        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log({ error });
        process.exit(1);
    }
};

startServer();
