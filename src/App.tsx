import { FC, useEffect, useState } from 'react'
import reactlogo from './assets/images/logo.png'
import './assets/styles/app.css'
import './assets/styles/app.scss'

const App: FC = () => {
  const [fullname, setFullname] = useState('TuTran')

  useEffect(() => {
    const time = setTimeout(() => {
      setFullname('DEVTuTran')
    }, 10000)
    return clearTimeout(time)
  }, [])
  return (
    <div>
      <img src={reactlogo} alt='React Logo' width={100} height={100} />
      <h1>{fullname}</h1>
      <h2> {process.env.APP_AUTHOR}</h2>
    </div>
  )
}

export default App
