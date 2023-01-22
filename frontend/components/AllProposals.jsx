import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import ProposalCard from "./ProposalCard"

const AllProposals = () => {
  const [backendDAO] = useCanister("backendDAO")
  const [allProposals, setAllProposals] = useState([])

  const getAllProposals = async () => {
    const allProps = await backendDAO.get_all_proposals()
    console.log(allProps)
    setAllProposals(allProps.reverse())
  }

  useEffect(() => {
    getAllProposals()
  }, [])

  return (
    <>
      <h3 className="text-center my-3">All Proposals</h3>

      <div className="card-group w-50 mx-auto">
        {allProposals.map((item, index) => {
          return (
            <div className="container parent">
              <ProposalCard item={item} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export { AllProposals }
