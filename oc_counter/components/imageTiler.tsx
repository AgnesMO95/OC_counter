const ImageTile = (
  numColsToCut: number,
  numRowsToCut: number,
  widthOfOnePiece: number,
  heightOfOnePiece: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) => {
  var image = new Image()
  image.onload = cutImageUp
  image.src = image.src

  function cutImageUp() {
    var imagePieces = []
    for (var x = 0; x < numColsToCut; ++x) {
      for (var y = 0; y < numRowsToCut; ++y) {
        var canvas = document.createElement('canvas')
        canvas.width = widthOfOnePiece
        canvas.height = heightOfOnePiece
        var context = canvas.getContext('2d')
        context?.drawImage(
          image,
          x * widthOfOnePiece,
          y * heightOfOnePiece,
          widthOfOnePiece,
          heightOfOnePiece,
          0,
          0,
          canvas.width,
          canvas.height
        )
        imagePieces.push(canvas.toDataURL())
      }
    }

    // imagePieces now contains data urls of all the pieces of the image

    // load one piece onto the page
    var anImageElement = document.getElementById('myImageElementInTheDom')
    image.src = imagePieces[0]
  }
  return <div></div>
}

export default ImageTile
