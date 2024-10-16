import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [fileType, setFileType] = useState("all");

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.split("/")[1],  // Get the file extension (e.g., jpeg, png)
    }));
    setPhotos((prevPhotos) => [...prevPhotos, ...updatedPhotos]);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const filteredPhotos = photos.filter(
    (photo) => fileType === "all" || photo.type === fileType
  );

  const downloadFilteredPhotosAsZip = async () => {
    if (filteredPhotos.length === 0) {
      alert("No photos to download.");
      return;
    }

    const zip = new JSZip();

    // Add filtered photos to the zip folder
    filteredPhotos.forEach((photo, index) => {
      zip.file(`${index}.${photo.type}`, photo.file);
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Use file-saver to trigger the download
    saveAs(content, "photos.zip");
  };

  return (
    <div className="app">
      <h1>Photo Sorter</h1>

      <div className="upload-section">
        <input
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.gif,.tiff,.tif,.bmp,.cr2,.nef,.arw"  // Include only the selected common formats
          onChange={handleFileUpload}
        />
        <select value={fileType} onChange={handleFileTypeChange}>
          <option value="all">All</option>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="gif">GIF</option>
          <option value="tiff">TIFF</option>
          <option value="bmp">BMP</option>
          <option value="x-canon-cr2">RAW (Canon CR2)</option>
          <option value="x-nikon-nef">RAW (Nikon NEF)</option>
          <option value="x-sony-arw">RAW (Sony ARW)</option>
        </select>
        <button onClick={downloadFilteredPhotosAsZip}>Download Filtered Photos</button>
      </div>

      <div className="photo-gallery">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo, index) => (
            <div className="photo-item" key={index}>
              <img src={photo.url} alt={`uploaded-${index}`} />
              <p>Type: {photo.type.toUpperCase()}</p>
            </div>
          ))
        ) : (
          <p>No photos to display.</p>
        )}
      </div>
    </div>
  );
}

export default App;
