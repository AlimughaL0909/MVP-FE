import React, { useState } from 'react';
import { Code, BookOpen, FileJson, Plus, Edit3, Copy, Save, Check, Download } from 'lucide-react';
import { PROMPT_TEMPLATES, PROMPT_GUIDELINES } from '../components/constant';

const PromptTemplate = React.memo(({ template, onEdit, isEditing, onSave }) => {
  const [editedTemplate, setEditedTemplate] = useState(template.template);

  return (
    <div className="prompt-template">
      <div className="prompt-header">
        <div>
          <h4 className="prompt-title">
            {template.name}
            <span className={`prompt-type ${template.type}`}>
              {template.type}
            </span>
          </h4>
          {template.variables.length > 0 && (
            <div className="prompt-variables">
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Variables:</span>
              {template.variables?.map((variable, idx) => (
                <span key={idx} className="prompt-variable">
                  [{variable}]
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="prompt-actions">
          <button 
            onClick={() => onEdit(template.id)}
            className="icon-button"
          >
            <Edit3 size={16} />
          </button>
          <button className="icon-button">
            <Copy size={16} />
          </button>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              className="toggle-input" 
              defaultChecked={template.active} 
            />
            <div className="toggle-slider"></div>
          </label>
        </div>
      </div>
      
      {isEditing ? (
        <div>
          <textarea
            className="prompt-textarea"
            value={editedTemplate}
            onChange={(e) => setEditedTemplate(e.target.value)}
          />
          <div className="prompt-edit-actions">
            <button 
              onClick={() => onEdit(null)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(template.id, editedTemplate)}
              className="save-button"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="prompt-content">
          <pre className="prompt-text">{template.template}</pre>
        </div>
      )}
    </div>
  );
});

const AIPrompts = () => {
  const [promptTemplates, setPromptTemplates] = useState(PROMPT_TEMPLATES);
  const [editingPrompt, setEditingPrompt] = useState(null);

  const handleSaveTemplate = (id, newTemplate) => {
    setPromptTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, template: newTemplate }
          : template
      )
    );
    setEditingPrompt(null);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="content-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="content-card-header" style={{ marginBottom: 0 }}>
            <Code size={20} className="icon-purple" />
            AI Prompt Templates
          </h3>
          {/* <button className="primary-button">
            <Plus size={16} />
            <span>New Template</span>
          </button> */}
        </div>

        <div className="space-y-4">
          {promptTemplates?.map(template => (
            <PromptTemplate
              key={template.id}
              template={template}
              onEdit={setEditingPrompt}
              isEditing={editingPrompt === template.id}
              onSave={handleSaveTemplate}
            />
          ))}
        </div>
      </div>

      <div className="grid-2-col">
        <div className="content-card">
          <h3 className="content-card-header">
            <BookOpen size={20} className="icon-purple" />
            Prompt Guidelines
          </h3>
          <ul className="guidelines-list">
            {PROMPT_GUIDELINES.map((guideline, idx) => (
              <li key={idx} className="guideline-item">
                <Check size={16} className="guideline-icon" />
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="content-card">
          <h3 className="content-card-header">
            <FileJson size={20} className="icon-purple" />
            Export/Import Templates
          </h3>
          <div className="space-y-4">
            <button className="export-button">
              <Download size={16} />
              <span>Export All Templates (JSON)</span>
            </button>
            <div className="upload-area">
              <Upload className="upload-icon" size={48} />
              <p className="upload-text">Drag and drop template file here</p>
              <button className="upload-link">
                or browse files
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

const Upload = ({ className, size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

export default React.memo(AIPrompts); 