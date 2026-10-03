
import React, { useState, useEffect } from 'react'
import Notecard from './components/Notecard'
import NoteForm from './components/NoteForm'

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('my-notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [search, setSearch] = useState('')
  const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    localStorage.setItem('my-notes', JSON.stringify(notes))
  }, [notes])

  function addNote(newNote) {
    setNotes((previousNotes) => [newNote, ...previousNotes])
  }

  function deleteNote(id) {
    const confirmed = window.confirm('Are you sure you want to delete this note?')

    if (confirmed) {
      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      )
    }
  }

  function editNote(note) {
    setEditingNote(note)

    const newTitle = window.prompt('Enter new title:', note.title)

    if (newTitle === null) {
      setEditingNote(null)
      return
    }

    const newContent = window.prompt('Enter new content:', note.content)

    if (newContent === null || !newContent.trim()) {
      setEditingNote(null)
      return
    }

    setNotes((previousNotes) =>
      previousNotes.map((item) =>
        item.id === note.id
          ? {
              ...item,
              title: newTitle.slice(0, 100),
              content: newContent,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    )

    setEditingNote(null)
  }

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Notes
        </h1>

        <p className="text-gray-500 mb-6">
          Capture your thoughts and ideas.
        </p>

        <NoteForm onAddNote={addNote} />

        <input
          type="text"
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6 bg-white"
        />

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {search
              ? 'No matching notes found.'
              : 'No notes yet. Create your first note!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <Notecard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={editNote}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default App