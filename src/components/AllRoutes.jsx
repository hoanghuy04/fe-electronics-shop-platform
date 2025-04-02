import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './../routes/index';

export default function AllRoutes() {
  const elements = useRoutes(routes)

  return (
    <div>
      {elements}
    </div>
  )
}
