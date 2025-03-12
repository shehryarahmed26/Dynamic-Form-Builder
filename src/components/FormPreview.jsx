import React from 'react';

const FormPreview = ({ formData }) => {
  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Form Data Preview</h3>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
}
export default FormPreview
