export const getFileSearchResult = async (
  prefixQuery: string,
  resultCount: number
): Promise<string[]> => {
  const requestParams = {
    prefix: prefixQuery,
    count: resultCount,
    randomDelay: true,
  };
  const queryString = Object.entries(requestParams)
    .map(([paramName, paramValue]) => `${paramName}=${paramValue}`)
    .join("&");
  const decodedResponse = await (
    await fetch(`http://localhost:8081/search?${queryString}`)
  ).json();
  return decodedResponse.results || [];
};
