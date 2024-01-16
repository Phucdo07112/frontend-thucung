import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import PieChartComponent from './AdminOrder/PieChart'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from "../services/OrderService";
import { useSelector } from 'react-redux';
const data = [
	{ name: 'Male', value: 540 },
	{ name: 'Female', value: 620 },
	{ name: 'Other', value: 210 }
]

const RADIAN = Math.PI / 180
const COLORS = ['#00C49F', '#FFBB28', '#FF8042']

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}


export default function BuyerProfilePieChart() {
	const user = useSelector((state) => state?.user);
	const getAllOrder = async () => {
		const res = await OrderService.getAllOrder(user?.access_token);
		return res;
	  };
	const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
	  const { isLoading: isLoadingOrders, data: orders } = queryOrder;
	return (
		<div className="w-[20rem] h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
			<strong className="text-gray-700 font-medium">Payment methods</strong>
			<div className="mt-3 w-full flex-1 text-xs">
				<div style={{ height: "100%", width: "100%" }}>
					<PieChartComponent data={orders?.data} />
				</div>
			</div>
		</div>
	)
}
