import React from 'react'
import PopUp from '../../components/New/PopUp'

function ReelsDetails({ visible, setVisible }) {
  const GS = [
    { name: 'Top Layer', GS: 100, BF: 25, Color: 'Black', Deckle: 100 },
    { name: 'C1-Corrugation 1', GS: 100, BF: 25, Color: 'Black', Deckle: 100 },
    { name: 'L1 - Liner Layer', GS: 100, BF: 25, Color: 'Black', Deckle: 100 },
  ]

  const reels = [
    { reelNo: '#100023', weight: 120, rate: 800 },
    { reelNo: '#100204', weight: 125, rate: 900 },
    { reelNo: '#100225', weight: 125, rate: 1500 },
    { reelNo: '#100226', weight: 250, rate: 2500 },
    { reelNo: '#100227', weight: 500, rate: 400 },
  ]

  return (
    <PopUp visible={visible} setVisible={setVisible} size={'lg'} header="" showCloseButton={true} height="480px" width="910px">
      <div className="grid grid-cols-3 gap-3 p-3 border">
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4">Reels Details :</h2>
          <table className="w-full ">
            <thead className="bg-white-200">
              <tr>
                <th className=" px-3 py-2"></th>
                <th className=" px-3 py-2">GS</th>
                <th className=" px-3 py-2">BF</th>
                <th className=" px-3 py-2">Color</th>
                <th className=" px-3 py-2">Deckle</th>
              </tr>
            </thead>
            <tbody>
              {GS.map((gs, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                  <td className=" px-3 py-2">{gs.name}</td>
                  <td className=" px-3 py-2">{gs.GS}</td>
                  <td className=" px-3 py-2">{gs.BF}</td>
                  <td className=" px-3 py-2">{gs.Color}</td>
                  <td className=" px-3 py-2">{gs.Deckle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full  mt-5 ">
          <table className='bg-orange-100 max-w-full' >
            <thead style={{ color: '#f45b31' }}>
              <tr>
                <th className=" px-3 py-2">Reel No</th>
                <th className=" px-3 py-2">Weight</th>
                <th className="px-3 py-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {reels.map((reel, index) => (
                <tr key={index} style={{ color: '#f45b31' }}>
                  <td className=" px-3 py-2">{reel.reelNo}</td>
                  <td className=" px-3 py-2">{reel.weight}</td>
                  <td className=" px-3 py-2">{reel.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end mt-2 items-center ">
        <button
          className=' p-3 bg-green-500 text-white rounded-md h-10 flex justify-center items-center'
          onClick={() => setVisible(false)}
        >
          Cancel
        </button>
      </div>
    </PopUp>
  )
}

export default ReelsDetails
