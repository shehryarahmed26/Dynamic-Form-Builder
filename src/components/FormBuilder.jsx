import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { addSection, deleteSection, addField, updateField, deleteField, updateSection } from '../store/formSlice';
import FormRenderer from './FormRenderer';
import FormPreview from './FormPreview';

const FIELD_TYPES = ['text', 'dropdown', 'radio', 'file', 'checkbox', 'country', 'date', 'phone'];

const FormBuilder = () => {
  const dispatch = useDispatch();
  const sections = useSelector(state => state.form.sections);
  const formData = useSelector(state => state.form.formData);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const handleAddSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      title: `Section ${sections.length + 1}`,
      fields: []
    };
    dispatch(addSection(newSection));
    setExpandedSections(prev => new Set(prev).add(newSection.id));
  };

  const handleAddField = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    const newField = {
      id: crypto.randomUUID(),
      type: 'text',
      label: `Field ${(section?.fields.length ?? 0) + 1}`,
      required: false
    };
    dispatch(addField({ sectionId, field: newField }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900">Dynamic Form Builder</h1>
            <p className="text-gray-600 text-center mt-2">Create custom forms with advanced validation and conditional logic</p>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
          </div>
          <button
            onClick={handleAddSection}
            className="flex items-center mx-auto sm:mx-0 my-6 sm:my-0  gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => toggleSection(section.id)} className="text-gray-500 hover:text-gray-700">
                        {expandedSections.has(section.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => dispatch(updateSection({ id: section.id, updates: { title: e.target.value } }))}
                        className="text-xl font-semibold bg-transparent border-none focus:ring-2  rounded px-2 py-1 flex-1"
                      />
                    </div>
                    <button
                      onClick={() => dispatch(deleteSection(section.id))}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {expandedSections.has(section.id) && (
                  <div className="p-6">
                    {section.fields.map(field => (
                      <div key={field.id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              dispatch(updateField({ sectionId: section.id, fieldId: field.id, updates: { label: e.target.value } }))
                            }
                            className="font-medium bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                          />
                          <button
                            onClick={() => dispatch(deleteField({ sectionId: section.id, fieldId: field.id }))}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                            <select
                              value={field.type}
                              onChange={(e) =>
                                dispatch(updateField({ sectionId: section.id, fieldId: field.id, updates: { type: e.target.value } }))
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {FIELD_TYPES.map(type => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  dispatch(updateField({ sectionId: section.id, fieldId: field.id, updates: { required: e.target.checked } }))
                                }
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600">Make field required</span>
                            </label>
                          </div>
                        </div>

                        {(field.type === 'dropdown' || field.type === 'radio') && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) =>
                                dispatch(updateField({
                                  sectionId: section.id,
                                  fieldId: field.id,
                                  updates: { options: e.target.value.split(',').map(o => o.trim()) }
                                }))
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                          
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddField(section.id)}
                      className="w-full mt-4 px-4 py-2 text-green-600 border-2 border-green-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Field
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {
              sections.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Form Preview</h2>
              <FormRenderer sections={sections} />
            </div>
              )
            }

            {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Form Data</h2>
              <FormPreview formData={formData} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default FormBuilder;