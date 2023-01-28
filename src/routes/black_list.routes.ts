import { Router } from "express"
import { BlackListController } from "../controllers/black_list.controller"
import { body } from "express-validator"

const router = Router()

router.post('/check_phrase', body('message').exists().isString(), BlackListController.check_phrase)
router.post('/add_profanity', body('new_word').exists().isString(), BlackListController.add_profanity)

export { router };