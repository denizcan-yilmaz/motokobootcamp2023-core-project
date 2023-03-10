import React, { useState } from "react"
import { Button } from "react-bootstrap"
import Card from "react-bootstrap/Card"
import ProgressBar from "react-bootstrap/ProgressBar"
import { useCanister } from "@connect2ic/react"

const ProposalCard = ({ item, isTouched, setIsTouched }) => {
  const accept = parseInt(item.acceptedCount) / 100000000
  const reject = parseInt(item.rejectedCount) / 100000000
  const [backendDAO] = useCanister("backendDAO")

  let acceptRatio
  if (accept === 0 && reject === 0) {
    acceptRatio = 50
  } else {
    acceptRatio = parseInt((accept / (accept + reject)) * 100)
  }

  let status

  if (item.isActive) {
    status = "Still Active"
  } else {
    status = "Not Active"
  }

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return (
      [year, month, day].join("-") +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    )
  }

  let creationDate = new Date(+item.creationDate / 1000000)

  let formattedCr = formatDate(creationDate)

  let resultDate = new Date(+item.resultDate / 1000000)

  let formattedRes = item.isActive ? "-" : formatDate(resultDate)

  const acceptHandler = async (proposal) => {
    try {
      const res = await backendDAO.vote(proposal, true)
      console.log(res)
      console.log("Accepted")
      console.log(proposal)
      setIsTouched((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

  const rejectHandler = async (proposal) => {
    try {
      const res = await backendDAO.vote(proposal, false)
      console.log(res)
      console.log("Rejected")
      console.log(proposal)
      setIsTouched((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card className="w-100 child my-2">
      <Card.Body>
        <Card.Title>#{item.proposalId}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Status: {status}
        </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">
          Proposer: {item.ownerOfProposal}
        </Card.Subtitle>
        <Card.Text className="text-center">
          <b>Proposal Text: </b> {item.webPageText}
        </Card.Text>
        <div className="container">
          <div className="row my-2">
            <div className="col">
              <Card.Subtitle className="mb-2 text-muted">
                Accepted: {accept}
              </Card.Subtitle>
            </div>
            <div className="col">
              <Card.Subtitle className="mb-2 text-muted">
                Rejected: {reject}
              </Card.Subtitle>
            </div>
          </div>
        </div>

        <ProgressBar>
          <ProgressBar
            animated
            variant="info"
            now={acceptRatio}
            key={1}
            label={`${acceptRatio}%`}
          />
          <ProgressBar
            animated
            variant="danger"
            now={100 - acceptRatio}
            key={2}
            label={`${100 - acceptRatio}%`}
          />
        </ProgressBar>
        <Card.Text>Proposal Date: {formattedCr}</Card.Text>
        <Card.Text>Result Date: {formattedRes} </Card.Text>
        <div className="container d-flex justify-content-center">
          <div className="row my-2 w-25">
            <div className="col">
              <Button
                className="btn-dark text-light"
                onClick={() => acceptHandler(item.proposalId)}
              >
                Accept
              </Button>
            </div>
            <div className="col">
              <Button
                className="btn-dark text-light"
                onClick={() => rejectHandler(item.proposalId)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProposalCard
