import type { NextPage } from 'next'
import styled, { AnyStyledComponent } from 'styled-components'
import BasicLayout from '../components/layout/Basic'
import FileInput, { Result } from 'react-file-reader-input'
import { useEffect, useState, useRef } from 'react'

/* Redux */
import { connect } from 'react-redux'
import { uploadAction, sendAction } from '../store/actions/mediaAction'
import { ActionTypes } from '../store/types'
import { Button } from 'react-bootstrap'
import { addFileToList } from '../store/ducks/media'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../store/store'

import * as tf from '@tensorflow/tfjs'

import SplitImage from '../components/splitImage'

const Title = styled.h1`
  color: red;
  position: center;
`

const UploadCover = styled.div`
  display: grid;
  height: 80vh;
  width: 50%;
  margin: auto;
  //background-color: #d439b2;
  background-color: #f5f6fa;
  padding: 15.5px;
  border-radius: 8px;
  grid-template-rows: 30% 65% 5%;

  @media screen and(max-width: 768px) {
    width: 99%;
    height: 100vh;
  }

  /*.UploadTop {
    height: 60%;
    border: 2px solid #c2cdda;
    width: 100%;
    border-style: dashed;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
    cursor: pointer;
  }*/
`
const UploadTop = styled.div`
  height: 80%;
  border: 2px solid #c2cdda;
  width: 100%;
  border-style: dashed;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  cursor: pointer;
  //background-color: #d46539;
`
const UploadBottom = styled.div`
  height: 95%;
  width: 100%;
  overflow-y: scroll;
  //background-color: #c7eb48;

  /*.Lists {
    height: ;
  }*/
`
const Lists = styled.div`
  //background-color: #cc3ab9;
  //height: 500px;
  //display: flex;
  //align-items: center;
  //justify-content: space-between;
  //flex-wrap: wrap;
`
const Boxes = styled.div`
  display: flex;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
  padding-top: 1.2em;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  //background-color: #39cfd4;
`
const Box = styled.div`
  //width: 18vw; //height: 1.2em;
  //height: auto;
  margin: 0.5vw;
  //background-color: #64e24b;
`
const SendButton = styled.div`
  color: white;
  height: 100%;
  //background-color: #d4d4d4;
  width: auto;
  cursor: pointer;
  font-family: 'Source Sans Pro', sans-serif;
  outline: none;
`
const CardImage = styled.img`
  //grid-area: img;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  position: absolute;
  //left: 0;
  //right: 0;
  width: 416px;
  height: 416px;
  z-index: 8;
  //object-fit: scale-down;
  //width: 100%;
  //height: auto;
  border-radius: 5px 5px 5px 5px;
`
const Canvas = styled.canvas`
  position: absolute;
  //marginLeft: 'auto';
  //marginRight: 'auto';
  //left: 0;
  //right: 0;
  z-index: 9;
  // textAlign: 'center';
  //zIndex: 8;
  width: 416px;
  height: 416px;

  //background-color: yellow;
`
// Typescript
/**
 * interface Props {
 *  name: string
 *  uploadAction: typeof actions.uploadAction
 * }
 *
 */

//import model from '../components/model''file://pages/api/model/model.json' //
const WEIGHTS = '/model/model.json' //process.env.PUBLIC_URL + '/model.json' //'http://localhost:3000/api/model/model.json' //'https://storage.googleapis.com/yolo-oc-model2/model.json' //'../components/model/model.json'  'https://storage.cloud.google.com/yolo-oc-model2/model.json' //http://storage.googleapis.com/yolo_oc_model/model.json'

