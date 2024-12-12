import { useState, useEffect } from 'react';
import { fetchClients, createClient } from '../../services/api';
import ClientForm from '../../components/ClientForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '@/services/withAuth';

function Clients() {
  const [clients, setClients] = useState([]);
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

  const handleCreateClient = async (clientData) => {
    try {
      await createClient(clientData, token);
      setShowForm(false); // Hide the form after success
      fetchClientsData(); // Refresh the client list
    } catch (err) {
      setError('Failed to create client: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>Clients</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
          {showForm ? 'Cancel' : 'Add New Client'}
        </button>

        {showForm && (
          <div style={{ marginBottom: '20px' }}>
            <ClientForm onSubmit={handleCreateClient} />
          </div>
        )}

        {clients.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>
                    {client.address
                      ? `${client.address.street}, ${client.address.number}, ${client.address.city}, ${client.address.province}, ${client.address.postal}`
                      : 'No address'}
                  </td>
                  <td>{client.notes || 'No notes'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No clients available. Add a new one!</p>
        )}
      </div>
      <Footer />
    </>
  );
}
export default withAuth(Clients);