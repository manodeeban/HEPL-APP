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
    if(error)
    alert('Please Enter a Valid URL');
    // throw error;
  }
}

