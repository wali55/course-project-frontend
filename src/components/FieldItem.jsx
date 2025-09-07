import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Info,
  Save,
  X
} from 'lucide-react';
import { createCustomField, deleteCustomField, removePendingField, updateCustomField, updatePendingField } from '../store/slices/customFieldsSlice';
import { FIELD_TYPES } from '../utils/fieldTypes';



const FieldItem = ({ field, index, inventoryId, onDrag }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(field.isNew);
  const [localField, setLocalField] = useState(field);

  const isTemporary = field.id.startsWith('temp-');

  const handleSave = () => {
    if (!localField.title.trim()) return;
    
    if (isTemporary) {
      dispatch(createCustomField({ 
        inventoryId, 
        fieldData: { ...localField, id: undefined } 
      })).unwrap();
    } else {
      dispatch(updateCustomField({ 
        inventoryId, 
        fieldId: field.id, 
        updates: localField 
      })).unwrap();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isTemporary) {
      dispatch(removePendingField(field.id));
    } else {
      setLocalField(field);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (isTemporary) {
      dispatch(removePendingField(field.id));
    } else {
      dispatch(deleteCustomField({ inventoryId, fieldId: field.id })).unwrap();
    }
  };

  const updateField = (updates) => {
    setLocalField({ ...localField, ...updates });
    if (isTemporary) {
      dispatch(updatePendingField({ id: field.id, updates }));
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDrag.start(e, index)}
      onDragEnd={onDrag.end}
      onDragOver={onDrag.over}
      onDrop={(e) => onDrag.drop(e, index)}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move mt-1" />
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={localField.title}
                onChange={(e) => updateField({ title: e.target.value })}
                placeholder="Field title"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <textarea
                value={localField.description}
                onChange={(e) => updateField({ description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localField.showInTable}
                  onChange={(e) => updateField({ showInTable: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show in table view</span>
              </label>
              
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{field.title}</h4>
                {field.showInTable ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                {field.description && (
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400" />
                    <div className="absolute bottom-6 left-0 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {field.description}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {FIELD_TYPES[field.fieldType]?.icon} {FIELD_TYPES[field.fieldType]?.label}
              </p>
              
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="text-sm text-blue-500 hover:text-blue-600">
                  Edit
                </button>
                <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldItem;