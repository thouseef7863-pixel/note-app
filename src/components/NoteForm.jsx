import { useState } from 'react';
import { useNotes } from '../NotesContext';

function NoteForm({ onAddNote }) {
  const notesCtx = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim() && !title.trim()) {
      alert('Please enter a note title or content.');
      return;
    }

    setIsSubmitting(true);

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const notePayload = {
      title: title.trim(),
      content: content.trim(),
      color,
      tags: parsedTags,
      archived: false,
      stock: 0,
    };

    try {
      if (onAddNote) {
        await onAddNote(notePayload);
      } else if (notesCtx?.createNote) {
        await notesCtx.createNote(notePayload);
      }

      setTitle('');
      setContent('');
      setColor('yellow');
      setTags('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow mb-6 border">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        disabled={isSubmitting}
        className="w-full mb-3 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
      />

      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        rows="4"
        disabled={isSubmitting}
        className="w-full mb-3 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
      />

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={isSubmitting}
          className="border p-2 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>

        <input
          type="text"
          placeholder="Tags (e.g. work, urgent)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isSubmitting}
          className="p-2 border rounded-lg text-sm flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving...
            </>
          ) : (
            'Add Note'
          )}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;