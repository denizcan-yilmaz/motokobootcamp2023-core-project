import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useCanister } from "@connect2ic/react"

const Vote = () => {
  const [backendDAO] = useCanister("backendDAO")
  const [allProposals, setAllProposals] = useState([])
  const [proposal, setProposal] = useState(null)

  const getAllProposals = async () => {
    const allProps = await backendDAO.get_all_proposals()
    console.log(allProps)
    setAllProposals(allProps.reverse())
  }

  const acceptHandler = async () => {
    try {
      await backendDAO.vote(proposal, true)
      console.log("Accepted")
    } catch (error) {
      console.log(error)
    }
  }
  const rejectHandler = async (proposal) => {}

  useEffect(() => {
    getAllProposals()
  }, [])

  return (
    <div className="container text-center my-5">
      <h2>Vote for a Proposal</h2>
      <input
        type="text"
        placeholder="Enter a proposal Id"
        onChange={(e) => setProposal(e.target.value)}
      />
      <p>{proposal}</p>
      <div className="container d-flex justify-content-center">
        <div className="row my-2 w-25">
          <div className="col">
            <Button className="btn-dark text-light" onClick={acceptHandler}>
              Accept
            </Button>
          </div>
          <div className="col">
            <Button className="btn-dark text-light">Reject</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vote
