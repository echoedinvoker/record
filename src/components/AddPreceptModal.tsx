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

  useEffect(() => {
    if (!isVisible) {
      setName('');
      setBaseMultiplier(1);
      setThresholds([]);
      setHopeKey('');
    }
  }, [isVisible]);

  const handleAddThreshold = () => {
    setThresholds([...thresholds, { threshold: 0, multiplier: 1 }]);
  };

  const handleRemoveThreshold = (index: number) => {
    const newThresholds = thresholds.filter((_, i) => i !== index);
    setThresholds(newThresholds);
  };

  const handleThresholdChange = (index: number, field: 'threshold' | 'multiplier', value: number) => {
    const newThresholds = [...thresholds];
    newThresholds[index][field] = value;
    setThresholds(newThresholds);
  };

  const handleSubmit = () => {
    onAdd(name, baseMultiplier, thresholds, hopeKey);
    onClose();
  };

  return (
    <Modal
      title="新增 Precept"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>新增</Button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Precept 名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="基礎倍數"
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
            <Input
              type="number"
              placeholder="閾值"
              value={threshold.threshold}
              onChange={(e) => handleThresholdChange(index, 'threshold', Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="倍數"
              value={threshold.multiplier}
              onChange={(e) => handleThresholdChange(index, 'multiplier', Number(e.target.value))}
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
