import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api'
import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'
// import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api'

interface GPXPoint {
  $: {
    lat: string
    lon: string
  }
  ele: string
}

const Map: React.FC = () => {
  const mapStyles = {
    height: '100vh',
    width: '100%'
  }

  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 })
  const [gpxTrackPoint, setGpxTrackPoint] = useState<google.maps.LatLngLiteral[] | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchGpxFile = async () => {
      // const gpxFilePath = 'src/components/Map/gpx-sample.gpx'
      const gpxFilePath = 'src/components/Map/Central-Ontario-Loop-Trail-COLT.gpx'
      try {
        const response = await fetch(gpxFilePath)
        // console.log(response)
        const gpxContent = await response.text()
        // console.log(gpxContent)
        const parsedGpx = GPX.parse(gpxContent)
        // console.log(typeof parsedGpx) // object
        // console.log(parsedGpx)
        // console.log(parsedGpx.$)
        // console.log(parsedGpx.metadata)
        // console.log(parsedGpx.wpt)
        // console.log(parsedGpx.trk)

        const firstTrackPoint = parsedGpx.trk[0]?.trkseg[0]?.trkpt[0]
        // console.log(firstTrackPoint)
        if (firstTrackPoint) {
          const center: google.maps.LatLngLiteral = {
            lat: parseFloat(firstTrackPoint.$.lat),
            lng: parseFloat(firstTrackPoint.$.lon)
          }
          setDefaultCenter(center)
        }

        const trkptArray: google.maps.LatLngLiteral[] = []

        parsedGpx?.trk[0]?.trkseg[0]?.trkpt.forEach((point: GPXPoint) => {
          const latLng: google.maps.LatLngLiteral = {
            lat: parseFloat(point.$.lat),
            lng: parseFloat(point.$.lon)
          }
          trkptArray.push(latLng)
        })

        setGpxTrackPoint(trkptArray)
        console.log(typeof trkptArray)
        console.log(trkptArray)
      } catch (error) {
        console.error('Parsing gpx file error: ', error)
      }
    }

    fetchGpxFile()
  }, [])

  return (
    <LoadScript googleMapsApiKey='AIzaSyDih9UJsPk45tf1r4kt5X_vsLuaZeDNJnk'>
      <GoogleMap mapContainerStyle={mapStyles} zoom={12} center={defaultCenter}>
        <Polyline
          path={gpxTrackPoint}
          options={{
            strokeColor: '#ff2527',
            strokeOpacity: 1,
            strokeWeight: 2
          }}
          visible={true}
        />
      </GoogleMap>
    </LoadScript>
  )
}

export default Map
