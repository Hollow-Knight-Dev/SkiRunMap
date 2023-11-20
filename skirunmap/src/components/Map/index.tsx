import { GoogleMap, LoadScript } from '@react-google-maps/api'

const Map: React.FC = () => {
  const mapStyles = {
    height: '100vh',
    width: '100%',
  }

  const defaultCenter = {
    lat: 42.869690069468454,
    lng: 140.70157595721824,
  }

  return (
    <LoadScript googleMapsApiKey='AIzaSyAJziEFlINzTGuIpA8fdWRIi27SFinCvdI'>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={defaultCenter}
      />
    </LoadScript>
  )
}

export default Map
