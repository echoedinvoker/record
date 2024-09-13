import { useState } from "react";
import { HopesContext } from "./hopesContext";
import { CreateHopePayload, Hope, HopeMapValue, UpdateHopePayload } from "../types";
import { buildHopeTree } from "../utils/hopes";
import { useMutation } from "@tanstack/react-query";
import { createHope, deleteHope as deleteHopeService, fetchHopeByName, updateHope } from "../services/hopes";

interface HopesContextProviderProps {
  children: React.ReactNode
}


export default function HopesContextProvider({ children }: HopesContextProviderProps) {
  const [hopes, setHopes] = useState<Hope[]>([])
  const [selectedHope, setSelectedHope] = useState<string>("")
  const hopesNames = hopes.map(hope => hope.name)
  const hopeTree = buildHopeTree(hopes)

  const mutateAddHope = useMutation({
    mutationFn: createHope
  })

  const mutateDeleteHope = useMutation({
    mutationFn: async (name: string) => {
      const hope = await fetchHopeByName(name)
      if (!hope) return
      return deleteHopeService(hope.id)
    }
  })

  const mutateUpdateHope = useMutation({
    mutationFn: updateHope
  })

  const isPending = mutateAddHope.isPending || mutateDeleteHope.isPending

  const addHope = (newHope: Hope) => {
    const payload: CreateHopePayload = {
      name: newHope.name,
      parent_name: newHope.parentName
    }
    mutateAddHope.mutate(payload)
    setHopes(prevHopes => [...prevHopes, newHope])
  }

  const deleteHope = (name: string) => {
    const hopeNames = collectHopeNames(name)
    const newHopes = hopes.filter(hope => !hopeNames.includes(hope.name))
    mutateDeleteHope.mutate(name)
    setHopes(newHopes)
  }

  const updateMarkdownContent = (value: string) => {
    const newHopes = hopes.map(hope => {
      if (hope.name === selectedHope) {
        const payload: UpdateHopePayload = {
          name: hope.name,
          markdown_content: value
        }
        mutateUpdateHope.mutate(payload)
        return { ...hope, markdownContent: value }
      }
      return hope
    })
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

  const selectHope = (name: string) => {
    setSelectedHope(name)
  }

  const appendTask = (hopeName: string, taskKey: string) => {
    const newHopes = hopes.map(hope => {
      if (hope.name === hopeName) {
        return { ...hope, taskOrder: [...hope.taskOrder, taskKey] }
      }
      return hope
    })
    setHopes(newHopes)
  }

  const value = {
    hopes,
    setHopes,
    addHope,
    deleteHope,
    hopesNames,
    hopeTree,
    selectedHope,
    selectHope,
    appendTask,
    isPending,
    updateMarkdownContent
  }

  return (
    <HopesContext.Provider value={value}>
      {children}
    </HopesContext.Provider>
  )
}
