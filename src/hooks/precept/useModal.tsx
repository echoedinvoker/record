import { useEffect, useState } from "react";
import { Precept, Threshold } from "../../services/precepts";

export default function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [baseMultiplier, setBaseMultiplier] = useState(1);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [hopeKey, setHopeKey] = useState('');
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [key, setKey] = useState('');

  const showModal = (precept: Precept | null) => {
    if (precept) {
      setName(precept.name);
      setBaseMultiplier(precept.baseMultiplier);
      setThresholds(precept.thresholds);
      setHopeKey(precept.hopeKey);
      setModalType('edit');
      setKey(precept.key);
    } else {
      setModalType('add');
    }
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
    modalType,
    key
  };
}

