import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Input, Select, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Threshold } from '../services/precepts';
import { HopesContext } from '../context/hopesContext';
import { useHopes } from '../hooks/hopes/useHopes';

interface AddPreceptModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (name: string, baseMultiplier: number, thresholds: Threshold[], hopeKey: string) => void;
}

const AddPreceptModal: React.FC<AddPreceptModalProps> = ({ isVisible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [baseMultiplier, setBaseMultiplier] = useState(1);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [hopeKey, setHopeKey] = useState('');

  useHopes()

  const { hopes } = useContext(HopesContext);

  // reset form whenever modal is closed or opened
  useEffect(() => {
    if (!isVisible) {
      setName('');
      setBaseMultiplier(1);
      setThresholds([]);
      setHopeKey('');
    }
  }, [isVisible]);

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

  const handleSubmit = () => {
    onAdd(name, baseMultiplier, thresholds, hopeKey);
    onClose();
  };

  return (
    <Modal
      title="Create Precept"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Create</Button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Precept Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Base Multiplier"
          value={baseMultiplier}
          onChange={(e) => setBaseMultiplier(Number(e.target.value))}
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setBaseMultiplier((prev) => Math.round((prev + delta) * 10) / 10);
          }}
          style={{
            textAlign: 'center',
            fontSize: '1.2em',
            fontWeight: 'bold',
          }}
          step={0.1}
        />
        {thresholds.map((threshold, index) => (
          <Space key={index} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="維持時間"
                value={threshold.thresholdNumber}
                onChange={(e) => handleThresholdChange(index, 'thresholdNumber', Number(e.target.value))}
                style={{ textAlign: 'center', width: '60%' }}
              />
              <Select
                value={threshold.unit}
                onChange={(value) => handleThresholdChange(index, 'unit', value)}
                style={{ width: '40%' }}
              >
                <Select.Option value="minutes">分鐘</Select.Option>
                <Select.Option value="hours">小時</Select.Option>
                <Select.Option value="days">天</Select.Option>
                <Select.Option value="months">月</Select.Option>
              </Select>
            </div>
            <Input
              type="number"
              placeholder="倍數"
              value={threshold.multiplier}
              onChange={(e) => handleThresholdChange(index, 'multiplier', Number(e.target.value))}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                handleThresholdChange(index, 'multiplier', Math.round((threshold.multiplier + delta) * 10) / 10);
              }}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              step={0.1}
            />
            <MinusCircleOutlined onClick={() => handleRemoveThreshold(index)} />
          </Space>
        ))}
        <Button type="dashed" onClick={handleAddThreshold} block icon={<PlusOutlined />}>
          新增閾值
        </Button>
        <Select
          style={{ width: '100%' }}
          placeholder="選擇 Hope"
          value={hopeKey}
          onChange={(value) => setHopeKey(value)}
        >
          {hopes.map((hope) => (
            <Select.Option key={hope.key} value={hope.key}>
              {hope.name}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </Modal>
  );
};

export default AddPreceptModal;
