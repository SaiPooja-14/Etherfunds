import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme, useToast } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CreateNewFund from './pages/CreateNewFund';
import FundDetails from './pages/FundDetails';
import FundsCreatedByMe from './pages/FundsCreatedByMe';
import ContributedToFunds from './pages/ContributedToFunds';
import WithdrawalRequests from './pages/WithdrawalRequests';
import WithdrawalRequestApprove from './pages/WithdrawalRequestApprove';
import { useMetamask } from "use-metamask";
import { ethers } from 'ethers';
import client from './client';
import ContractInfo from './backend/artifacts/contracts/EtherFund.sol/EtherFund.json'
import RequestWithdrawalForm from './pages/RequestWithdrawalForm';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

function App() {
  const { connect, metaState } = useMetamask();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Function to switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
        }
      }
      console.error('Error switching to Sepolia:', switchError);
    }
  };

  // Check if connected to correct network
  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
      
      if (chainId !== SEPOLIA_CHAIN_ID) {
        console.log('Please switch to Sepolia network');
        await switchToSepolia();
      }
    }
  };

  useEffect(() => {
    if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(ethers.providers.Web3Provider);
          await checkNetwork();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (metaState.isConnected) {
      checkNetwork();
      
      client.setProvider(window.ethereum);
      client.setContract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        ContractInfo.abi
      );

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
        window.location.reload();
      });
    }
  }, [metaState]);

  return (
    <>
      <ChakraProvider>
        <Router>
          <Navbar isCorrectNetwork={isCorrectNetwork} switchToSepolia={switchToSepolia} />

          <Routes>
            <Route exact path='/' element={<LandingPage />}></Route>
            <Route exact path='/myfunds' element={<FundsCreatedByMe />}></Route>
            <Route exact path='/mycontributions' element={<ContributedToFunds />}></Route>
            <Route exact path='/fundraiser/new/' element={<CreateNewFund />}></Route>

            <Route path='fundraiser/:id' element={<FundDetails />}></Route>
            <Route path='fundraiser/:id/withdraw' element={<RequestWithdrawalForm />}></Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;