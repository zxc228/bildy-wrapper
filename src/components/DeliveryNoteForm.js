import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function DeliveryNoteForm({ onSubmit, clients = [], projectId, initialData = {} }) {

  
  // Initial values for the form
  const initialValues = {
    clientId: initialData.clientId || clients[0]?._id || '',
    projectId: projectId || '',
    format: initialData.format || 'material',
    material: initialData.material || '',
    hours: initialData.hours || '',
    description: initialData.description || '',
    workdate: initialData.workdate || '',
  };

  // Custom validation logic
  const validate = (values) => {
    const errors = {};

    if (!values.clientId) {
      errors.clientId = 'Client is required';
    }
    if (!values.format) {
      errors.format = 'Format is required';
    }
    if (values.format === 'material' && !values.material) {
      errors.material = 'Material type is required';
    }
    if (values.format === 'hours' && (!values.hours || values.hours <= 0)) {
      errors.hours = 'Valid hours worked is required';
    }
    if (!values.description) {
      errors.description = 'Description is required';
    }
    if (!values.workdate) {
      errors.workdate = 'Work date is required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
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

          {/* Client Selection */}
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

          {/* Project ID */}
          <div className="space-y-2">
            <label className="text-gray-300">Project ID</label>
            <Field
              name="projectId"
              readOnly
              className="w-full p-3 bg-gray-800 text-gray-500 border border-gray-600 rounded cursor-not-allowed"
            />
          </div>

          {/* Format */}
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

          {/* Fields for material or hours */}
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

          {/* Description */}
          <div className="space-y-2">
            <label className="text-gray-300">Description</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Description"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Work Date */}
          <div className="space-y-2">
            <label className="text-gray-300">Work Date</label>
            <Field
              name="workdate"
              type="date"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="workdate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Submit Button */}
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
