import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function DeliveryNoteForm({ onSubmit, clients = [], projectId, initialData = {} }) {
  // Схема валидации формы
  const validationSchema = Yup.object({
    clientId: Yup.string().required('Client is required'),
    format: Yup.string().oneOf(['material', 'hours']).required('Format is required'),
    material: Yup.string().when('format', {
      is: 'material',
      then: Yup.string().required('Material type is required'),
    }),
    hours: Yup.number().when('format', {
      is: 'hours',
      then: Yup.number().required('Hours worked is required').positive('Must be positive'),
    }),
    description: Yup.string().required('Description is required'),
    workdate: Yup.date().required('Work date is required'),
  });

  // Начальные значения формы
  const initialValues = {
    clientId: initialData.clientId || clients[0]?._id || '',
    projectId: projectId || '',
    format: initialData.format || 'material',
    material: initialData.material || '',
    hours: initialData.hours || '',
    description: initialData.description || '',
    workdate: initialData.workdate || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form className="space-y-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Delivery Note Form
          </h2>

          {/* Выбор клиента */}
          <div className="space-y-2">
            <label className="text-gray-300">Select Client</label>
            <Field
              as="select"
              name="clientId"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Project ID (только для чтения) */}
          <div className="space-y-2">
            <label className="text-gray-300">Project ID</label>
            <Field
              name="projectId"
              readOnly
              className="w-full p-3 bg-gray-800 text-gray-500 border border-gray-600 rounded cursor-not-allowed"
            />
          </div>

          {/* Формат */}
          <div className="space-y-2">
            <label className="text-gray-300">Format</label>
            <Field
              as="select"
              name="format"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="material">Material</option>
              <option value="hours">Hours</option>
            </Field>
            <ErrorMessage name="format" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Поля для материалов или часов */}
          {values.format === 'material' && (
            <div className="space-y-2">
              <label className="text-gray-300">Type of Material</label>
              <Field
                name="material"
                placeholder="Type of Material"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="material" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          )}

          {values.format === 'hours' && (
            <div className="space-y-2">
              <label className="text-gray-300">Hours Worked</label>
              <Field
                name="hours"
                type="number"
                placeholder="Hours Worked"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="hours" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          )}

          {/* Описание */}
          <div className="space-y-2">
            <label className="text-gray-300">Description</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Description"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Дата выполнения */}
          <div className="space-y-2">
            <label className="text-gray-300">Work Date</label>
            <Field
              name="workdate"
              type="date"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="workdate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Delivery Note'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
