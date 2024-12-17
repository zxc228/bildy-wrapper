import axios from 'axios';

const BASE_URL = 'https://bildy-rpmaya.koyeb.app';

/** Onboarding */
// User registration
export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/api/user/register`, userData);
  const token = response.data.token; 
  if (token) {
    localStorage.setItem('jwt', token); 
  }
  return response.data;
};

// User login
export const loginUser = (credentials) => 
  axios.post(`${BASE_URL}/api/user/login`, credentials);

// Email validation
export const validateEmail = async (emailValidationData) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    throw new Error('Token is missing. Please register again.');
  }
  return axios.put(
    `${BASE_URL}/api/user/validation`,
    emailValidationData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};



/** Clients */
// Retrieve all clients
export const fetchClients = (token) => 
  axios.get(`${BASE_URL}/api/client`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// client creation
export const createClient = (clientData, token) => 
  axios.post(`${BASE_URL}/api/client`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Retrieve client by ID
export const fetchClientById = (clientId, token) => 
  axios.get(`${BASE_URL}/api/client/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Client deletion
export const deleteClient = (clientId, token) =>
  axios.delete(`${BASE_URL}/api/client/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Client update
export const updateClient = (clientId, clientData, token) =>
  axios.put(`${BASE_URL}/api/client/${clientId}`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });





/** Projects */
// Retrieve all projects
export const fetchProjects = (token) => 
  axios.get(`${BASE_URL}/api/project`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Project creation
export const createProject = (projectData, token) => 
  axios.post(`${BASE_URL}/api/project`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Project update
export const updateProject = (projectId, projectData, token) => 
  axios.put(`${BASE_URL}/api/project/${projectId}`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Retrieve project by ID
export const fetchProjectById = (projectId, token) => 
  axios.get(`${BASE_URL}/api/project/one/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteProjectById = (projectId, token) => 
  axios.delete(`${BASE_URL}/api/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Retrieve projects by client ID
export const fetchProjectsByClientId = (clientId, token) =>
  axios.get(`${BASE_URL}/api/project/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });



/** Delivery Notes */
// Delivery Note creation
export const createDeliveryNote = (noteData, token) =>
  axios.post(`${BASE_URL}/api/deliverynote`, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Retrieve all delivery notes
export const fetchDeliveryNotesByProject = (projectId, token) =>
  axios.get(`${BASE_URL}/api/deliverynote/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Download delivery note PDF
export const downloadDeliveryNotePDF = (noteId, token) =>
  axios.get(`${BASE_URL}/api/deliverynote/pdf/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

// Delivery Note deletion
export const deleteDeliveryNote = (noteId, token) =>
  axios.delete(`${BASE_URL}/api/deliverynote/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


export const updateDeliveryNote = (noteId, noteData, token) =>
  
  axios.put(`${BASE_URL}/api/deliverynote/${noteId}`, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });
