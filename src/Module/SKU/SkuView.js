import { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown, Mail, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import { inventoryApi } from '../../api/inventory'
import { skuApi } from '../../api/sku'

const SkuView = ({ setIsMinimized, selectedSkuData, handleSkuEdit }) => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [addressExpanded, setAddressExpanded] = useState(true)
  const [detailsExpanded, setDetailsExpanded] = useState(true)
  const [contentHeight, setContentHeight] = useState('580px')
   const [skuVersions, setSkuVersions] = useState([])
  const [activeVersion, setActiveVersion] = useState(null)
  const containerRef = useRef(null)
const [selectedSku,setSelectedSku]=useState({})
const [inventoryData, setInventoryData] = useState([]);
const [selectedItemId, setSelectedItemId] = useState(null);

const selectedItem = inventoryData.find((inv) => inv.item_id === Number(selectedItemId));

const navigate = useNavigate();
useEffect(() => {
  const fetchClient = async () => {
    if (!selectedSkuData?.id) return;

    try {
      const data = await skuApi.singlesku(selectedSkuData.id);
      setSelectedSku(data);
      console.log("sku singke darta",data)
       navigate(`/SKU/${selectedSkuData.id}`);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  fetchClient();
}, [selectedSkuData?.id]);

  useEffect(() => {
    const fetchSkuVersions = async () => {
      try {
             setSkuVersions([]);
      setActiveVersion(null);

        if (!selectedSku?.id) return
        const response = await skuApi.getSkuVersions(selectedSku.id)
        const versions = response?.data?.data || []
        setSkuVersions(versions)

        // Set latest version as default
        if (versions.length > 0) {
          setActiveVersion(versions[0])
        }
      } catch (error) {
        console.error('Error fetching SKU versions:', error)
      }
    }

    fetchSkuVersions()
  }, [selectedSku?.id])

    const handleVersionChange = (e) => {
    const versionId = Number(e.target.value)
    const selected = skuVersions.find((v) => v.id === versionId)
    setActiveVersion(selected)
  }
  // Tabs available in the interface
  const tabs = ['Overview']

  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return

      const windowHeight = window.innerHeight
      const containerTop = containerRef.current.getBoundingClientRect().top
      const headerHeight = 92
      const footerBuffer = 20

      const availableHeight = windowHeight - containerTop - headerHeight - footerBuffer
      setContentHeight(`${Math.max(300, availableHeight)}px`) // Set minimum height of 300px
    }
    updateHeight()

    // Update height on window resize
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

useEffect(() => {
  const fetchInventory = async () => {
    try {
      const res = await inventoryApi.getInventoryInSkuView();
      console.log("Inventory Response:", res);
      setInventoryData(res?.data?.inventoryData || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  fetchInventory();
}, []);

useEffect(() => {
  if (inventoryData.length > 0 && !selectedItemId) {
    setSelectedItemId(inventoryData[0].item_id);
  }
}, [inventoryData]);
  return (
    <div
      className="flex flex-col border border-gray-200 w-full shadow-sm bg-white"
      ref={containerRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-2 px-3">
        <h1 className="text-xl font-medium">{selectedSku.client}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => handleSkuEdit(selectedSku.id)}
            className="px-2 py-1 border rounded text-sm"
          >
            Edit
          </button>
          {/*<button className="px-4 py-1 bg-blue-500 text-white rounded text-sm">
            New Transaction ▾
          </button>
          <button className="px-4 py-1 border rounded text-sm">More ▾</button>*/}
          <button
         onClick={() => {
  setIsMinimized(false);
  navigate("/SKU");
}}

            className="px-2 py-1 border rounded text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-3 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`p-1 text-sm font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="flex-grow"></div>
        {/*<button className="px-4">
          <Mail size={16} />
        </button>*/}
      </div>

      {/* Content area with dynamic height */}
      <div className="flex overflow-y-auto" style={{ height: contentHeight }}>
        {/* Left Column */}
        <div className="w-1/3 border-r h-[90%] border-gray-200 p-4">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="font-normal text-gray-700 mb-4 text-sm border-b border-gray-200">
              {selectedSku.client}
            </h2>

            <div className="flex items-start">
              <div className="bg-gray-200 w-11 h-10 rounded-md mr-3 flex items-center justify-center text-gray-500">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold my-0">{selectedSku.sku_name}</p>
                <p className="text-sm my-0">{selectedSku.sku_ui_id}</p>

              </div>
            </div>
          </div>

          {/* MEASUREMENTS */}
          <div className="py-1 border-b border-gray-200">
                      <div className="flex justify-between py-1">
                  <span className="text-gray-600">SKU Type</span>
                  <span className="font-medium">{selectedSku.sku_type || '-'}</span>
                </div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setAddressExpanded(!addressExpanded)}
            >
              
              <h3 className="font-medium text-sm text-gray-800">MEASUREMENTS</h3>
              {addressExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {addressExpanded && (
              <div className="text-sm">
                <div className="mb-4">
                  <div className="text-gray-600 m-0">
                    {selectedSku?.sku_type === 'RSC box' && (
  <div className="space-y-1 text-sm">
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Ply</span>
      <span className="font-medium">{selectedSku.ply ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Length</span>
      <span className="font-medium">{selectedSku.length ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Width</span>
      <span className="font-medium">{selectedSku.width ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Height</span>
      <span className="font-medium">{selectedSku.height ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Unit</span>
      <span className="font-medium">{selectedSku.unit ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Joints</span>
      <span className="font-medium">{selectedSku.joints ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">UPS</span>
      <span className="font-medium">{selectedSku.ups ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Inner/Outer Dimension</span>
      <span className="font-medium">{selectedSku.inner_outer_dimension ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Flap Width</span>
      <span className="font-medium">{selectedSku.flap_width ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Length Trimming</span>
      <span className="font-medium">{selectedSku.length_trimming_tolerance ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Width Trimming</span>
      <span className="font-medium">{selectedSku.width_trimming_tolerance ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Deckle Size</span>
      <span className="font-medium">{selectedSku.deckle_size ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Minimum Order Level</span>
      <span className="font-medium">{selectedSku.minimum_order_level ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Customer Reference</span>
      <span className="font-medium">{selectedSku.customer_reference ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Reference Number</span>
      <span className="font-medium">{selectedSku.reference_number ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Internal ID</span>
      <span className="font-medium">{selectedSku.internal_id ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Length Board Size (cm²)</span>
      <span className="font-medium">{selectedSku.length_board_size_cm2 ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Width Board Size (cm²)</span>
      <span className="font-medium">{selectedSku.width_board_size_cm2 ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Board Size (cm²)</span>
      <span className="font-medium">{selectedSku.board_size_cm2 ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">GST (%)</span>
      <span className="font-medium">{selectedSku.gst_percentage ?? '-'}</span>
    </div>
  </div>
)}

  {selectedSku?.sku_type === 'Board' && (
<div className="space-y-2">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Ply</span>
    <span className="font-medium">{selectedSku.ply ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length</span>
    <span className="font-medium">{selectedSku.length ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width</span>
    <span className="font-medium">{selectedSku.width ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Height</span>
    <span className="font-medium">{selectedSku.height ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Unit</span>
    <span className="font-medium">{selectedSku.unit || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Joints</span>
    <span className="font-medium">{selectedSku.joints ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">UPS</span>
    <span className="font-medium">{selectedSku.ups ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Inner/Outer Dimension</span>
    <span className="font-medium">{selectedSku.inner_outer_dimension || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Flap Width</span>
    <span className="font-medium">{selectedSku.flap_width ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Flap Tolerance</span>
    <span className="font-medium">{selectedSku.flap_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length Trimming Tolerance</span>
    <span className="font-medium">{selectedSku.length_trimming_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width Trimming Tolerance</span>
    <span className="font-medium">{selectedSku.width_trimming_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.length_board_size_cm2 ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.width_board_size_cm2 ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.board_size_cm2 ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Deckle Size</span>
    <span className="font-medium">{selectedSku.deckle_size ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Minimum Order Level</span>
    <span className="font-medium">{selectedSku.minimum_order_level ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">GST (%)</span>
    <span className="font-medium">{selectedSku.gst_percentage ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Total Weight</span>
    <span className="font-medium">{selectedSku.total_weight ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Total Bursting Strength</span>
    <span className="font-medium">{selectedSku.total_bursting_strength ?? '-'}</span>
  </div>
</div>

  )}

    {selectedSku?.sku_type === 'Die Cut box' && (
<div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Ply</span>
    <span className="font-medium">{selectedSku.ply ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length</span>
    <span className="font-medium">{selectedSku.length ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width</span>
    <span className="font-medium">{selectedSku.width ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Height</span>
    <span className="font-medium">{selectedSku.height ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Unit</span>
    <span className="font-medium">{selectedSku.unit || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Joints</span>
    <span className="font-medium">{selectedSku.joints ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Ups</span>
    <span className="font-medium">{selectedSku.ups ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Select Dies</span>
    <span className="font-medium">{selectedSku.select_dies || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Inner/Outer Dimension</span>
    <span className="font-medium">{selectedSku.inner_outer_dimension || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Flap Width</span>
    <span className="font-medium">{selectedSku.flap_width ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Flap Tolerance</span>
    <span className="font-medium">{selectedSku.flap_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length Trimming Tolerance</span>
    <span className="font-medium">{selectedSku.length_trimming_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width Trimming Tolerance</span>
    <span className="font-medium">{selectedSku.width_trimming_tolerance ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Length Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.length_board_size_cm2 || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Width Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.width_board_size_cm2 || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Board Size (cm²)</span>
    <span className="font-medium">{selectedSku.board_size_cm2 ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Deckle Size</span>
    <span className="font-medium">{selectedSku.deckle_size ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Minimum Order Level</span>
    <span className="font-medium">{selectedSku.minimum_order_level ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">GST %</span>
    <span className="font-medium">{selectedSku.gst_percentage || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Total Weight</span>
    <span className="font-medium">{selectedSku.total_weight ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Total Bursting Strength</span>
    <span className="font-medium">{selectedSku.total_bursting_strength ?? '-'}</span>
  </div>
</div>

    )}

 {selectedSku?.sku_type === 'Composite' && (
<div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Minimum Order Level</span>
    <span className="font-medium">{selectedSku.minimum_order_level ?? '-'}</span>
  </div>
   <div className="flex justify-between py-1">
    <span className="text-gray-600">GST Percentage</span>
    <span className="font-medium">{selectedSku.gst_percentage ?? '-'}</span>
  </div>
  </div>
 )}

  {selectedSku?.sku_type === 'Custom Item' && (
<div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">GST Percentage</span>
    <span className="font-medium">{selectedSku.gst_percentage ?? '-'}</span>
  </div>
   <div className="flex justify-between py-1">
    <span className="text-gray-600">Estimate</span>
    <span className="font-medium">{selectedSku.estimate_composite_item ?? '-'}</span>
  </div>
   <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Version Limit</span>
    <span className="font-medium">{selectedSku.sku_version_limit ?? '-'}</span>
  </div>
  </div>
 )}
                
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OTHER DETAILS */}
          <div className="py-1">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
            >
              <h3 className="font-medium text-sm text-gray-800">OTHER DETAILS</h3>
              {detailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {detailsExpanded && (
                <div className="text-gray-600 m-0">
                    {selectedSku?.sku_type === 'RSC box' && (
  <div className="space-y-1 text-sm">
    <div className="flex justify-between py-1">
      <span className="text-gray-600">SKU Version</span>
      <span className="font-medium">{selectedSku.sku_version_limit ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Partition Panel</span>
      <span className="font-medium">{selectedSku.composite_type ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Part Count</span>
      <span className="font-medium">{selectedSku.part_count ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Print Type</span>
      <span className="font-medium">{selectedSku.print_type ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Total Weight</span>
      <span className="font-medium">{selectedSku.total_weight ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Total Bursting Strength</span>
      <span className="font-medium">{selectedSku.total_bursting_strength ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Created At</span>
      <span className="font-medium">{moment(selectedSku.created_at).format('DD MMM YYYY')?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Updated At</span>
      <span className="font-medium">{moment(selectedSku.updated_at).format('DD MMM YYYY')?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Status</span>
      <span className="font-medium">{selectedSku.status ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Created By</span>
      <span className="font-medium">{selectedSku.created_by ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Updated By</span>
      <span className="font-medium">{selectedSku.updated_by ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Sku Creator</span>
      <span className="font-medium">{selectedSku.sku_creator.name ?? '-'}</span>
    </div>
    <div className="flex justify-between py-1">
      <span className="text-gray-600">Sku Updater</span>
      <span className="font-medium">{selectedSku?.sku_updater?.name ?? '-'}</span>
    </div>
  </div>
)}

 {selectedSku?.sku_type === 'Board' && (
<div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Client ID</span>
    <span className="font-medium">{selectedSku.client_id ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU UI ID</span>
    <span className="font-medium">{selectedSku.sku_ui_id || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Name</span>
    <span className="font-medium">{selectedSku.sku_name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Client</span>
    <span className="font-medium">{selectedSku.client || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Strict Adherence</span>
    <span className="font-medium">{selectedSku.strict_adherence ? 'Yes' : 'No'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Customer Reference</span>
    <span className="font-medium">{selectedSku.customer_reference || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Reference Number</span>
    <span className="font-medium">{selectedSku.reference_number || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Internal ID</span>
    <span className="font-medium">{selectedSku.internal_id || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Version Limit</span>
    <span className="font-medium">{selectedSku.sku_version_limit ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Composite Type</span>
    <span className="font-medium">{selectedSku.composite_type || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Part Count</span>
    <span className="font-medium">{selectedSku.part_count ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created At</span>
    <span className="font-medium">{moment(selectedSku.created_at).format('D MMM YYYY')}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated At</span>
    <span className="font-medium">{moment(selectedSku.updated_at).format('D MMM YYYY')}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Status</span>
    <span className="font-medium capitalize">{selectedSku.status || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created By</span>
    <span className="font-medium">{selectedSku.created_by ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated By</span>
    <span className="font-medium">{selectedSku.updated_by ?? '-'}</span>
  </div>
    <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Creator</span>
    <span className="font-medium">{selectedSku?.sku_creator?.name ?? '-'}</span>
  </div>
     <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Updater</span>
    <span className="font-medium">{selectedSku?.sku_updater?.name ?? '-'}</span>
  </div>
</div>
)}
 {selectedSku?.sku_type === 'Die Cut box' && (
                <div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Name</span>
    <span className="font-medium">{selectedSku.sku_name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Client</span>
    <span className="font-medium">{selectedSku.client || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Customer Reference</span>
    <span className="font-medium">{selectedSku.customer_reference || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Reference Number</span>
    <span className="font-medium">{selectedSku.reference_number || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Internal ID</span>
    <span className="font-medium">{selectedSku.internal_id || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Print Type</span>
    <span className="font-medium">{selectedSku.print_type || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Version Limit</span>
    <span className="font-medium">{selectedSku.sku_version_limit ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Strict Adherence</span>
    <span className="font-medium">{selectedSku.strict_adherence ? 'Yes' : 'No'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created By</span>
    <span className="font-medium">{selectedSku.sku_creator?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated By</span>
    <span className="font-medium">{selectedSku.sku_updator?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created At</span>
    <span className="font-medium">
      {selectedSku.created_at ? moment(selectedSku.created_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated At</span>
    <span className="font-medium">
      {selectedSku.updated_at ? moment(selectedSku.updated_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
</div>)}

 {selectedSku?.sku_type === 'Composite' && (
               <div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Name</span>
    <span className="font-medium">{selectedSku.sku_name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Client</span>
    <span className="font-medium">{selectedSku.client || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Composite Type</span>
    <span className="font-medium">{selectedSku.composite_type || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Part Count</span>
    <span className="font-medium">{selectedSku.part_count ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Version Limit</span>
    <span className="font-medium">{selectedSku.sku_version_limit ?? '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created By</span>
    <span className="font-medium">{selectedSku.sku_creator?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated By</span>
    <span className="font-medium">{selectedSku.sku_updater?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created At</span>
    <span className="font-medium">
      {selectedSku.created_at ? moment(selectedSku.created_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated At</span>
    <span className="font-medium">
      {selectedSku.updated_at ? moment(selectedSku.updated_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
</div>

 )}

  {selectedSku?.sku_type === 'Custom Item' && (
            <div className="space-y-1 text-sm">
  <div className="flex justify-between py-1">
    <span className="text-gray-600">SKU Name</span>
    <span className="font-medium">{selectedSku.sku_name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Client</span>
    <span className="font-medium">{selectedSku.client || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Description</span>
    <span className="font-medium">{selectedSku.description || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Default SKU Details</span>
    <span className="font-medium">{selectedSku.default_sku_details || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created By</span>
    <span className="font-medium">{selectedSku.sku_creator?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated By</span>
    <span className="font-medium">{selectedSku.sku_updater?.name || '-'}</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Created At</span>
    <span className="font-medium">
      {selectedSku.created_at ? moment(selectedSku.created_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
  <div className="flex justify-between py-1">
    <span className="text-gray-600">Updated At</span>
    <span className="font-medium">
      {selectedSku.updated_at ? moment(selectedSku.updated_at).format('DD MMM YYYY') : '-'}
    </span>
  </div>
</div>

  )}

                  </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 px-2 py-1">
          {/*<div className="flex bg-gray-50 p-2 justify-between items-center rounded">
            <div className="flex items-start mb-2">
              <div className="mr-2 text-blue-500">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="font-medium text-sm m-0">WHAT'S NEXT?</h3>
                <p className="text-sm -ml-6 ">
                  Create an <span className="text-blue-500">invoice</span> or a{' '}
                  <span className="text-blue-500">quote</span> and send it to your customer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="bg-blue-500 text-white h-7 w-24 rounded text-xs">
                New Invoice
              </button>
              <button className="bg-white border border-gray-300 h-7 w-24 rounded text-xs">
                New Quote
              </button>
              <button className="h-7 px-3">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>*/}

          <div className="mb-8">
            <h3 className="text-lg font-medium">SKU Values</h3>
<div className="border rounded m-0">
  <div className="overflow-x-auto">
    <table className="w-full text-sm min-w-[800px]">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left p-2 text-xs">Layer</th>
          <th className="text-left p-2 text-xs">GSM</th>
          <th className="text-left p-2 text-xs">BF</th>
          <th className="text-left p-2 text-xs">Material</th>
          <th className="text-left p-2 text-xs">Color</th>
          <th className="text-left p-2 text-xs">Flute Type</th>
          <th className="text-left p-2 text-xs">Weight</th>
          <th className="text-left p-2 text-xs">Bursting Strength</th>
        </tr>
      </thead>
      <tbody>
        {selectedSku.sku_values &&
          selectedSku.sku_values.map((item, index) => (
            <tr className="border-t" key={index}>
              <td className="p-3 text-left text-xs">{item.layer || '-'}</td>
              <td className="text-left p-3 text-xs">{item.gsm || '-'}</td>
              <td className="text-left p-3 text-xs">{item.bf || '-'}</td>
              <td className="text-left p-3 text-xs">{item.material || '-'}</td>
              <td className="text-left p-3 text-xs">{item.color || '-'}</td>
              <td className="text-left p-3 text-xs">{item.flute_type || '-'}</td>
           <td className="text-left p-3 text-xs">
  {item.weight != null ? parseFloat(item.weight).toFixed(3) : '-'}
</td>

              <td className="text-left p-3 text-xs">{item.bursting_strength || '-'}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>


           
          </div>

                {activeVersion?.sku_values?.length > 0 && ( <div className="mt-6">
    <div className="flex items-center gap-4 my-4">
  <h3 className="text-lg font-medium m-0">Version</h3>
  <select
    className="border px-3 py-1 rounded text-sm"
    value={activeVersion?.id || ''}
    onChange={handleVersionChange}
  >
    {skuVersions.map((version) => (
      <option key={version.id} value={version.id}>
        {version.sku_version}
      </option>
    ))}
  </select>
</div>


      {/* Table Rendering */}

        <div className=" border rounded-md">
          <table className="table-auto w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left text-xs">Layer</th>
                <th className="border px-2 py-1 text-left text-xs">GSM</th>
                <th className="border px-2 py-1 text-left text-xs">BF</th>
                <th className="border px-2 py-1 text-left text-xs">Material</th>
                <th className="border px-2 py-1 text-left text-xs">Color</th>
                <th className="border px-2 py-1 text-left text-xs">Flute Type</th>
                <th className="border px-2 py-1 text-left text-xs">Weight</th>
                <th className="border px-2 py-1 text-left text-xs">Bursting Strength</th>
              </tr>
            </thead>
            <tbody>
              {activeVersion?.sku_values?.map((item1, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-xs">{item1.layer || '-'}</td>
                  <td className="border px-2 py-1 text-xs">{item1.gsm || '-'}</td>
                  <td className="border px-2 py-1 text-xs">{item1.bf || '-'}</td>
                  <td className="border px-2 py-1 text-xs">{item1.material || '-'}</td>
                  <td className="border px-2 py-1 text-xs">{item1.color || '-'}</td>
                  <td className="border px-2 py-1 text-xs">{item1.flute_type || '-'}</td>
                  <td className="border px-2 py-1 text-xs">
                    {item1.weight != null && !isNaN(Number(item1.weight))
                      ? Number(item1.weight).toFixed(2)
                      : '-'}
                  </td>
                  <td className="border px-2 py-1 text-xs">
                    {item1.bursting_strength != null && !isNaN(Number(item1.bursting_strength))
                      ? Number(item1.bursting_strength).toFixed(2)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </div>)}

  <h3 className="text-lg font-medium m-0 mt-2">Bill of Material</h3>
<table className="min-w-full mt-2 border text-sm">
  <thead>
    <tr className="bg-gray-100 text-left">
      <th className="p-2 border">Material Name</th>
      <th className="p-2 border">Standard Cost</th>
      <th className="p-2 border">Weight In Kg</th>
      <th className="p-2 border">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-2 border">
        <select
          className="border p-1 rounded w-full"
          value={selectedItemId || ''}
          onChange={(e) => setSelectedItemId(e.target.value)}
        >
          <option value="">Select Material</option>
          {inventoryData.map((inv) => (
            <option key={inv.item_id} value={inv.item_id}>
              {inv.item.item_name}
            </option>
          ))}
        </select>
      </td>

      <td className="p-2 border">
        {selectedItem ? parseFloat(selectedItem.item.standard_cost).toFixed(2) : '-'}
      </td>

      <td className="p-2 border">
        {selectedSku?.total_weight ? parseFloat(selectedSku.total_weight).toFixed(3) : '-'}
      </td>

      <td className="p-2 border">
        {selectedItem && selectedSku?.total_weight
          ? (parseFloat(selectedItem.item.standard_cost) * parseFloat(selectedSku.total_weight)).toFixed(2)
          : '-'}
      </td>
    </tr>
  </tbody>
</table>


        </div>
      </div>
    </div>
  )
}

export default SkuView
