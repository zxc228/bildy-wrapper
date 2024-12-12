import { useState, useEffect } from 'react';
import { fetchDeliveryNotes, createDeliveryNote } from '../../services/api';
import DeliveryNoteForm from '../../components/DeliveryNoteForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '../../services/withAuth';

function DeliveryNotes() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (token) {
      fetchDeliveryNotesData();
    }
  }, [token]);

  const fetchDeliveryNotesData = async () => {
    try {
      const response = await fetchDeliveryNotes(token);
      setDeliveryNotes(response.data);
    } catch (err) {
      setError('Failed to load delivery notes: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateDeliveryNote = async (deliveryNoteData) => {
    try {
      await createDeliveryNote(deliveryNoteData, token);
      setShowForm(false); // Hide the form after success
      fetchDeliveryNotesData(); // Refresh the delivery note list
    } catch (err) {
      setError('Failed to create delivery note: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>Delivery Notes</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
          {showForm ? 'Cancel' : 'Add New Delivery Note'}
        </button>

        {showForm && (
          <div style={{ marginBottom: '20px' }}>
            <DeliveryNoteForm onSubmit={handleCreateDeliveryNote} />
          </div>
        )}

        {deliveryNotes.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project ID</th>
                <th>Description</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {deliveryNotes.map((note) => (
                <tr key={note.id}>
                  <td>{note.id}</td>
                  <td>{note.projectId}</td>
                  <td>{note.description}</td>
                  <td>{note.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No delivery notes available. Add a new one!</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default withAuth(DeliveryNotes);
