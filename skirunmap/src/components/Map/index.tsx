import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'

interface MapProps {
  gpxFileUrl: string
}
interface GPXPoint {
  $: {
    lat: string
    lon: string
  }
  ele: string
}

const Map: React.FC<MapProps> = ({ gpxFileUrl }) => {
  const mapStyles = {
    height: '100vh',
    width: '100%'
  }

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 })
  const [gpxTrackPoint, setGpxTrackPoint] = useState<google.maps.LatLngLiteral[] | undefined>(
    undefined
  )

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
      fetchGpxFile(gpxFileUrl, Map)
    }

    loadGoogleMapsApi()
  }, [gpxFileUrl])

  const fetchGpxFile = async (filePath: string, Map: any) => {
    // const gpxFilePath = 'src/components/Map/gpx-sample.gpx'
    try {
      const response = await fetch(filePath)
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

        const googleMap = new Map(document.getElementById('map') as HTMLElement, {
          center: center,
          zoom: 9
        })
        setMap(googleMap)
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
      // console.log(typeof trkptArray)
      // console.log(trkptArray)
    } catch (error) {
      console.error('Parsing gpx file error: ', error)
    }
  }

  useEffect(() => {
    if (map && gpxTrackPoint) {
      const polyline = new google.maps.Polyline({
        path: gpxTrackPoint,
        strokeColor: '#ff2527',
        strokeOpacity: 1,
        strokeWeight: 2,
        map: map,
        geodesic: true
      })
    }
  }, [map, gpxTrackPoint])

  return <div id='map' style={mapStyles}></div>
}

export default Map
