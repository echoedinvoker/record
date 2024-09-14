import { useQuery } from "@tanstack/react-query";
import { fetchHopes } from "../../services/hopes";
import { useContext, useEffect } from "react";
import { HopesContext } from "../../context/hopesContext";
import { Hope, HopeResponse } from "../../types";

export function useHopes() {
  const { hopes, setHopes } = useContext(HopesContext)
  const { data, isSuccess } = useQuery({
    queryKey: ['hopes'],
    queryFn: fetchHopes,
  })
  useEffect(() => {
    if (isSuccess && hopes.length === 0) {
      const hopes = data.map((hope: HopeResponse) => {
        const formattedHope: Hope = {
          name: hope.name,
          key: hope.key,
          markdownContent: hope.markdown_content,
          parentKey: hope.parent_key,
          taskOrder: JSON.parse(hope.task_order)
        }
        return formattedHope
      })
      console.log(hopes)
      setHopes(hopes)
    }
  }, [isSuccess])
}

