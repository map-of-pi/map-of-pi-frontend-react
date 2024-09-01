export const createFormData = (data: Record<string, any>, fileKey?: string, file?: File) => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  // append file data if available
  if (file && fileKey) {
    formData.append(fileKey, file);
  }
  
  return formData;
};

export const getMultipartFormDataHeaders = () => {
  return {
    'Content-Type': 'multipart/form-data',
  };
};
