export async function pdfUrlToBase64(pdfUrl) {
  try {
    // Fetch the PDF file
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Convert response to blob
    const blob = await response.blob();

    // Create a FileReader
    const reader = new FileReader();

    // Read the blob as Data URL
    reader.readAsDataURL(blob);

    // When FileReader completes reading
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // Get the result as Data URL
        const base64data = reader.result;

        // Extract the Base64 content
        const base64Content = base64data.split(',')[1];

        // Resolve with the Base64 content
        resolve(base64Content);
      };

      // Handle errors
      reader.onerror = () => {
        reader.abort();
        reject(new Error('Error reading the PDF file'));
      };
    });
  } catch (error) {
    console.error('Error converting PDF to Base64:', error);
    throw error;
  }
}

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
};
