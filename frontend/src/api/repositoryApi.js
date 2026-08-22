import client from './client';

export const scanRepository = async (url) => {
  const response = await client.post('/repositories/scan-url', { url });
  return response.data;
};

export const uploadRepository = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await client.post('/repositories/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
