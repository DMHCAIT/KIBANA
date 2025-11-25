'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, MapPin, Check } from 'lucide-react'
import { AddressManager } from '@/components/store/AddressManager'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  is_default?: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // For now, using localStorage. In production, use a proper addresses table
    const saved = JSON.parse(localStorage.getItem('user_addresses') || '[]')
    setAddresses(saved)
    setLoading(false)
  }

  const handleSave = async (address: Address) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let updated: Address[]
    
    if (editingAddress) {
      // Update existing
      updated = addresses.map(a => 
        a.id === editingAddress.id 
          ? { ...address, id: editingAddress.id }
          : address.is_default ? { ...a, is_default: false } : a
      )
    } else {
      // Add new
      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      }
      updated = [
        ...addresses.map(a => address.is_default ? { ...a, is_default: false } : a),
        newAddress,
      ]
    }

    localStorage.setItem('user_addresses', JSON.stringify(updated))
    setAddresses(updated)
    setShowAddModal(false)
    setEditingAddress(null)
    toast.success(editingAddress ? 'Address updated' : 'Address added')
  }

  const handleDelete = (id: string) => {
    const updated = addresses.filter(a => a.id !== id)
    localStorage.setItem('user_addresses', JSON.stringify(updated))
    setAddresses(updated)
    toast.success('Address deleted')
  }

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === id,
    }))
    localStorage.setItem('user_addresses', JSON.stringify(updated))
    setAddresses(updated)
    toast.success('Default address updated')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Button onClick={() => {
          setEditingAddress(null)
          setShowAddModal(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Addresses Saved</h3>
            <p className="text-muted-foreground mb-4">
              Add your first address to get started
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={address.is_default ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                    {address.is_default && (
                      <Badge>
                        <Check className="mr-1 h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAddress(address)
                        setShowAddModal(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddressManager
          address={editingAddress}
          onSave={handleSave}
          open={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingAddress(null)
          }}
        />
      )}
    </div>
  )
}

