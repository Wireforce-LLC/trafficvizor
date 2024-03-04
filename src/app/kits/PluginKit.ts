import plugins from "../../../plugins";
import _ from "lodash";

export default class PluginKit {
  async getConfigs() {
    return require("../../../config.json")
  }

  async getPluginLinks(name: string) {
    return _.get(plugins(), name, null)
  }

  async getAllUiPlugins() {
    const plugins = await this.getConfigs()

    return (plugins?.plugins || undefined)?.filter((i: any) => i.type == 'UI')
  }
}

export const $pluginKit = new PluginKit()