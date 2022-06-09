// import { Heading, Stack, VisuallyHidden } from "@chakra-ui/react";
// import { NextPage } from "next";
// import { useSSR } from "./hooks/useSSR";
// import { Logo } from "./Logo";
// import { PageContent } from "./PageContent";
// // import styles from "../styles/Home.module.css";

// // import { getAsset, getVault } from "../contracts";
// // import { BigNumber, constants } from "ethers";
// // import {
// //   Button,
// //   ChakraProps,
// //   Heading,
// //   HStack,
// //   NumberDecrementStepper,
// //   NumberIncrementStepper,
// //   NumberInput,
// //   NumberInputField,
// //   NumberInputStepper,
// //   Stack,
// //   Tag,
// //   TagProps,
// //   Text as ChakraText,
// //   useDisclosure,
// //   VisuallyHidden,
// // } from "@chakra-ui/react";
// // import { Fragment, useEffect, useState } from "react";
// // import {
// //   CappedHeading,
// //   CappedText,
// //   CappedTextProps,
// // } from "@gvrs/chakra-capsize";

// // const Underlying = ({ address }: { address: string }) => {
// //   const { activeChain } = useNetwork();
// //   const mockUnderlying = getAsset(activeChain?.name);
// //   const { data: tokenData } = useToken({
// //     address: mockUnderlying.addressOrName,
// //   });
// //   const { data, isLoading, isError } = useContractRead(
// //     mockUnderlying,
// //     "balanceOf",
// //     {
// //       args: [address],
// //       watch: true,
// //     }
// //   );
// //   const {
// //     data: d,
// //     isError: e,
// //     isLoading: l,
// //     write: mint10k,
// //   } = useContractWrite(mockUnderlying, "mint", { args: [address, 10000] });
// //   return (
// //     <Stack>
// //       <Text>---</Text>
// //       <Text># mock asset</Text>
// //       {isLoading && <Text>- fetching balance...</Text>}
// //       {isError && <Text>- failed to fetch balance.</Text>}
// //       {data && (
// //         <Text>
// //           - your balance: {data.toString()} {tokenData?.symbol}
// //         </Text>
// //       )}
// //       <Button size={"xs"} width="sm" onClick={() => mint10k()}>
// //         Mint 10k MUSDC
// //       </Button>
// //     </Stack>
// //   );
// // };

// // const ProgressEpoch = ({ disabled }: { disabled: boolean }) => {
// //   const { activeChain } = useNetwork();
// //   const mockUnderlying = getAsset(activeChain?.name);
// //   const vault = getVault(activeChain?.name);
// //   const { data: tokenData } = useToken({
// //     address: mockUnderlying.addressOrName,
// //   });
// //   const format = (val: string) =>
// //     tokenData?.symbol ? `${val} ${tokenData.symbol}` : val;
// //   const parse = (val: string) => val.replace(/^\$/, "");

// //   const [nextEpochAUM, setNextEpochAUM] = useState("0");
// //   const {
// //     // data: d,
// //     // isError: e,
// //     isLoading: progressEpochLoading,
// //     write: progressEpoch,
// //   } = useContractWrite(vault, "progressEpoch", {
// //     args: [BigNumber.from(nextEpochAUM)],
// //   });

// //   const {
// //     data: preview,
// //     isError,
// //     isLoading,
// //   } = useContractRead(vault, "previewProgress", {
// //     args: [+nextEpochAUM],
// //     watch: true,
// //   });
// //   return (
// //     <>
// //       <NumberInput
// //         size={"xs"}
// //         width="sm"
// //         onChange={(valueString) => setNextEpochAUM(parse(valueString))}
// //         value={format(nextEpochAUM)}
// //         min={0}
// //       >
// //         <NumberInputField />
// //         <NumberInputStepper>
// //           <NumberIncrementStepper />
// //           <NumberDecrementStepper />
// //         </NumberInputStepper>
// //       </NumberInput>
// //       <Button
// //         size={"xs"}
// //         width="sm"
// //         disabled={disabled}
// //         isLoading={progressEpochLoading}
// //         onClick={() => {
// //           progressEpoch();
// //         }}
// //       >
// //         Progress Epoch
// //       </Button>
// //       {preview && (
// //         <Text>
// //           {preview[0] === true ? "" : "-"}{" "}
// //           {BigNumber.from(preview[1]).toString()}
// //         </Text>
// //       )}
// //     </>
// //   );
// // };

