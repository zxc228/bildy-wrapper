import { useState, useEffect } from 'react';
import { fetchClients } from '../services/api'; // Предполагается, что API для получения клиентов уже есть.

export default function ProjectForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    projectCode: initialData.projectCode || '',
    email: initialData.email || '',
    address: {
      street: initialData.address?.street || '',
      number: initialData.address?.number || '',
      postal: initialData.address?.postal || '',
      city: initialData.address?.city || '',
      province: initialData.address?.province || '',
    },
    code: initialData.code || '',
    clientId: initialData.clientId || '',
  });

  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Загрузка списка клиентов при загрузке формы.
    const loadClients = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        const response = await fetchClients(token);
        setClients(response.data);
      } catch (err) {
        setError('Failed to load clients: ' + (err.response?.data?.message || err.message));
      }
    };
    loadClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create / Edit Project</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <label className="block font-medium">Project Name</label>
        <input
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Project Code</label>
        <input
          name="projectCode"
          placeholder="Project Code"
          value={formData.projectCode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <h3 className="text-lg font-bold">Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="address.street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address.number"
          placeholder="Number"
          value={formData.address.number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address.postal"
          placeholder="Postal Code"
          value={formData.address.postal}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address.city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address.province"
          placeholder="Province"
          value={formData.address.province}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Internal Code</label>
        <input
          name="code"
          placeholder="Internal Code"
          value={formData.code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Client</label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select a Client
          </option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Save Project
      </button>
    </form>
  );
}
