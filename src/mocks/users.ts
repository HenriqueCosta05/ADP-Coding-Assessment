import type { User } from '../types/user'

export const mockUsers: readonly User[] = [
  // users from API were deleted, so I created new mock users with different names and addresses
  {
    id: 11,
    name: 'Anna Martins',
    address: { street: 'Rua das Flores', suite: 'Apt. 12', city: 'Campinas', zipcode: '13010-110' },
    phone: '+55 19 91234-0011',
  },
  {
    id: 12,
    name: 'Bruno Carvalho',
    address: { street: 'Avenida Central', suite: 'Suite 301', city: 'Belo Horizonte', zipcode: '30110-000' },
    phone: '+55 31 98765-4012',
  },
  {
    id: 13,
    name: 'Carla Mendes',
    address: { street: 'Rua do Sol', suite: 'Apt. 45', city: 'Recife', zipcode: '50030-230' },
    phone: '+55 81 99876-5013',
  },
  {
    id: 14,
    name: 'Diego Almeida',
    address: { street: 'Travessa Verde', suite: 'Suite 7', city: 'Curitiba', zipcode: '80010-000' },
    phone: '+55 41 99123-4514',
  },
  {
    id: 15,
    name: 'Elisa Ferreira',
    address: { street: 'Rua Nova', suite: 'Apt. 88', city: 'Porto Alegre', zipcode: '90010-100' },
    phone: '+55 51 98456-7815',
  },
  {
    id: 16,
    name: 'Fabio Nogueira',
    address: { street: 'Alameda Azul', suite: 'Suite 210', city: 'Salvador', zipcode: '40010-020' },
    phone: '+55 71 99234-5616',
  },
  {
    id: 17,
    name: 'Gabriela Rocha',
    address: { street: 'Rua Alta', suite: 'Apt. 3', city: 'Fortaleza', zipcode: '60010-000' },
    phone: '+55 85 98765-1217',
  },
  {
    id: 18,
    name: 'Hugo Teixeira',
    address: { street: 'Avenida Mar', suite: 'Suite 99', city: 'Florianopolis', zipcode: '88010-000' },
    phone: '+55 48 99345-6718',
  },
  {
    id: 19,
    name: 'Isabela Costa',
    address: { street: 'Rua Clara', suite: 'Apt. 140', city: 'Brasilia', zipcode: '70040-010' },
    phone: '+55 61 98123-9019',
  },
  {
    id: 20,
    name: 'Joao Pereira',
    address: { street: 'Praca Velha', suite: 'Suite 5', city: 'Manaus', zipcode: '69010-000' },
    phone: '+55 92 99456-3220',
  },
]
