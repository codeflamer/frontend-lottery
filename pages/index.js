import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
import MainHeader from "../components/MainHeader";
// import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smart contract lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <Header /> */}
            <MainHeader />
            <LotteryEntrance />
        </div>
    );
}
