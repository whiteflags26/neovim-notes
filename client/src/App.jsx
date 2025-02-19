import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Clock, Calendar, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/notes`, { content: newNote });
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2] font-mono flex items-center justify-center">
      <div className="w-full max-w-2xl p-6 bg-[#1d2021] rounded-lg shadow-lg border border-[#504945]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#504945] pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#98971a]" />
            <h1 className="text-xl">Neovim Notes</h1>
          </div>
          <div className="flex items-center space-x-4 text-[#928374]">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{format(currentTime, 'yyyy-MM-dd')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{format(currentTime, 'HH:mm:ss')}</span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full h-40 bg-[#3c3836] border border-[#504945] p-3 rounded focus:outline-none focus:border-[#98971a] resize-none"
              placeholder="Type your notes here..."
            />
            <button
              type="submit"
              className="bg-[#98971a] px-4 py-2 rounded hover:bg-[#b8bb26] transition-colors"
            >
              Save
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-[#3c3836] p-4 rounded border border-[#504945] flex justify-between items-start"
            >
              <p className="whitespace-pre-wrap flex-1">{note.content}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#928374]">
                  {format(new Date(note.createdAt), 'HH:mm:ss')}
                </span>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
