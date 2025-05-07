document.getElementById('extract-btn').addEventListener('click', extractText);
document.getElementById('download-btn').addEventListener('click', downloadText);

async function extractText() {
  const fileInput = document.getElementById('file-upload');
  const output = document.getElementById('output');
  output.value = "";

  if (!fileInput.files.length) {
    alert("Please select a PDF file.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const typedArray = new Uint8Array(reader.result);

    try {
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      }

      output.value = fullText.trim() || "No extractable text found in this PDF.";
    } catch (error) {
      console.error("Error reading PDF:", error);
      alert("An error occurred while reading the PDF. Please check the console for details.");
    }
  };

  reader.readAsArrayBuffer(file);
}

function downloadText() {
  const text = document.getElementById('output').value;
  if (!text.trim()) {
    alert("There's no text to download!");
    return;
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "extracted_text.txt";
  link.click();
}
