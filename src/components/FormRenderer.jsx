import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';

const FormRenderer = ({ sections }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, watch } = useForm();

  const onSubmit = (data) => {
    dispatch(updateFormData(data));
  };

  const watchAllFields = watch();

  const renderField = (field) => {
    if (field.condition && watchAllFields[field.condition.field] !== field.condition.value) {
      return null;
    }

    return (
      <Controller
        name={field.id}
        control={control}
        rules={{ required: field.required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const baseInputClasses = `w-full p-2 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`;

          switch (field.type) {
            case 'text':
              return (
                <>
                  <input type="text" value={value || ''} onChange={onChange} className={baseInputClasses} />
                  {error && <p className="mt-1 text-sm text-red-500">This field is required</p>}
                </>
              );

            case 'dropdown':
              return (
                <>
                  <select value={value || ''} onChange={onChange} className={baseInputClasses}>
                    <option value="">Select an option</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {error && <p className="mt-1 text-sm text-red-500">This field is required</p>}
                </>
              );

            case 'radio':
              return (
                <div className="space-y-2">
                  {field.options?.map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input type="radio" value={option} checked={value === option} onChange={() => onChange(option)} className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                  {error && <p className="mt-1 text-sm text-red-500">This field is required</p>}
                </div>
              );

            case 'checkbox':
              return (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">{field.label}</span>
                </label>
              );

            case 'file':
              return <input type="file" onChange={(e) => onChange(e.target.files?.[0])} className={baseInputClasses} />;

            case 'date':
              return <DatePicker selected={value} onChange={onChange} className={baseInputClasses} dateFormat="MMMM d, yyyy" />;

            case 'phone':
              return  (
                <PhoneInput
                value={value}
                onChange={onChange}
                defaultCountry="PK" // Default country (Change as needed)
                international // Ensures country code like +92 appears
                countryCallingCodeEditable={false} // Prevents editing country code manually
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              )

            default:
              return null;
          }
        }}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
      {sections.map(section => (
        <div key={section.id} className="space-y-6 min-h-[100px]">
          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
          <div className="space-y-4">
            {section.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="pt-4">
        <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormRenderer;
