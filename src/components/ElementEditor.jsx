import { useState } from 'react';
import { CUSTOM_ID_ELEMENT_TYPES } from '../utils/customIdElementTypes';

const ElementEditor = ({ element, onUpdate, onClose }) => {
  const [local, setLocal] = useState(element);
  const config = CUSTOM_ID_ELEMENT_TYPES[element.type];

  const handleSave = () => {
    onUpdate(element.id, local);
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Edit {config.label}</h3>
        
        <div className="space-y-4">
          {config.hasValue && (
            <div>
              <label className="block text-sm font-medium mb-1">Text Value</label>
              <input
                type="text"
                value={local.value || ''}
                onChange={(e) => setLocal({ ...local, value: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter text..."
              />
            </div>
          )}
          
          {config.formatOptions && (
            <div>
              <label className="block text-sm font-medium mb-2">Format Options</label>
              
              {config.formatOptions.includes('leadingZeros') && (
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={local.format?.leadingZeros || false}
                    onChange={(e) => setLocal({
                      ...local,
                      format: { ...local.format, leadingZeros: e.target.checked }
                    })}
                  />
                  <span className="text-sm">Leading zeros</span>
                </label>
              )}
              
              {config.formatOptions.includes('dateFormat') && (
                <select
                  value={local.format?.dateFormat || 'YYYYMMDD'}
                  onChange={(e) => setLocal({
                    ...local,
                    format: { ...local.format, dateFormat: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="YYYYMMDD">YYYY-MM-DD</option>
                  <option value="YYYYMM">YYYY-MM</option>
                  <option value="YYYY">YYYY</option>
                  <option value="DDMMYYYYHHmm">DD-MM-YYYY HH:mm</option>
                </select>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementEditor;