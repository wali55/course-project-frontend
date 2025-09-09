import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { fetchSingleHomeInventoryItem } from "../store/slices/homeSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const HomeItemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    singleItem: item,
    loading,
    error,
    customFields,
  } = useSelector((state) => state.home);

  useEffect(() => {
    if (!itemId) {
      return;
    }
    dispatch(fetchSingleHomeInventoryItem(itemId));
  }, [dispatch, itemId]);

  const renderFieldValue = (fieldName, value, fieldType) => {
    if (!value) return <span className="text-gray-400">Not set</span>;

    switch (fieldType) {
      case "BOOLEAN":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      case "DOCUMENT_LINK":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View Document
          </a>
        );
      case "MULTI_TEXT":
        return (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{value}</p>
          </div>
        );
      case "NUMBER":
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{value.toLocaleString()}</span>
          </div>
        );
      case "IMAGE":
        return (
          <div className="relative group">
            <img
              src={value}
              alt={fieldName}
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        );
      default:
        return <span className="break-words">{String(value)}</span>;
    }
  };

  const getFieldType = (fieldName) => {
    const field = customFields?.find((f) => f.title === fieldName);
    return field?.fieldType || "TEXT";
  };

  if (!itemId) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Item Details</h1>
            <p className="text-gray-600">View and manage item information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Item ID
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                  {item.customId || `#${item.id.slice(-8)}`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created Date
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created By
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <User className="w-4 h-4 text-gray-500" />
                <span>{item.creator?.username || "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>

        {item.fieldValues && Object.keys(item.fieldValues).length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Item Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(item.fieldValues).map(([fieldName, value]) => {
                const fieldType = getFieldType(fieldName);
                const isImage =
                  fieldType === "IMAGE" ||
                  fieldName.toLowerCase().includes("image");

                return (
                  <div
                    key={fieldName}
                    className={isImage ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      {fieldName}
                    </label>
                    <div className="text-gray-900">
                      {renderFieldValue(
                        fieldName,
                        value,
                        isImage ? "IMAGE" : fieldType
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">
                {new Date(item.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeItemPage;
