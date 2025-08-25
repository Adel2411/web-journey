import express from "express";
import cors from "cors";
import { setBlogRoutes } from "./routes/post.route";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/api", (_req, res) => {
	res.json({ message: "Server is running yoooooo!" });
	console.log("Welcomeee");
});
setBlogRoutes(app);

app.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
