import Vue from 'vue'
import Vuex from 'vuex'
import Es from './es.js'

Vue.use(Vuex)

function handle_err(err) {
  return err.response ? JSON.stringify(err.response) : err
}

function construct_conditions(options) {
  let group_by_field = options.reduce((group_by_field, node) => {
    let group = group_by_field[node.field] || [];
    group.push(node.value);
    group_by_field[node.field] = group;
    return group_by_field
  }, {})


  let conditions = []
  for (let field in group_by_field) {
    let values = group_by_field[field]
    let condition = {
      terms: {
        [field]: values
      }
    }
    conditions.push(condition)
  }

  return conditions
}

function construct_query_body(picked) {
  return {
    bool: {
      filter: [{
        bool: {
          must: construct_conditions(picked.included),
          must_not: construct_conditions(picked.excluded)
        }
      }]
    }
  }
}

export default new Vuex.Store({
  state: {
    es: null,
    alarm: null,
    selected: {},
    picked: [],
    aggs: [],
    result: {}
  },

  getters: {
    has_alarm(state) {
      return state.alarm !== null
    },
    has_aggs(state) {
      return !!state.aggs.length
    }
  },

  mutations: {
    refresh(state, new_state) {
      for (let key in new_state) {
        state[key] = new_state[key]
      }
    },

    pick(state, nodes) {
      state.picked = nodes
    },
  },

  actions: {
    change_index(ctx, index) {
      let es = new Es(index)
      ctx.commit('refresh', {
        es: es
      })

      es.aggs_result().then(res => {
        ctx.commit('refresh', {
          aggs: res,
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          aggs: [],
          alarm: handle_err(err)
        })
      })
    },

    submit(ctx) {
      ctx.state.es.search(construct_query_body(ctx.state.picked)).then(res => {
        ctx.commit('refresh', {
          result: res,
          alarm: null
        })
      }).catch(err => {
        ctx.commit('refresh', {
          result: {},
          alarm: handle_err(err)
        })
      })
    }
  }
})
