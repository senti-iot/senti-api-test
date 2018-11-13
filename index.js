const { api } = require('senti-apicore')

const apiRoute1 = '/weather/v1/2018-11-09T13:00:00/57.0488/9.9217/da'
const apiRoute2 = '/weather/v2/2018-11-09T13:00:00/57.0488/9.9217/da'
const apiRoute3 = '/template/v1'
const apiRoute4 = '/template/v2'
const numRetry = 5

const apiCall = async (route, n) => {
	let response
	try {
		response = await api.get(route)
	} catch (error) {
		if (n === 1) {
			console.error(error)
		}
		response = await apiCall(route, n - 1)
	}
	// check response	
	if (response.ok && response.status == 200) {
		console.log('API/weather:', response.status, Date())
		return response.data
	} else {
		console.log('API/weather Error:', response.problem, Date())
		return 403
	}
}

const result = async () => {
	let response
	// response = await apiCall(apiRoute1, numRetry)
	// console.log(response)
	response = await apiCall(apiRoute2, numRetry)
	console.log(response)
	response = await apiCall(apiRoute3, numRetry)
	console.log(response)
	response = await apiCall(apiRoute4, numRetry)
	console.log(response)
	return
}

result()
