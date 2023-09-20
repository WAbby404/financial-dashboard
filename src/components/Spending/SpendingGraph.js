import React, { useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from "recharts";

function Spending(props) {
    const onMouseOver = useCallback((data, index) => {
      props.toSetCurrentCategory(index);
    }, []); // eslint-disable-line

    const onMouseLeave = useCallback((data, index) => {
      props.toSetCurrentCategory(null);
    }, []); // eslint-disable-line

    let colors = ['#fcba03', '#ec03fc', '#fc6f03', '#03befc', '#52fc03', '#3503fc'  ];

    const renderActiveShape = props => {
      const RADIAN = Math.PI / 180;
      const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        midAngle
      } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius - 85) * cos;
      const sy = cy + (outerRadius - 85) * sin;
      return (
        <Sector
          cx={sx}
          cy={sy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={props.payload.fill}
        />
      );
    };

    return (
        <figure className="xl:w-10/12 xl:h-4/5 xl:m-auto" aria-label='Spending Categories Pie Chart'>
           <ResponsiveContainer width="100%" height={250}>
            <PieChart height={250}>
              <Pie
                activeIndex={props.currentCategory}
                data={props.formattedTransactions}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                stroke= "#2e2270"
                outerRadius={100}
                activeShape={renderActiveShape}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
              >
              {props.formattedTransactions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </figure>
    );
}

export default Spending;