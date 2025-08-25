import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Eye, DollarSign, TrendingUp, Users, Home } from "lucide-react"

interface Transaction {
  id: string
  type: "tour_booking" | "property_purchase" | "commission" | "refund"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded"
  clientName: string
  clientEmail: string
  propertyTitle: string
  agentName: string
  date: string
  description: string
}

interface AdminTransactionTableProps {
  transactions: Transaction[]
}

export function AdminTransactionTable({ transactions }: AdminTransactionTableProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "property_purchase":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "tour_booking":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "commission":
        return "bg-gold/20 text-gold border-gold/30"
      case "refund":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "refunded":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalRevenue = transactions
    .filter((t) => t.status === "completed" && t.type !== "refund")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)

  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const uniqueClients = new Set(transactions.map((t) => t.clientEmail)).size

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-luxury text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-luxury text-2xl font-bold text-gold">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-luxury text-sm text-muted-foreground">Pending</p>
              <p className="text-luxury text-2xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-luxury text-sm text-muted-foreground">Transactions</p>
              <p className="text-luxury text-2xl font-bold text-green-400">{completedTransactions}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-luxury text-sm text-muted-foreground">Unique Clients</p>
              <p className="text-luxury text-2xl font-bold text-blue-400">{uniqueClients}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-10 glass border-white/20" />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-48 glass border-white/20">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="property_purchase">Property Purchase</SelectItem>
                <SelectItem value="tour_booking">Tour Booking</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-48 glass border-white/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="glass border-white/20 text-foreground hover:border-gold hover:text-gold bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Transactions Table */}
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">
                  Transaction
                </th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Property</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Agent</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-2 text-luxury text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      <p className="text-luxury text-xs text-muted-foreground">#{transaction.id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <p className="text-luxury text-sm text-foreground font-medium">{transaction.clientName}</p>
                      <p className="text-luxury text-xs text-muted-foreground">{transaction.clientEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-luxury text-sm text-foreground">{transaction.propertyTitle}</p>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-luxury text-sm text-foreground">{transaction.agentName}</p>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-luxury text-sm font-bold text-gold">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-luxury text-sm text-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <Button variant="ghost" size="sm" className="text-foreground hover:text-gold">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="heading-luxury text-xl text-foreground mb-2">No Transactions Found</h3>
            <p className="text-luxury text-muted-foreground">
              Transactions will appear here once clients start booking.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
