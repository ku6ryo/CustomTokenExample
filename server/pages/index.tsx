import type { NextPage } from 'next'
import axios from 'axios'
import Definition from "../contract/RyoToken.json"
import Web3 from "web3"
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

const Home: NextPage = () => {

  const [balance, setBalance] = useState("")
  const [initializing, setInitializing] = useState(true)
  const [receiverAddress, setReceiverAddress] = useState("")

  useEffect(() => {
    ;(async () => {
      await updateBalance()
      setInitializing(false)
    })()
  }, [])

  const updateBalance = async () => {
    const { NEXT_PUBLIC_CONTRACT_ADDRESS } = process.env
    if (window.ethereum && NEXT_PUBLIC_CONTRACT_ADDRESS) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      const account = accounts[0]
      const web3 = new Web3(window.ethereum)
      const contract = new web3.eth.Contract(Definition.abi as any, NEXT_PUBLIC_CONTRACT_ADDRESS)
      console.log(contract)
      const balance = await contract.methods.balanceOf(account).call({ from: account })
      setBalance(balance)
      setInitializing(false)
    }
  }

  const faucet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        const account = accounts[0]
        await axios.get("/api/faucet?address=" + account)
        await updateBalance()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const send = async () => {
    const { NEXT_PUBLIC_CONTRACT_ADDRESS } = process.env
    if (window.ethereum && NEXT_PUBLIC_CONTRACT_ADDRESS) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })
      const account = accounts[0]
      const web3 = new Web3(window.ethereum)
      const contract = new web3.eth.Contract(Definition.abi as any, NEXT_PUBLIC_CONTRACT_ADDRESS)
      const nonce = await web3.eth.getTransactionCount(account)
      await contract.methods.transfer(receiverAddress, 1).send({ from: account, nonce })
      await updateBalance()
    }
  }

  if (initializing) {
    return <div>initializing</div>
  }

  return (
    <>
      <div>balance: {balance}</div>
      <div><input placeholder='send to' value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)}/></div>
      <div><button onClick={send}>SEND</button></div>
      <div><button onClick={faucet}>FAUCET</button></div>
      <div><button onClick={updateBalance}>UPDATE BALANCE</button></div>
    </>
  )
}

export default Home
