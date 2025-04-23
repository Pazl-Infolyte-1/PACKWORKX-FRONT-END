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


const RoutePopup=({onSelectRoutes,setisSingleViewPopupRoute,routeData})=>{

	const [routeList, setRouteList] = useState([])
	const [selectedRoutes, setSelectedRoutes] = useState([])


	useEffect(() => {
		if(routeData){
			setRouteList(routeData)
		}
	  }, []);
	  

	  const handleCheckboxChange = (route, isChecked) => {
		setSelectedRoutes((prevSelected) => {
		  let updated;
		  if (isChecked) {
			updated = [...prevSelected, route];
		  } else {
			updated = prevSelected.filter((r) => r.id !== route.id);
		  }
		  onSelectRoutes(updated); // Send to parent
		  return updated;
		});
	  };
	
	  const closemodal=()=>{
		setisSingleViewPopupRoute(false)
	  }
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
          {routeList.length > 0 ? (
            routeList.map((route) => (
              <CTableRow key={route.id} className="text-center">
                <CTableDataCell>
                  <input
                    type="checkbox"
                    checked={selectedRoutes.some((r) => r.id === route.id)}
                    onChange={(e) =>
                      handleCheckboxChange(route, e.target.checked)
                    }
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