import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button"; // adjust path as needed

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully.");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".csv" ref={inputRef} onChange={handleFileChange} className="hidden" />

        <div className="flex items-center gap-2">
          <Button type="button" onClick={triggerFileInput}>
            {file ? "Change File" : "Select CSV File"}
          </Button>

          {file && <span className="text-sm text-gray-600">{file.name}</span>}
        </div>

        <Button type="submit" disabled={!file}>
          Upload CSV
        </Button>
      </form>
    </div>
  );
}

export default FileUpload;
