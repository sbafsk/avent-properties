import { gql } from '@apollo/client'

export const typeDefs = gql`
	type User {
		id: ID!
		email: String!
		name: String!
		role: UserRole!
		created_at: String!
		updated_at: String!
		reservations: [TourReservation!]
	}

	enum UserRole {
		ADMIN
		CLIENT
		AGENCY
	}

	type Property {
		id: ID!
		title: String!
		description: String!
		price: Float!
		currency: String!
		city: String!
		neighborhood: String
		property_type: String!
		bedrooms: Int
		bathrooms: Int
		area_m2: Int
		amenities: [String!]
		images: [String!]
		status: PropertyStatus!
		agency_id: String!
		created_at: String!
		updated_at: String!
		agency: Agency
		reservations: [TourReservation!]
	}

	enum PropertyStatus {
		AVAILABLE
		RESERVED
		SOLD
	}

	type Agency {
		id: ID!
		name: String!
		email: String!
		phone: String
		address: String
		properties: [Property!]
		created_at: String!
		updated_at: String!
	}

	type TourReservation {
		id: ID!
		user: User!
		property: Property!
		scheduled_date: String!
		deposit_amount: Float!
		status: ReservationStatus!
		created_at: String!
		updated_at: String!
	}

	enum ReservationStatus {
		PENDING
		CONFIRMED
		CANCELLED
		COMPLETED
	}

	type Transaction {
		id: ID!
		amount: Float!
		type: TransactionType!
		status: TxStatus!
		reservation_id: String
		user_id: String!
		created_at: String!
		updated_at: String!
	}

	enum TransactionType {
		DEPOSIT
		COMMISSION
		REFUND
	}

	enum TxStatus {
		PENDING
		PAID
		FAILED
		REFUNDED
	}

	type ContactRequest {
		id: ID!
		name: String!
		email: String!
		phone: String
		message: String!
		property_id: String
		status: ContactStatus!
		created_at: String!
		updated_at: String!
	}

	enum ContactStatus {
		NEW
		IN_PROGRESS
		RESOLVED
		CLOSED
	}

	type Query {
		# User queries
		me: User
		users: [User!]!
		user(id: ID!): User

		# Property queries
		properties(
			city: String
			property_type: String
			min_price: Float
			max_price: Float
			bedrooms: Int
			status: PropertyStatus
			limit: Int
			offset: Int
		): [Property!]!
		property(id: ID!): Property
		propertiesByAgency(agency_id: ID!): [Property!]!

		# Agency queries
		agencies: [Agency!]!
		agency(id: ID!): Agency

		# Reservation queries
		reservations: [TourReservation!]!
		reservation(id: ID!): TourReservation
		userReservations(user_id: ID!): [TourReservation!]!
		propertyReservations(property_id: ID!): [TourReservation!]!

		# Transaction queries
		transactions: [Transaction!]!
		transaction(id: ID!): Transaction
		userTransactions(user_id: ID!): [Transaction!]!

		# Contact queries
		contactRequests: [ContactRequest!]!
		contactRequest(id: ID!): ContactRequest
	}

	type Mutation {
		# User mutations
		createUser(input: CreateUserInput!): User!
		updateUser(id: ID!, input: UpdateUserInput!): User!
		deleteUser(id: ID!): Boolean!

		# Property mutations
		createProperty(input: CreatePropertyInput!): Property!
		updateProperty(id: ID!, input: UpdatePropertyInput!): Property!
		deleteProperty(id: ID!): Boolean!

		# Agency mutations
		createAgency(input: CreateAgencyInput!): Agency!
		updateAgency(id: ID!, input: UpdateAgencyInput!): Agency!
		deleteAgency(id: ID!): Boolean!

		# Reservation mutations
		createReservation(input: CreateReservationInput!): TourReservation!
		updateReservation(id: ID!, input: UpdateReservationInput!): TourReservation!
		cancelReservation(id: ID!): TourReservation!

		# Transaction mutations
		createTransaction(input: CreateTransactionInput!): Transaction!
		updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!

		# Contact mutations
		createContactRequest(input: CreateContactRequestInput!): ContactRequest!
		updateContactRequest(id: ID!, input: UpdateContactRequestInput!): ContactRequest!
	}

	# Input types
	input CreateUserInput {
		email: String!
		name: String!
		role: UserRole!
	}

	input UpdateUserInput {
		email: String
		name: String
		role: UserRole
	}

	input CreatePropertyInput {
		title: String!
		description: String!
		price: Float!
		currency: String!
		city: String!
		neighborhood: String
		property_type: String!
		bedrooms: Int
		bathrooms: Int
		area_m2: Int
		amenities: [String!]
		images: [String!]
		status: PropertyStatus!
		agency_id: String!
	}

	input UpdatePropertyInput {
		title: String
		description: String
		price: Float
		currency: String
		city: String
		neighborhood: String
		property_type: String
		bedrooms: Int
		bathrooms: Int
		area_m2: Int
		amenities: [String!]
		images: [String!]
		status: PropertyStatus
		agency_id: String
	}

	input CreateAgencyInput {
		name: String!
		email: String!
		phone: String
		address: String
	}

	input UpdateAgencyInput {
		name: String
		email: String
		phone: String
		address: String
	}

	input CreateReservationInput {
		user_id: String!
		property_id: String!
		scheduled_date: String!
		deposit_amount: Float!
	}

	input UpdateReservationInput {
		scheduled_date: String
		deposit_amount: Float
		status: ReservationStatus
	}

	input CreateTransactionInput {
		amount: Float!
		type: TransactionType!
		reservation_id: String
		user_id: String!
	}

	input UpdateTransactionInput {
		amount: Float
		type: TransactionType
		status: TxStatus
	}

	input CreateContactRequestInput {
		name: String!
		email: String!
		phone: String
		message: String!
		property_id: String
	}

	input UpdateContactRequestInput {
		status: ContactStatus
	}
`
