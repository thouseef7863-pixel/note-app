
import React from 'react'

function Notecard({ note, onDelete, onEdit }) {
  const colors = {
    yellow: 'bg-yellow-100',
    blue: 'bg-blue-100',
    red: 'bg-red-100',
    green: 'bg-green-100'
  }

  return (
    <div className={`${colors[note.color] || 'bg-white'} border p-5 rounded-xl shadow-sm`}>
      <h2 className="font-bold text-lg mb-2">
        {note.title || 'Untitled Note'}
      </h2>

      <p className="text-gray-700 whitespace-pre-wrap break-words">
        {note.content}
      </p>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => onEdit(note)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(note.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Notecard