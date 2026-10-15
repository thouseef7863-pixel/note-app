import axios from 'axios';

// Default to JSON Server port 5000 endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/notes';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

/**
 * Explicit route configurations using Axios:
 * - GET    /notes
 * - GET    /notes/:id
 * - POST   /notes
 * - PUT    /notes/:id
 * - PATCH  /notes/:id
 * - DELETE /notes/:id
 */

// GET /notes
export const fetchNotesApi = async (params = {}) => {
  const response = await apiClient.get('', { params });
  return response.data;
};

// GET /notes/:id
export const fetchNoteByIdApi = async (id) => {
  const response = await apiClient.get(`/${id}`);
  return response.data;
};

// POST /notes
export const createNoteApi = async (noteData) => {
  const response = await apiClient.post('', noteData);
  return response.data;
};

// PUT /notes/:id (full replacement)
export const putNoteApi = async (id, fullNoteData) => {
  const response = await apiClient.put(`/${id}`, fullNoteData);
  return response.data;
};

// PATCH /notes/:id (partial update)
export const patchNoteApi = async (id, partialUpdates) => {
  const response = await apiClient.patch(`/${id}`, partialUpdates);
  return response.data;
};

// DELETE /notes/:id
export const deleteNoteApi = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};

export default apiClient;
