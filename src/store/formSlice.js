import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sections: [],
  formData: {}
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addSection: (state, action) => {
      state.sections.push(action.payload);
    },
    updateSection: (state, action) => {
      const { id, updates } = action.payload;
      const section = state.sections.find(s => s.id === id);
      if (section) {
        Object.assign(section, updates);
      }
    },
    deleteSection: (state, action) => {
      state.sections = state.sections.filter(section => section.id !== action.payload);
    },
    addField: (state, action) => {
      const { sectionId, field } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        section.fields.push(field);
      }
    },
    updateField: (state, action) => {
      const { sectionId, fieldId, updates } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        const field = section.fields.find(f => f.id === fieldId);
        if (field) {
          Object.assign(field, updates);
        }
      }
    },
    deleteField: (state, action) => {
      const { sectionId, fieldId } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      if (section) {
        section.fields = section.fields.filter(field => field.id !== fieldId);
      }
    },
    updateFormData: (state, action) => {
      state.formData = action.payload;
    }
  }
});

export const {
  addSection,
  updateSection,
  deleteSection,
  addField,
  updateField,
  deleteField,
  updateFormData
} = formSlice.actions;

export default formSlice.reducer;
