import type { NextPage } from 'next'
import styled from 'styled-components'
import BasicLayout from '../layout/Basic'
//import FileInput, { Result } from 'react-file-reader-input'
import FileInput, { Result } from 'react-file-reader-input'
import { useEffect, useState, useRef } from 'react'
//var sizeOf = require('image-size')

/* Redux */
import { connect } from 'react-redux'
import { uploadAction, sendAction } from '../store/actions/mediaAction'
import { ActionTypes } from '../store/types'
import { Button } from 'react-bootstrap'
import { addFileToList } from '../store/ducks/media'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../store/store'

import * as tf from '@tensorflow/tfjs'
//const tfn = require('@tensorflow/tfjs-node')
import modelAPI from './api/model'
import { blob } from 'node:stream/consumers'

const Title = styled.h1`
  color: red;
  position: center;
`

const UploadCover = styled.div`
  display: grid;
  height: 80vh;
  width: 50%;
  margin: auto;
  background-color: #d439b2;
  //background-color: #f5f6fa;
  padding: 15.5px;
  border-radius: 8px;
  grid-template-rows: 60% 40% 5%;

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
  height: 60%;
  border: 2px solid #c2cdda;
  width: 100%;
  border-style: dashed;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  cursor: pointer;
  background-color: #d46539;
`
const UploadBottom = styled.div`
  height: 30%;
  width: 100%;
  overflow-y: scroll;
  background-color: #c7eb48;

  /*.Lists {
    height: ;
  }*/
`
const Lists = styled.div`
  background-color: #cc3ab9;
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
  justify-content: space-around;
  flex-wrap: wrap;
  background-color: #39cfd4;
`
const Box = styled.div`
  width: 18vw; //height: 1.2em;
  height: auto;
  margin: 0.5vw;
  background-color: #64e24b;
`
const SendButton = styled.div`
  color: white;
  height: 10%;
  background-color: #607878;
  height: auto;
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
  //width: 116px;
  //height: 107px;
  //object-fit: scale-down;
  //width: 100%;
  //height: auto;
  border-radius: 5px 5px 5px 5px;
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

  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  /* 
  model: tf.Model;
  predictions: any; */

  //Load model method
  const loadModel = async () => {
    //const handler = tfn.io.fileSystem('../public/model.json')
    const model = await tf.loadGraphModel(WEIGHTS)
    console.log(model)
    setModel(model)
  }
  useEffect(() => {
    loadModel()
  }, [])

  //make file to ImageData instead
  const predict = async (imageData: HTMLImageElement, net: tf.GraphModel) => {
    var imageHeight = imageData.height
    console.log(imageHeight)
    imageHeight = imageData.clientHeight
    console.log(imageHeight)
    imageHeight = imageData.offsetHeight
    console.log(imageHeight)
    imageHeight = imageData.naturalHeight
    console.log(imageHeight)
    var image = imageRef.current
    if (image) {
      const newImg = new Image(image.naturalWidth, image.naturalHeight)
      newImg.src = image.src
      console.log(image.height)
      console.log(image.clientHeight)
      console.log(image.offsetHeight)
      console.log(image.scrollHeight)
      console.log(image.naturalHeight)
      console.log(image.width)
      console.log(image.clientWidth)
      console.log(image.offsetWidth)
      console.log(image.scrollWidth)
      console.log(image.naturalWidth)
      //image.width = image.naturalWidth
      //image.height = image.naturalHeight
      const img = tf.browser.fromPixels(newImg)
      console.log(img.shape)
      console.log(img.size)
      const resized = tf.image
        .resizeBilinear(img, [416, 416])
        .cast('float32')
        .expandDims(0)
      const obj = await net.executeAsync(resized)
      console.log(obj)

      //delete any existing tensors
      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(obj)
    }
  }

  const detect = async () => {
    const image = mediaFiles[0]
    console.log(image)
    var url = URL.createObjectURL(image)
    const im = new Image()
    im.src = url
    console.log(im.width)
    console.log(im.naturalWidth)
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
          >
            <img src="/upload.svg" />
          </FileInput>
        </UploadTop>
        <UploadBottom>
          <Lists>
            <Boxes>
              {mediaFiles.map((file: File) => (
                <Box key={file.name}>
                  <CardImage
                    src={URL.createObjectURL(file)}
                    ref={imageRef}
                    width={416}
                    height={416}
                  />
                </Box>
              ))}
            </Boxes>
          </Lists>
        </UploadBottom>
        <SendButton>
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
