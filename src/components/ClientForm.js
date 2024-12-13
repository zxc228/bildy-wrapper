import { useState } from 'react';

export default function ClientForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    cif: initialData.cif || '',
    address: {
      street: initialData.address?.street || '',
      number: initialData.address?.number || '',
      postal: initialData.address?.postal || '',
      city: initialData.address?.city || '',
      province: initialData.address?.province || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <input
        name="name"
        placeholder="Client Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="cif"
        placeholder="CIF"
        value={formData.cif}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <h3 className="text-lg font-bold">Address</h3>
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
        type="number"
        value={formData.address.number}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="address.postal"
        placeholder="Postal Code"
        type="number"
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
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        {initialData.name ? 'Update Client' : 'Create Client'}
      </button>
    </form>
  );
}
