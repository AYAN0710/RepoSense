import client from './client';

export const askCodebase = async (repositoryId, query, topK = 5) => {
  const response = await client.post('/codeChat/chat', {
    repository_id: repositoryId,
    query,
    top_k: topK,
  });
  return response.data;
};
