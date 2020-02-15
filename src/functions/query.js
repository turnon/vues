class Query {
  constructor() {
    this.conditions = {}
  }

  del(id) {
    delete this.conditions[id]
  }

  put(id, cond) {
    this.conditions[id] = cond
    console.log(JSON.stringify(this.conditions))
  }

  to_json() {
    let must = Object.values(this.conditions).reduce((arr, cond) => {
      cond = Array.isArray(cond) ? cond : [cond];
      return arr.concat(cond)
    }, [])

    return {
      bool: {
        filter: [{
          bool: {
            must: must
          }
        }]
      }
    }
  }

}

export default Query
