import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  fetchNotesApi,
  createNoteApi,
  patchNoteApi,
  deleteNoteApi,
  putNoteApi,
} from './services/notesApi';
import ToastContainer from './components/ToastContainer';

export interface Note {
  id: string | number;
  title: string;
  content: string;
  color: string;
  tags: string[];
  archived: boolean;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNote: (note: Partial<Note>) => Promise<Note | null>;
  updateNote: (id: string | number, updates: Partial<Note>) => Promise<Note | null>;
  deleteNote: (id: string | number) => Promise<boolean>;
  toggleArchive: (id: string | number) => Promise<Note | null>;
  searchNotes: (query: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const isNetworkError = (error: unknown): boolean =>
  error instanceof Error &&
  (error.message === 'Network Error' ||
    ('code' in error && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')));

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Toast notification helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all notes from JSON Server (GET /notes)
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotesApi();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch notes from JSON Server backend.';
        setError(`Cannot load notes: ${msg}. Is JSON Server running on port 5000?`);
        addToast('Error fetching notes from server', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Create a new note (POST /notes)
  const createNote = async (noteData: Partial<Note>): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const payload: Omit<Note, 'id'> = {
        title: noteData.title?.trim() || 'Untitled Note',
        content: noteData.content || '',
        color: noteData.color || 'yellow',
        tags: Array.isArray(noteData.tags)
          ? noteData.tags
          : typeof noteData.tags === 'string'
          ? (noteData.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        archived: Boolean(noteData.archived ?? false),
        stock: Number(noteData.stock ?? 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = await createNoteApi(payload);
      setNotes((prev) => [created, ...prev]);
      addToast('Note created successfully! 📝', 'success');
      return created;
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg = err?.message || 'Failed to create note';
        setError(msg);
        addToast(`Create failed: ${msg}`, 'error');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update note (PATCH /notes/:id or PUT /notes/:id)
  const updateNote = async (
    id: string | number,
    updates: Partial<Note>
  ): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    try {
      const sanitizedUpdates = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const updated = await patchNoteApi(id, sanitizedUpdates);
      setNotes((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? { ...item, ...updated } : item))
      );
      addToast('Note updated successfully! ✏️', 'success');
      return updated;
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg = err?.message || 'Failed to update note';
        setError(msg);
        addToast(`Update failed: ${msg}`, 'error');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete note (DELETE /notes/:id)
  const deleteNote = async (id: string | number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteNoteApi(id);
      setNotes((prev) => prev.filter((item) => String(item.id) !== String(id)));
      addToast('Note deleted successfully! 🗑️', 'success');
      return true;
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg = err?.message || 'Failed to delete note';
        setError(msg);
        addToast(`Delete failed: ${msg}`, 'error');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle archive status (PATCH /notes/:id)
  const toggleArchive = async (id: string | number): Promise<Note | null> => {
    const existing = notes.find((n) => String(n.id) === String(id));
    const nextArchived = existing ? !existing.archived : true;

    setLoading(true);
    setError(null);
    try {
      const updated = await patchNoteApi(id, {
        archived: nextArchived,
        updatedAt: new Date().toISOString(),
      });
      setNotes((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? { ...item, ...updated } : item))
      );
      addToast(
        nextArchived ? 'Note moved to archive! 📦' : 'Note unarchived to active notes! 📂',
        'info'
      );
      return updated;
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg = err?.message || 'Failed to toggle archive status';
        setError(msg);
        addToast(`Archive toggle failed: ${msg}`, 'error');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Search notes from API backend with client-side query matching (GET /notes)
  const searchNotes = async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const allNotes = await fetchNotesApi();
      if (!query || !query.trim()) {
        setNotes(Array.isArray(allNotes) ? allNotes : []);
      } else {
        const q = query.toLowerCase().trim();
        const filtered = (allNotes || []).filter((note: Note) => {
          const inTitle = note.title ? note.title.toLowerCase().includes(q) : false;
          const inContent = note.content ? note.content.toLowerCase().includes(q) : false;
          const inTags = Array.isArray(note.tags)
            ? note.tags.some((t) => t && t.toLowerCase().includes(q))
            : false;
          return inTitle || inContent || inTags;
        });
        setNotes(filtered);
      }
    } catch (err: any) {
      if (!isNetworkError(err)) {
        const msg = err?.message || 'Failed to search notes';
        setError(msg);
        addToast(`Search failed: ${msg}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load notes on startup
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const value: NotesContextType = {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    searchNotes,
    fetchNotes,
    toasts,
    removeToast,
    addToast,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </NotesContext.Provider>
  );
};

export default NotesContext;
