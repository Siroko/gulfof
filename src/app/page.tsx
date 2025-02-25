'use client'

import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, OverlayView } from '@react-google-maps/api'

export default function GulfPage() {
  const [gulfName, setGulfName] = useState('Mexico')
  const [recentNames, setRecentNames] = useState<string[]>([])
  
  const mapCenter = {
    lat: 25.5,
    lng: -90.0 
  }

  const labelPosition = {
    lat: 25.1, // Position the label above the marker
    lng: -90.0
  }

  const mapStyles = {
    height: '70vh',
    width: '100%'
  }

  useEffect(() => {
    fetchRecentNames()
  }, [])

  const fetchRecentNames = async () => {
    try {
      const response = await fetch('/api/gulf-names')
      const data = await response.json()
      setRecentNames(data.map((item: { name: string }) => item.name))
    } catch (error) {
      console.error('Error fetching names:', error)
    }
  }

  const handleSaveName = async () => {
    try {
      await fetch('/api/gulf-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: gulfName }),
      })
      fetchRecentNames()
    } catch (error) {
      console.error('Error saving name:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Gulf of {gulfName}</h1>
        <div className="flex gap-2 items-center">
          <span className="text-lg">Gulf of</span>
          <input
            type="text"
            value={gulfName}
            onChange={(e) => setGulfName(e.target.value)}
            className="border text-black rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
          <button
            onClick={handleSaveName}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={5}
          center={mapCenter}
          options={{
            scrollwheel: false,
            gestureHandling: 'panning',
            zoomControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            disableDoubleClickZoom: true
          }}
        >
            <OverlayView
            position={labelPosition}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >
            <div className="text-[#148299] text-[11px] font-normal tracking-wide px-20 py-10
                          transform -translate-x-1/2 -translate-y-1/2 select-none
                          bg-[#72d4e8] min-w-[250px] text-center
                          font-['Google_Sans_Text',_'Roboto',_Arial,_sans-serif]">
              Gulf of {gulfName}
            </div>
          </OverlayView>
          <Marker
            position={mapCenter}
            title={`Gulf of ${gulfName}`}
          />
        </GoogleMap>
      </LoadScript>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Names</h2>
        <ul className="space-y-1">
          {recentNames.map((name, index) => (
            <li 
              key={index}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => setGulfName(name)}
            >
              Gulf of {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 