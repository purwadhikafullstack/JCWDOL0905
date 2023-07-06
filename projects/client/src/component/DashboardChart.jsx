import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DashboardChart({ data, plotConfig, maxY }) {
  const GradientColors = () => {
    return (
      <defs>
        <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="#8884d8" stopOpacity={0.7} />
          <stop offset="75%" stopColor="#ff9bff81" stopOpacity={0.5} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
        </linearGradient>
      </defs>
    );
  };

  const formatYAxis = (tick) => {
    return new Intl.NumberFormat("id-ID").format(tick);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ResponsiveContainer width={"90%"} height={300}>
            <AreaChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#8884d8"
                opacity={0.4}
              />
              <XAxis
                dataKey="name"
                label={{ value: "Month", position: "insideBottom", offset: -5, style: { fontWeight: "bold", fontFamily: "Calibri", fontSize: 17 }, }}
                height={35}
              />
              <YAxis
                domain={[0, maxY]}
                label={{
                  value: "Sales (IDR)",
                  angle: -90,
                  position: "insideLeft",
                  dx: -5,
                  style: { fontWeight: "bold", fontFamily: "Calibri", fontSize: 17 },
                }}
                width={70}
                tickFormatter={formatYAxis}
              />
              <Tooltip />
              <defs>
                <GradientColors />
              </defs>
              {plotConfig.map((data, index) => (
                <Area
                  key={`area-${index}`}
                  type="monotone"
                  dataKey={data.key}
                  stroke={data.color}
                  strokeWidth={3}
                  strokeOpacity={1}
                  fill="url(#colorView)"
                />
              ))}
            </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardChart;
