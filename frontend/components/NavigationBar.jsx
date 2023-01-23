import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { ConnectButton } from "@connect2ic/react"
import React from "react"
import { NavLink } from "react-router-dom"

const NavigationBar = ({ wallet, assets }) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="py-4 sticky-top">
        <Container>
          <Navbar.Brand>
            <NavLink
              to="/"
              className="ml-auto font-weight-bold text-light navBrand"
              style={{ textDecoration: "none" }}
            >
              Motoko Bootcamp DAO
            </NavLink>
          </Navbar.Brand>
          {wallet && (
            <Nav className="me-auto">
              <Nav.Link>
                <NavLink
                  activeClassName="is-active"
                  to="/proposals"
                  className="non-active"
                  style={{ textDecoration: "none" }}
                >
                  View All Proposals
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  activeClassName="is-active"
                  to="/new-proposal"
                  className="non-active"
                  style={{ textDecoration: "none" }}
                >
                  New Proposal
                </NavLink>
              </Nav.Link>
            </Nav>
          )}

          {!wallet && (
            <Nav className="me-auto">
              <Nav.Link>
                Please authenticate to see the content of the DAO
              </Nav.Link>
            </Nav>
          )}
          {wallet && (
            <Nav.Link className="mx-3 text-light">
              Welcome{" "}
              <i>
                {wallet?.principal?.slice(0, 5)}...
                {wallet?.principal?.slice(-5, wallet?.principal?.length)}
              </i>
            </Nav.Link>
          )}
          <ConnectButton style={{ backgroundColor: "white", color: "black" }} />
        </Container>
      </Navbar>
      {/* <button onClick={console.log(wallet, assets)}>click</button> */}
      <br />
    </>
  )
}

export default NavigationBar
