import { createFileRoute } from '@tanstack/react-router'
import { getPrintProjects } from '~/lib/serverFns/prints'
import { getGames } from '~/lib/serverFns/games'
import type { PrintProject } from '~/types'
import SectionHeader from '~/components/SectionHeader/SectionHeader'
import RouteError from '~/components/RouteError/RouteError'
import styles from './index.module.css'

export const Route = createFileRoute('/prints/')({
  errorComponent: ({ error }) => <RouteError error={error as Error} />,
  loader: async () => {
    const [printProjects, games] = await Promise.all([getPrintProjects(), getGames()])
    const gameMap = Object.fromEntries(games.map((g) => [g.id, g.title]))
    return { printProjects, gameMap }
  },
  component: Prints,
})

type DotClass = 'dotPlanned' | 'dotPrinting' | 'dotPrinted'

const COLUMNS: { status: PrintProject['status']; label: string; dot: DotClass }[] = [
  { status: 'planned', label: 'Planned', dot: 'dotPlanned' },
  { status: 'printing', label: 'Printing', dot: 'dotPrinting' },
  { status: 'printed', label: 'Printed', dot: 'dotPrinted' },
]

function Prints() {
  const { printProjects, gameMap } = Route.useLoaderData()
  const printedCount = printProjects.filter((p) => p.status === 'printed').length

  return (
    <div>
      <SectionHeader
        title="3D Print Projects"
        subtitle={`${printedCount} completed · ${printProjects.length - printedCount} in progress or planned`}
      />

      <div className={styles.kanban}>
        {COLUMNS.map(({ status, label, dot }) => {
          const items = printProjects.filter((p) => p.status === status)
          return (
            <div key={status} className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={`${styles.dot} ${styles[dot]}`} />
                {label} ({items.length})
              </div>
              <div className={styles.cards}>
                {items.length === 0 ? (
                  <div className={styles.empty}>Nothing here yet</div>
                ) : (
                  items.map((p) => (
                    <div key={p.id} className={styles.card}>
                      <div className={styles.cardName}>{p.name}</div>
                      {p.gameId && gameMap[p.gameId] && (
                        <div className={styles.cardGame}>For: {gameMap[p.gameId]}</div>
                      )}
                      {p.notes && <div className={styles.cardNote}>{p.notes}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
