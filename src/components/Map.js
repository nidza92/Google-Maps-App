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
  defaultCenter,
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

const getLocalStorageZoom = () => {
  let zoom = localStorage.getItem('zoom')
  if (zoom) {
    return JSON.parse(localStorage.getItem('zoom'))
  } else {
    return 4
  }
}
const getLocalStorageCenter = () => {
  let center = localStorage.getItem('center')
  if (center) {
    return JSON.parse(localStorage.getItem('center'))
  } else {
    return defaultCenter
  }
}

const getStorage = (payload, defaultValue) => {
  let data = localStorage.getItem(payload)
  if (data) {
    return JSON.parse(localStorage.getItem(payload))
  } else {
    return defaultValue
  }
}

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })
  const [markerList, setMarkerList] = useState(getLocalStorage)
  const [addBatchMarkers, setAddBatchMarkers] = useState('')

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
    mapRef.current.setZoom(parseInt(getStorage('zoom', 4)))
    // mapRef.current.setCenter(getLocalStorageCenter())
    mapRef.current.setCenter(getStorage('center', defaultCenter))
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
      let index = 1
      let markedColor = ''
      let newMarker = element.trim().split(',')
      switch (newMarker[2]) {
        case 'yellow':
          markedColor = markerColors[0].color
          index = 0
          break
        case 'red':
          markedColor = markerColors[1].color
          index = 1
          break
        case 'blue':
          markedColor = markerColors[2].color
          index = 2
          break
        case 'green':
          markedColor = markerColors[3].color
          index = 3
          break
        case 'purple':
          markedColor = markerColors[4].color
          index = 4
          break
        default:
          markedColor = markerColors[1].color
          index = 1
          break
      }

      batchArray.push({
        lat: parseFloat(newMarker[0]),
        lng: parseFloat(newMarker[1]),
        id: uuid(),
        color: markedColor,
        colorCounter: index,
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
            center={defaultCenter}
            options={options}
            onIdle={() => {
              let zoom = mapRef.current.getZoom()
              let center = mapRef.current.getCenter()
              console.log('getCenter return', center)
              localStorage.setItem('zoom', JSON.stringify(zoom))
              localStorage.setItem('center', JSON.stringify(center))
            }}
            onClick={(event) => {
              setMarkerList((oldState) => [
                ...oldState,
                {
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                  id: uuid(),
                  color: markerColors[0].color,
                  colorCounter: 0,
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
