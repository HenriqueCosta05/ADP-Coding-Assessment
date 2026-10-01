export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
}

export interface User {
  id: number
  name: string
  address: Address | null
  phone: string | null
}
