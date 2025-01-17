import fs from 'fs'

import requiredArg from './requiredArg'
import arrayPathToString from './arrayPathToString'

export default (path = requireArg('path')) => {
	if (Array.isArray(path)) {
		return fs.existsSync(arrayPathToString(path))
	} else if (typeof path === 'string') {
		return fs.existsSync(path)
	}
	throw new Error('The argument was expected to be type "String" or "Array<String>".')
}
