import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function ClientForm({ onSubmit, initialData = {} }) {
  // Схема валидации с использованием Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Client name is required'),
    cif: Yup.string().required('CIF is required'),
    address: Yup.object({
      street: Yup.string().required('Street is required'),
      number: Yup.number().required('Number is required'),
      postal: Yup.number().required('Postal code is required'),
      city: Yup.string().required('City is required'),
      province: Yup.string().required('Province is required'),
    }),
  });

  // Начальные значения формы
  const initialValues = {
    name: initialData.name || '',
    cif: initialData.cif || '',
    address: {
      street: initialData.address?.street || '',
      number: initialData.address?.number || '',
      postal: initialData.address?.postal || '',
      city: initialData.address?.city || '',
      province: initialData.address?.province || '',
    },
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
        <Form className="space-y-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            {initialData.name ? 'Update Client' : 'Create Client'}
          </h2>

          {/* Поле имени */}
          <div>
            <Field
              name="name"
              placeholder="Client Name"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Поле CIF */}
          <div>
            <Field
              name="cif"
              placeholder="CIF"
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <ErrorMessage
              name="cif"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <h3 className="text-lg font-bold text-gray-300">Address</h3>

          {/* Адрес */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field
                name="address.street"
                placeholder="Street"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage
                name="address.street"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Field
                name="address.number"
                placeholder="Number"
                type="number"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage
                name="address.number"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Field
                name="address.postal"
                placeholder="Postal Code"
                type="number"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage
                name="address.postal"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Field
                name="address.city"
                placeholder="City"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage
                name="address.city"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Field
                name="address.province"
                placeholder="Province"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <ErrorMessage
                name="address.province"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            {initialData.name ? 'Update Client' : 'Create Client'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
