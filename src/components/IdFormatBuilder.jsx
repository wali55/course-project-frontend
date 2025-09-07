import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Save,
  RefreshCw,
  Copy
} from 'lucide-react';
import DraggableElement from './DraggableElement';
import { addElement, clearError, generatePreview, loadIdFormat, removeElement, reorderElements, saveIdFormat, updateElement } from '../store/slices/idFormatSlice';
import { CUSTOM_ID_ELEMENT_TYPES } from '../utils/customIdElementTypes';

const IdFormatBuilder = ({ inventoryId }) => {
  const dispatch = useDispatch();
  const { elements, preview, isLoading, error } = useSelector(state => state.idFormat);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    dispatch(loadIdFormat(inventoryId)).unwrap();
  }, [inventoryId, dispatch]);

  useEffect(() => {
    if (elements.length > 0) {
      dispatch(generatePreview(elements)).unwrap();
    }
  }, [elements, dispatch]);

  const handleAddElement = (type) => {
    const defaults = {
      FIXED_TEXT: { type, value: 'TEXT' },
      DATETIME: { type, format: { dateFormat: 'YYYYMMDD' } },
      SEQUENCE: { type, format: { leadingZeros: true } }
    };
    dispatch(addElement(defaults[type] || { type }));
    setShowAddMenu(false);
  };

  const dragHandlers = {
    start: (e, index) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    },
    end: () => setDraggedIndex(null),
    over: (e) => e.preventDefault(),
    drop: (e, hoverIndex) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== hoverIndex) {
        dispatch(reorderElements({ dragIndex: draggedIndex, hoverIndex }));
      }
    }
  };

  const copyPreview = () => navigator.clipboard.writeText(preview);

  if (isLoading) return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Custom ID Format</h2>
        <button
          onClick={() => dispatch(saveIdFormat({ inventoryId, elements })).unwrap()}
          disabled={isLoading || elements.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Format
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          {error}
          <button onClick={() => dispatch(clearError())} className="text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Live Preview</h3>
            <div className="text-lg font-mono bg-white px-3 py-2 rounded border">
              {preview || 'No preview available'}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(generatePreview(elements)).unwrap()}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={copyPreview}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            No elements added yet. Click "Add Element" to start building your ID format.
          </div>
        ) : (
          elements.map((element, index) => (
            <DraggableElement
              key={element.id}
              element={element}
              index={index}
              onUpdate={(id, updates) => dispatch(updateElement({ id, updates }))}
              onRemove={(id) => dispatch(removeElement(id))}
              onDrag={dragHandlers}
            />
          ))
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Element
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 grid grid-cols-2 gap-2 p-4">
            {Object.entries(CUSTOM_ID_ELEMENT_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleAddElement(type)}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-lg">{config.icon}</span>
                <span className="font-medium text-sm">{config.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Rules & Information</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag elements to reorder • Use settings to configure options</li>
          <li>• Custom IDs must be unique • Existing items keep their IDs</li>
        </ul>
      </div>
    </div>
  );
};

export default IdFormatBuilder;