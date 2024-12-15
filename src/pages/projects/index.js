import { useState, useEffect } from 'react';
import {
  fetchProjects,
  createProject,
  fetchProjectById,
  fetchDeliveryNotesByProject,
  createDeliveryNote,
  deleteDeliveryNote,
  updateDeliveryNote,
  downloadDeliveryNotePDF,
} from '../../services/api';
import ProjectForm from '../../components/ProjectForm';
import DeliveryNoteForm from '../../components/DeliveryNoteForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '../../services/withAuth';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (token) {
      fetchProjectsData();
    }
  }, [token]);

  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProjects(token);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryNotes = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await fetchDeliveryNotesByProject(projectId, token);
      setDeliveryNotes(response.data);
    } catch (err) {
      setError('Failed to load delivery notes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData, token);
      setShowForm(false);
      fetchProjectsData();
    } catch (err) {
      setError('Failed to create project: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateOrUpdateNote = async (noteData) => {
    try {
      if (editingNote) {
        await updateDeliveryNote(editingNote._id, noteData, token);
      } else {
        const fullData = { ...noteData, projectId: selectedProject._id };
        await createDeliveryNote(fullData, token);
      }
      fetchDeliveryNotes(selectedProject._id);
      setShowNoteForm(false);
      setEditingNote(null);
    } catch (err) {
      setError('Failed to save delivery note: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this delivery note?')) {
      try {
        await deleteDeliveryNote(noteId, token);
        fetchDeliveryNotes(selectedProject._id);
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

  const handleSelectProject = async (projectId) => {
    try {
      const response = await fetchProjectById(projectId, token);
      setSelectedProject(response.data);
      fetchDeliveryNotes(projectId);
    } catch (err) {
      setError('Failed to fetch project: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300">
        <div className="container mx-auto p-6 flex-grow flex">
          {/* Список проектов */}
          <div className="w-1/3 p-4 bg-gray-800 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Projects</h2>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded shadow-md hover:scale-105 transition-transform"
            >
              {showForm ? 'Cancel' : 'Add New Project'}
            </button>

            {showForm && (
              <ProjectForm onSubmit={handleCreateProject} initialData={selectedProject || {}} />
            )}

            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-cyan-500"></div>
              </div>
            ) : (
              <ul className="space-y-2 mt-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project._id}
                      className={`p-2 cursor-pointer rounded ${
                        selectedProject?._id === project._id ? 'bg-cyan-700' : 'hover:bg-cyan-800'
                      }`}
                      onClick={() => handleSelectProject(project._id)}
                    >
                      {project.name}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-400 italic">
                    No projects available. Add a new project to get started.
                  </p>
                )}
              </ul>
            )}
          </div>

          {/* Детали проекта */}
          <div className="w-2/3 p-4">
            {selectedProject ? (
              <>
                <div className="bg-gray-800 p-6 rounded shadow-lg">
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">{selectedProject.name}</h2>
                  <p><strong>Code:</strong> {selectedProject.code}</p>
                  <p><strong>Email:</strong> {selectedProject.email}</p>
                </div>

                <div className="mt-6 bg-gray-800 p-6 rounded shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">Delivery Notes</h3>
                  <button
                    onClick={() => setShowNoteForm(!showNoteForm)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded shadow-md hover:scale-105 transition-transform"
                  >
                    {showNoteForm ? 'Cancel' : 'Add Delivery Note'}
                  </button>
                  {showNoteForm && (
                    <DeliveryNoteForm
                      onSubmit={handleCreateOrUpdateNote}
                      projectId={selectedProject._id}
                      initialData={editingNote || {}}
                    />
                  )}
                  {deliveryNotes.length > 0 ? (
                    <ul className="space-y-4 mt-6">
                      {deliveryNotes.map((note) => (
                        <li key={note._id} className="p-4 bg-gray-900 border border-gray-700 rounded flex justify-between items-center">
                          <span>{note.description}</span>
                          <div className="space-x-2">
                            <button
                              onClick={() => handleDownloadPDF(note._id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => {
                                setEditingNote(note);
                                setShowNoteForm(true);
                              }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
                            >
                              Edit
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
                    <p className="text-gray-400 mt-4">No delivery notes available for this project.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-400">Select a project to view details</h2>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(Projects);
