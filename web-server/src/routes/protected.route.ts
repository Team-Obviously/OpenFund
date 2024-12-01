import { verifyOktoToken } from "../middleware/auth.middleware";
import router from "./auth.route";

router.get("/protected-route", verifyOktoToken, (req, res) => {
  // Your route handler
});
