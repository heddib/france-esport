function validateCode(response) {
    console.log('VALIDATING CODE : ' + response.statusCode);
    
    return new Promise((resolve, reject) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log('CODE IS OK')
            resolve(response)
        }

        console.log('Response with code: ' + response.statusCode +
            '\nContent: ' + response.content.toString())
        reject('Response with code: ' + response.statusCode +
            '\nContent: ' + response.content.toString())
    })
}

function getJson(response) {
    return new Promise((resolve, reject) => {
        console.info('Content: ' + response.content.toString())
        resolve(response.content.toJSON())
    })
    .catch(e => {
        console.error('Error parsing JSON response: ' + e)
        throw 'Error parsing JSON response: ' + e
    })
}