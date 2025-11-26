import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ScoreBreakdown } from '../types';

interface ScoreRadarProps {
  breakdown: ScoreBreakdown;
}

const ScoreRadar: React.FC<ScoreRadarProps> = ({ breakdown }) => {
  const data = [
    { subject: '内容 (Content)', A: breakdown.content, fullMark: 100 },
    { subject: '语法 (Grammar)', A: breakdown.grammar, fullMark: 100 },
    { subject: '连贯 (Coherence)', A: breakdown.coherence, fullMark: 100 },
    { subject: '格式 (Format)', A: breakdown.format, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="得分"
            dataKey="A"
            stroke="#2563eb"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            formatter={(value: number) => [`${value}/100`, '分数']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreRadar;