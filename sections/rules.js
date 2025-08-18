window.Rules = () => {
  const { rules, setRules, isAdminAuthenticated, updateData, setModalState } = window.AppState;

  const handleAddSection = async () => {
    if (!isAdminAuthenticated) return;
    const newSection = { title: 'New Section', items: ['New Rule'] };
    const updatedRules = { sections: [...rules.sections, newSection] };
    const result = await updateData('rules.json', updatedRules, 'update');
    if (result) setRules(updatedRules);
  };

  const handleAddRule = async (sectionIndex) => {
    if (!isAdminAuthenticated) return;
    const updatedRules = { ...rules };
    updatedRules.sections[sectionIndex].items.push('New Rule');
    const result = await updateData('rules.json', updatedRules, 'update');
    if (result) setRules(updatedRules);
  };

  const handleSectionTitleChange = async (sectionIndex, value) => {
    if (!isAdminAuthenticated) return;
    const updatedRules = { ...rules };
    updatedRules.sections[sectionIndex].title = value;
    const result = await updateData('rules.json', updatedRules, 'update');
    if (result) setRules(updatedRules);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white text-center">Rules</h2>
      {rules.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="card bg-white text-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            {isAdminAuthenticated ? (
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                className="text-lg sm:text-xl font-bold w-full bg-gray-100 p-1 rounded"
              />
            ) : (
              <h3 className="text-lg sm:text-xl font-bold">{section.title}</h3>
            )}
            {isAdminAuthenticated && (
              <button
                onClick={() => setModalState({ isOpen: true, type: 'deleteSection', data: { sectionIndex } })}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                🗑️
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start justify-between">
                {isAdminAuthenticated ? (
                  <div className="flex items-center w-full">
                    <span className="text-sm mr-2">{itemIndex + 1}.</span>
                    {typeof item === 'string' ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => window.AppState.handleRuleChange(sectionIndex, itemIndex, 'text', e.target.value)}
                        className="w-full bg-gray-100 p-1 rounded text-sm"
                      />
                    ) : (
                      <div className="w-full">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => window.AppState.handleRuleChange(sectionIndex, itemIndex, 'text', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm mb-2"
                        />
                        <textarea
                          value={item.subItems.join('\n')}
                          onChange={(e) => window.AppState.handleRuleChange(sectionIndex, itemIndex, 'subItems', e.target.value)}
                          className="w-full bg-gray-100 p-1 rounded text-sm"
                          rows="3"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => setModalState({ isOpen: true, type: 'deleteRule', data: { sectionIndex, itemIndex } })}
                      className="text-red-500 hover:text-red-700 text-lg ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start w-full">
                    <span className="text-sm mr-2">{itemIndex + 1}.</span>
                    {typeof item === 'string' ? (
                      <span className="text-sm">{item}</span>
                    ) : (
                      <div>
                        <span className="text-sm">{item.text}</span>
                        <ul className="list-disc pl-6 mt-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex} className="text-sm">{subItem}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isAdminAuthenticated && (
            <button
              onClick={() => handleAddRule(sectionIndex)}
              className="mt-3 w-full px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
            >
              Add Rule
            </button>
          )}
        </div>
      ))}
      {isAdminAuthenticated && (
        <button
          onClick={handleAddSection}
          className="w-full px-2 py-1 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-all"
        >
          Add Section
        </button>
      )}
    </div>
  );
};