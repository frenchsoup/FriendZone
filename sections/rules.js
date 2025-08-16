window.Rules = ({ rules, setRules, isAdminAuthenticated, updateData, handleRuleChange, handleAddSection, handleAddRule, handleSectionTitleChange, setModalState }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-teal-400 text-center">Rules</h2>
      {rules.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="card bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            {isAdminAuthenticated ? (
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                className="text-lg sm:text-xl font-bold w-full bg-gray-700 p-1 rounded text-gray-100 focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <h3 className="text-lg sm:text-xl font-bold text-teal-400">{section.title}</h3>
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
                    <span className="text-sm mr-2 text-gray-300">{itemIndex + 1}.</span>
                    {typeof item === 'string' ? (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleRuleChange(sectionIndex, itemIndex, 'text', e.target.value)}
                        className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <div className="w-full">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleRuleChange(sectionIndex, itemIndex, 'text', e.target.value)}
                          className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500 mb-2"
                        />
                        <textarea
                          value={item.subItems.join('\n')}
                          onChange={(e) => handleRuleChange(sectionIndex, itemIndex, 'subItems', e.target.value)}
                          className="w-full bg-gray-700 p-1 rounded text-xs sm:text-sm text-gray-100 focus:ring-2 focus:ring-teal-500"
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
                    <span className="text-sm mr-2 text-gray-300">{itemIndex + 1}.</span>
                    {typeof item === 'string' ? (
                      <span className="text-sm text-gray-400">{item}</span>
                    ) : (
                      <div>
                        <span className="text-sm text-gray-400">{item.text}</span>
                        <ul className="list-disc pl-6 mt-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex} className="text-sm text-gray-400">{subItem}</li>
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
              className="mt-3 w-full px-2 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
            >
              Add Rule
            </button>
          )}
        </div>
      ))}
      {isAdminAuthenticated && (
        <button
          onClick={handleAddSection}
          className="w-full px-2 py-1 text-xs sm:text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all"
        >
          Add Section
        </button>
      )}
    </div>
  );
};