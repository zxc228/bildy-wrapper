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

/** Delivery Notes */
// Получение списка накладных
export const fetchDeliveryNotes = (token) => 
  axios.get(`${BASE_URL}/api/deliverynote`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Создание накладной
export const createDeliveryNote = (deliveryNoteData, token) => 
  axios.post(`${BASE_URL}/api/deliverynote`, deliveryNoteData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Загрузка PDF накладной
export const downloadDeliveryNotePDF = (deliveryNoteId, token) => 
  axios.get(`${BASE_URL}/api/deliverynote/pdf/${deliveryNoteId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // Для загрузки файлов
  });