// // const useContractAum = () => {
// //   const { activeChain } = useNetwork();
// //   const vault = getVault(activeChain?.name);
// //   const { data: assetContract } = useContractRead(vault, "asset");
// //   const { data: assetToken } = useToken({
// //     address: assetContract?.toString(),
// //   });
// //   const { data: aumB } = useContractRead(vault, "aum", {
// //     watch: true,
// //   });
// //   const aum = BigNumber.isBigNumber(aumB) ? BigNumber.from(aumB).toNumber() : 0;

// //   return [aum, assetToken?.symbol];
// // };

// // const VaultDeposit = () => {
// //   const { activeChain } = useNetwork();
// //   const mockUnderlying = getAsset(activeChain?.name);
// //   const vault = getVault(activeChain?.name);
// //   const { data: account } = useAccount();
// //   const [_, symbol] = useContractAum();

// //   const { write: approveMax } = useContractWrite(mockUnderlying, "approve", {
// //     args: [vault.addressOrName, constants.MaxUint256],
// //   });
// //   const { data: approvalB } = useContractRead(mockUnderlying, "allowance", {
// //     args: [account?.address, vault.addressOrName],
// //     watch: true,
// //   });
// //   const allowance = BigNumber.isBigNumber(approvalB)
// //     ? BigNumber.from(approvalB)
// //     : BigNumber.from(0);
// //   const allowanceString =
// //     allowance.toString() === constants.MaxUint256.toString()
// //       ? "infinite"
// //       : allowance.toString();
// //   const { data: assetBalanceB } = useContractRead(mockUnderlying, "balanceOf", {
// //     args: [account?.address],
// //     watch: true,
// //   });
// //   const assetBalance = BigNumber.isBigNumber(assetBalanceB)
// //     ? BigNumber.from(assetBalanceB)
// //     : BigNumber.from(0);
//   // const [depositAmount, setDepositAmount] = useState("0");

// //   const { write } = useContractWrite(vault, "storeAssetForDeposit", {
// //     args: [1],
// //     overrides: {
// //       gasLimit: 300000,
// //     },
// //   });
// //   const isAllowed =
// //     !allowance.isZero() &&
// //     allowance.gte(
// //       BigNumber.from(depositAmount).mul(BigNumber.from(10).pow(18))
// //     );
// //   const { write: approve } = useContractWrite(mockUnderlying, "approve", {
// //     args: [
// //       vault.addressOrName,
// //       BigNumber.from(depositAmount).mul(BigNumber.from(10).pow(18)),
// //     ],
// //   });
// //   return (
// //     <>
// //       <Text padStart={2} opacity={0.5}>
// //         // deposit
// //       </Text>
// //       <Text padStart={2}>
// //         asset balance: {assetBalance.toString()} {symbol}
// //       </Text>
// //       <HStack spacing={0} m={0} p={0}>
// //         <Text padStart={2}>deposit amount:</Text>
//         // <NumberInput
//         //   m={0}
//         //   size={"xs"}
//         //   maxW="sm"
//         //   onChange={(valueString) =>
//         //     setDepositAmount(valueString.split(" ")[0] ?? "0")
//         //   }
//         //   value={` ${depositAmount} ${symbol}`}
//         //   max={Math.min(10000, assetBalance.toNumber())}
//         //   min={0}
//         // >
//         //   <NumberInputField
//         //     border={"none"}
//         //     fontSize={"unset"}
//         //     background={"blackAlpha.50"}
//         //     px={0}
//         //     display="inline"
//         //   />
//         //   <NumberInputStepper>
//         //     <NumberIncrementStepper />
//         //     <NumberDecrementStepper />
//         //   </NumberInputStepper>
//         // </NumberInput>
// //       </HStack>
// //       {allowanceString && <Text>{allowanceString}</Text>}
// //       {!isAllowed && (
//         // <>
//         //   {depositAmount != "0" && (
//         //     <Text onClick={() => approve()} padStart={2}>
//         //       //{" "}
//         //       <InlineButton>
//         //         [Approve {depositAmount} {symbol}]
//         //       </InlineButton>
//         //     </Text>
//         //   )}
//         //   <Text onClick={() => approveMax()} padStart={2}>
//         //     // <InlineButton>[Approve Max]</InlineButton>
//         //   </Text>
//         // </>
// //       )}
// //       {isAllowed && (
// //         <Text onClick={() => write()} padStart={2}>
// //           // <InlineButton>[Deposit]</InlineButton>
// //         </Text>
// //       )}

