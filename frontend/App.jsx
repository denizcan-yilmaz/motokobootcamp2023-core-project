import React, { useEffect, useState } from "react"
import logo from "./assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectDialog, Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
import "bootstrap/dist/css/bootstrap.min.css"
import NavigationBar from "./components/NavigationBar"
import { useBalance, useWallet } from "@connect2ic/react"

/*
 * Import canister definitions like this:
 */
// import * as counter from "../.dfx/local/canisters/counter"
import * as backendDAO from "../.dfx/local/canisters/backendDAO"
import * as webPage from "../.dfx/local/canisters/webPage"

/*
 * Some examples to get you started
 */
// import { Counter } from "./components/Counter"
import { AllProposals } from "./components/AllProposals"
import HomePage from "./components/HomePage"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import NewProposal from "./components/NewProposal"

function App() {
  const [wallet] = useWallet()
  const [assets] = useBalance()
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    document.title = "DAO"
  }, [])

  return (
    <BrowserRouter>
      <NavigationBar wallet={wallet} assets={assets} />
      <div className="App">
        <ConnectDialog />
      </div>

      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {wallet && (
          <Route path="/proposals" exact>
            <AllProposals isTouched={isTouched} setIsTouched={setIsTouched} />
          </Route>
        )}
        {wallet && (
          <Route path="/new-proposal" exact>
            <div className="d-flex aligns-items-center justify-content-center">
              <NewProposal isTouched={isTouched} setIsTouched={setIsTouched} />
            </div>
          </Route>
        )}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

const client = createClient({
  canisters: {
    backendDAO,
    webPage,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
