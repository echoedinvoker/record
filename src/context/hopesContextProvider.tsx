import { useState } from "react";
import { HopesContext } from "./hopesContext";
import { Hope, HopeMapValue } from "../types";
import { buildHopeTree } from "../utils/hopes";

interface HopesContextProviderProps {
  children: React.ReactNode
}


export default function HopesContextProvider({ children }: HopesContextProviderProps) {
  const [hopes, setHopes] = useState<Hope[]>([])
  const hopesNames = hopes.map(hope => hope.name)
  const hopeTree = buildHopeTree(hopes)

  const addHope = (newHope: Hope) => {
    setHopes(prevHopes => [...prevHopes, newHope])
  }

  const deleteHope = (name: string) => {
    const hopeNames = collectHopeNames(name)
    const newHopes = hopes.filter(hope => !hopeNames.includes(hope.name))
    setHopes(newHopes)
  }

  const collectHopeNames = (name: string): string[] => {
    const collectNames = (node: HopeMapValue): string[] => {
      const names = [node.name];
      node.children.forEach(child => {
        names.push(...collectNames(child));
      });
      return names;
    };

    const findNode = (nodes: HopeMapValue[], targetName: string): HopeMapValue | undefined => {
      for (const node of nodes) {
        if (node.name === targetName) {
          return node;
        }
        const found = findNode(node.children, targetName);
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    const targetNode = findNode(hopeTree, name);
    return targetNode ? collectNames(targetNode) : [];
  };

  const value = {
    hopes,
    setHopes,
    addHope,
    deleteHope,
    hopesNames,
    hopeTree,
  }

  return (
    <HopesContext.Provider value={value}>
      {children}
    </HopesContext.Provider>
  )
}
