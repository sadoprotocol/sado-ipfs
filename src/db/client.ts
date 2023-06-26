import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL in .env is missing");
}

const connection = await mongoose.connect(process.env.DATABASE_URL);

export { connection };
