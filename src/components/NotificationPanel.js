import { useEffect, useState } from 'react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilX } from '@coreui/icons'
import { commonApi } from '../api/common'
import { useDispatch, useSelector } from 'react-redux'
import { setAllNotifications, clearNotification, clearAllNotifications } from '../action'

const NotificationPanel = () => {
  const dispatch = useDispatch()

  const notifications = useSelector((state) => state?.auth?.all_notification || [])

  const fetchNotifications = async () => {
    try {
      const response = await commonApi.getNotifications()
      dispatch(setAllNotifications(response?.data?.data || []))
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const removeNotification = async (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await commonApi.clearNotifications(id)
      dispatch(clearNotification(id))
    } catch (error) {
      console.error('Error clearing notification:', error)
    }
  }

  const handleClearAll = async () => {
    try {
      notifications.map(async (note) => {
        await commonApi.clearNotifications(note.id)
      })
      dispatch(clearAllNotifications())
    } catch (error) {
      console.error('Error clearing all notifications:', error)
    }
  }

  return (
    // Changed from variant="nav-item" to remove the <li> wrapper
    <CDropdown>
      <CDropdownToggle caret={false} className="position-relative nav-link">
        <CIcon icon={cilBell} size="lg" className="text-white" />
        {notifications.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.75rem' }}
          >
            {notifications.length}
          </span>
        )}
      </CDropdownToggle>

      <CDropdownMenu
        className="pt-0"
        placement="bottom-end"
        style={{
          width: '320px',
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            borderBottom: '1px solid #dee2e6',
          }}
        >
          <span>Notifications</span>

          <button
            onClick={handleClearAll}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'normal',
            }}
          >
            Clear All
          </button>
        </div>

        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {notifications.length === 0 ? (
            <CDropdownItem disabled>No new notifications</CDropdownItem>
          ) : (
            notifications.map((note, index) => (
              <div
                key={index}
                style={{
                  borderBottom: index !== notifications.length - 1 ? '1px dotted #ddd' : 'none',
                }}
              >
                <CDropdownItem
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    backgroundColor: 'transparent',
                  }}
                  className="notification-item"
                >
                  <span
                    style={{
                      flex: 1,
                      marginRight: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      fontSize: '0.9rem',
                    }}
                  >
                    {/* ALERT or CRITICAL Prefix */}
                    {(() => {
                      const text = note?.message || ''
                      if (text.startsWith('ALERT')) {
                        return (
                          <span
                            style={{
                              color: '#ffc107',
                              fontWeight: 'bold',
                              marginRight: '4px',
                            }}
                          >
                            ALERT
                          </span>
                        )
                      }
                      if (text.startsWith('CRITICAL')) {
                        return (
                          <span
                            style={{
                              color: '#c82333',
                              fontWeight: 'bold',
                              marginRight: '4px',
                            }}
                          >
                            CRITICAL
                          </span>
                        )
                      }
                      return null
                    })()}

                    {/* Remaining Message */}
                    <span>
                      {(() => {
                        const text = note?.message || ''
                        const cleanedText = text
                          .replace(/^ALERT\s*/, '')
                          .replace(/^CRITICAL\s*/, '')
                        return cleanedText || 'No new notifications'
                      })()}
                    </span>
                  </span>

                  <button
                    onClick={(e) => removeNotification(e, note.id)}
                    className="btn btn-sm btn-light p-1 ms-2 border-0"
                    style={{ lineHeight: 0 }}
                  >
                    <CIcon icon={cilX} size="sm" />
                  </button>
                </CDropdownItem>
              </div>
            ))
          )}
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationPanel