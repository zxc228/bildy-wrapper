import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchClients,
  createClient,
  deleteClient,
  updateClient,
  fetchProjectsByClientId, // Добавляем функцию API
} from '../../services/api';
import ClientForm from '../../components/ClientForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '@/services/withAuth';

function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [projects, setProjects] = useState([]); // Добавляем состояние для проектов
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
      setProjects(response.data); // Сохраняем проекты выбранного клиента
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
    fetchProjectsData(client._id); // Загружаем проекты при выборе клиента
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(clientId, token);
        setSelectedClient(null);
        setProjects([]); // Очищаем проекты
        fetchClientsData();
      } catch (err) {
        setError('Failed to delete client: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="container mx-auto p-6 flex-grow flex">
          {/* Блок списка клиентов */}
          <div className="w-1/3 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Clients</h2>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSelectedClient(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-500"
            >
              {showForm ? 'Cancel' : 'Add New Client'}
            </button>

            {showForm && (
              <ClientForm
                onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
                initialData={selectedClient || {}}
              />
            )}

            <ul className="space-y-2">
              {clients.map((client) => (
                <li
                  key={client._id}
                  className={`p-2 cursor-pointer rounded ${
                    selectedClient?._id === client._id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectClient(client)}
                >
                  {client.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Блок деталей клиента */}
          <div className="w-2/3 p-4">
            {selectedClient ? (
              <>
                <div className="bg-white p-6 rounded shadow mb-6">
                  <h2 className="text-2xl font-bold mb-4">{selectedClient.name}</h2>
                  <p><strong>ID:</strong> {selectedClient._id}</p>
                  <p>
                    <strong>Address:</strong> {selectedClient.address.street}, {selectedClient.address.number}, {selectedClient.address.city}, {selectedClient.address.province}, {selectedClient.address.postal}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 mt-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(selectedClient._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 mt-4 ml-2"
                  >
                    Delete
                  </button>
                </div>

                {/* Список проектов */}
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-xl font-bold mb-4">Projects</h3>
                  {projects.length > 0 ? (
                    <ul className="space-y-2">
                      {projects.map((project) => (
                        <li key={project._id} className="p-2 border rounded hover:bg-gray-100">
                          <Link href={`/projects/${project._id}`} className="text-blue-600 hover:underline">
                            
                              <strong>Name:</strong> {project.name} <br />
                              <strong>Code:</strong> {project.projectCode} <br />
                              <strong>Internal Code:</strong> {project.code}
                            
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects available for this client.</p>
                  )}
                </div>

              </>
            ) : (
              <p className="text-gray-600">Select a client to view details</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(Clients);
