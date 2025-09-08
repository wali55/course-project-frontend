import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import FieldInput from "./FieldInput";
import { createItem, updateItem } from "../store/slices/itemsSlice";
import toast from "react-hot-toast";

const ItemForm = ({ inventoryId, item, onClose }) => {
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.items);

  const [formData, setFormData] = useState({
    customId: item?.customId || "",
    fieldValues: item?.fieldValues || {},
  });

  const handleFieldChange = (fieldTitle, value) => {
    setFormData((prev) => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [fieldTitle]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (item) {
      await dispatch(updateItem({ id: item.id, data: formData })).unwrap();
      toast("Item created successfully");
    } else {
      await dispatch(createItem({ inventoryId, data: formData })).unwrap();
      toast("Item created successfully");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {item ? "Edit Item" : "Create Item"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {customFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.title}
                  {field.description && (
                    <span className="text-gray-500 text-xs ml-1">
                      ({field.description})
                    </span>
                  )}
                </label>
                <FieldInput
                  field={field}
                  value={formData.fieldValues[field.title]}
                  onChange={(value) => handleFieldChange(field.title, value)}
                />
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {item ? "Update" : "Create"} Item
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
