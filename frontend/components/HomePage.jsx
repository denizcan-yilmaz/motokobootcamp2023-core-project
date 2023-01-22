import React, { useState } from "react"
import logo from ".././assets/camp_logo.png"

const HomePage = () => {
  return (
    <header className="App-header container w-75">
      <img src={logo} className="App-logo" alt="logo" />
      <p className="slogan">Motoko Bootcamp Core Project - DAO</p>
      <p className="fs-3">by Denizcan Yilmaz - denizcan.yilmaz#7286</p>
    </header>
  )
}

export default HomePage
