require('dotenv').load()
const create = require('apisauce').create
const { encrypt } = require('senti-apicore')

const { ENCRYPTION_KEY, API_LOCAL, API_DEV, API_URL } = process.env

const apiRoute = '/weather/v1/2018-11-09T13:00:00/57.0488/9.9217/da'
const numRetry = 5

const api = create({
	baseURL: API_LOCAL,
	timeout: 30000,
	headers: {
		'auth': encrypt(ENCRYPTION_KEY)
	}
})

const apiCall = async (n) => {
	let response
	try {
		response = await api.get(apiRoute)
	} catch (error) {
		if (n === 1) {
			console.error(error)
		}
		response = await apiCall(n - 1)
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
	response = await apiCall(numRetry)
	console.log(response)
	return
}

result()
