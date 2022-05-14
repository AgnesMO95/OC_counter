import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Canvas = styled.canvas`
  display: block;
  width: 9000px;
  height: 10000px;
  background: red;
`

type Props = {
  inputCanvas: HTMLCanvasElement | null
  image: HTMLImageElement | null
}

const SplitImage = ({ inputCanvas, image }: Props) => {
  const [tiles, setTiles] = useState<ImageData[] | undefined>(undefined)
  const [shouldSplit, setShouldSplit] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  var imgW: number //px
  var imgH: number //px

  var w = innerWidth
  var h = innerHeight

  const tileDim = 416 //px
  var tileCountX: number
  var tileCountY: number
  var imgData: Uint8ClampedArray
  var ctx: CanvasRenderingContext2D | null
  var originalPosX: number[] = []
  var originalPosY: number[] = []
  console.log(image?.naturalHeight)

  if (inputCanvas) {
    inputCanvas.width = w
    inputCanvas.height = h
    ctx = inputCanvas.getContext('2d')
    console.log('er her1')
    console.log(w, h)
  }
  //   if (shouldSplit) {
  //     imgOnLoad()
  //     setShouldSplit(false)
  //   }

  //   function imgOnLoad() {
  //     console.log('er her2')
  //     init()
  //     console.log('er her3')
  //     var tiles = getTiles()
  //     console.log('er her4')
  //     setTiles(tiles)
  //     console.log('er her5')
  //     //drawTiles(tiles)
  //   }

  function init(image: HTMLImageElement) {
    console.log('hva skjer')

    //check how many full tiles we can fit
    //right and bootom sides of the image will get cropped
    tileCountX = ~~(imgW / tileDim)
    tileCountY = ~~(imgH / tileDim)

    if (!ctx) {
      console.log('ctx is undefined')
      return
    }
    console.log(imgW, imgH)
    ctx.drawImage(image, 0, 0)
    imgData = ctx.getImageData(0, 0, imgW, imgH).data
    ctx.clearRect(0, 0, w, h)
  }

  //get imgdata index from img px positions
  function indexX(x: number) {
    var i = x * 4
    if (i > imgData.length) console.warn('X out of bounds')
    return i
  }
  function indexY(y: number) {
    var i = imgW * 4 * y
    if (i > imgData.length) console.warn('Y out of bounds')
    return i
  }
  function getIndex(x: number, y: number) {
    var i = indexX(x) + indexY(y)
    if (i > imgData.length) console.warn('XY out of bounds')
    return i
  }

  //get a tile of size tileDim x tileDim from position xy
  function getTile(x: number, y: number) {
    var slice: number[] = []
    //loop over rows
    for (var i = 0; i < tileDim; i++) {
      //slice origianl image from x to x + tileDim, concat
      slice.push(
        ...imgData.slice(getIndex(x, y + i), getIndex(x + tileDim, y + i))
      )
    }
    //convert back to typed array and to imgData objet
    const tile = new ImageData(new Uint8ClampedArray(slice), tileDim, tileDim)
    //save original position
    originalPosX.push(x)
    originalPosY.push(y)
    //tile.x = x
    //tile.y = y
    return tile
  }

  //generate all tiles
  function getTiles() {
    var tiles: ImageData[] = []
    for (var yi = 0; yi < tileCountY; yi++) {
      for (var xi = 0; xi < tileCountX; xi++) {
        tiles.push(getTile(xi * tileDim, yi * tileDim))
      }
    }
    return tiles
  }

  function drawTiles(tiles: ImageData[], ctx: CanvasRenderingContext2D) {
    tiles.forEach(
      (
        d,
        i //ctx2?.putImageData(d, d.width * 1.1, d.height * 1.1)
      ) => ctx?.putImageData(d, originalPosX[i], originalPosY[i])
    )
  }

  useEffect(() => {
    if (!image) {
      console.log('image does not exist')
      return
    }
    console.log(image.height)
    console.log(image.naturalHeight)
    imgW = image.naturalWidth
    imgH = image.naturalHeight
    console.log(image?.naturalHeight)
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('canvas does not exist')
      return
    }
    canvas.width = 512
    canvas.height = 256
    const contex = canvas.getContext('2d')
    if (!contex) {
      console.log('context does not exist')
      return
    }

    init(image)
    console.log('er her3')
    var tiles = getTiles()
    console.log('er her4')
    setTiles(tiles)

    drawTiles(tiles, contex)
  }, [drawTiles])

  return (
    <div>
      <Canvas ref={canvasRef} />
    </div>
  )
}
export default SplitImage
