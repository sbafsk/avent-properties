import { createClient } from '@/lib/supabase/server'

export default async function TestDB() {
  const supabase = await createClient()
  
  // Test query to check connection
  const { data: agencies, error: agenciesError } = await supabase
    .from('agencies')
    .select('*')
    .limit(5)
  
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .limit(5)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agencies</h2>
          {agenciesError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {agenciesError.message}
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success!</strong> Found {agencies?.length || 0} agencies
            </div>
          )}
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(agencies, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Properties</h2>
          {propertiesError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {propertiesError.message}
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success!</strong> Found {properties?.length || 0} properties
            </div>
          )}
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(properties, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
