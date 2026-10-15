import { useState, useEffect, useMemo } from 'react';
import Notecard from './components/Notecard';
import NoteForm from './components/NoteForm';
import EditNoteModal from './components/EditNoteModal';
import { useNotes } from './NotesContext';

function App() {
  const {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    searchNotes,
    fetchNotes,
  } = useNotes();

  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'archived' | 'all'

  // Debounced search via NotesContext API
  useEffect(() => {
    const timer = setTimeout(() => {
      searchNotes(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, searchNotes]);

  // Tab counts
  const counts = useMemo(() => {
    const active = notes.filter((n) => !n.archived).length;
    const archived = notes.filter((n) => n.archived).length;
    return { active, archived, total: notes.length };
  }, [notes]);

  // Filter notes according to current tab
  const displayedNotes = useMemo(() => {
    return notes.filter((note) => {
      if (activeTab === 'active') return !note.archived;
      if (activeTab === 'archived') return note.archived;
      return true;
    });
  }, [notes, activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">My Notes</h1>
            <p className="text-gray-500">Capture your thoughts and ideas.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Backend: JSON Server
            </span>
            <button
              onClick={() => fetchNotes()}
              disabled={loading}
              title="Refresh notes from server"
              className="px-3 py-1 text-xs font-medium bg-white hover:bg-gray-50 text-gray-700 border rounded-full transition-colors flex items-center gap-1 shadow-2xs"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => fetchNotes()}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Note Form Component */}
        <NoteForm onAddNote={createNote} />

        {/* Search bar & Tabs */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your notes by title, content, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3.5 pr-10 border rounded-xl bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <span>Active Notes</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'active'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {counts.active}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'archived'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <span>Archived</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'archived'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {counts.archived}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60'
              }`}
            >
              <span>All Notes</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'all'
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {counts.total}
              </span>
            </button>

            {loading && (
              <div className="ml-auto flex items-center gap-2 text-blue-600 text-xs font-medium">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Syncing with server...
              </div>
            )}
          </div>
        </div>

        {/* Notes Grid or Empty State */}
        {displayedNotes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
            <div className="text-4xl mb-3">
              {search ? '🔍' : activeTab === 'archived' ? '📦' : '📝'}
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {search
                ? 'No matching notes found'
                : activeTab === 'archived'
                ? 'No archived notes'
                : 'No notes yet'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {search
                ? `No notes matched "${search}". Try searching with different keywords or tags.`
                : activeTab === 'archived'
                ? 'Notes you archive will appear here for safekeeping.'
                : 'Create your first note above to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedNotes.map((note) => (
              <Notecard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={(n) => setEditingNote(n)}
                onToggleArchive={toggleArchive}
              />
            ))}
          </div>
        )}

        {/* Edit Note Modal */}
        <EditNoteModal
          note={editingNote}
          isOpen={Boolean(editingNote)}
          onClose={() => setEditingNote(null)}
          onSave={updateNote}
        />
      </div>
    </div>
  );
}

export default App;