// //       {/* <Text padStart={2}>
// //         approval: {approval}{" "}
// //         <InlineButton as="button" onClick={() => approveMax()}>
// //           [approve max]
// //         </InlineButton>
// //       </Text> */}
// //       {/* <Button size={"xs"} width="sm" onClick={() => write()}>
// //         Deposit
// //       </Button> */}
// //     </>
// //   );
// // };

// // const VaultPublic = () => {
// //   const [aum, symbol] = useContractAum();
// //   const epoch = useContractEpoch();

// //   const { onToggle, isOpen } = useDisclosure();

// //   return (
// //     <>
//       // <Text
//       //   padStart={2}
//       //   as="button"
//       //   width={"fit-content"}
//       //   onClick={onToggle}
//       //   opacity={0.5}
//       // >
//       //   // <InlineButton>[{isOpen ? "hide " : ""}contract data]</InlineButton>
//       // </Text>
// //       {isOpen && (
// //         <>
// //           <Text padStart={2}>asset: {symbol}</Text>
// //           <Text padStart={2}>cap: infinite</Text>
// //           <Text padStart={2}>
// //             aum: {aum} {symbol}
// //           </Text>
// //           <Text padStart={2}>epoch: {epoch}</Text>
// //           <Text padStart={2}>last epoch performance: +0%</Text>

// //           {/* <Text padStart={2} opacity={0.5}>
// //             // TODO: last change
// //           </Text>
// //           <Text padStart={2} opacity={0.5}>
// //             // TODO: historical gain
// //           </Text> */}
// //         </>
// //       )}
// //     </>
// //   );
// // };

// // const useContractEpoch = () => {
// //   const { activeChain } = useNetwork();
// //   const vault = getVault(activeChain?.name);
// //   const { data: epochB } = useContractRead(vault, "epoch", {
// //     watch: true,
// //   });
// //   const epoch = BigNumber.isBigNumber(epochB)
// //     ? BigNumber.from(epochB).toNumber()
// //     : 0;
// //   return epoch;
// // };
// // const VaultAdmin = () => {
// //   const { activeChain } = useNetwork();
// //   const mockUnderlying = getAsset(activeChain?.name);
// //   const vault = getVault(activeChain?.name);
// //   const { data: tokenData } = useToken({
// //     address: mockUnderlying.addressOrName,
// //   });
// //   const epoch = useContractEpoch();
//   // const { isLoading: startVaultLoading, write } = useContractWrite(
//   //   vault,
//   //   "startVault",
//   //   { args: [0] }
//   // );

// //   return (
// //     <>
// //       <Text>---</Text>
// //       <Text># vault admin functions</Text>
// //       <Button
// //         size={"xs"}
// //         width="sm"
// //         disabled={epoch !== 0}
// //         onClick={() => {
// //           write();
// //         }}
// //       >
// //         Start Vault
// //       </Button>
// //       <ProgressEpoch disabled={epoch == 0} />
// //     </>
// //   );
// // };

// // const VaultBalance = ({ address }: { address: string }) => {
// //   const [aum, symbol] = useContractAum();
// //   const { activeChain } = useNetwork();
// //   const vault = getVault(activeChain?.name);
// //   const { data: hasPendingDeposit } = useContractRead(
// //     vault,
// //     "userHasPendingUpdate",
// //     {
// //       args: [address],
// //       watch: true,
// //     }
// //   );
// //   return (
// //     <>
//       // <Text padStart={1} />
//       // <Text padStart={2} opacity={0.5}>
//       //   // your stats
//       // </Text>
//       // <Text padStart={2}>stored value: 0 {symbol}</Text>
//       // <Text padStart={2}>
//       //   has pending deposit: {hasPendingDeposit ? "true" : "false"}
//       // </Text>
//       // <Text padStart={2}>pending deposit: 0 {symbol}</Text>

//       // <Text padStart={2} opacity={0.5}>
//       //   // total deposited: 0 {symbol}
//       // </Text>
//       // <Text padStart={2} opacity={0.5}>
//       //   // total withdrawn: 0 {symbol}
//       // </Text>
// //     </>
// //   );
// // };

