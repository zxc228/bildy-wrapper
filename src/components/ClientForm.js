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

    if (name.includes('address.')) {
      // Update nested address fields
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      // Update top-level fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Client Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="cif"
        placeholder="Client CIF"
        value={formData.cif}
        onChange={handleChange}
        required
      />
      <input
        name="address.street"
        placeholder="Street"
        value={formData.address.street}
        onChange={handleChange}
        required
      />
      <input
        name="address.number"
        placeholder="Number"
        value={formData.address.number}
        onChange={handleChange}
        required
      />
      <input
        name="address.postal"
        placeholder="Postal Code"
        value={formData.address.postal}
        onChange={handleChange}
        required
      />
      <input
        name="address.city"
        placeholder="City"
        value={formData.address.city}
        onChange={handleChange}
        required
      />
      <input
        name="address.province"
        placeholder="Province"
        value={formData.address.province}
        onChange={handleChange}
        required
      />
      <button type="submit">Save Client</button>
    </form>
  );
}
