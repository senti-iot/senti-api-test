require('dotenv').load
const create = require('apisauce').create

// dotenv.load()

const apiRoute = '/weather/v2/2018-11-09T13:00:00/57.0488/9.9217/da'
const numRetry = 5

const api = create({
	baseURL: process.env.API_URL,
	timeout: 30000,
	headers: {
		'auth-token': process.env.AUTH_TOKEN
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
}


router.get('/:version/:date/:lat/:long/:lang', async (req, res, next) => {
	if (verifyAPIVersion(req.params.version)) {
		let response
		response = await getWeatherRetry(req.params.date, req.params.lat, req.params.long, req.params.lang, numRetry)
		res.json(response)
	} else {
		// Version error or test next version
		// response.headers.get('content-type').indexOf('javascript') === -1
		// let h = 
		if (req.params.version === 'v2') {
			// console.log(req.headers)
			res.json(req.headers)
		}
		// res.send(`API/weather version: ${req.params.version} not supported`)
	}
})