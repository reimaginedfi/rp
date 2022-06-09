// const Client = () => {
//   const { data: account } = useAccount();
//   // const { data: farmer } = useContractRead(vault, "farmer");
//   // const shouldShowAdmin =
//   //   farmer && account && farmer.toString() == account.address;
//   const isWalletConnected = account?.address;
//   return (
//     <>
//       <ConnectButton.Custom>
//         {({
//           account,
//           chain,
//           openAccountModal,
//           openChainModal,
//           openConnectModal,
//           mounted,
//         }) => {
//           if (!mounted || !account || !chain) {
//             return (
//               <Text
//                 as="button"
//                 onClick={() => openConnectModal()}
//                 width={"fit-content"}
//               >
//                 // <InlineButton color={"blue"}>[connect wallet]</InlineButton>
//               </Text>
//             );
//           }
//           if (chain.unsupported) {
//             return (
//               <Text
//                 as="button"
//                 onClick={() => openChainModal()}
//                 width={"fit-content"}
//               >
//                 // unsupported chain.{" "}
//                 <InlineButton color={"blue"}>[switch]</InlineButton>
//               </Text>
//             );
//           }
//           return (
//             <>
//               <Text
//                 width={"fit-content"}
//                 onClick={() => {
//                   openAccountModal();
//                 }}
//                 as="button"
//               >
//                 // connected to:{" "}
//                 <InlineButton color={"blue"}>
//                   [
//                   {`${account.address.slice(0, 4)}...${account.address.slice(
//                     -4
//                   )}`}
//                   ]
//                 </InlineButton>
//               </Text>
//               <Text>// balance: {account.displayBalance}</Text>
//               <Text
//                 width={"fit-content"}
//                 as="button"
//                 onClick={() => {
//                   openChainModal();
//                 }}
//               >
//                 // chain:{" "}
//                 <InlineButton color={"blue"}>[{chain.name}]</InlineButton>
//               </Text>
//             </>
//           );
//         }}
//       </ConnectButton.Custom>

//       {/* <Text>// ===== ===== ===== ===== =====</Text> */}
//       <Vault />
//       <Underlying address={account?.address!} />
//     </>
//   );
// };

import { useAccount } from "wagmi";
import { RINKEBY_STABLE_VAULT } from "../contracts";
import { AsciiConnectButton } from "./AsciiConnectButton";
import { AsciiText, NewLine } from "./AsciiText";
import { Vault } from "./Vault";

export const PageContent = () => {
  const { data: account } = useAccount();

  return (
    <>
      <AsciiConnectButton />
      <NewLine />
      <AsciiText>// ███████ Vaults ██████████████</AsciiText>
      {!account && (
        <>
          <NewLine />
          <AsciiText>// connect wallet to see vaults</AsciiText>
        </>
      )}
      {account?.address && (
        <Vault
          name="StableVault"
          vault={RINKEBY_STABLE_VAULT}
          chainName="rinkeby"
        />
      )}
    </>
  );
};
