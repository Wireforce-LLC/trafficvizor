import dynamic from "next/dynamic";

let plugins: {[key: string]: any} = {}

function registerPlugin(name: string, path: any|undefined = undefined) {
  plugins[name] = path.default
}

export default () => {
  return plugins
}

// registerPlugin("CloudFunctions", require(`@/../plugins/CloudFunctions`))