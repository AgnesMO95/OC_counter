import type { NextApiRequest, NextApiResponse } from 'next'
/*//import group from '../../components/model/group1'

type Data = {
  name: string
}

export default async function modelAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var reader = new FileReader()
  const blob = reader.readAsText('../components/model/group1-shard1of61.bin')
  reader.readAsBinaryString(blob)
  //const file_data = await fsp.readFile('model/model.json')
  //const json_data = JSON.parse(file_data)
  //res.status(200).json(json_data)
  res.status(200).send()
  //res.send('../../public/model.json')
}*/

import fs from 'fs'
import path from 'path'

export default async function modelAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dirRelativeToPublicFolder = 'model'

  const dir = path.resolve('./public/', dirRelativeToPublicFolder)
  console.log(dir)
  const filenames = fs.readdirSync(dir)
  console.log(filenames)

  const images = filenames
    .map(name => path.join('/', dir, name))
    .filter(name => name.endsWith('.bin'))

  res.statusCode = 200
  res.send(images)
}
