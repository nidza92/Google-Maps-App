import React, { useState } from 'react'
import { Marker } from '@react-google-maps/api'
import { markerColors } from '../assets/markerColors'

export default function StatefulMarker({ marker, deleteMarker }) {
  const [color, setColor] = useState(marker.color)

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
          let randomColor = Math.floor(Math.random() * markerColors.length)
          while (markerColors[randomColor].color === color) {
            randomColor = Math.floor(Math.random() * markerColors.length)
          }

          setColor(markerColors[randomColor].color)
        }
      }}
    ></Marker>
  )
}
