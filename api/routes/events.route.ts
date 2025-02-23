import express from 'express'
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from '../controllers/events.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const route = express.Router();

// api/events/get-events
route.get("/get-events",authMiddleware, getEvents);

// api/events/get-event
route.get("/get-event/:id",authMiddleware, getEvent);

// api/events/create-event
route.post("/create-event",authMiddleware, createEvent);

// api/events/update-event
route.put("/update-event/:id", authMiddleware, updateEvent);

// api/events/delete-event
route.delete("/delete-event/:id",authMiddleware, deleteEvent);

export default route;