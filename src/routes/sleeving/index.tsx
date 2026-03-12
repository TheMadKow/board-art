import { createFileRoute } from '@tanstack/react-router'
import { getSleevingData } from '~/lib/serverFns/sleeving'
import SectionHeader from '~/components/SectionHeader/SectionHeader'
import RouteError from '~/components/RouteError/RouteError'
import styles from './index.module.css'

export const Route = createFileRoute('/sleeving/')({
  errorComponent: ({ error }) => <RouteError error={error as Error} />,
  loader: () => getSleevingData(),
  component: Sleeving,
})

function sleeveProgress(needed: number, sleeved: number) {
  if (needed === 0) {
    return null
  }
  const pct = Math.round((sleeved / needed) * 100)
  return { pct, complete: sleeved >= needed }
}

function Sleeving() {
  const { games, stock } = Route.useLoaderData()

  const gamesWithSleeves = games.filter((g) => g.sleeves.length > 0)
  const fullySleevedCount = gamesWithSleeves.filter((g) =>
    g.sleeves.every((s) => s.sleeved >= s.needed)
  ).length

  return (
    <div>
      <SectionHeader
        title="Sleeving Tracker"
        subtitle={`${fullySleevedCount} of ${gamesWithSleeves.length} games fully sleeved`}
      />

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Per-Game Sleeve Status</div>
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Component</th>
                <th>Type</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {gamesWithSleeves.flatMap((game) =>
                game.sleeves.map((sleeve, i) => {
                  const progress = sleeveProgress(sleeve.needed, sleeve.sleeved)
                  return (
                    <tr key={sleeve.id}>
                      {i === 0 ? (
                        <td rowSpan={game.sleeves.length} className={styles.gameCell}>
                          {game.title}
                        </td>
                      ) : null}
                      <td>{sleeve.name}</td>
                      <td className={styles.sleeveType}>{sleeve.type}</td>
                      <td>
                        {progress ? (
                          <span
                            className={
                              progress.complete ? styles.sleevedYes : styles.sleevedPartial
                            }
                          >
                            {sleeve.sleeved}/{sleeve.needed} ({progress.pct}%)
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
              {games
                .filter((g) => g.sleeves.length === 0)
                .map((game) => (
                  <tr key={game.id}>
                    <td>{game.title}</td>
                    <td colSpan={3} className={styles.sleevedNo}>
                      Not sleeved
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>Sleeve Inventory</div>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Size</th>
                <th>In Stock</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.id}>
                  <td>{s.brand}</td>
                  <td>{s.size}</td>
                  <td className={s.countInStock < 100 ? styles.stockLow : styles.stockOk}>
                    {s.countInStock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
