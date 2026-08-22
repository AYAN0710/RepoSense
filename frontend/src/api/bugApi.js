import client from './client';

export const analyzeBugs = async (repositoryId, query = "Find potential bugs in the repository.", topK = 8) => {
  const response = await client.post('/bugs/analyze', {
    repository_id: repositoryId,
    query,
    top_k: topK,
  });
  return response.data;
};
