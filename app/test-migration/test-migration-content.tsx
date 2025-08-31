'use client'

import { useProperties, useAgencies, useUsers, useReservations } from '@/lib/hooks'

export default function TestMigrationContent() {
  // Test all our migrated hooks
  const { 
    properties, 
    isLoading: isLoadingProperties, 
    isError: isErrorProperties,
    error: errorProperties 
  } = useProperties({ limit: 5 })

  const { 
    agencies, 
    isLoading: isLoadingAgencies, 
    isError: isErrorAgencies,
    error: errorAgencies 
  } = useAgencies()

  const { 
    users, 
    isLoading: isLoadingUsers, 
    isError: isErrorUsers,
    error: errorUsers 
  } = useUsers()

  const { 
    reservations, 
    isLoading: isLoadingReservations, 
    isError: isErrorReservations,
    error: errorReservations 
  } = useReservations()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Properties Test */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Properties</h2>
          {isLoadingProperties && <p className="text-muted-foreground">Loading...</p>}
          {isErrorProperties && <p className="text-red-400">Error: {errorProperties?.message}</p>}
          {properties && (
            <div>
              <p className="text-green-400 mb-2">✅ Loaded {properties.length} properties</p>
              <ul className="text-sm text-muted-foreground">
                {properties.slice(0, 3).map(property => (
                  <li key={property.id}>• {property.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Agencies Test */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Agencies</h2>
          {isLoadingAgencies && <p className="text-muted-foreground">Loading...</p>}
          {isErrorAgencies && <p className="text-red-400">Error: {errorAgencies?.message}</p>}
          {agencies && (
            <div>
              <p className="text-green-400 mb-2">✅ Loaded {agencies.length} agencies</p>
              <ul className="text-sm text-muted-foreground">
                {agencies.slice(0, 3).map(agency => (
                  <li key={agency.id}>• {agency.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Users Test */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Users</h2>
          {isLoadingUsers && <p className="text-muted-foreground">Loading...</p>}
          {isErrorUsers && <p className="text-red-400">Error: {errorUsers?.message}</p>}
          {users && (
            <div>
              <p className="text-green-400 mb-2">✅ Loaded {users.length} users</p>
              <ul className="text-sm text-muted-foreground">
                {users.slice(0, 3).map(user => (
                  <li key={user.id}>• {user.name} ({user.role})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Reservations Test */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Reservations</h2>
          {isLoadingReservations && <p className="text-muted-foreground">Loading...</p>}
          {isErrorReservations && <p className="text-red-400">Error: {errorReservations?.message}</p>}
          {reservations && (
            <div>
              <p className="text-green-400 mb-2">✅ Loaded {reservations.length} reservations</p>
              <ul className="text-sm text-muted-foreground">
                {reservations.slice(0, 3).map(reservation => (
                  <li key={reservation.id}>• {reservation.scheduled_date} - {reservation.status}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Migration Status</h3>
        <p className="text-muted-foreground">
          This page tests all migrated endpoints using Supabase GraphQL hooks. 
          If you see green checkmarks above, the migration is working correctly!
        </p>
      </div>
    </>
  )
}
