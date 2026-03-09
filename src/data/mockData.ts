import type { Game, SleeveStock, PrintProject } from '~/types'

export const games: Game[] = [
  {
    id: 'g1',
    title: 'Gloomhaven',
    bggId: '174430',
    owned: true,
    playLog: [
      { date: '2026-01-10', players: 3, notes: 'Scenario 1 — victory!' },
      { date: '2026-01-24', players: 3, notes: 'Scenario 2' },
      { date: '2026-02-07', players: 4 },
    ],
    sleeves: [
      { name: 'Monster ability cards', type: 'Mayday Premium (63×88mm)', needed: 504, sleeved: 504 },
      { name: 'Item cards', type: 'Mayday Standard (63×88mm)', needed: 154, sleeved: 154 },
      { name: 'Attack modifier cards', type: 'Mayday Standard (63×88mm)', needed: 450, sleeved: 200 },
    ],
  },
  {
    id: 'g2',
    title: 'Wingspan',
    bggId: '266192',
    owned: true,
    playLog: [
      { date: '2026-01-05', players: 2 },
      { date: '2026-02-14', players: 4, notes: 'Valentines game night' },
    ],
    sleeves: [
      { name: 'Bird cards', type: 'Swan Panasia (63×88mm)', needed: 170, sleeved: 170 },
      { name: 'Bonus cards', type: 'Swan Panasia (63×88mm)', needed: 26, sleeved: 26 },
    ],
  },
  {
    id: 'g3',
    title: 'Terraforming Mars',
    bggId: '167791',
    owned: true,
    playLog: [
      { date: '2025-12-28', players: 3 },
      { date: '2026-03-01', players: 2 },
    ],
    sleeves: [
      { name: 'Project cards', type: 'Mayday Standard (63×88mm)', needed: 208, sleeved: 208 },
      { name: 'Corporation cards', type: 'Mayday Standard (63×88mm)', needed: 12, sleeved: 12 },
      { name: 'Prelude cards', type: 'Mayday Standard (63×88mm)', needed: 35, sleeved: 0 },
    ],
  },
  {
    id: 'g4',
    title: 'Root',
    bggId: '237182',
    owned: true,
    playLog: [{ date: '2026-02-22', players: 4 }],
    sleeves: [],
  },
  {
    id: 'g5',
    title: 'Spirit Island',
    bggId: '162886',
    owned: true,
    playLog: [],
    sleeves: [],
  },
  {
    id: 'g6',
    title: 'Ark Nova',
    bggId: '342942',
    owned: false,
    playLog: [],
    sleeves: [],
  },
]

export const sleeveStock: SleeveStock[] = [
  { id: 's1', brand: 'Mayday', size: 'Standard (63×88mm)', countInStock: 400 },
  { id: 's2', brand: 'Mayday', size: 'Premium (63×88mm)', countInStock: 150 },
  { id: 's3', brand: 'Swan Panasia', size: 'Standard (63×88mm)', countInStock: 300 },
  { id: 's4', brand: 'Mayday', size: 'Mini (44×68mm)', countInStock: 200 },
  { id: 's5', brand: 'FFG', size: 'Mini American (41×63mm)', countInStock: 50 },
]

export const printProjects: PrintProject[] = [
  { id: 'p1', name: 'Gloomhaven Monster Stands', gameId: 'g1', status: 'printed', notes: '3 full sets done' },
  { id: 'p2', name: 'Wingspan Bird Feeder Dice Tower', gameId: 'g2', status: 'printed' },
  { id: 'p3', name: 'Terraforming Mars Player Trays', gameId: 'g3', status: 'printing', notes: 'Currently on 3rd set' },
  { id: 'p4', name: 'Root Faction Tokens', gameId: 'g4', status: 'planned' },
  { id: 'p5', name: 'Spirit Island Custom Island Board', gameId: 'g5', status: 'planned', notes: 'Need to find a good model' },
  { id: 'p6', name: 'Generic Card Holder — Small', status: 'printed' },
  { id: 'p7', name: 'Insert Organizer v2', status: 'planned', notes: 'Universal design for medium boxes' },
]
