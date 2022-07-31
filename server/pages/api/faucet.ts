import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from "web3"
import Definition from "../../contract/RyoToken.json"

type ResponseData = {
  message: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const {
    FAUCET_PRIVATE_KEY,
    NEXT_PUBLIC_CONTRACT_ADDRESS,
    RPC_URL,
  } = process.env
  const {
    address
  } = req.query

  if (!RPC_URL) {
    res.status(400)
    res.write("RPC URL not set")
    return
  }
  if (!NEXT_PUBLIC_CONTRACT_ADDRESS) {
    res.status(400)
    res.write("Contract address not set")
    return
  }
  if (!FAUCET_PRIVATE_KEY) {
    res.status(400)
    res.write("validator private key is not set.")
    return
  }
  const web3 = new Web3()
  if (!address || Array.isArray(address) || !web3.utils.isAddress(address)) {
    res.status(400)
    res.write("Address is not set or invalid address")
    return
  }
  const faucetAccount = web3.eth.accounts.privateKeyToAccount(FAUCET_PRIVATE_KEY)
  web3.eth.defaultAccount = faucetAccount.address
  web3.eth.setProvider(RPC_URL)
  const contract = new web3.eth.Contract(Definition.abi as any, NEXT_PUBLIC_CONTRACT_ADDRESS)
  await contract.methods.transfer(address, 1).send({ from: faucetAccount.address })
  res.status(200).json({ message: "Success" })
}
