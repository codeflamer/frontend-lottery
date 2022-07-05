import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const dispatch = useNotification();

    // console.log(chainIdHex);
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainIdHex ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumberPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntryFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntryFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWInner",
        params: {},
    });

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNofification("success");
        UpdateUI();
    };

    const handleNewNofification = (type) => {
        dispatch({
            type,
            message: "Transcation Complete",
            title: "Tx Notification",
            icon: "bell",
            position: "topR",
        });
    };

    const UpdateUI = async () => {
        console.log("Hiii");
        const entranceFeeFromContract = (await getEntryFee()).toString();
        const recentWinner = (await getRecentWinner()).toString();
        const NumOfPlayers = (await getNumberOfPlayers()).toString();
        setNumberPlayers(NumOfPlayers);
        setRecentWinner(recentWinner);
        setEntranceFee(entranceFeeFromContract);
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            UpdateUI();
        }
    }, [isWeb3Enabled, numPlayers]);

    return (
        <div className="p-5">
            Hi from the lottery Enterance!
            <br />
            {lotteryAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess, //successfully send to the metamask
                                onError: (error) => console.log(error),
                            });
                        }}
                        disabled={isFetching || isLoading}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div className="">Enter Lottery</div>
                        )}
                    </button>
                    <div>Enterance fee: {ethers.utils.formatEther(entranceFee)} ETH</div>
                    <div>Number Of Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </>
            ) : (
                <div>No Lottery Address Detected</div>
            )}
        </div>
    );
};

export default LotteryEntrance;
