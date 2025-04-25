import { useEffect,useState } from "react"
import apiMethods from "../../api/config"
import {
	CTable,
	CTableHead,
	CTableRow,
	CTableHeaderCell,
	CTableBody,
	CTableDataCell
  } from '@coreui/react'
import ActionButton from "../../components/New/ActionButton"
import { useDispatch, useSelector } from 'react-redux'

const RoutePopup=({setisSingleViewPopupRoute,fullRouteResponse})=>{

  const dispatch = useDispatch()
  const selectedRouteIds2 = useSelector(
    (state) => state.routeprocess?.selectedRouteIds || []
  );
  
  useEffect(() => {
    console.log('Selected Route IDs in pop:', selectedRouteIds2);
  }, [selectedRouteIds2]);
  //const [selectedRouteIds, setSelectedRouteIds] = useState([]);

  useEffect(() => {
    console.log('Full Route Response:', JSON.stringify(fullRouteResponse.data));
  }, [fullRouteResponse]);
	
	
	  const closemodal=()=>{
		setisSingleViewPopupRoute(false)
	  }

    const handleCheckboxChange = (id) => {
      const isSelected = selectedRouteIds2.includes(id)
      const updated = isSelected
        ? selectedRouteIds2.filter((item) => item !== id)
        : [...selectedRouteIds2, id]
  
      dispatch({
        type: 'SET_SELECTED_ROUTE_IDS',
        payload: updated,
      })
    }
  
    const routes = fullRouteResponse?.data?.routes || [];
  
	return (<>
    <div className="h-[300px] overflow-y-auto border border-gray-200 custom-scrollbar">
    <CTable striped hover className="w-full m-0">
      <CTableHead className="bg-gray-100 sticky top-0 z-10">
        <CTableRow className="text-center">
          <CTableHeaderCell>Select Route</CTableHeaderCell>
          <CTableHeaderCell>Route Name</CTableHeaderCell>
          <CTableHeaderCell>Created Date</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {routes.length > 0 ? (
          routes.map((route) => (
            <CTableRow key={route.id} className="text-center">
              <CTableDataCell>
                <input
                  type="checkbox"
                  checked={route?.id != null && selectedRouteIds2.includes(route.id)}
                  onChange={() => handleCheckboxChange(route?.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{route.route_name}</CTableDataCell>
              <CTableDataCell>
                {new Date(route.created_at).toLocaleDateString()}
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan={3} className="text-center text-gray-500">
              No route data found.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
	

    </div>
	<div className="flex justify-end gap-2 mt-2">
  <ActionButton
    label={'Submit'}
    onClick={closemodal}
    variant="add"
  />
</div>
	</>)
}


export default RoutePopup