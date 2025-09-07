import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
} from 'lucide-react';
import { addPendingField, fetchCustomFields, reorderCustomFields, reorderFields } from '../store/slices/customFieldsSlice';
import { FIELD_TYPES } from '../utils/fieldTypes';
import FieldItem from './FieldItem';

const CustomFieldsManager = () => {
  const dispatch = useDispatch();
  const { fields, pendingFields, isLoading, error } = useSelector(state => state.customFields);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const { inventory } = useSelector((state) => state.accessControl);

  useEffect(() => {
    dispatch(fetchCustomFields(inventory?.id)).unwrap();
  }, [inventory?.id, dispatch]);

  const allFields = [...fields, ...pendingFields];

  const getFieldCountByType = (fieldType) => 
    allFields.filter(f => f.fieldType === fieldType).length;

  const canAddField = (fieldType) => 
    getFieldCountByType(fieldType) < FIELD_TYPES[fieldType].limit;

  const handleAddField = (fieldType) => {
    if (canAddField(fieldType)) {
      dispatch(addPendingField({ fieldType }));
    }
  };

  const handleReorder = () => {
    const serverFields = allFields.filter(f => !f.id.startsWith('temp-'));
    if (serverFields.length > 0) {
      dispatch(reorderCustomFields({ inventoryId: inventory?.id, fields: serverFields })).unwrap();
    }
  };

  const dragHandlers = {
    start: (e, index) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    },
    end: () => {
      handleReorder();
      setDraggedIndex(null);
    },
    over: (e) => e.preventDefault(),
    drop: (e, hoverIndex) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== hoverIndex) {
        dispatch(reorderFields({ dragIndex: draggedIndex, hoverIndex }));
      }
    }
  };

  if (isLoading && allFields.length === 0) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Custom Fields ({inventory.title})</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}


      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-900 mb-2">Fixed Fields (Always Present)</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• Created By (automatic)</div>
          <div>• Created At (automatic)</div>
          <div>• Custom ID (editable by users)</div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(FIELD_TYPES).map(([type, config]) => (
          <button
            key={type}
            onClick={() => handleAddField(type)}
            disabled={!canAddField(type)}
            className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
              canAddField(type)
                ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <div className="font-medium">{config.icon} {config.label}</div>
            <div className="text-sm text-gray-500 mt-1">
              {getFieldCountByType(type)}/{config.limit} used
            </div>
          </button>
        ))}
      </div>


      <div className="space-y-4">
        {allFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No custom fields added yet. Click the buttons above to add fields.
          </div>
        ) : (
          allFields.map((field, index) => (
            <FieldItem
              key={field.id}
              field={field}
              index={index}
              inventoryId={inventory?.id}
              onDrag={dragHandlers}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CustomFieldsManager;