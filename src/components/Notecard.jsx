import { useNotes } from '../NotesContext';

function Notecard({ note, onDelete, onEdit, onToggleArchive }) {
  const notesCtx = useNotes();

  const colors = {
    yellow: 'bg-yellow-100 border-yellow-200',
    blue: 'bg-blue-100 border-blue-200',
    red: 'bg-red-100 border-red-200',
    green: 'bg-green-100 border-green-200',
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      if (onDelete) {
        onDelete(note.id);
      } else if (notesCtx?.deleteNote) {
        notesCtx.deleteNote(note.id);
      }
    }
  };

  const handleToggleArchive = () => {
    if (onToggleArchive) {
      onToggleArchive(note.id);
    } else if (notesCtx?.toggleArchive) {
      notesCtx.toggleArchive(note.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note);
    }
  };

  return (
    <div
      className={`${
        colors[note.color] || 'bg-white border-gray-200'
      } border p-5 rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-bold text-lg text-gray-900 leading-snug">
            {note.title || 'Untitled Note'}
          </h2>
          {note.archived && (
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 shrink-0">
              Archived
            </span>
          )}
        </div>

        <p className="text-gray-700 whitespace-pre-wrap break-words text-sm mb-3">
          {note.content}
        </p>

        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-white/70 backdrop-blur-xs text-gray-600 px-2 py-0.5 rounded-md border border-black/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-black/5 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-gray-500">
          {note.createdAt
            ? new Date(note.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            : ''}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleArchive}
            title={note.archived ? 'Restore to active notes' : 'Move to archive'}
            className="text-xs px-2.5 py-1 rounded bg-white/80 hover:bg-white text-gray-700 border border-gray-300 font-medium transition-colors"
          >
            {note.archived ? 'Unarchive' : 'Archive'}
          </button>

          <button
            onClick={handleEdit}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notecard;