import axios from "axios"
import Idx from "./idx.js"

async function load_mappings() {
  let indexes = {}
  await axios.get("/_mapping").then(res => {
    for (let index in res.data) {
      let mappings = res.data[index]['mappings']
      for (let type in mappings) {
        let props = mappings[type]['properties']
        delete props["id"]
        let idx = new Idx(index, type, props)
        indexes[idx.index_type] = idx
      }
    }
  })

  return indexes
}

export default load_mappings
