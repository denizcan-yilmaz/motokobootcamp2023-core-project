import React, { useState } from "react"
import { useCanister } from "@connect2ic/react"
import { Button } from "react-bootstrap"

const NewProposal = () => {
  const [proposal, setProposal] = useState(null)
  const [backendDAO] = useCanister("backendDAO")

  const proposalHandler = async () => {
    try {
      await backendDAO.submit_proposal(proposal)
      console.log("Sent proposal")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="container text-center my-5">
      <h2>Submit a Proposal</h2>
      <input
        type="text"
        placeholder="Enter a new proposal"
        onChange={(e) => setProposal(e.target.value)}
      />
      <div className="container d-flex justify-content-center">
        <div className="row my-2 w-25">
          <div className="col">
            <Button
              className="btn btn-dark text-light"
              onClick={proposalHandler}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProposal
