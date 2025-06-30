import React from 'react'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

function LayerProduction({ isOpen, onClose, workorder }) {
  if (!isOpen) return null;

  // Example fallback for demo/testing
  const layers = workorder?.work_order_sku_values || [];

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl mx-2 p-3 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[60px]">
          {workorder?.work_generate_id && (
            <div className="w-full text-left text-xs text-gray-500 mb-1 font-mono">
              <span className="font-semibold text-gray-700">Work Generate ID:</span> {workorder.work_generate_id}
            </div>
          )}
          <h2 className="text-base font-medium mb-2 text-gray-700">Layer Production Status</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1 text-xs">
              <thead>
                <tr className="text-[11px] text-gray-400 uppercase">
                  <th className="text-left px-1 py-1 font-normal">Layer</th>
                  <th className="text-left px-1 py-1 font-normal">Status</th>
                  <th className="text-left px-1 py-1 font-normal">Weight</th>
                  <th className="text-left px-1 py-1 font-normal">Material</th>
                  <th className="text-left px-1 py-1 font-normal">Production</th>
                </tr>
              </thead>
              <tbody>
                {layers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-2">No layers found.</td>
                  </tr>
                )}
                {layers.map((layer) => {
                  const production_status = layer?.production_status 
                  const statusColor = STATUS_COLORS[production_status] || 'bg-gray-100 text-gray-800';
                  return (
                    <tr key={layer.layer_id} className="rounded hover:bg-gray-50 transition">
                      <td className="px-1 py-1 font-medium whitespace-nowrap">{layer.layer}</td>
                      <td className="px-1 py-1">
                        <span className={`px-1 py-0.5 rounded text-[11px] font-medium ${layer.layer_status === 'grouped' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                          {layer.layer_status}
                        </span>
                      </td>
                      <td className="px-1 py-1">{layer.weight}</td>
                      <td className="px-1 py-1">{layer.material}</td>
                      <td className="px-1 py-1">
                        <span className={`px-1 py-0.5 rounded text-[11px] font-medium ${statusColor}`}>{production_status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayerProduction