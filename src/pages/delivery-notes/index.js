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
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-8">
            Delivery Notes
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
              {showForm ? 'Cancel' : 'Add New Delivery Note'}
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <DeliveryNoteForm onSubmit={handleCreateDeliveryNote} />
            </div>
          )}

          {deliveryNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Project ID</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700 text-gray-300">
                  {deliveryNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="hover:bg-gray-600 transition-colors duration-200"
                    >
                      <td className="p-4">{note.id}</td>
                      <td className="p-4">{note.projectId}</td>
                      <td className="p-4">{note.description}</td>
                      <td className="p-4">{note.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No delivery notes available. Add a new one!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default withAuth(DeliveryNotes);
