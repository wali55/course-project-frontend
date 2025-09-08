import { Upload, FileText } from "lucide-react";
import api from "../services/api";

const FieldInput = ({ field, value, onChange }) => {

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/items/upload", formData);
      onChange(response.data.imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  switch (field.fieldType) {
    case "SINGLE_TEXT":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );

    case "MULTI_TEXT":
      return (
        <textarea
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );

    case "NUMBER":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value ? parseFloat(e.target.value) : "")
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );

    case "BOOLEAN":
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Yes</span>
        </label>
      );

    case "DOCUMENT_LINK":
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          {value && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <FileText className="w-4 h-4" />
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                View File
              </a>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default FieldInput;
