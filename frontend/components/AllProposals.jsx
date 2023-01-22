import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import ProposalCard from "./ProposalCard"
import Pagination from "react-bootstrap/Pagination"

const AllProposals = () => {
  const [backendDAO] = useCanister("backendDAO")
  const [allProposals, setAllProposals] = useState([])
  const [active, setActive] = useState(1)
  const [slice, setSlice] = useState([])
  const [PagItems, setPagItems] = useState([])

  function id_compare(a, b) {
    return a.proposalId - b.proposalId
  }

  const getAllProposals = async () => {
    const allProps = await backendDAO.get_all_proposals()
    allProps.sort(id_compare)
    console.log(allProps)
    setAllProposals(allProps.reverse())
    const slice = allProps.slice((active - 1) * 4, active * 4)
    console.log("slice: ", slice)
    setSlice(slice)
    const elemNum = allProps.length
    let items = []
    for (let i = 1; i < elemNum / 4 + 1; i++) {
      items.push(
        <Pagination.Item
          className="custom-pagination-item"
          key={i}
          active={i === active}
          onClick={(e) => {
            setActive(i)
            console.log(i)
          }}
        >
          {i}
        </Pagination.Item>,
      )
    }
    setPagItems(items)
  }

  useEffect(() => {
    getAllProposals()
  }, [active])

  return (
    <>
      <h2 className="text-center mt-5">All Proposals</h2>

      <div className="card-group w-50 mx-auto">
        {slice.map((item, index) => {
          return (
            <div className="container" key={index}>
              <ProposalCard item={item} />
            </div>
          )
        })}
        <div className="mx-auto d-block">
          <Pagination>{PagItems}</Pagination>
        </div>
        <br />
      </div>
    </>
  )
}

export { AllProposals }
