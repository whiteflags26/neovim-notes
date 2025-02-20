const Note = require('../model/note');

const noteController = {};

noteController.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

noteController.createNote = async (req, res) => {
    const note = new Note({
        content: req.body.content,
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

noteController.deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = noteController;