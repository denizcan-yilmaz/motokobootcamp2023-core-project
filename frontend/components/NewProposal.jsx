import React, { useState } from "react"
import { useCanister } from "@connect2ic/react"
import { Button } from "react-bootstrap"

const NewProposal = () => {
  const [proposal, setProposal] = useState("")
  const [backendDAO] = useCanister("backendDAO")

  const proposalHandler = async () => {
    try {
      await backendDAO.submit_proposal(proposal)
      console.log("Sent proposal")
      setProposal("")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="container text-center my-5">
      <h2>Submit a Proposal</h2>
      <textarea
        type="text"
        placeholder="Enter a new proposal"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        className="w-75 my-3"
        rows={5}
      />
      <div className="container d-flex justify-content-center">
        <div className="row my-2 w-25">
          <div className="col">
            <Button
              className="btn btn-dark text-light"
              onClick={proposalHandler}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProposal
