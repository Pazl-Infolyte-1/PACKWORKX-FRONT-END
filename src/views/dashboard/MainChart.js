import React, { useEffect, useRef, useState } from 'react'
import { CChartLine, CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import { CButton, CButtonGroup } from '@coreui/react'

const MainChart = () => {
  const chartRef = useRef(null)
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('month')

  // Manufacturing ERP theme colors
  const themeColors = {
    production: '#e74c3c',
    inventory: '#3498db',
    sales: '#2ecc71',
    purchase: '#f39c12',
    quality: '#9b59b6',
    maintenance: '#e67e22',
    finance: '#34495e',
    hr: '#1abc9c'
  }

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  // Manufacturing data sets
  const getChartData = () => {
    const baseLabels = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      year: ['Q1', 'Q2', 'Q3', 'Q4']
    }

    const salesOrdersData = {
      week: [120, 150, 140, 180, 165, 145, 190],
      month: [650, 720, 680, 847],
      quarter: [2200, 2450, 2380, 2650, 2580, 2890],
      year: [8500, 9200, 10100, 11200]
    }

    const workOrdersData = {
      week: [45, 52, 48, 65, 58, 50, 70],
      month: [125, 140, 138, 156],
      quarter: [480, 520, 510, 580, 560, 620],
      year: [1800, 2100, 2300, 2600]
    }

    const purchaseOrdersData = {
      week: [25, 32, 28, 40, 35, 30, 45],
      month: [65, 75, 72, 89],
      quarter: [250, 280, 270, 310, 295, 340],
      year: [950, 1100, 1250, 1400]
    }

    return {
      labels: baseLabels[timeRange],
      datasets: [
        {
          label: 'Sales Orders',
          data: salesOrdersData[timeRange],
          borderColor: themeColors.sales,
          backgroundColor: `${themeColors.sales}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: themeColors.sales,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: themeColors.sales,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Work Orders',
          data: workOrdersData[timeRange],
          borderColor: themeColors.production,
          backgroundColor: `${themeColors.production}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: themeColors.production,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: themeColors.production,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Purchase Orders',
          data: purchaseOrdersData[timeRange],
          borderColor: themeColors.purchase,
          backgroundColor: `${themeColors.purchase}20`,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: themeColors.purchase,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: themeColors.purchase,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ],
    }
  }

  // Production efficiency bar chart
  const getBarChartData = () => {
    return {
      labels: ['Production', 'Quality Control', 'Packaging', 'Shipping', 'Assembly'],
      datasets: [
        {
          label: 'Efficiency %',
          data: [95, 88, 92, 78, 96],
          backgroundColor: [
            `${themeColors.production}80`,
            `${themeColors.quality}80`,
            `${themeColors.inventory}80`,
            `${themeColors.purchase}80`,
            `${themeColors.maintenance}80`
          ],
          borderColor: [
            themeColors.production,
            themeColors.quality,
            themeColors.inventory,
            themeColors.purchase,
            themeColors.maintenance
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ],
    }
  }

  // Inventory distribution doughnut chart
  const getDoughnutData = () => {
    return {
      labels: ['Raw Materials', 'Work in Progress', 'Finished Goods', 'Packaging Materials', 'Consumables', 'Spare Parts'],
      datasets: [
        {
          data: [35, 25, 20, 12, 5, 3],
          backgroundColor: [
            themeColors.inventory,
            themeColors.production,
            themeColors.sales,
            themeColors.purchase,
            themeColors.quality,
            themeColors.maintenance
          ],
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 5,
          cutout: '60%',
        }
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: themeColors.production,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index',
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
          drawOnChartArea: true,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          },
          callback: function(value) {
            return chartType === 'line' ? value + ' orders' : value + (chartType === 'bar' ? '%' : '')
          }
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      point: {
        radius: 5,
        hitRadius: 10,
        hoverRadius: 7,
        borderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: themeColors.production,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y + '%'
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          }
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%'
          }
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: themeColors.production,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <CChartLine
            ref={chartRef}
            style={{ height: '350px' }}
            data={getChartData()}
            options={chartOptions}
          />
        )
      case 'bar':
        return (
          <CChartBar
            style={{ height: '350px' }}
            data={getBarChartData()}
            options={barChartOptions}
          />
        )
      case 'doughnut':
        return (
          <CChartDoughnut
            style={{ height: '350px' }}
            data={getDoughnutData()}
            options={doughnutOptions}
          />
        )
      default:
        return (
          <CChartLine
            ref={chartRef}
            style={{ height: '350px' }}
            data={getChartData()}
            options={chartOptions}
          />
        )
    }
  }

  return (
    <div>
      {/* Chart Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <CButtonGroup size="sm">
          {[
            { key: 'line', label: 'Orders Trend' },
            { key: 'bar', label: 'Efficiency' },
            { key: 'doughnut', label: 'Inventory' }
          ].map((type) => (
            <CButton
              key={type.key}
              color={chartType === type.key ? 'primary' : 'outline-secondary'}
              onClick={() => setChartType(type.key)}
              style={{
                backgroundColor: chartType === type.key ? themeColors.production : 'transparent',
                borderColor: themeColors.production,
                color: chartType === type.key ? 'white' : themeColors.production
              }}
            >
              {type.label}
            </CButton>
          ))}
        </CButtonGroup>

        {chartType === 'line' && (
          <CButtonGroup size="sm">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <CButton
                key={range}
                color={timeRange === range ? 'primary' : 'outline-secondary'}
                onClick={() => setTimeRange(range)}
                style={{
                  backgroundColor: timeRange === range ? themeColors.production : 'transparent',
                  borderColor: themeColors.production,
                  color: timeRange === range ? 'white' : themeColors.production
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </CButton>
            ))}
          </CButtonGroup>
        )}
      </div>

      {/* Chart Container */}
      <div className="chart-container" style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        {renderChart()}
      </div>

      {/* Chart Insights */}
      <div className="mt-3">
        <div className="row">
          <div className="col-md-4">
            <div style={{
              background: `${themeColors.sales}15`,
              border: `2px solid ${themeColors.sales}30`,
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{ color: themeColors.sales, fontSize: '1.8rem', fontWeight: 'bold' }}>
                {chartType === 'line' ? '+12.4%' : chartType === 'bar' ? '89.8%' : '35%'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '0.875rem', fontWeight: '500' }}>
                {chartType === 'line' ? 'Sales Growth' : chartType === 'bar' ? 'Avg Efficiency' : 'Raw Materials'}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{
              background: `${themeColors.production}15`,
              border: `2px solid ${themeColors.production}30`,
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{ color: themeColors.production, fontSize: '1.8rem', fontWeight: 'bold' }}>
                {chartType === 'line' ? '+8.7%' : chartType === 'bar' ? '95%' : '25%'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '0.875rem', fontWeight: '500' }}>
                {chartType === 'line' ? 'Production Growth' : chartType === 'bar' ? 'Best Performance' : 'WIP'}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{
              background: `${themeColors.purchase}15`,
              border: `2px solid ${themeColors.purchase}30`,
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{ color: themeColors.purchase, fontSize: '1.8rem', fontWeight: 'bold' }}>
                {chartType === 'line' ? '+15.2%' : chartType === 'bar' ? '78%' : '20%'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '0.875rem', fontWeight: '500' }}>
                {chartType === 'line' ? 'Purchase Growth' : chartType === 'bar' ? 'Lowest Dept.' : 'Finished Goods'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing KPIs Summary */}
      <div className="mt-4">
        <div className="row">
          <div className="col-12">
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: `2px solid ${themeColors.inventory}30`,
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h6 style={{ color: themeColors.finance, marginBottom: '15px' }}>Key Manufacturing Metrics</h6>
              <div className="row text-center">
                <div className="col-md-3">
                  <div style={{ color: themeColors.production, fontSize: '1.2rem', fontWeight: 'bold' }}>1,247</div>
                  <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>Daily Production</div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: themeColors.quality, fontSize: '1.2rem', fontWeight: 'bold' }}>96.8%</div>
                  <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>Quality Rate</div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: themeColors.maintenance, fontSize: '1.2rem', fontWeight: 'bold' }}>89/95</div>
                  <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>Active Machines</div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: themeColors.sales, fontSize: '1.2rem', fontWeight: 'bold' }}>92.3%</div>
                  <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>On-time Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainChart