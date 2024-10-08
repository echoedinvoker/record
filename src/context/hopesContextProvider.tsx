import { useState } from "react";
import { HopesContext } from "./hopesContext";
import { CreateHopePayload, Hope, HopeMapValue, UpdateHopePayload } from "../types";
import { buildHopeTree } from "../utils/hopes";
import { useMutation } from "@tanstack/react-query";
import { createHope, deleteHope as deleteHopeService, fetchHopeByKey, updateHope } from "../services/hopes";
import { useTasks } from "../hooks/useTasks";

interface HopesContextProviderProps {
  children: React.ReactNode
}


export default function HopesContextProvider({ children }: HopesContextProviderProps) {
  const { data } = useTasks()
  const [hopes, setHopes] = useState<Hope[]>([])
  const [selectedHope, setSelectedHope] = useState<string>("")
  const hopesKeys = hopes.map(hope => hope.key)
  const hopeTree = data ? buildHopeTree(hopes, data) : []

  const getSelectedHopeContent = () => {
    if (!selectedHope) return ''
    const hope = hopes.find((hope) => hope.key === selectedHope)
    if (!hope) return ''
    return hope.markdownContent
  }
  const initialValue = getSelectedHopeContent()

  const mutateAddHope = useMutation({
    mutationFn: createHope
  })

  const mutateDeleteHope = useMutation({
    mutationFn: async (key: string) => {
      const hope = await fetchHopeByKey(key)
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
      key: newHope.key,
      parent_key: newHope.parentKey
    }
    mutateAddHope.mutate(payload)
    setHopes(prevHopes => [...prevHopes, newHope])
  }

  const deleteHope = (key: string) => {
    const hopeKeys = collectHopeKeys(key)
    const newHopes = hopes.filter(hope => !hopeKeys.includes(hope.key))
    mutateDeleteHope.mutate(key)
    setHopes(newHopes)
  }

  const updateMarkdownContent = (value: string) => {
    const newHopes = hopes.map(hope => {
      if (hope.key === selectedHope) {
        const payload: UpdateHopePayload = {
          key: hope.key,
          markdown_content: value
        }
        mutateUpdateHope.mutate(payload)
        return { ...hope, markdownContent: value }
      }
      return hope
    })
    setHopes(newHopes)
  }

  const collectHopeKeys = (key: string): string[] => {
    const collectKeys = (node: HopeMapValue): string[] => {
      const keys = [node.key];
      node.children.forEach(child => {
        keys.push(...collectKeys(child));
      });
      return keys;
    };

    const findNode = (nodes: HopeMapValue[], targetKey: string): HopeMapValue | undefined => {
      for (const node of nodes) {
        if (node.key === targetKey) {
          return node;
        }
        const found = findNode(node.children, targetKey);
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    const targetNode = findNode(hopeTree, key);
    return targetNode ? collectKeys(targetNode) : [];
  };

  const selectHope = (key: string) => {
    setSelectedHope(key)
  }

  const appendTask = (hopeKey: string, taskKey: string) => {
    setHopes(prevHopes => {
      return prevHopes.map(hope => {
        if (hope.key === hopeKey) {
          const newHope = { ...hope, taskOrder: [...hope.taskOrder, taskKey] }
          mutateUpdateHope.mutate({
            key: hope.key,
            task_order: JSON.stringify(newHope.taskOrder)
          })
          return newHope
        }
        return hope
      })
    })
  }

  const value = {
    hopes,
    setHopes,
    addHope,
    deleteHope,
    hopesKeys,
    hopeTree,
    selectedHope,
    selectHope,
    appendTask,
    isPending,
    updateMarkdownContent,
    initialValue
  }

  return (
    <HopesContext.Provider value={value}>
      {children}
    </HopesContext.Provider>
  )
}
