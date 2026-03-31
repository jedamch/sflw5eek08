const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();	


mongoose.connect("mongodb://adminsys:test1234@ncgrp.xyz:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
    
const studentSchema = new mongoose.Schema({ name: String, age: Number, course: String });
const Student = mongoose.model("Student", studentSchema);


app.get("/", (req, res) => {
    res.redirect("/students");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.render("students", { students });
    } catch (error) {
        res.status(500).send("Error fetching students");
    }
});

app.get("/student/new", (req, res) => {
    res.render("new_student");
});

app.post("/student", async (req, res) => {
    try {
        const newStudent = new Student({ name: req.body.name, age: req.body.age, course: req.body.course });
        await newStudent.save();
        res.redirect("/students");
    } catch (error) {
        res.status(500).send("Error adding student");
    }
});

app.get("/student/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.render("student", { student });
    } catch (error) {
        res.status(500).send("Error fetching student");
    }
});

app.get("/student/:id/edit", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.render("edit_student", { student });
    } catch (error) {
        res.status(500).send("Error fetching student");
    }
});

app.put("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, age: req.body.age, course: req.body.course },
            { new: true }
        );
        if (!student) return res.status(404).send("Student Not Found");
        res.redirect("/students");
    } catch (error) {
        res.status(500).send("Error updating student");
    }
});


app.delete("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send("Student Not Found");
        res.redirect("/students");
    } catch (error) {
        res.status(500).send("Error deleting student");
    }
});


app.listen(80, () => console.log("Server is running on port 80"));

