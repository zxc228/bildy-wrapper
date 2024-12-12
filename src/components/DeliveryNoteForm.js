import { useState } from 'react';

export default function DeliveryNoteForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    projectId: initialData.projectId || '',
    description: initialData.description || '',
    quantity: initialData.quantity || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="projectId"
        placeholder="Project ID"
        value={formData.projectId}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <button type="submit">Save Delivery Note</button>
    </form>
  );
}
