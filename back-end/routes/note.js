const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');


//ROUTE : 1 Getting all note using: GET "/api/note/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//ROUTE : 2  Add the new note using :POST "/api/note/addnote" login required
router.post('/addnote', [
    body('title', "Please enter the valid title").isLength({ min: 3 }),
    body('description', "Description atleast 5 charachter long").isLength({ min: 5 })
], fetchuser, async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let { title, description, tag } = req.body;
        //create a new note
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//ROUTE : 3 Update the exiting notes using : PUT "/api/note/updatenote:id" Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create the new object
        let newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find the node to be updated and update it        
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(400).send("not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

//ROUTE 4: Delete the exiting not using : delete login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note with given id
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        //Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: "note has been deleted", note: note });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;