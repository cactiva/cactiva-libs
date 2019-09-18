import React from 'react';
import * as IconSource from '@expo/vector-icons';

interface IconProps {
  source: any;
  name: string;
  size?: number;
  color?: string;
}
export default ({ source, name, size, color }: IconProps) => {
  const Icon: any = (IconSource as any)[source];

  return <Icon name={name} size={size} color={color} />;
};
