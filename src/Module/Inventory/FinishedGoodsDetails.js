import React from 'react'
import PopUp from '../../components/New/PopUp'
import { CModalHeader, CModalBody, CModalFooter, CModalTitle, CButton } from '@coreui/react'
import { IoMdEye } from 'react-icons/io'

function FinishedGoodsDetails({ visible, setVisible }) {
  return (
    <PopUp visible={visible} setVisible={setVisible} size="xxl" header=""
    showCloseButton={true} height="600px" width="1200px" >
      
      <div className=" flex gap-2 h-[500px]">
        {/* Left Section (Scrollable Finished Goods) */}
        <div className="w-[40%]  shadow-lg rounded-lg px-2 flex flex-col ">
          {/* Fixed Header */}
          <div className="bg-[#8167e5] text-white text-lg font-semibold p-3 rounded-md  flex justify-center items-center h-10 mt-4 mb-2">
            Finished Goods
          </div>

          {/* Scrollable List */}
          <div className="mt-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar pb-3">
            {[{ id: 10022 }, { id: 10023 }, { id: 10024 }].map((item) => (
              <div key={item.id} className="border-2  rounded-md pl-3 shadow-md h-[170px]">
                <p className="text-[#21338e] font-semibold">Finished Good ID: FG - #{item.id}</p>
                <p className="text-gray-700 mb-0 ">
                  Layers: <span className="font-medium">3</span>
                </p>
                <p className="text-gray-700 mb-0 ">
                  Print: <span className="font-medium">Flexo</span>
                </p>
                <p className="text-gray-700 mb-0">
                  Dimensions: <span className="font-medium">40x30x20 cm</span>
                </p>
                <p className="text-gray-700 mb-0">
                  Available Quantity: <span className="font-medium">150</span>
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 mb-0">
                      Work Order: <span className="font-medium">WO12345</span>
                    </p>
                  </div>
                  <span className="px-4">
                    <IoMdEye className=' h-[25px] w-[25px]' />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (Fixed Top Info + Scrollable Layers) */}
        <div className="w-[60%] bg-transparent shadow-lg rounded-lg  flex flex-col">
          {/* Fixed Top Info */}

          <div className="border-b-2 px-4 flex justify-center items-center pt-4 ">
            <p className="text-xl font-semibold text-[#21338e]">Finished Good ID: FG - #10022</p>
          </div>

          <div className=" border-b-2 shadow-[0_2px_2px_-2px_rgba(0,0,0,0.3)] px-3 m-2 pb-2 bg-transparent">
            <div className=" text-gray-700  grid grid-cols-3 gap-2">
              <span className="font-medium">
                Layers: <span className='font-bold'>3</span>
              </span>
              <span className="font-medium">
                Dimensions: <span className='font-bold'>50x40x30 cm</span>
              </span  >
              <span className="font-medium">
                Work Order: <span className='font-bold'>WO-67890</span>
              </span>
              
              <span className="font-medium">
                Print: <span className='font-bold'>Offset</span>
              </span>
              <span className="font-medium">
                Available Quantity: <span className='font-bold'>200</span>
              </span>
            
            </div>
           
          </div>

          {/* Scrollable Layers Info */}
          <div className=" space-y-4 overflow-y-auto flex-1 custom-scrollbar bg-white px-4 mt-2 ">
            {[
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'FG',
                completion: '75%',
              },
              {
                title: 'CL1 - Corrugation Layer',
                gsm: 150,
                bf: 29,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'FG',
                completion: '75%',
                fluteRatio: 10,
              },
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'RM',
                completion: '75%',
              },
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'RM',
                completion: '75%',
              },
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'RM',
                completion: '75%',
              },
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'RM',
                completion: '75%',
              },
              {
                title: 'Top Layer Details',
                gsm: 130,
                bf: 26,
                color: 'Yellow',
                dimensions: '50x40',
                allocation: 'RM',
                completion: '75%',
              },
            ].map((layer, index) => (
              <div key={index} >
                <span className="text-lg font-semibold text-[#21338e]">{layer.title}</span>
                <div className="grid grid-cols-2 pb-2">
                  <span className="text-gray-700 ">
                    GSM: <span className="font-medium">{layer.gsm}</span>
                  </span>
                  <soan className="text-gray-700 ">
                    BF: <span className="font-medium">{layer.bf}</span>
                  </soan>
                  <span className="text-gray-700 ">
                    Color: <span className="font-medium">{layer.color}</span>
                  </span>
                  <span className="text-gray-700 ">
                    Board Dimensions: <span className="font-medium">{layer.dimensions}</span>
                  </span>
                  <span className="text-gray-700 ">
                    Allocation: <span className="font-medium">{layer.allocation}</span>
                  </span>
                  <span className="text-gray-700 ">
                    Completion: <span className="font-medium">{layer.completion}</span>
                  </span>
                  {layer.fluteRatio && (
                    <span className="text-gray-700">
                      Flute Ratio: <span className="font-medium">{layer.fluteRatio}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PopUp>
  )
}

export default FinishedGoodsDetails
