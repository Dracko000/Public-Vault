"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x1164E0Cc1621E91748aA9199Cfc3f322A970Df4d" // ganti dengan alamat kontrakmu
const ABI = [
  "function sponsor(address user, uint256 amount) external",
  "function getBalance() external view returns (uint256)",
]

export default function Home() {
  const [provider, setProvider] = useState<any>()
  const [signer, setSigner] = useState<any>()
  const [contract, setContract] = useState<any>()
  const [balance, setBalance] = useState("0")
  const [fundAmount, setFundAmount] = useState("")
  const [sponsorAddress, setSponsorAddress] = useState("")
  const [sponsorAmount, setSponsorAmount] = useState("")

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const prov = new ethers.BrowserProvider(window.ethereum)
        const signer = await prov.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
        setProvider(prov)
        setSigner(signer)
        setContract(contract)
      } else {
        alert("Install MetaMask")
      }
    }
    init()
  }, [])

  const fetchBalance = async () => {
    if (!contract) return
    const bal = await contract.getBalance()
    setBalance(ethers.formatEther(bal))
  }

  const fundVault = async () => {
    if (!signer || !fundAmount) return
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: ethers.parseEther(fundAmount),
    })
    await tx.wait()
    fetchBalance()
  }

  const sponsorUser = async () => {
    if (!contract || !sponsorAddress || !sponsorAmount) return
    const tx = await contract.sponsor(
      sponsorAddress,
      ethers.parseEther(sponsorAmount)
    )
    await tx.wait()
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">RyuKun Vault For Public Fund</h1>
      <h1 className="text-2xl font-bold">Public Gas Sponsor Vault UI</h1>
      <div className="space-y-2">
        <button
          onClick={fetchBalance}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh Vault Balance
        </button>
        <div>Vault Balance: {parseFloat(balance).toString()} ETH</div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Fund Vault</h2>
        <input
          type="text"
          placeholder="Amount in ETH"
          className="border p-2 w-full"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
        />
        <button
          onClick={fundVault}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Fund Vault
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Sponsor User</h2>
        <input
          type="text"
          placeholder="User address"
          className="border p-2 w-full"
          value={sponsorAddress}
          onChange={(e) => setSponsorAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount in ETH"
          className="border p-2 w-full"
          value={sponsorAmount}
          onChange={(e) => setSponsorAmount(e.target.value)}
        />
        <button
          onClick={sponsorUser}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Sponsor
        </button>
      </div>
    </main>
  )
}
