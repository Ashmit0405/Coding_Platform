import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProfileUpload from "@/hooks/useProfileUpload.js";

export default function UpdateProfilePhoto({ token, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadProfile, msg, loading } = useProfileUpload(token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadProfile(selectedFile, () => {
      setSelectedFile(null);
      if (onClose) onClose();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="w-full"
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>

      {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
    </form>
  );
}
