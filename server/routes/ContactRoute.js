import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { SearchContacts } from "../controllers/ContactsController.js";

const ContactsRoute = Router();

ContactsRoute.post("/search" , verifyToken , SearchContacts);


export default ContactsRoute;