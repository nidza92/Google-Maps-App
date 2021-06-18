import React, { useState, useEffect } from 'react'
import { Marker } from '@react-google-maps/api'
import { markerColors } from '../assets/markerColors'

export default function StatefulMarker({ marker, deleteMarker, markerList }) {
  const [color, setColor] = useState(marker.color)
  const [idx, setIdx] = useState(1)

  useEffect(() => {
    markerList.forEach((element) => {
      if (element.id === marker.id) {
        element.color = color
      }
    })
    localStorage.setItem('markerList', JSON.stringify(markerList))
  }, [color])

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
          if (marker.colorCounter < markerColors.length - 1) {
            marker.colorCounter++
          } else {
            marker.colorCounter = 0
          }

          setColor(markerColors[marker.colorCounter].color)
        }
      }}
    ></Marker>
  )
}
