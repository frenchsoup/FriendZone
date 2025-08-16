window.Modal = () => {
  const { modalState, setModalState } = window.AppState;
  if (!modalState.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal animate-fade-in">
      <div className="bg-gray-900 text-gray-100 rounded-lg p-3 sm:p-4 max-w-sm w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-teal-400">{modalState.type === 'deleteRule' ? 'Delete Rule' : 'Delete Section'}</h3>
          <button onClick={() => setModalState({ isOpen: false, type: '', data: null })} className="text-gray-400 hover:text-gray-200 text-lg">×</button>
        </div>
        {modalState.type === 'deleteRule' && (
          <div>
            <p className="text-sm text-gray-300 mb-3">Are you sure you want to delete this rule?</p>
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
              className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          </div>
        )}
        {modalState.type === 'deleteSection' && (
          <div>
            <p className="text-sm text-gray-300 mb-3">Are you sure you want to delete this section?</p>
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
              className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};