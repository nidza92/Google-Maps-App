import React, { useState, useEffect } from 'react'
import { Marker } from '@react-google-maps/api'
import { markerColors } from '../assets/markerColors'

export default function StatefulMarker({ marker, deleteMarker }) {
  const [color, setColor] = useState(marker.color)
  const [idx, setIdx] = useState(1)

  return (
    <Marker
      key={marker.id}
      position={{ lat: marker.lat, lng: marker.lng }}
      icon={{
        url: color,
      }}
      onRightClick={(event) => {
        let id = marker.id
        deleteMarker(id)
      }}
      onClick={(event) => {
        if (marker.lat === event.latLng.lat()) {
          if (idx < markerColors.length - 1) {
            setIdx(idx + 1)
          } else {
            setIdx(0)
          }
          setColor(markerColors[idx].color)
        }
      }}
    ></Marker>
  )
}
