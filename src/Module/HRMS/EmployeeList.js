import React from 'react'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { TbSmartHome } from 'react-icons/tb'
import { BiSearchAlt } from 'react-icons/bi'

function EmployeeList() {
  return (
    <>
      <div style={{ maxWidth: '1280px', margin: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '100' }}>Employee</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              style={{
                backgroundColor: '#14b8a6',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
            >
              + Create Employee
            </button>
            <button
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
            >
              Import
            </button>
            <button
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
              }}
            >
              Export
            </button>
          </div>
        </div>

        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '20px',
            border: '1px solid #e7e5e4',
            borderRadius: '6px',
            padding: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px', marginLeft: '40px' }}>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <TbSmartHome style={{ color: '#14b8a6' }} />
              <span>All Datas</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                5055
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <IoCheckmarkCircleOutline />
              <span>Active</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                500
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <IoCheckmarkCircleOutline />
              <span>Inactive</span>
              <span
                style={{
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  borderRadius: '6px',
                  height: '24px',
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                50
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1280px',
            margin: 'auto',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              border: '1px solid #e7e5e4',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            <BiSearchAlt style={{ color: '#737373' }} />
            <input
              type="text"
              placeholder="Search Employee..."
              style={{ outline: 'none', border: 'none', backgroundColor: 'transparent' }}
            />
          </div>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Department
            </option>
            <option value="">Department1</option>
            <option value="">Department2</option>
            <option value="">Department3</option>
          </select>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Role
            </option>
            <option value="">Role1</option>
            <option value="">Role2</option>
            <option value="">Role3</option>
          </select>

          <select
            style={{
              border: '1px solid #e7e5e4',
              padding: '8px',
              width: '256px',
              borderRadius: '6px',
              color: '#737373',
              backgroundColor: 'transparent',
            }}
          >
            <option disabled selected>
              Select Manager
            </option>
            <option value="">Manager1</option>
            <option value="">Manager2</option>
            <option value="">Manager3</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                {[
                  'Name',
                  'Role',
                  'Department',
                  'Work Schedule',
                  'Report Manager',
                  'Status',
                  'Action',
                ].map((heading, index) => (
                  <th key={index} style={{ padding: '10px' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {['Vinish', 'Admin', 'Development', 'Morning shift', 'Dinesh', 'Active', ''].map(
                  (data, index) => (
                    <td key={index} style={{ padding: '10px' }}>
                      {data}
                    </td>
                  ),
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default EmployeeList
