import React from 'react'
import './Style.css'

import { IoSearch } from 'react-icons/io5'
import { FaBell } from 'react-icons/fa'
import { FaWarehouse } from 'react-icons/fa'
import { FaThumbtack } from 'react-icons/fa'
import { FaFillDrip } from 'react-icons/fa'
import { FaCircle } from 'react-icons/fa'
import { BiDollarCircle } from 'react-icons/bi'
import { CiStar } from 'react-icons/ci'
import { MdWorkOutline } from 'react-icons/md'
import { MdOutlineGppGood } from 'react-icons/md'
import { MdGroups2 } from 'react-icons/md'

const Demo = () => {
  return (
    <div className="dashboard-container">
      <div className="stock-overview">
        <div className="stock-card-green">
          <div className="title-green">
            <h3>Reels</h3>
            <p>Total Quantity: 1200</p>
            <p>Status: Enough Stock</p>
            <button className="green-button">View Details</button>
          </div>
          <div className="image-green">
            <BiDollarCircle
              style={{ height: '60px', width: '60px', marginTop: '10px', color: 'white' }}
            />
          </div>
        </div>
        <div className="stock-card-yellow">
          <div className="title-yellow">
            <h3>Glues</h3>
            <p>Total Quantity:300</p>
            <p>Status: low Stock</p>
            <button className="yellow-button">View Details</button>
          </div>
          <div className="image-yellow">
            <CiStar style={{ height: '60px', width: '60px', marginTop: '10px', color: 'white' }} />
          </div>
        </div>
        <div className="stock-card-red">
          <div className="title-red">
            <h3>Pins</h3>
            <p>Total Quantity:50</p>
            <p>Status:Out of Stock</p>
            <button className="red-button">View Details</button>
          </div>
          <div className="image-red">
            <MdWorkOutline
              style={{ height: '60px', width: '60px', marginTop: '10px', color: 'white' }}
            />
          </div>
        </div>
      </div>
      <div className="summary-box">
        <div className="stock-card-black">
          <div className="title-black">
            <h3>Finished Goods</h3>
            <p>Total Quantity: 600</p>

            <button className="black-button">View Details</button>
          </div>
          <div className="image-black">
            <MdOutlineGppGood
              style={{ height: '60px', width: '60px', marginTop: '10px', color: 'white' }}
            />
          </div>
        </div>
        <div className="stock-card-blue">
          <div className="title-blue">
            <h3>Semi Finished Goods</h3>
            <p>Total Quantity:450</p>

            <button className="blue-button">View Details</button>
          </div>
          <div className="image-blue">
            <MdGroups2
              style={{ height: '60px', width: '60px', marginTop: '10px', color: 'white' }}
            />
          </div>
        </div>

        <div className="stock-value">
          <h3>Total Stock Value </h3>
          <h1>$50,000</h1>
        </div>
      </div>
      <section className="materials-section">
        <h4>Raw Materials Types</h4>
        <div className="input">
          <div
            style={{
              border: 'none',
              marginBottom: '3px',
              position: ' relative',
              display: 'flex',
              borderRadius: '8px',
              height: '30',
              width: '200',
              boxShadow: '0px 2px 3px rgba(0,0,0)',
            }}
          >
            <input
              type="text"
              placeholder="Search SKU by name or ID"
              className="search-input"
              style={{
                outline: 'none',
                border: '0',
                height: '40',
                width: '200',
                marginBottom: '3px',
              }}
            />
            <IoSearch style={{ height: 25, width: 25, marginRight: 10, marginTop: '8' }} />
          </div>
          <div
            style={{
              boxshadow: ' 0px 2px 8px rgba(0,0,0,0)',
              backgroundcolor: '#8167e5',
              outline: 'none',
              height: '40',
              width: '100',
              color: '#ffffff',
              display: 'flex',
              marginRight: '10px',
            }}
          >
            <button>Filter</button>
            <button className="saved-button">Saved Filter</button>
            <button className="bulk-button">Bulk upload</button>
          </div>
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <FaCircle style={{ height: '20', width: '20', color: '#6ac8d8' }} /> Reel - Standard
              </td>
              <td>Type:Standard</td>
              <td>Available:180</td>
              <td>Reorder Level:500</td>
              <td>Last Updated:2023-10-01</td>
            </tr>
            <tr>
              <td>
                <FaFillDrip style={{ height: '20', width: '20', color: '#ea64d3' }} /> Glue -
                Pasting
              </td>
              <td>Type:Normal</td>
              <td>Available:200</td>
              <td>Reorder Level:100</td>
              <td>Last Updated:2023-10-01</td>
            </tr>
            <tr>
              <td>
                <FaThumbtack style={{ height: '20', width: '20', color: '#21338e' }} /> Pin - Small
              </td>
              <td>Type:Medium</td>
              <td>Available:25</td>
              <td>Reorder Level:200</td>
              <td>Last Updated:2023-10-01</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="pagination">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4 </button>
      </div>
    </div>
  )
}

export default Demo
