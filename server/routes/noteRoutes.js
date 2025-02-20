const express = require('express');
const router = express.Router();
const noteController = require('../controller/noteController');

// Get all notes
router.get('/', noteController.getAllNotes);

// Create a new note
router.post('/', noteController.createNote);

// Delete a note
router.delete('/:id', noteController.deleteNote);

module.exports = router;