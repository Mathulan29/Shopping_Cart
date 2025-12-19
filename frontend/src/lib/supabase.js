import { createClient } from '@supabase/supabase-js'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isMock = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co'

class MockSupabaseClient {
  constructor() {
    this.auth = {
      getUser: async () => {
        const user = localStorage.getItem('mock_user')
        return { data: { user: user ? JSON.parse(user) : null }, error: null }
      },
      signInWithPassword: async ({ email }) => {
        const user = { id: 'mock-user-1', email }
        localStorage.setItem('mock_user', JSON.stringify(user))
        return { data: { user }, error: null }
      },
      signUp: async ({ email }) => {
        const user = { id: 'mock-user-1', email }
        localStorage.setItem('mock_user', JSON.stringify(user))
        return { data: { user }, error: null }
      },
      signOut: async () => {
        localStorage.removeItem('mock_user')
        return { error: null }
      },
      onAuthStateChange: (callback) => {
        // Trigger immediately
        callback('SIGNED_IN', localStorage.getItem('mock_user') ? { user: JSON.parse(localStorage.getItem('mock_user')) } : null)
        return { data: { subscription: { unsubscribe: () => { } } } }
      },
    }
  }

  from(table) {
    return new MockQueryBuilder(table)
  }
}

class MockDatabase {
  constructor() {
    this.storageKey = 'mock_supabase_db'
    this.load()
  }

  load() {
    const stored = localStorage.getItem(this.storageKey)
    this.data = stored ? JSON.parse(stored) : {
      categories: MOCK_CATEGORIES,
      products: MOCK_PRODUCTS,
      cart_items: []
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data))
  }

  table(tableName) {
    if (!this.data[tableName]) {
      this.data[tableName] = []
    }
    return this.data[tableName]
  }

  insert(tableName, rows) {
    const newRows = rows.map(row => ({
      id: `${tableName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      ...row
    }))
    this.data[tableName].push(...newRows)
    this.save()
    return newRows
  }

  update(tableName, match, updates) {
    const table = this.table(tableName)
    const updatedRows = []

    this.data[tableName] = table.map(row => {
      let isMatch = true
      for (const [key, value] of Object.entries(match)) {
        if (row[key] !== value) {
          isMatch = false
          break
        }
      }

      if (isMatch) {
        const updatedRow = { ...row, ...updates }
        updatedRows.push(updatedRow)
        return updatedRow
      }
      return row
    })

    this.save()
    return updatedRows
  }

  delete(tableName, match) {
    const table = this.table(tableName)
    const initialLength = table.length

    this.data[tableName] = table.filter(row => {
      for (const [key, value] of Object.entries(match)) {
        if (row[key] === value) return false
      }
      return true
    })

    this.save()
    return initialLength > this.data[tableName].length
  }
}

const mockDb = new MockDatabase()

class MockQueryBuilder {
  constructor(table) {
    this.table = table
    this.result = [...mockDb.table(table)]
    this.filters = {}
  }

  select(columns) {
    // Basic select support - ignoring specific columns for now, returns all
    return this
  }

  insert(data) {
    this.insertedData = mockDb.insert(this.table, Array.isArray(data) ? data : [data])
    return this
  }

  update(data) {
    this.updateData = data
    return this
  }

  delete() {
    this.isDelete = true
    return this
  }

  eq(column, value) {
    if (this.updateData) {
      // Perform update immediately for simplicity in this mock chain
      mockDb.update(this.table, { [column]: value }, this.updateData)
    } else if (this.isDelete) {
      mockDb.delete(this.table, { [column]: value })
    } else {
      this.result = this.result.filter(item => item[column] === value)
    }
    return this
  }

  in(column, values) {
    this.result = this.result.filter(item => values.includes(item[column]))
    return this
  }

  order(column, { ascending = true } = {}) {
    this.result.sort((a, b) => {
      if (a[column] < b[column]) return ascending ? -1 : 1
      if (a[column] > b[column]) return ascending ? 1 : -1
      return 0
    })
    return this
  }

  limit(count) {
    this.result = this.result.slice(0, count)
    return this
  }

  async then(resolve, reject) {
    // Simulate network delay
    setTimeout(() => {
      if (this.insertedData) {
        resolve({ data: this.insertedData, error: null })
      } else {
        resolve({ data: this.result, error: null })
      }
    }, 50)
  }
}

if (isMock) {
  console.info('%c Demo Mode Enabled ', 'background: #f97316; color: white; padding: 4px; border-radius: 4px;', 'Using mock data for demonstration.')
}

export const supabase = isMock
  ? new MockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey)
