import { Image, Skeleton } from '@nextui-org/react'
import { DocumentData } from 'firebase/firestore'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Spot } from '../../store/useRoute'
import { useRouteCardStore } from '../../store/useRouteCard'
import LikeDislike from '../LikeDislike'
import View from './images/eye.png'
import GooglePin from './images/google-maps-pin.png'
import Tag from './images/tag.png'

interface RouteCardDocData {
  data: DocumentData[]
}

const RouteCard: React.FC<RouteCardDocData> = ({ data }) => {
  const navigate = useNavigate()
  const { selectedImages, setSelectedImages } = useRouteCardStore()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const handleDotClick = (routeID: string, index: number) => {
    const newSelectedImages = { ...selectedImages, [routeID]: index }
    setSelectedImages(newSelectedImages)
  }

  setTimeout(() => {
    setIsLoaded(true)
  }, 500)

  // useEffect(() => {
  //   console.log('selectedImages:', selectedImages)
  // }, [selectedImages])

  // const handleImageBug = (index: number) => {
  //   console.log(index)
  // }

  return (
    // <div className='h-screen-64px flex w-full flex-col flex-wrap gap-4'>
    // <div className='flex w-auto flex-wrap gap-4'>
    <div className='columns-4 space-y-4'>
      {data.map((route, index) => {
        let imageIndex = 0
        return (
          <div
            key={index}
            className='relative h-fit w-52 cursor-pointer break-inside-avoid-column rounded-2xl bg-zinc-50 shadow-[0px_4px_7px_-4px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
          >
            <Link
              key={`${route.routeID}_${index}`}
              to={`/route/${route.routeID}`}
              className='absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-2xl'
            />
            <div className='flex flex-wrap text-xl'>
              <div className='relative w-52 rounded-xl bg-zinc-200'>
                <Skeleton isLoaded={isLoaded} className='rounded-xl'>
                  <div className='flex h-full w-full'>
                    {route.spots?.map((spot: Spot) =>
                      spot.imageUrls.map((url: string) => (
                        <Image
                          isZoomed
                          key={imageIndex++}
                          src={url}
                          alt={spot.spotTitle}
                          className={`aspect-square rounded-xl object-cover ${
                            selectedImages[route.routeID] === imageIndex ? 'block' : 'hidden'
                          }`}
                          onClick={() => {
                            navigate(`/route/${route.routeID}`)
                          }}
                          // onClick={() => handleImageBug(imageIndex)}
                        />
                      ))
                    )}
                  </div>
                  <div className='absolute bottom-2 z-20 flex h-4 w-full flex-wrap items-center justify-center gap-2'>
                    {Array.from({
                      length: route.spots?.reduce(
                        (acc: number, spot: Spot) => acc + spot.imageUrls.length,
                        0
                      )
                    }).map((_, spanIndex) => (
                      <span
                        key={spanIndex}
                        className={`dot h-2 w-2 rounded-full ${
                          selectedImages[route.routeID] === spanIndex
                            ? 'bg-white'
                            : 'bg-zinc-500 shadow-[0px_0px_4px_-2px_#ffffff] '
                        }`}
                        onClick={() => handleDotClick(route.routeID, spanIndex)}
                      />
                    ))}
                  </div>
                </Skeleton>
              </div>

              <div className='flex flex-col gap-1 p-2 text-sm'>
                <Skeleton isLoaded={isLoaded} className='rounded-xl'>
                  <div className='ml-1 flex items-center gap-3'>
                    <div className='z-20 scale-90'>
                      <LikeDislike data={route} />
                    </div>
                    <p className='w-40 truncate text-xl font-bold'>{route.routeTitle}</p>
                  </div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className='rounded-xl'>
                  <div className='ml-1 flex items-center gap-1'>
                    <img src={View} alt='View eye' className='h-3 w-auto' />
                    <p>{route.viewCount}</p>
                  </div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className='rounded-xl'>
                  <div className='flex flex-wrap gap-2'>
                    {/* <p>Tag: </p> */}
                    {route.tags.length > 0 ? (
                      route.tags.map((tag: string, index: number) => (
                        <Link
                          key={`${route.routeID}_tag_${index}`}
                          to={`/search/${tag}`}
                          className='z-20 flex items-center gap-1 rounded-xl bg-blue-100 pl-1 pr-1'
                        >
                          <img src={Tag} alt='Tag' className='h-3 w-auto' />
                          <p className='max-w-[144px] truncate'>{tag}</p>
                        </Link>
                      ))
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className='rounded-xl'>
                  <div className='flex flex-wrap gap-1'>
                    {/* <p>Spots: </p> */}
                    {route.spots.length > 0 ? (
                      route.spots?.map((spot: Spot, index: number) => (
                        <Link
                          key={`${route.routeID}_spot_${index}`}
                          to={`/search/${spot.spotTitle}`}
                          className='z-20 flex items-center gap-1 rounded-xl bg-blue-100 pl-1 pr-1'
                        >
                          <img src={GooglePin} alt='Pin' className='h-3 w-auto' />
                          <p className='max-w-[144px] truncate'>{spot.spotTitle}</p>
                        </Link>
                      ))
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </Skeleton>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RouteCard
