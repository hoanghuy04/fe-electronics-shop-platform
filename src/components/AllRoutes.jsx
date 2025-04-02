import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './../routes/index';
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AllRoutes() {
  const elements = useRoutes(routes)

  return (
    <div>
      {elements}
    </div>
  )
}
