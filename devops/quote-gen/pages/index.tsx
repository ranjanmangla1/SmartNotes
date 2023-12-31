import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { GradientBackgroundComp } from '@/components/QuoteGenerator/QuoteGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>Quote Generator</title>
        <meta name="description" content="A side project to generate inspirational quotes, uisng NextJS, AWS Lambda, NodeJS, Graphql, DynamoDB, AWS Amplify." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GradientBackgroundComp />
      {/* <GradientBackgroundComp /> */}
      {/* <main className={`${styles.main}`}> */}
        {/* <h1 style={{"textAlign": "center", "fontFamily": "sans-serif", "fontSize": "4rem", "fontWeight": "800"}}>Inspirational Quote Generator</h1> */}
      {/* </main> */}
    </>
  )
}
