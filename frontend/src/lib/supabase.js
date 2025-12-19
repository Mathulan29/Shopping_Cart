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

class MockQueryBuilder {
  constructor(table) {
    this.table = table
    this.data = table === 'categories' ? MOCK_CATEGORIES : table === 'products' ? MOCK_PRODUCTS : []
    this.filters = []
  }

  select(columns) {
    return this
  }

  insert(data) {
    // Mock insert - for cart, we'd ideally update local state, but for now just return success
    return this
  }

  update(data) {
    return this
  }

  delete() {
    return this
  }

  order(column, { ascending = true } = {}) {
    // Basic mock sort
    return this
  }

  limit(count) {
    this.data = this.data.slice(0, count)
    return this
  }

  eq(column, value) {
    this.data = this.data.filter(item => item[column] === value)
    return this
  }

  in(column, values) {
    this.data = this.data.filter(item => values.includes(item[column]))
    return this
  }

  async then(resolve, reject) {
    // Simulate network delay
    setTimeout(() => {
      resolve({ data: this.data, error: null })
    }, 100)
  }
}

if (isMock) {
  console.info('%c Demo Mode Enabled ', 'background: #f97316; color: white; padding: 4px; border-radius: 4px;', 'Using mock data for demonstration.')
}

export const supabase = isMock
  ? new MockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey)
