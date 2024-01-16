import { Pagination } from 'antd';
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


const PopularProducts = ({products}) => {
	const inittial = () => ({
		data: products?.data,
		currentPage: 1,
		todosPerPage: 3
	  });
	const [limitProduct, setLimitProduct] = useState(inittial())

    const indexOfLastTodo = limitProduct?.currentPage * limitProduct?.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - limitProduct?.todosPerPage;

    const currentTodos = limitProduct?.data?.slice(indexOfFirstTodo, indexOfLastTodo);
	const handleLimitProduct = (value) => {
		setLimitProduct({
			...limitProduct,
			currentPage: Number(value)
		})
	}

	useEffect(() => {
		setLimitProduct({
			...limitProduct,
			data: products?.data,
		})
	},[products?.data])

	return (
		<div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
			<strong className="text-gray-700 font-medium">Popular Products</strong>
			<div className="mt-4 flex flex-col gap-3">
				{currentTodos?.map((product) => (
					<Link
						key={product?._id}
						to={`/productDetails/${product?._id}`}
						className="flex items-start hover:no-underline"
					>
						<div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
							<img
								className="w-full h-full object-cover rounded-lg"
								src={product?.image}
								alt={product?.name}
							/>
						</div>
						<div className="ml-4 flex-1">
							<p className="text-sm text-gray-800">{product?.name}</p>
							<span
								className={classNames(
									product?.countInStock === 0
										? 'text-red-500'
										: product?.countInStock > 50
										? 'text-green-500'
										: 'text-orange-500',
									'text-xs font-medium'
								)}
							>
								{product?.countInStock === 0 ? 'Out of Stock' : product?.countInStock + ' in Stock'}
							</span>
						</div>
						<div className="text-xs text-gray-400 pl-1.5">{product?.price}</div>
					</Link>
				))}
				<Pagination defaultCurrent={1} onChange={handleLimitProduct} total={products?.data?.length} />;
			</div>
		</div>
	)
}

export default PopularProducts
