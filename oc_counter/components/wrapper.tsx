import Head from 'next/head'
import { Fragment } from 'react'

const Wrapper = ({ children }: { children: any }) => {
  return (
    <Fragment>
      <Head>
        <title>Nextjs Uploader</title>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/cerulean/bootstrap.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0.300"
          rel="stylesheet"
        />
        <script src=""></script>
      </Head>
    </Fragment>
  )
}

export default Wrapper
