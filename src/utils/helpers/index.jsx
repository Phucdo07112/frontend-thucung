export function getOrderStatus(status) {
	switch (status) {
		case 'Đơn Hàng Đã Đặt':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-sky-600 bg-sky-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'Đã Xác Nhận Thông Tin':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-orange-600 bg-orange-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'Đã Giao Cho ĐVVC':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-teal-600 bg-teal-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'OUT_FOR_DELIVERY':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-yellow-600 bg-yellow-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		case 'Đã Nhận Được Hàng':
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-green-600 bg-green-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
		default:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-md text-gray-600 bg-gray-100">
					{status.replaceAll('_', ' ').toLowerCase()}
				</span>
			)
	}
}
