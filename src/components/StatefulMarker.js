import React, { useState, useEffect } from 'react'
import { Marker } from '@react-google-maps/api'
import { markerColors } from '../assets/markerColors'

// const getLocalStorage = () => {
//   let list = localStorage.getItem('markerList')

//   if (list) {
//     return JSON.parse(localStorage.getItem('markerList'))
//   } else {
//     return []
//   }
// }

export default function StatefulMarker({ marker, deleteMarker, markerList }) {
  const [color, setColor] = useState(marker.color)
  const [idx, setIdx] = useState(1)

  useEffect(() => {
    // console.log(storedMarkerList)
    markerList.forEach((element) => {
      if (element.id === marker.id) {
        element.color = color
      }
    })
    console.log(markerList)
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
