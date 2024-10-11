import React, { useContext } from 'react';
import { Modal, Button, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Threshold } from '../services/precepts';
import { HopesContext } from '../context/hopesContext';
import { useHopes } from '../hooks/hopes/useHopes';
import { PreceptsContext } from '../context/preceptsContext';
import PreceptModalThreadhold from './PreceptModalThreadhold';

interface AddPreceptModalProps {
  onClose: () => void;
  onAdd: (name: string, baseMultiplier: number, thresholds: Threshold[], hopeKey: string) => void;
}

const AddPreceptModal: React.FC<AddPreceptModalProps> = ({ onClose, onAdd }) => {
  useHopes()
  const { hopes } = useContext(HopesContext);
  const { name, setName, baseMultiplier, setBaseMultiplier, thresholds, hopeKey, setHopeKey, handleAddThreshold, isModalVisible,
  } = useContext(PreceptsContext);

  const handleSubmit = () => {
    onAdd(name, baseMultiplier, thresholds, hopeKey);
    onClose();
  };

  return (
    <Modal
      title="Create Precept"
      open={isModalVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Create</Button>
      ]}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input placeholder="Precept Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="number" placeholder="Base Multiplier"
          value={baseMultiplier}
          onChange={(e) => setBaseMultiplier(Number(e.target.value))}
          onWheel={(e) => {
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setBaseMultiplier((prev) => Math.round((prev + delta) * 10) / 10);
          }}
          style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}
          step={0.1}
        />
        {thresholds.map((threshold, index) => <PreceptModalThreadhold threshold={threshold} index={index} key={index} />)}
        <Button type="dashed" onClick={handleAddThreshold} block icon={<PlusOutlined />}>
          新增閾值
        </Button>
        <Select style={{ width: '100%' }} placeholder="選擇 Hope" value={hopeKey} onChange={(value) => setHopeKey(value)}>
          {hopes.map((hope) => (
            <Select.Option key={hope.key} value={hope.key}>{hope.name}</Select.Option>
          ))}
        </Select>
      </Space>
    </Modal>
  );
};

export default AddPreceptModal;
