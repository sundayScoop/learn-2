import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { BlockfrostProvider, Transaction } from "@meshsdk/core";

const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [funds, setFunds] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [donated, setDonated] = useState<boolean>(false);


  async function getFunds() {
    if (wallet){
      setLoading(true);
      const _funds = (await wallet.getBalance())[0].quantity;
      const ada = _funds.slice(0, _funds.length - 6);
      setFunds(ada);
      setLoading(false);
    }
  }

  async function requestDonation(){
    setLoading(true);
    const tx = new Transaction({
      initiator: wallet,
      fetcher: new BlockfrostProvider("previewm6YqjcH0gnPC0ETjKYgiwEgQFuA0UJkh"),
      verbose: true
    });

    tx.sendLovelace("addr_test1qzsqalwpdpxa54racay47utdmwm84rqzl35r8llz9dkztv4t5663pg6ah59kv3sjdyj3n4u5w38rjmt5jf95867d4kqs6n6qqv",
      "10000000"
    );

    const unsigned = await tx.build();

    const signed = await wallet.signTx(unsigned);
    const hash = await wallet.submitTx(signed);

    setLoading(false);
    setDonated(true);
  }

  return (
    <div>
      <h1 style={{
        textAlign: "center",
        fontSize: 30
      }}>Test App</h1>
      <div style={{
        textAlign: "right",
        color: "red"
      }}><CardanoWallet onConnected={getFunds}/></div>
      
      {connected ? (
        <>
        {donated ? (
            <p>Thank you for donating</p>
          ) : (
            <div>
              <p>Would you like to support the author of this app by donating 10 of your {funds} ADA?</p>
              <button
                type="button"
                onClick={() => requestDonation()}
                disabled={loading}
                style={{
                  margin: "8px",
                  backgroundColor: loading ? "orange" : "grey",
                }}
              >
                Yes
            </button>
            </div>
            
          )}
        </>
      ):(
        <>
        <p style={{
          textAlign: "center",
          fontFamily: "fantasy",
          fontSize: 23
        }}>Welcome to test app. Connect your wallet to continue</p>
        </>
      )}
    </div>
  );
};

export default Home;