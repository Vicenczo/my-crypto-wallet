import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";

interface WalletContextType {
  wallet: any;
  balance: string;
  address: string;
  connectMetaMask: () => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<void>;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<any>(null);
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { toast } = useToast();

  const updateBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setWallet(signer);
        setAddress(accounts[0]);
        setIsConnected(true);
        updateBalance(accounts[0]);

        toast({
          title: "Uspešno povezano",
          description: "MetaMask novčanik je uspešno povezan!",
        });

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            updateBalance(accounts[0]);
          } else {
            setWallet(null);
            setAddress("");
            setBalance("0");
            setIsConnected(false);
          }
        });

      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        toast({
          variant: "destructive",
          title: "Greška",
          description: "Došlo je do greške prilikom povezivanja s MetaMask-om.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask nije pronađen",
        description: "Molimo instalirajte MetaMask ekstenziju.",
      });
    }
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!wallet) return;
    
    try {
      const tx = await wallet.sendTransaction({
        to: to,
        value: ethers.parseEther(amount)
      });
      
      toast({
        title: "Transakcija poslana",
        description: `Transakcija je uspešno poslana! Hash: ${tx.hash}`,
      });
      
      await tx.wait();
      updateBalance(address);
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Došlo je do greške prilikom slanja transakcije.",
      });
    }
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      balance, 
      address, 
      connectMetaMask, 
      sendTransaction,
      isConnected 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}