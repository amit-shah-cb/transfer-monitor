This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Dev Notes:

1. Setup OZ Defender
    1. Create relay
    2. Click gear and set api key + secret
    3. Fund relay address
2. Launch NFTs on Thirdweb 
    1. setup Edition Drop
    2. Create NFTs for collection
    3. Set Claim only by owner
    4. Claim N copies to Relay Address of each NFT you want to distribute
3. Setup Vercel Project
4. Setup tenderly 
    1. Create erc20 transfer alert on address of interest as to address and ERC20 contract address
    2. Set the web hook to the vercel domain and hook endpoint

Integration Gotchas
-have to import { Lambda } from 'aws-sdk'; because of lazy build on nextjs !! its a workaround to work with oz defender
-had to deploy my own ERC20 bc there is no faucet on base ... 
-cannot set claimable easily ! Have to have the wallet connectable so can easily use oz defender on our won
-using OZ defender with Thirdweb SDK results in huge latency which times out vercel server less (> 10sec) 
-cannot use third web sdk to populate transaction ! Always signs on prepare() + populateTransaction call
	-workaround: get ABI from third web dashboard
	-use ethers to create contract with ABI
	-call ethers populate transaction
	-use defender relay to relay.sendTransaction
		-this is the correct way as the sendTransaction only waits for relayer to sign, not tx to be mined


Some On Chain Things:

https://testnets.opensea.io/collection/fordummy
Test Collection: https://goerli.basescan.org/address/0x86e90dce3dc3e201546bd4e5f5ae2b7c28c9a080
Dummy Token: https://goerli.basescan.org/address/0xcb0b29999f1ec513992509625ff69655f667330a
Relayer: 0x6b2bc7a4e217549936ae28b9121ee6e06a207381


