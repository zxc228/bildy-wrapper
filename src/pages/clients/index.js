import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchClients,
  createClient,
  deleteClient,
  updateClient,
  fetchProjectsByClientId,
} from '../../services/api';
import ClientForm from '../../components/ClientForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '@/services/withAuth';

function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (token) {
      fetchClientsData();
    }
  }, [token]);

  const fetchClientsData = async () => {
    try {
      const response = await fetchClients(token);
      setClients(response.data);
    } catch (err) {
      setError('Failed to load clients: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchProjectsData = async (clientId) => {
    try {
      const response = await fetchProjectsByClientId(clientId, token);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      await createClient(clientData, token);
      setShowForm(false);
      fetchClientsData();
    } catch (err) {
      setError('Failed to create client: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      await updateClient(selectedClient._id, clientData, token);
      setShowForm(false);
      setSelectedClient(null);
      fetchClientsData();
    } catch (err) {
      setError('Failed to update client: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    fetchProjectsData(client._id);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(clientId, token);
        setSelectedClient(null);
        setProjects([]);
        fetchClientsData();
      } catch (err) {
        setError('Failed to delete client: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300">
        <div className="container mx-auto p-8 flex-grow flex gap-8">
          {/* List of clients */}
          <div className="w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              Clients
            </h2>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSelectedClient(null);
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 mt-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
              {showForm ? 'Cancel' : 'Add New Client'}
            </button>

            {showForm && (
              <div className="mt-6">
                <ClientForm
                  onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
                  initialData={selectedClient || {}}
                />
              </div>
            )}

            <ul className="space-y-2 mt-6">
              {clients.map((client) => (
                <li
                  key={client._id}
                  className={`p-4 cursor-pointer rounded-lg ${
                    selectedClient?._id === client._id
                      ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } transition-colors duration-300`}
                  onClick={() => handleSelectClient(client)}
                >
                  {client.name}
                </li>
              ))}
            </ul>
          </div>

          {/* CLient details and projects */}
          <div className="w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            {selectedClient ? (
              <>
                <div>
                  <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-4">
                    {selectedClient.name}
                  </h2>
                  <p>
                    <span className="font-bold">ID:</span> {selectedClient._id}
                  </p>
                  <p>
                    <span className="font-bold">Address:</span>{' '}
                    {selectedClient.address.street}, {selectedClient.address.number},{' '}
                    {selectedClient.address.city}, {selectedClient.address.province},{' '}
                    {selectedClient.address.postal}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-400 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(selectedClient._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* List of projects */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-300 mb-4">Projects</h3>
                  {projects.length > 0 ? (
                    <ul className="space-y-2">
                      {projects.map((project) => (
                        <li
                          key={project._id}
                          className="p-4 border rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                        >
                          <Link
                            href={`/projects/${project._id}`}
                            className="text-cyan-400 hover:underline"
                          >
                            <p>
                              <strong>Name:</strong> {project.name}
                            </p>
                            <p>
                              <strong>Code:</strong> {project.projectCode}
                            </p>
                            <p>
                              <strong>Internal Code:</strong> {project.code}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-center bg-gray-900 p-4 rounded-lg">
                      This client does not have any projects yet. You can add one from the Projects section.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
                  No client selected
                </h2>
                <p className="text-lg text-gray-400">
                  Please select a client from the left panel to view details or add a new client.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(Clients);
