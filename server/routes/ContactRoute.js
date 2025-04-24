import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { SearchContacts , getContactsForDMList } from "../controllers/ContactsController.js";

const ContactsRoute = Router();

ContactsRoute.post("/search" , verifyToken , SearchContacts);
ContactsRoute.get("/get-contacts-for-dm" , verifyToken , getContactsForDMList);


export default ContactsRoute;