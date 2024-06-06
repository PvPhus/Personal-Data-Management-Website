import React from 'react'
import { BrowserRouter as Router, Routes, Route, RouteProps } from 'react-router-dom'
import {Login} from '../pages/Account'

export const PrivateRoute = ({children, ...rest}: RouteProps): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route {...rest} element={false ? children : <Login />}></Route>
      </Routes>
    </Router>
  )
}
