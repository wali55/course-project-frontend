import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInventory,
  updateInventory,
} from "../store/slices/inventoriesSlice";
import { Upload, X, Tag, Globe, Lock } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InventorySettings = ({ inventory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, tags } = useSelector((state) => state.inventories);

  useEffect(() => {
    if (!tags || tags.length === 0) {
      dispatch(fetchTags()).unwrap();
    }
  }, [dispatch, tags]);

  const [formData, setFormData] = useState({
    title: inventory?.title || "",
    description: inventory?.description || "",
    categoryId: inventory?.categoryId || "",
    image: inventory?.image || "",
    tagObjs: inventory?.tags || [],
    isPublic: inventory?.isPublic || false,
    version: inventory?.version || 1,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !formData.tagObjs.map(t => t.name).includes(tag.name)
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/inventories/image", formData);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    e.target.value = "";

    try {
      setImageUploading(true);
      setImageFile(file);

      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        handleInputChange("image", imageUrl);
        setImageFile(null);
      } else {
        console.error("Image upload failed: No URL returned");
        alert("Failed to upload image. Please try again.");
        setImageFile(null);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
      setImageFile(null);
    } finally {
      setImageUploading(false);
    }
  };

  const addTag = (tagObj) => {
    handleInputChange("tagObjs", [...formData.tagObjs, tagObj]);
    setTagInput("");
    setShowTagDropdown(false);
  };

  const removeTag = (tagObj) => {
    handleInputChange(
      "tagObjs",
      formData.tagObjs.filter((t) => t.id !== tagObj.id)
    );
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      if (inventory) {
        await dispatch(updateInventory({ id: inventory.id, data: formData })).unwrap();
      } 
      toast("Inventory updated successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      toast("Failed to update inventory. Please try again.");
    }
  };

  const selectedTags = tags.filter((tag) =>
    formData.tagObjs.map(t => t.id).includes(tag.id)
  );

  const handleDelete = async () => {
    try {
        await dispatch(deleteInventory(inventory?.id)).unwrap();
        toast("Inventory deleted successfully");
        navigate("/dashboard");
    } catch (error) {
        toast("Failed to delete inventory");
    }
  }

  return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {inventory ? "Edit Inventory" : "Create Inventory"}
              {imageUploading && (
                <span className="text-sm text-gray-500 ml-2">
                  "(Uploading image...)"
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Supports Markdown formatting"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  handleInputChange("categoryId", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="space-y-3">
                {(formData.image || imageFile) && (
                  <div className="relative inline-block">
                    {imageUploading ? (
                      <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <img
                        src={
                          formData.image ||
                          (imageFile ? URL.createObjectURL(imageFile) : "")
                        }
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )}
                    {!imageUploading && (
                      <button
                        type="button"
                        onClick={() => {
                          handleInputChange("image", "");
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                <label
                  className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                    imageUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {imageUploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-3">
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onFocus={() => setShowTagDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowTagDropdown(false), 200)
                    }
                    placeholder="Type to search tags..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showTagDropdown && filteredTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Tag className="w-4 h-4 text-gray-400" />
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    handleInputChange("isPublic", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {formData.isPublic ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Make this inventory public
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Public inventories can be viewed and edited by all authenticated
                users
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={imageUploading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  imageUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {inventory ? "Update" : "Create"} Inventory
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-gray-300 text-gray-50 rounded-md hover:bg-red-600 bg-red-500"
              >
                Delete Inventory
              </button>
            </div>
          </div>
        </div>
  );
};

export default InventorySettings;
