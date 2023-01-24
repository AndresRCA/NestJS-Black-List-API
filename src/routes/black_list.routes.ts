import { Router } from "express"
import { BlackListController } from "../controllers/BlackListController.controller"

const router = Router()

router.post("/check_phrase", BlackListController.check_phrase)
router.post("/add_profanity", BlackListController.add_profanity)

export { router };