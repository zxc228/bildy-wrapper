import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  fetchProjectById,
  fetchDeliveryNotesByProject,
  createDeliveryNote,
  deleteDeliveryNote,
  downloadDeliveryNotePDF,
  fetchClients,
} from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '@/services/withAuth';
import DeliveryNoteForm from '../../components/DeliveryNoteForm';

function ProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Для анимации загрузки
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (id && token) {
      fetchProjectDetails();
      fetchDeliveryNotes();
      fetchClientsData();
    }
  }, [id, token]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchProjectById(id, token);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project details: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryNotes = async () => {
    try {
      const response = await fetchDeliveryNotesByProject(id, token);
      setDeliveryNotes(response.data);
    } catch (err) {
      setError('Failed to load delivery notes: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchClientsData = async () => {
    try {
      const response = await fetchClients(token);
      setClients(response.data);
    } catch (err) {
      setError('Failed to load clients: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateNote = async (formData) => {
    try {
      const noteData = { ...formData, clientId: project.clientId, projectId: id };
      await createDeliveryNote(noteData, token);
      fetchDeliveryNotes();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create delivery note: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this delivery note?')) {
      try {
        await deleteDeliveryNote(noteId, token);
        fetchDeliveryNotes();
      } catch (err) {
        setError('Failed to delete delivery note: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDownloadPDF = async (noteId) => {
    try {
      const response = await downloadDeliveryNotePDF(noteId, token);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `deliverynote_${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to download delivery note: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300">
        <div className="container mx-auto p-6 flex-grow">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              ← Back
            </button>
          </div>
          <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">
            Project Details
          </h1>
          {error && <p className="text-red-500">{error}</p>}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
            </div>
          ) : project ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-4">{project.name}</h2>
              <p><strong>Code:</strong> {project.projectCode}</p>
              <p><strong>Internal Code:</strong> {project.code}</p>
              <p><strong>Email:</strong> {project.email}</p>
              <p>
                <strong>Address:</strong> {project.address.street}, {project.address.number}, {project.address.city}, {project.address.province}, {project.address.postal}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Delivery Notes</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {showForm ? 'Cancel' : 'Add Delivery Note'}
            </button>
            {showForm && (
              <DeliveryNoteForm
                onSubmit={(formData) => {
                  handleCreateNote(formData);
                  setShowForm(false);
                }}
                clients={clients}
                projectId={id}
              />
            )}
            {deliveryNotes.length > 0 ? (
              <ul className="space-y-4 mt-6">
                {deliveryNotes.map((note) => (
                  <li key={note._id} className="p-4 border border-gray-700 rounded-lg flex justify-between items-center bg-gray-900">
                    <span>{note.description}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleDownloadPDF(note._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                      >
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-400">No delivery notes available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(ProjectDetails);
