import {Router} from 'express'
import { createnotice, editnotice, deletenotice } from '../controllers/noticeController';
const route = Router();

route.post('/createnotice/:id', createnotice);
route.put('/editnotice/:id', editnotice);
route.delete('/deletenotice/:id', deletenotice);

export default route;