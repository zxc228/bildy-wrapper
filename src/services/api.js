import axios from 'axios';

const BASE_URL = 'https://bildy-rpmaya.koyeb.app';

/** Onboarding */
// Регистрация пользователя
export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/api/user/register`, userData);
  const token = response.data.token; // Предполагается, что сервер возвращает токен
  if (token) {
    localStorage.setItem('jwt', token); // Сохраняем токен
  }
  return response.data;
};

// Логин пользователя
export const loginUser = (credentials) => 
  axios.post(`${BASE_URL}/api/user/login`, credentials);

// Валидация email
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
// Получение списка клиентов
export const fetchClients = (token) => 
  axios.get(`${BASE_URL}/api/client`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Создание клиента
export const createClient = (clientData, token) => 
  axios.post(`${BASE_URL}/api/client`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Получение клиента по ID
export const fetchClientById = (clientId, token) => 
  axios.get(`${BASE_URL}/api/client/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Удаление клиента
export const deleteClient = (clientId, token) =>
  axios.delete(`${BASE_URL}/api/client/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Обновление клиента
export const updateClient = (clientId, clientData, token) =>
  axios.put(`${BASE_URL}/api/client/${clientId}`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });





/** Projects */
// Получение списка проектов
export const fetchProjects = (token) => 
  axios.get(`${BASE_URL}/api/project`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Создание проекта
export const createProject = (projectData, token) => 
  axios.post(`${BASE_URL}/api/project`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Обновление проекта
export const updateProject = (projectId, projectData, token) => 
  axios.put(`${BASE_URL}/api/project/${projectId}`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Получение проекта по ID
export const fetchProjectById = (projectId, token) => 
  axios.get(`${BASE_URL}/api/project/one/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });




// Получение всех проектов клиента
export const fetchProjectsByClientId = (clientId, token) =>
  axios.get(`${BASE_URL}/api/project/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });



/** Delivery Notes */
// Создание накладной
export const createDeliveryNote = (noteData, token) =>
  axios.post(`${BASE_URL}/api/deliverynote`, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Получение накладных проекта
export const fetchDeliveryNotesByProject = (projectId, token) =>
  axios.get(`${BASE_URL}/api/deliverynote/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Скачивание PDF накладной
export const downloadDeliveryNotePDF = (noteId, token) =>
  axios.get(`${BASE_URL}/api/deliverynote/pdf/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

// Удаление накладной
export const deleteDeliveryNote = (noteId, token) =>
  axios.delete(`${BASE_URL}/api/deliverynote/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
