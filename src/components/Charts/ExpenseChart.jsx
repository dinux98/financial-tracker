import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlobalContext } from '../../context/GlobalState';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#64748b'];

export const ExpenseChart = () => {
    const { transactions } = useContext(GlobalContext);

    // Filter expenses and aggregate by category
    const expenseData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const data = Object.keys(expenseData).map(key => ({
        name: key,
        value: expenseData[key]
    })).filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
                    <p className="font-bold text-slate-800">{payload[0].name}</p>
                    <p className="text-primary font-medium">
                        Rs {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center h-80">
                <p className="text-slate-400 font-medium">No expenses to display yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Spending Breakdown</h3>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
