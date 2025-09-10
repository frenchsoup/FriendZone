window.Modal = () => {
  const { modalState, setModalState } = window.AppState;
  if (!modalState.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal">
      <div className="bg-white text-gray-800 rounded-lg p-2 sm:p-3 max-w-sm w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm sm:text-base font-semibold">{modalState.type === 'deleteRule' ? 'Delete Rule' : 'Delete Section'}</h3>
          <button onClick={() => setModalState({ isOpen: false, type: '', data: null })} className="text-gray-500 hover:text-gray-700 text-lg">\u00D7</button>
        </div>
        {modalState.type === 'deleteRule' && (
          <div>
            <p className="text-sm mb-2">Are you sure you want to delete this rule?</p>
            <button
              onClick={() => {
                const updatedRules = { ...window.AppState.rules };
                updatedRules.sections[modalState.data.sectionIndex].items.splice(modalState.data.itemIndex, 1);
                window.AppState.updateData('rules.json', updatedRules, 'delete', { sectionIndex: modalState.data.sectionIndex, itemIndex: modalState.data.itemIndex }).then(result => {
                  if (result) {
                    window.AppState.setRules(updatedRules);
                    window.AppState.setModalState({ isOpen: false, type: '', data: null });
                  }
                });
              }}
              className="w-full px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        )}
        {modalState.type === 'deleteSection' && (
          <div>
            <p className="text-sm mb-2">Are you sure you want to delete this section?</p>
            <button
              onClick={() => {
                const updatedRules = { ...window.AppState.rules };
                updatedRules.sections.splice(modalState.data.sectionIndex, 1);
                window.AppState.updateData('rules.json', updatedRules, 'delete', modalState.data.sectionIndex).then(result => {
                  if (result) {
                    window.AppState.setRules(updatedRules);
                    window.AppState.setModalState({ isOpen: false, type: '', data: null });
                  }
                });
              }}
              className="w-full px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};