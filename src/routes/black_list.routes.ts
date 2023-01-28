import { Router } from "express"
import { BlackListController } from "../controllers/black_list.controller"
import { body } from "express-validator"
import { validate_request } from "../middleware/validate_request.middleware"

const router = Router()

router.post('/check_phrase', validate_request([body('message').exists().isString()]), BlackListController.check_phrase)
router.post('/add_profanity', validate_request([body('new_word').exists().isString()]), BlackListController.add_profanity)

export { router };