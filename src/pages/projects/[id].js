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
  const [clients, setClients] = useState([]); // Добавлено состояние для клиентов
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (id && token) {
      fetchProjectDetails();
      fetchDeliveryNotes();
      fetchClientsData(); // Получение списка клиентов
    }
  }, [id, token]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetchProjectById(id, token);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project details: ' + (err.response?.data?.message || err.message));
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
      fetchDeliveryNotes(); // Обновляем список накладных
      setShowForm(false); // Скрываем форму
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
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="container mx-auto p-6 flex-grow">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              ← Back
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-6">Project Details</h1>
          {error && <p className="text-red-500">{error}</p>}
          {project ? (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
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

          {/* Список накладных */}
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Delivery Notes</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mb-4"
            >
              {showForm ? 'Cancel' : 'Add Delivery Note'}
            </button>
            {showForm && (
            <DeliveryNoteForm
                onSubmit={(formData) => {
                handleCreateNote(formData);
                setShowForm(false);
                }}
                clients={clients} // Передаем список клиентов
                projectId={id} // Передаем текущий projectId
            />
            )}

            {deliveryNotes.length > 0 ? (
              <ul className="space-y-2">
                {deliveryNotes.map((note) => (
                  <li key={note._id} className="p-4 border rounded flex justify-between items-center">
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
              <p>No delivery notes available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(ProjectDetails);
