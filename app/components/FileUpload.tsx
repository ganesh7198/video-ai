"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef(new AbortController());

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      return {
        signature: data.signature,
        expire: data.expire,
        token: data.token,
        publicKey: data.publicKey,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Authentication failed");
    }
  };

  const handleUpload = async () => {
    setError("");
    setImageUrl("");
    setProgress(0);

    const input = fileInputRef.current;

    if (!input?.files?.length) {
      alert("Please select a file");
      return;
    }

    const file = input.files[0];

    // Image validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    // 5 MB validation
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setLoading(true);

    // Create a fresh AbortController for this upload
    abortControllerRef.current = new AbortController();

    try {
      const auth = await authenticator();

      const response = await upload({
        file,
        fileName: file.name,
        signature: auth.signature,
        token: auth.token,
        expire: auth.expire,
        publicKey: auth.publicKey,

        abortSignal: abortControllerRef.current.signal,

        onProgress: (event) => {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          setProgress(percent);
        },
      });

      console.log(response);

      setImageUrl(response.url);

      alert("Upload Successful!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        setError("Upload cancelled.");
      } else if (err instanceof ImageKitInvalidRequestError) {
        setError(err.message);
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError("Network error.");
      } else if (err instanceof ImageKitServerError) {
        setError("ImageKit server error.");
      } else {
        setError("Something went wrong.");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current.abort();
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {loading && (
        <button
          onClick={cancelUpload}
          style={{
            background: "red",
            color: "white",
          }}
        >
          Cancel Upload
        </button>
      )}

      <progress
        value={progress}
        max={100}
      />

      <p>{progress}%</p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {imageUrl && (
        <div>
          <h3>Uploaded Image</h3>

          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <p>
            <strong>URL:</strong>
          </p>

          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {imageUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;