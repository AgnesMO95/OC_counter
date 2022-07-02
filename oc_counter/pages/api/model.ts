// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import model from '../../public/model/model.json'
const fsp = require('fs').promises

type Data = {
  name: string
}

export default async function modelAPI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //const file_data = await fsp.readFile('model/model.json')
  //const json_data = JSON.parse(file_data)
  //res.status(200).json(json_data)
  res.status(200).send(model)
  //res.send('../../public/model.json')
}
