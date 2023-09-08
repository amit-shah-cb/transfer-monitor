import { NextResponse,NextRequest } from 'next/server'
import { SmartContract, ThirdwebSDK} from "@thirdweb-dev/sdk";
import { EthersWallet } from "@thirdweb-dev/wallets";
import { ethers } from 'ethers';





export async function POST(req:NextRequest) {  
  /*
  {
  id: '7c6f5040-a376-4fa5-b5d0-51928866d007',
  event_type: 'ALERT',
  transaction: {
    network: '84531',
    block_hash: '0x08f71ff83628a94cd91b8b1ab480bc3cb4a559cd06fd5489e36e06ff29c9d7a5',
    block_number: 9474421,
    hash: '0x4a2d9212cbc7d5187eefd4b8d6f6208b75d08bbde95b90a512c02f121d95f60a',
    from: '0x69bAdF095B03d62e97445EB0142e6488d19fF38B',
    to: '0xCB0B29999f1EC513992509625FF69655f667330A',
    logs: [ [Object] ],
    input: '0xa9059cbb0000000000000000000000004c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d500000000000000000000000000000000000000000000003635c9adc5dea00000',
    value: '0x0',
    nonce: '0x17',
    gas: '0x13aa4',
    gas_used: '0xf968',
    cumulative_gas_used: '0x1b381',
    gas_price: '0x5f5e132',
    gas_tip_cap: '0x5f5e100',
    gas_fee_cap: '0x5f5e139'
  }
}
*/
  const data = await req.json()
  console.log(JSON.stringify(data));
  return NextResponse.json({});

  // let wallet = (ethers.Wallet.fromMnemonic(process.env.MNEMONIC as string));
  // wallet=  wallet.connect(new ethers.providers.JsonRpcProvider(process.env.PROVIDER))
  // console.log("loaded wallet:",await wallet.getAddress(), "balance:", await wallet.getBalance());

 
  // const sdk = ThirdwebSDK.fromSigner(wallet, process.env.CHAIN as string, {   
  //   secretKey:process.env.THIRD_WEB_SECRET as string,
  // });

  // const contract  = await sdk.getContract(process.env.ERC1155_CONTRACT_ADDRESS as string);

  // console.log("loaded contract:",await contract.getAddress());
  // // Address of the wallet you want to send the NFT to
  // const toAddress = wallet.address;
  // const tokenId = 3; // The token ID of the NFT you want to send
  // const amount = 1; // How many copies of the NFTs to transfer

 
  // const tx = await contract.erc1155.claimTo(toAddress, tokenId, amount);
  // console.log(tx)

  // return NextResponse.json(tx)
}