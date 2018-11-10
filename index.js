require('dotenv').load()
const create = require('apisauce').create
const { encrypt } = require('./lib/encryption')
// const { encrypt, decrypt } = require('./lib/encryption')

const { ENCRYPTION_KEY, API_URL_TEST } = process.env

const apiRoute = '/weather/v2/2018-11-09T13:00:00/57.0488/9.9217/da'
const numRetry = 5

let tokenEncrypted = encrypt(ENCRYPTION_KEY)

const api = create({
	baseURL: API_URL_TEST,
	timeout: 30000,
	headers: {
		'auth': tokenEncrypted
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
		console.log('API/weather returned:', response.status, Date())
		return response.data
	} else {
		console.log('API/weather Error:', response.problem)
		return null
	}
}

const result = async () => {
	let response
	response = await apiCall(numRetry)
	console.log(response)
	return
}

result()
