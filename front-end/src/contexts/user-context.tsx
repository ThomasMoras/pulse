import { pulseContract } from "@/contracts/pulse.contract";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

// Définir le type de données du contexte
interface UserContextType {
  isAccountCreated: boolean;
  setIsAccountCreated: (value: boolean) => void;
}

// Fournir une valeur initiale par défaut
const UserContext = createContext<UserContextType>({
  isAccountCreated: false,
  setIsAccountCreated: () => {}, // Fonction vide par défaut
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  // check if user has mint his SBT
  const { data: hasSBT } = useReadContract({
    abi: pulseContract.abi,
    address: pulseContract.address,
    functionName: "hasSoulBoundToken",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Ne lance la requête que si une adresse est connectée
    },
  });

  useEffect(() => {
    // console.log("hasSBT :", hasSBT);
    if (hasSBT === true) {
      console.log("Mise à jour de isAccountCreated à true");
      setIsAccountCreated(true);
    }
  }, [hasSBT]);

  return (
    <UserContext.Provider value={{ isAccountCreated, setIsAccountCreated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
