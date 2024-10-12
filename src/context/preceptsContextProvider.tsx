import { PreceptsContext } from "./preceptsContext";
import useModal from "../hooks/precept/useModal";
import usePrecept from "../hooks/precept/usePrecept";

interface PreceptsContextProviderProps {
  children: React.ReactNode
}

export default function PreceptsContextProvider({ children }: PreceptsContextProviderProps) {

  const { precepts, setPrecepts, addPrecept, removePrecept, togglePrecept, updatePrecept, onDragEnd, changePreceptStatus
  } = usePrecept()

  const {
    isModalVisible,
    showModal,
    handleCancel,
    name,
    setName,
    baseMultiplier,
    setBaseMultiplier,
    thresholds,
    hopeKey,
    setHopeKey,
    handleThresholdChange,
    handleAddThreshold,
    handleRemoveThreshold,
    modalType,
    key
  } = useModal()

  const value = {
    precepts,
    setPrecepts,
    addPrecept,
    removePrecept,
    togglePrecept,
    updatePrecept,
    onDragEnd,
    changePreceptStatus,
    isModalVisible,
    showModal,
    handleCancel,
    name,
    setName,
    baseMultiplier,
    setBaseMultiplier,
    thresholds,
    hopeKey,
    setHopeKey,
    handleThresholdChange,
    handleAddThreshold,
    handleRemoveThreshold,
    modalType,
    key
  }


  return <PreceptsContext.Provider value={value}>
    {children}
  </PreceptsContext.Provider>
}
