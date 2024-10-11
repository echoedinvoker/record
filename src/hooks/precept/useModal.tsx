import { useEffect, useState } from "react";
import { Threshold } from "../../services/precepts";

export default function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [baseMultiplier, setBaseMultiplier] = useState(1);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [hopeKey, setHopeKey] = useState('');

  const showModal = () => {
    console.log('showModal');
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddThreshold = () => {
    setThresholds([...thresholds, { thresholdNumber: 0, multiplier: 1, unit: 'minutes' }]);
  };

  const handleRemoveThreshold = (index: number) => {
    const newThresholds = thresholds.filter((_, i) => i !== index);
    setThresholds(newThresholds);
  };

  const handleThresholdChange = (index: number, field: 'thresholdNumber' | 'multiplier' | 'unit', value: number | string) => {
    setThresholds(prev => {
      const newThresholds = [...prev];
      newThresholds[index] = {
        ...newThresholds[index],
        [field]: value,
      };
      return newThresholds;
    })
  };

  // reset form whenever modal is closed
  useEffect(() => {
    if (!isModalVisible) {
      setName('');
      setBaseMultiplier(1);
      setThresholds([]);
      setHopeKey('');
    }
  }, [isModalVisible]);

  return {
    isModalVisible,
    showModal,
    handleCancel,
    handleAddThreshold,
    handleRemoveThreshold,
    handleThresholdChange,
    name,
    setName,
    baseMultiplier,
    setBaseMultiplier,
    thresholds,
    hopeKey,
    setHopeKey,
  };
}

