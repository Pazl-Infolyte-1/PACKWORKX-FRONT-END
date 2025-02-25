import { MdPrecisionManufacturing } from 'react-icons/md'
import { MdEmojiObjects } from 'react-icons/md'
import { MdEngineering } from 'react-icons/md'
import { MdDoDisturbOn } from 'react-icons/md'

function MachineDashboard() {
  return (
    <div>
      <div style={{ fontFamily: 'Mulish', padding: '20px', Width: '100%', margin: 'auto' }}>
        {/* Dashboard Heading */}
        <h1 style={{ marginBottom: '20px', color: '#030303' }}>Machine Master Dashboard</h1>

        {/* Status Boxes in Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              height: '130px',
              width: '350px',
              backgroundColor: '#c7c7f1',
              borderRadius: '5px',
              padding: '5px',
              display: 'flex',
              borderRadius: '10px',
              boxShadow: '0px 2px 10px rgba(241, 236, 236, 0.1)',
              opacity: 0.6,
            }}
          >
            <div>
              <h3 style={{ marginLeft: '10px', color: '#4a03fa' }}>Total Machine</h3>

              <h1 style={{ marginLeft: '100px', color: '#4a03fa' }}>150</h1>
            </div>
            <div>
              <MdPrecisionManufacturing
                style={{
                  height: '50px',
                  width: '50px',
                  marginLeft: '100px',
                  marginTop: '30px',
                  color: '#4a03fa',
                }}
              />
            </div>
          </div>
          <div
            style={{
              height: '130px',
              width: '350px',
              backgroundColor: '#c3f2cb',
              borderRadius: '5px',
              padding: '5px',
              display: 'flex',
              borderRadius: '10px',
              boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
              opacity: 0.6,
            }}
          >
            <div>
              <h3 style={{ marginLeft: '80px', color: '#155724' }}>Active</h3>

              <h1 style={{ marginLeft: '100px', color: '#155724' }}>120</h1>
            </div>
            <div>
              <MdEmojiObjects
                style={{
                  height: '50px',
                  width: '50px',
                  marginLeft: '100px',
                  marginTop: '30px',
                  color: '#155724',
                }}
              />
            </div>
          </div>
          <div
            style={{
              height: '130px',
              width: '350px',
              backgroundColor: '#aad3ff',
              borderRadius: '5px',
              padding: '5px',
              display: 'flex',
              borderRadius: '10px',
              boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
              opacity: 0.6,
            }}
          >
            <div>
              <h3 style={{ marginLeft: '10px', color: '#0000ff' }}>Under Maintenance</h3>

              <h1 style={{ marginLeft: '100px', color: '#0000ff' }}>20</h1>
            </div>
            <div>
              <MdEngineering
                style={{
                  height: '50px',
                  width: '50px',
                  marginLeft: '100px',
                  marginTop: '30px',
                  color: '#0000ff',
                }}
              />
            </div>
          </div>
          <div
            style={{
              height: '130px',
              width: '350px',
              backgroundColor: '#ffb9c6',
              borderRadius: '5px',
              padding: '5px',
              display: 'flex',
              borderRadius: '10px',
              boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
              opacity: 0.6,
            }}
          >
            <div>
              <h3 style={{ marginLeft: '80px', textAlign: 'center', color: '#ff2d55' }}>
                Disabled
              </h3>

              <h1 style={{ marginLeft: '100px', color: '#ff2d55' }}>10</h1>
            </div>
            <div>
              <MdDoDisturbOn
                style={{
                  height: '50px',
                  width: '50px',
                  marginLeft: '80px',
                  marginTop: '30px',
                  color: '#ff2d55',
                }}
              />
            </div>
          </div>
        </div>

        {/* Machine Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
            padding: '10px',
          }}
        >
          <div style={{ borderRadius: '5px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex' }}>
              <h3 style={{ marginLeft: '10px' }}>Machine Table</h3>
              {/* Search and Filter Section */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginLeft: '55%',
                }}
              >
                <input
                  type="text"
                  placeholder="Search by Name, ID, Status, Process"
                  style={{
                    width: '230px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.16)',
                    backgroundColor: 'rgba(0,0,0,0)',
                    color: '#7f7f7f',
                  }}
                />
                <input
                  type="date"
                  style={{
                    padding: '0px 8px',
                    border: '0',
                    boxSizing: 'border-box',
                    borderRadius: '12px',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.16)',
                    backgroundColor: '#ffffff',
                    color: '#023f81',
                    fontSize: '18px',
                    fontFamily: 'Mulish',
                    lineHeight: '30px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />

                <button
                  style={{
                    padding: '0px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#8167e5',
                    color: '#ffffff',
                    fontSize: '18px',
                    fontFamily: 'Poppins',
                    fontWeight: '500',
                    lineHeight: '30px',
                    cursor: 'pointer',
                    width: '100px',
                    outline: 'none',
                    border: '0',
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', margintop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb', border: '1px solid #000', opacity: 0.6 }}>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Name
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Type
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Process Count
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Status
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Last Maintenance
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Next Maintenance
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Speed
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Capacity
                </th>
                <th style={{ padding: '10px', border: '1px solid #fff', textAlign: 'left' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ border: '1px solid #fff' }}>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>001</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>Machine A</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>Type 1</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>3</td>
                <td style={{ padding: '10px', border: '1px solid #fff', color: '#0275ff' }}>
                  Active
                </td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>01/01/2023</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>01/07/2023</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>500</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>2000 L</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>...</td>
              </tr>
              <tr style={{ border: '1px solid #fff' }}>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  002
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  Machine 2
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  Type 2
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  10
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #fff',
                    backgroundColor: '#f2f2f2',
                    color: '#81182c',
                  }}
                >
                  Maintenance
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  01/05/2023
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  01/07/2023
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  500
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  2000 L
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  ...
                </td>
              </tr>
              <tr style={{ border: '1px solid #fff' }}>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>003</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>Machine c</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>Type 3</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>5</td>
                <td style={{ padding: '10px', border: '1px solid #fff', color: '#ff3b30' }}>
                  Disable
                </td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>01/01/2023</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>01/07/2023</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>500</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>2000 L</td>
                <td style={{ padding: '10px', border: '1px solid #fff' }}>...</td>
              </tr>
              <tr style={{ border: '1px solid #fff' }}>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  004
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  Machine d
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  Type 4
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  5
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #fff',
                    backgroundColor: '#f2f2f2',
                    color: '#ff3b30',
                  }}
                >
                  Under Maintenance
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  01/03/2023
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  01/07/2023
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  500
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  2000 L
                </td>
                <td
                  style={{ padding: '10px', border: '1px solid #fff', backgroundColor: '#f2f2f2' }}
                >
                  ...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'right',
            marginTop: '10px',
            gap: '5px',
            marginRight: '20px',
          }}
        >
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              style={{
                backgroundColor: "#e5e7eb'",
                border: '1px solid #ccc',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
export default MachineDashboard
