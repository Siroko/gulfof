'use client'

import { useState } from 'react'
import { GoogleMap, LoadScript, Marker, OverlayView } from '@react-google-maps/api'

const GulfPage = () => {
  const [gulfName, setGulfName] = useState('Mexico')
  
  const mapCenter = {
    lat: 25.5,
    lng: -90.0
  }
  
  const mapStyles = {
    height: '70vh',
    width: '100%'
  }

  const labelPosition = {
    lat: 26.9, // Position the label above the marker
    lng: -90.0
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
            className="border text-black rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[200px]"
            placeholder="Enter name"
          />
        </div>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={5}
          center={mapCenter}
          options={{
            mapTypeId: 'roadmap',
            zoomControl: false
          }}
        >
          <OverlayView
            position={labelPosition}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >
            <div className="text-[#148299] text-[11px] font-normal tracking-wide px-20 py-10
                          transform -translate-x-1/2 select-none
                          bg-[#72d4e8] min-w-[250px] text-center
                          font-['Google_Sans_Text',_'Roboto',_Arial,_sans-serif]">
              Gulf of {gulfName}
            </div>
          </OverlayView>
          
          <Marker
            position={mapCenter}
          />
        </GoogleMap>
      </LoadScript>

      <div className="mt-4 text-sm text-gray-600">
        <p>Click the text field above to rename the Gulf of {gulfName}</p>
      </div>
    </div>
  )
}

export default GulfPage 