const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'], // Ensure content is provided
      trim: true, // Remove extra spaces
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Middleware to update `updatedAt` field on document updates
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

noteSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;