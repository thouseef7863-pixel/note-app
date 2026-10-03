
import React, { useState } from 'react'

function NoteForm({ onAddNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('yellow')

  function handleSubmit(e) {
    e.preventDefault()

    if (!content.trim()) {
      alert('Please enter note content')
      return
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      color,
      createdAt: new Date().toISOString()
    }

    onAddNote(newNote)

    setTitle('')
    setContent('')
    setColor('yellow')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow mb-6 border">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        className="w-full mb-3 p-3 border rounded resize-none"
        rows="4"
      />

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>
    </form>
  )
}

export default NoteForm