import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Wallet, Send, LogOut } from "lucide-react";

const Index = () => {
  const { wallet, balance, address, connectMetaMask, sendTransaction, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    await sendTransaction(recipient, amount);
    setRecipient("");
    setAmount("");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wallet-background relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-wallet-foreground">
            Kripto Novčanik
          </h1>
          <Button
            onClick={connectMetaMask}
            className="bg-gradient-to-r from-wallet-primary to-wallet-secondary hover:opacity-90 text-white"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Poveži MetaMask
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wallet-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              // Simply reload the page - MetaMask will require reconnection
              window.location.reload();
            }}
            variant="outline"
            className="mb-4"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Odjavi se
          </Button>
        </div>

        <Card className="p-6 bg-opacity-10 bg-white backdrop-blur-lg">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-wallet-foreground">Vaš Novčanik</h2>
            <div className="bg-wallet-background/50 p-4 rounded-lg">
              <p className="text-sm text-wallet-foreground/70">Adresa:</p>
              <p className="font-mono text-wallet-foreground break-all">{address}</p>
            </div>
            <div className="bg-wallet-background/50 p-4 rounded-lg">
              <p className="text-sm text-wallet-foreground/70">Stanje:</p>
              <p className="text-2xl font-bold text-wallet-foreground">{balance} ETH</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-opacity-10 bg-white backdrop-blur-lg">
          <form onSubmit={handleSend} className="space-y-4">
            <h2 className="text-2xl font-bold text-wallet-foreground">Pošalji ETH</h2>
            <div className="space-y-2">
              <Input
                placeholder="Adresa primatelja"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-wallet-background/50 text-wallet-foreground placeholder:text-wallet-foreground/50"
              />
              <Input
                placeholder="Iznos (ETH)"
                type="number"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-wallet-background/50 text-wallet-foreground placeholder:text-wallet-foreground/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-wallet-primary to-wallet-secondary hover:opacity-90 text-white"
              disabled={!recipient || !amount}
            >
              <Send className="mr-2 h-4 w-4" />
              Pošalji
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Index;