// // const Vault = () => {
// //   const { data: account } = useAccount();
// //   const { activeChain } = useNetwork();
// //   const vault = getVault(activeChain?.name);
// //   const { data: farmer } = useContractRead(vault, "farmer");
// //   const shouldShowAdmin =
// //     farmer && account && farmer.toString() == account.address;
// //   const isWalletConnected = account?.address;
// //   const { onToggle: onContractToggle, isOpen: isContractOpen } = useDisclosure({
// //     defaultIsOpen: true,
// //   });
// //   return (
// //     <>
// //       <Text padStart={1} />
// //       <Text>
// //         contract StableVault {"{"}{" "}
// //         <InlineButton opacity={0.25} as="button" onClick={onContractToggle}>
// //           [{isContractOpen ? "hide" : "show"}]
// //         </InlineButton>
// //       </Text>
// //       {isContractOpen && (
// //         <>
// //           <VaultPublic />
// //           {account?.address ? (
// //             <VaultBalance address={account?.address} />
// //           ) : (
// //             <>
// //               <Text padStart={1}></Text>
// //               <Text padStart={2} opacity={0.5}>
// //                 // connect wallet to use the vault
// //               </Text>
// //             </>
// //           )}

// //           {account?.address && (
// //             <>
// //               <Text padStart={1}></Text>
// //               <VaultDeposit />
// //             </>
// //           )}
// //         </>
// //       )}
// //       <Text>{"}"}</Text>
// //       {/* <Text>My Balance</Text>
// //       <VaultDeposit />
// //       <Text>Vault Withdraw</Text> */}
// //       {shouldShowAdmin && <VaultAdmin />}
// //     </>
// //   );
// // };

// // const Client = () => {
// //   const { data: account } = useAccount();
// //   // const { data: farmer } = useContractRead(vault, "farmer");
// //   // const shouldShowAdmin =
// //   //   farmer && account && farmer.toString() == account.address;
// //   const isWalletConnected = account?.address;
// //   return (
// //     <>
// //       <ConnectButton.Custom>
// //         {({
// //           account,
// //           chain,
// //           openAccountModal,
// //           openChainModal,
// //           openConnectModal,
// //           mounted,
// //         }) => {
// //           if (!mounted || !account || !chain) {
// //             return (
// //               <Text
// //                 as="button"
// //                 onClick={() => openConnectModal()}
// //                 width={"fit-content"}
// //               >
// //                 // <InlineButton color={"blue"}>[connect wallet]</InlineButton>
// //               </Text>
// //             );
// //           }
// //           if (chain.unsupported) {
// //             return (
// //               <Text
// //                 as="button"
// //                 onClick={() => openChainModal()}
// //                 width={"fit-content"}
// //               >
// //                 // unsupported chain.{" "}
// //                 <InlineButton color={"blue"}>[switch]</InlineButton>
// //               </Text>
// //             );
// //           }
// //           return (
// //             <>
// //               <Text
// //                 width={"fit-content"}
// //                 onClick={() => {
// //                   openAccountModal();
// //                 }}
// //                 as="button"
// //               >
// //                 // connected to:{" "}
// //                 <InlineButton color={"blue"}>
// //                   [
// //                   {`${account.address.slice(0, 4)}...${account.address.slice(
// //                     -4
// //                   )}`}
// //                   ]
// //                 </InlineButton>
// //               </Text>
// //               <Text>// balance: {account.displayBalance}</Text>

// //               <Text
// //                 width={"fit-content"}
// //                 as="button"
// //                 onClick={() => {
// //                   openChainModal();
// //                 }}
// //               >
// //                 // chain:{" "}
// //                 <InlineButton color={"blue"}>[{chain.name}]</InlineButton>
// //               </Text>
// //             </>
// //           );
// //         }}
// //       </ConnectButton.Custom>

// //       {/* <Text>// ===== ===== ===== ===== =====</Text> */}
// //       <Vault />
// //       <Underlying address={account?.address!} />
// //     </>
// //   );
// // };

// const Admin: NextPage = () => {
//   // const isSSR = useSSR();
//   return (
//     <>
//       <Head>
//         <title>REFI Pro</title>
//         <meta name="description" content="REFI Pro" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <VisuallyHidden>
//         <Heading>REFI Pro</Heading>
//       </VisuallyHidden>
//       <Stack as="main" minH="100vh" spacing={2}>
//         <Logo />
//         {/* {!isSSR && <PageContent />} */}
//       </Stack>
//     </>
//   );
// };

// export default Admin;

export default false;
