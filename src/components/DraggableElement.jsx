import { useState } from 'react';
import { 
  GripVertical, 
  Trash2, 
  Settings,
} from 'lucide-react';
import ElementEditor from './ElementEditor';
import { CUSTOM_ID_ELEMENT_TYPES } from '../utils/customIdElementTypes';

const DraggableElement = ({ element, index, onUpdate, onRemove, onDrag }) => {
  const [showEditor, setShowEditor] = useState(false);
  const config = CUSTOM_ID_ELEMENT_TYPES[element.type];

  const getElementDisplay = () => {
    if (element.type === 'FIXED_TEXT') return element.value || 'Empty';
    
    let display = config.label;
    if (element.format?.leadingZeros) display += ' (padded)';
    if (element.format?.dateFormat) display += ` (${element.format.dateFormat})`;
    return display;
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDrag.start(e, index)}
        onDragEnd={onDrag.end}
        onDragOver={onDrag.over}
        onDrop={(e) => onDrag.drop(e, index)}
        className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <div className="flex-1 flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium">{getElementDisplay()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditor(true)}
              className="p-1 text-gray-500 hover:text-blue-500"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(element.id)}
              className="p-1 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {showEditor && (
        <ElementEditor
          element={element}
          onUpdate={onUpdate}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
};

export default DraggableElement;