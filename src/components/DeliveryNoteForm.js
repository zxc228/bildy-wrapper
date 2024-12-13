import { useState, useEffect } from 'react';

export default function DeliveryNoteForm({ onSubmit, clients = [], projectId, initialData = {} }) {
  const [formData, setFormData] = useState({
    clientId: initialData.clientId || '',
    projectId: projectId, // Устанавливаем projectId по умолчанию
    format: initialData.format || 'material',
    material: initialData.material || '',
    hours: initialData.hours || '',
    description: initialData.description || '',
    workdate: initialData.workdate || '',
  });

  useEffect(() => {
    // Если clients есть, выбираем первого клиента по умолчанию
    if (!formData.clientId && clients.length > 0) {
      setFormData((prev) => ({ ...prev, clientId: clients[0]._id }));
    }
  }, [clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
      {/* Выпадающий список для Client ID */}
      <select
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        {clients.map((client) => (
          <option key={client._id} value={client._id}>
            {client.name}
          </option>
        ))}
      </select>

      {/* Автоматическое и неизменяемое поле для Project ID */}
      <input
        name="projectId"
        value={formData.projectId}
        readOnly
        className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
      />

      {/* Остальные поля */}
      <select
        name="format"
        value={formData.format}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="material">Material</option>
        <option value="hours">Hours</option>
      </select>

      {formData.format === 'material' && (
        <input
          name="material"
          placeholder="Type of Material"
          value={formData.material}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      )}

      {formData.format === 'hours' && (
        <input
          name="hours"
          type="number"
          placeholder="Hours Worked"
          value={formData.hours}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      )}

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="workdate"
        type="date"
        value={formData.workdate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Save Delivery Note
      </button>
    </form>
  );
}
