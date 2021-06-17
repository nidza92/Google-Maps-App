import React, { useState, useEffect } from 'react'
import classes from './styling/Map.module.css'
import Card from './utils/Card'
import MainForm from './MainForm'
import uuid from 'react-uuid'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { markerColors } from '../assets/markerColors'
import {
  libraries,
  mapContainerStyle,
  center,
  options,
} from './MapConfig/mapConfig'
import StatefulMarker from './StatefulMarker'
import { PlacesAutocomplete } from './PlacesSearch'

const getLocalStorage = () => {
  let list = localStorage.getItem('markerList')
  if (list) {
    return JSON.parse(localStorage.getItem('markerList'))
  } else {
    return []
  }
}

const getLocalStorage1 = () => {
  let bounds = localStorage.getItem('bounds')
  if (bounds) {
    return JSON.parse(localStorage.getItem('bounds'))
  } else {
    return {}
  }
}

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })
  const [markerList, setMarkerList] = useState(getLocalStorage())
  const [addBatchMarkers, setAddBatchMarkers] = useState('')

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    // let k = getLocalStorage1()
    mapRef.current.fitBounds(getLocalStorage1())
  }, [])
  const panTo = ({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
  }

  useEffect(() => {
    localStorage.setItem('markerList', JSON.stringify(markerList))
    console.log(markerList)
  }, [markerList])

  const deleteMarker = (id) => {
    let filteredMarkers = markerList.filter((markers) => {
      return markers.id !== id
    })
    setMarkerList(filteredMarkers)
  }

  const handleChange = (e) => {
    setAddBatchMarkers(e.target.value)
    console.log(addBatchMarkers)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(addBatchMarkers)
    let splitBatch = addBatchMarkers.trim().split('\n')
    let batchArray = []

    splitBatch.forEach((element) => {
      let markedColor = ''
      let newMarker = element.trim().split(',')
      switch (newMarker[2]) {
        case 'yellow':
          markedColor = markerColors[0].color
          break
        case 'red':
          markedColor = markerColors[1].color
          break
        case 'blue':
          markedColor = markerColors[2].color
          break
        case 'green':
          markedColor = markerColors[3].color
          break
        case 'purple':
          markedColor = markerColors[4].color
          break
        default:
          markedColor = markerColors[1].color
          break
      }

      batchArray.push({
        lat: parseFloat(newMarker[0]),
        lng: parseFloat(newMarker[1]),
        id: uuid(),
        color: markedColor,
      })
    })
    let copiedMarkerList = markerList
    let newState = [...copiedMarkerList, ...batchArray]

    setMarkerList(newState)
  }

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading maps'

  return (
    <div className={classes.container}>
      <Card>
        <div className={classes.map}>
          <PlacesAutocomplete panTo={panTo} />
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            onLoad={onMapLoad}
            zoom={4}
            center={center}
            options={options}
            // onBoundsChanged={() => {
            //   var bounds = mapRef.current.getBounds()
            //   var ne = bounds.getNorthEast()
            //   var sw = bounds.getSouthWest()
            //   // console.log(ne.lat())
            //   // console.log(ne.lng())
            //   // console.log(sw.lat())
            //   // console.log(sw.lng())
            //   console.log(bounds)
            // }}
            onIdle={() => {
              var bounds = mapRef.current.getBounds()
              var ne = bounds.getNorthEast()
              var sw = bounds.getSouthWest()
              // console.log(ne.lat())
              // console.log(ne.lng())
              // console.log(sw.lat())
              // console.log(sw.lng())
              console.log(bounds)
              localStorage.setItem('bounds', JSON.stringify(bounds))
            }}
            onClick={(event) => {
              setMarkerList((oldState) => [
                ...oldState,
                {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                  id: uuid(),
                  color: markerColors[0].color,
                },
              ])
            }}
          >
            {markerList.map((marker) => {
              return (
                <StatefulMarker
                  markerList={markerList}
                  key={marker.id}
                  marker={marker}
                  deleteMarker={deleteMarker}
                ></StatefulMarker>
              )
            })}
          </GoogleMap>
        </div>
      </Card>
      <div>
        <Card>
          <MainForm
            handleSubmit={handleSubmit}
            addBatchMarkers={addBatchMarkers}
            handleChange={handleChange}
          ></MainForm>
        </Card>
      </div>
    </div>
  )
}

export default Map
