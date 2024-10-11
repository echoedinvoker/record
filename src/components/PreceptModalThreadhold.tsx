import { useContext } from "react";
import { Threshold } from "../services/precepts";
import { MinusCircleOutlined } from '@ant-design/icons';
import { PreceptsContext } from "../context/preceptsContext";
import { Input, Select, Space } from 'antd';

interface PreceptModalThreadholdProps {
  threshold: Threshold;
  index: number;
}

export default function PreceptModalThreadhold({ threshold, index }: PreceptModalThreadholdProps) {
  const {
    handleThresholdChange,
    handleRemoveThreshold,
  } = useContext(PreceptsContext);

  return (
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
  )
}
