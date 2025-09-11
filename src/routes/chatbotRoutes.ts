import { Router } from 'express';
import * as controller from '../controllers/chatbotController';

const router = Router();

// A single POST route to handle chatbot queries
router.post('/', controller.askQuery);

export default router;