const Home: NextPage = (): JSX.Element => {
  const mediaFiles = useSelector<AppState, File[]>(
    state => state.media.fileList
  )
  const dispatch = useDispatch()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    results: Result[]
  ): void => {
    console.log('her')
    results.forEach((res: [ProgressEvent, File]) => {
      const [e, file] = res
      dispatch(addFileToList(file))
      console.log(e)
      //var dimensions = sizeOf(file)
      //console.log(dimensions.width, dimensions.height)
    })
    console.log(mediaFiles)
  }

  const [model, setModel] = useState<tf.GraphModel | null>(null) //mobilenet.MobileNet  | automl.ObjectDetectionModel
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState<number | null>(null)
  const [shouldTile, setShouldTile] = useState<boolean>(false)
  /* 
  model: tf.Model;
  predictions: any; */

  //Load model method
  const loadModel = async () => {
    const model = await tf.loadGraphModel(WEIGHTS)

    setModel(model)
  }
  useEffect(() => {
    loadModel()
  }, [])

  const cropImage = (img: tf.Tensor3D) => {
    const size = Math.min(img.shape[0], img.shape[1])
    const centerHeight = img.shape[0] / 2
    const beginHeight = centerHeight - size / 2
    const centerWidth = img.shape[1] / 2
    const beginWidth = centerWidth - size / 2
    return img.slice([beginHeight, beginWidth, 0], [size, size, 3])
  }

  //make file to ImageData instead
  const predict = async (imageData: HTMLImageElement, model: tf.GraphModel) => {
    console.log(model)
    var imageHeight = imageData.height

    var image = imageRef.current
    var canvas = canvasRef.current
    console.log(image?.height)

    if (image) {
      const newImg = new Image(image.naturalWidth, image.naturalHeight)
      newImg.src = image.src

      const img = tf.browser.fromPixels(image, 3)

      console.log('Bilde')

      const tfimg = img.transpose([0, 1, 2]).expandDims()

      const resized = img.cast('float32').expandDims(0) //tf.image.resizeBilinear(img, [416, 416]) //.cast('float32').expandDims(0)
      const batchedImage = resized.div(tf.scalar(255))

      const input = img.expandDims(0)
      const input2 = input.toFloat().div(tf.scalar(255))
      const obj = await model.executeAsync(input2)

      if (obj instanceof tf.Tensor) {
        console.log('heer')
        console.log(obj.shape)
        let convDims = obj.shape.slice(1, 3)

        var boxes = new Array() as number[]
        var pred = new Array() as number[]

        const getBoxesAndPred = (
          arr: Uint8Array | Float32Array | Int32Array
        ) => {
          for (let index = 0; index < arr.length; index++) {
            if ((index + 1) % 5 == 0) {
              pred.push(arr[index])
            } else {
              boxes.push(arr[index])
            }
          }
        }

        getBoxesAndPred(obj.dataSync())
        const tensor = tf.tensor2d(boxes, [boxes.length / 4, 4])

        console.log(boxes, pred)
        const selected_indices = tf.image.nonMaxSuppression(
          tensor,
          pred,
          5,
          0.5,
          0.26
        )
        const selected_boxes = tf.gather(tensor, selected_indices)
        console.log(selected_indices.arraySync())
        console.log(selected_boxes.arraySync())
        const scores = selected_indices.arraySync().map(i => pred[i])
        boxes = selected_boxes.arraySync()
        setCount(boxes.length)

        if (canvas) {
          canvas.width = image?.width
          canvas.height = image?.height
          console.log('canvas')
          const ctx = canvas.getContext('2d')
          if (ctx) {
            requestAnimationFrame(() => {
              drawRect(boxes, scores, 0.2, image?.width, image?.height, ctx)
            })
          }
        }
      } else {
        console.log('dette er den andre ')
        console.log(obj[0].dataSync())
      }

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(obj)
    }
  }

  const drawRect = (
    boxes: any,
    //classes: any,
    scores: number[],
    threshold: number,
    imgWidth: number,
    imgHeight: number,
    ctx: CanvasRenderingContext2D //canvas
  ) => {
    console.log('drawrect')
    console.log(boxes.length)
    console.log(scores)
    for (let i = 0; i < boxes.length; i++) {
      console.log('for loop')
      if (boxes[i] && scores[i] > threshold) {
        console.log('draw')
        //ensure valid detection
        //set variables
        console.log(boxes[i])
        const [y, x, height, width] = boxes[i]
        const text = 'Osteoclast'

        //set styling
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 5
        ctx.fillStyle = 'black'
        ctx.font = '20px Arial'
        console.log(canvasRef.current?.width, canvasRef.current?.height)
        console.log(imgHeight)
        //draw
        ctx.beginPath()
        ctx.fillText(
          text + ' - ' + Math.round(scores[i] * 100) / 100,
          x * imgWidth,
          y * imgHeight - 10
        )
        console.log(x, y, width, height)
        console.log([
          x * imgWidth,
          y * imgHeight,
          width * imgWidth, // / 2
          height * imgHeight,
        ])
        console.log([
          x * imgWidth,
          y * imgHeight,
          width * (imgWidth / 2), // / 2
          height * (imgHeight / 1.5),
        ])
        //convert from % to px
        ctx.rect(
          x * imgWidth,
          y * imgHeight,
          width * imgWidth - x * imgWidth, // width of rect
          height * imgHeight - y * imgHeight
        )
        ctx.stroke()
      }
    }
  }

  const detect = async () => {
    const image = mediaFiles[0] //funker ikke med predict
    var url = URL.createObjectURL(image)
    const im = new Image()
    im.src = url
    if (model) {
      predict(im, model)
    }
  }
  /*
  we need to think about memory management, want to avoid memory leaks in our client side app 
  const predict = (imageData: ImageData)=> {
    can run all our code inside tensorflow tidy method, makes sure all our tensor are released from memory when the prediction is finished 
    const pred = await tf.tidy(() => {
      the actual image data we want comes from the html canvas, that we are extracting as the imagedata type (can pass in a variety of types here), convert the image into a tensor that can be used in the tensorflowgraph
      let img = tf.fromPixels(imageData);

      need to reshape our data into the shape it was trained with 
      first value is the batchsize (how many images), then the pixels (28x28) and in the end how many color channels 
      img = img.reshape([1, 28, 28, 1])

      Tensorflow requires it to be a float type, convert it if its integer
      img = tf.cast(img, 'float32') 

      when we have our data in the correct format we can just pass it into the model and then just call predict 
      const output = this.model.predict(img) as any; 

      it returns the prediction as an tensor, convert it to an array called dataSync
      this.prediction = Array.from(output.dataSync());

    })

  }
  */
  //<img src="/upload.svg" />
  return (
    <BasicLayout>
      <Title> OC Counter </Title>
      <UploadCover>
        <UploadTop>
          <FileInput
            as="binary"
            onChange={handleChange}
            multiple={true}
            style={{ width: '100%', height: '100%' }}
          ></FileInput>
        </UploadTop>
        <UploadBottom>
          {count && <h3>Number of OCs: {count}</h3>}
          <Lists>
            <Boxes>
              {mediaFiles.map((file: File) => (
                <Box key={file.name}>
                  <CardImage src={URL.createObjectURL(file)} ref={imageRef} />
                  <Canvas ref={canvasRef} />
                </Box>
              ))}
            </Boxes>
            {shouldTile && (
              <SplitImage
                inputCanvas={canvasRef.current}
                image={imageRef.current}
              />
            )}
          </Lists>
        </UploadBottom>
        <SendButton>
          <Button
            onClick={() =>
              canvasRef.current && imageRef.current
                ? setShouldTile(true)
                : setShouldTile(false)
            }
          >
            Tile
          </Button>
          <Button onClick={() => detect()}>Send</Button>
        </SendButton>
      </UploadCover>
    </BasicLayout>
  )
}

const mapStateToProps = (state: any) => ({
  media: state.media,
})

//export default Home
export default connect(mapStateToProps, { uploadAction, sendAction })(Home)
