import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL in .env is missing");
}

mongoose.connect(process.env.DATABASE_URL).catch((_) => {
	console.log(`Failed to connect to database: ${process.env.DATABASE_URL}`);
});
