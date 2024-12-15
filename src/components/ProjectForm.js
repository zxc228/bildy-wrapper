import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { fetchClients } from '../services/api';

export default function ProjectForm({ onSubmit, initialData = {} }) {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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

  const validationSchema = Yup.object({
    name: Yup.string().required('Project name is required'),
    projectCode: Yup.string().required('Project code is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.object({
      street: Yup.string().required('Street is required'),
      number: Yup.string().required('Number is required'),
      postal: Yup.string().required('Postal code is required'),
      city: Yup.string().required('City is required'),
      province: Yup.string().required('Province is required'),
    }),
    code: Yup.string().required('Internal code is required'),
    clientId: Yup.string().required('Client is required'),
  });

  const initialValues = {
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
      {({ isSubmitting }) => (
        <Form className="space-y-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-8 rounded-lg shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            {initialData.name ? 'Edit Project' : 'Create Project'}
          </h2>
          {error && <p className="text-red-400">{error}</p>}

          <div className="space-y-2">
            <label className="block font-medium text-gray-300">Project Name</label>
            <Field
              name="name"
              placeholder="Project Name"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-300">Project Code</label>
            <Field
              name="projectCode"
              placeholder="Project Code"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="projectCode" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-300">Email</label>
            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <h3 className="text-xl font-bold text-gray-300">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field
                name="address.street"
                placeholder="Street"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="address.street" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="address.number"
                placeholder="Number"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="address.number" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="address.postal"
                placeholder="Postal Code"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="address.postal" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="address.city"
                placeholder="City"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="address.city" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="address.province"
                placeholder="Province"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage name="address.province" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-300">Internal Code</label>
            <Field
              name="code"
              placeholder="Internal Code"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage name="code" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-300">Client</label>
            <Field
              as="select"
              name="clientId"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="" disabled>
                Select a Client
              </option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
