import { createClient } from '@/lib/supabase/server'

export default async function TestSupabase() {
  const supabase = await createClient()
  
  // Test query to check connection
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(5)
  
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error.message}
        </div>
        <p className="mt-4 text-gray-600">
          This usually means your environment variables are not set correctly or the database hasn&apos;t been migrated yet.
        </p>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <strong>Success!</strong> Connected to Supabase successfully.
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Users Table Data:</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
