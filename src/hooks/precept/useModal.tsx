import { useState } from "react";

export default function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return {
    isModalVisible,
    showModal,
    handleCancel
  };
}

