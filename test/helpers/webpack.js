import del from 'del'
import path from 'path'
import webpack from 'webpack'
import MemoryFS from 'memory-fs'

const module = config => {
	return {
		rules: config.rules
			? config.rules
			: config.loader
			? [
					{
						test: (config.loader && config.loader.test) || /\.txt$/,
						use: {
							loader: path.resolve(__dirname, '../../src'),
							options: (config.loader && config.loader.options) || {},
						},
					},
			  ]
			: [],
	}
}

const plugins = config => [].concat(config.plugins || [])

const output = config => {
	return {
		path: path.resolve(__dirname, `../outputs/${config.output ? config.output : ''}`),
		filename: '[name].docs.md',
	}
}

export default function(fixture, config, options) {
	config = {
		mode: 'development',
		devtool: config.devtool || 'sourcemap',
		context: path.resolve(__dirname, '..', 'fixtures'),
		entry: `./${fixture}`,
		output: output(config),
		module: module(config),
		plugins: plugins(config),
		optimization: {
			runtimeChunk: true,
		},
	}

	options = Object.assign({ output: false }, options)

	if (options.output) del.sync(config.output.path)

	const compiler = webpack(config)

	if (!options.output) compiler.outputFileSystem = new MemoryFS()

	return new Promise((resolve, reject) =>
		compiler.run((err, stats) => {
			if (err) reject(err)

			resolve(stats)
		})
	)
}
