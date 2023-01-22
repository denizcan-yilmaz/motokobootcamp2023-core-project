import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { ConnectButton } from "@connect2ic/react"
import React from "react"
import { NavLink } from "react-router-dom"

const NavigationBar = ({ wallet }) => {
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
                  to="/vote"
                  className="non-active"
                  style={{ textDecoration: "none" }}
                >
                  Vote
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
              <Nav.Link>Please authenticate to see the content of DAO</Nav.Link>
            </Nav>
          )}
          <ConnectButton className="bg-dark" />
        </Container>
      </Navbar>
      <br />
    </>
  )
}

export default NavigationBar
