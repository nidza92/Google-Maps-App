import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'

import uuid from 'react-uuid'

import classes from '../components/styling/PlacesSearch.module.css'

export const PlacesAutocomplete = ({ panTo }) => {
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.320904, lng: () => 21.89576 },
      radius: 150 * 1000,
    },
    debounce: 300,
  })

  return (
    <div className={classes.search}>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false)
          clearSuggestions()
          try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            panTo({ lat, lng })
            console.log(lat, lng)
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Enter an address'
        />
        <ComboboxPopover>
          <ComboboxList className={classes.resultsList}>
            {status === 'OK' &&
              data.map(({ description }) => (
                <ComboboxOption key={uuid()} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}
