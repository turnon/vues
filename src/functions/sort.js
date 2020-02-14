class Sort {
  constructor() {
    this.sortors = {}
    this.seq = []
  }

  add_sortor(id, sortor) {
    this.sortors[id] = sortor
    this.seq.push(id)
    console.log(JSON.stringify(this.to_json()))
  }

  to_json() {
    let arr = this.seq.reduce((result, id) => {
      let sortor = this.sortors[id]
      if (sortor) result.push(sortor)
      return result
    }, [])
    if (!arr.length) arr.push("_doc")
    return arr
  }
}

export default Sort
