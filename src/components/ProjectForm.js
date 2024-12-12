import { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Project Name" value={formData.name} onChange={handleChange} required />
      <input name="projectCode" placeholder="Project Code" value={formData.projectCode} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="address.street" placeholder="Street" value={formData.address.street} onChange={handleChange} required />
      <input name="address.number" placeholder="Number" value={formData.address.number} onChange={handleChange} required />
      <input name="address.postal" placeholder="Postal Code" value={formData.address.postal} onChange={handleChange} required />
      <input name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} required />
      <input name="address.province" placeholder="Province" value={formData.address.province} onChange={handleChange} required />
      <input name="code" placeholder="Internal Code" value={formData.code} onChange={handleChange} required />
      <input name="clientId" placeholder="Client ID" value={formData.clientId} onChange={handleChange} required />
      <button type="submit">Save Project</button>
    </form>
  );
}
