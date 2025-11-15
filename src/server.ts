import app from "./app";
import { PORT, NODE_ENV } from "./config/env.config";

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT || 3000}`);
	console.log(`Environment: ${NODE_ENV}`);
});
