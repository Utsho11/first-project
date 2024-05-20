import express from "express";
import { StudentControllers } from "./student.controller";

const router = express.Router();

// will call controller function

router.post("/create-student", StudentControllers.createStudent);
router.get("/", StudentControllers.getAllStudents);
router.get("/:studentId", StudentControllers.getSingleStudents);
router.delete("/:studentId", StudentControllers.deleteSingleStudents);

export const StudentRoutes = router;
