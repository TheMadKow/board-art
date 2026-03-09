import { createFileRoute, Link } from '@tanstack/react-router'
import { getGames } from '~/lib/serverFns/games'
import { getSleevingData } from '~/lib/serverFns/sleeving'
import { getPrintProjects } from '~/lib/serverFns/prints'
import styles from './index.module.css'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [games, { games: sleeveGames }, printProjects] = await Promise.all([
      getGames(),
      getSleevingData(),
      getPrintProjects(),
    ])
    return { games, sleeveGames, printProjects }
  },
  component: Dashboard,
})

function Dashboard() {
  const { games, sleeveGames, printProjects } = Route.useLoaderData()

  const ownedCount = games.filter((g) => g.owned).length
  const totalSessions = games.reduce((sum, g) => sum + g.playLog.length, 0)

  const ownedWithSleeves = sleeveGames.filter((g) => g.sleeves.length > 0)
  const fullySleevedCount = ownedWithSleeves.filter((g) =>
    g.sleeves.every((s) => s.sleeved >= s.needed)
  ).length

  const printedCount = printProjects.filter((p) => p.status === 'printed').length
  const pendingPrints = printProjects.filter((p) => p.status !== 'printed').length

  return (
    <div>
      <div className={styles.hero}>
        <h1>
          Welcome to <span>BoardArt</span>
        </h1>
        <p>Your board game collection, sleeves, and 3D print projects — all in one place.</p>
      </div>

      <div className={styles.cards}>
        <Link to="/library" className={styles.card}>
          <div className={styles.cardIcon}>🎲</div>
          <div className={styles.cardTitle}>Library</div>
          <div className={styles.cardStat}>{ownedCount}</div>
          <div className={styles.cardDesc}>
            games owned &mdash; {totalSessions} total play sessions logged
          </div>
        </Link>

        <Link to="/sleeving" className={styles.card}>
          <div className={styles.cardIcon}>🃏</div>
          <div className={styles.cardTitle}>Sleeving</div>
          <div className={styles.cardStat}>{fullySleevedCount}</div>
          <div className={styles.cardDesc}>
            games fully sleeved &mdash; {ownedWithSleeves.length - fullySleevedCount} partially or unstarted
          </div>
        </Link>

        <Link to="/prints" className={styles.card}>
          <div className={styles.cardIcon}>🖨️</div>
          <div className={styles.cardTitle}>3D Prints</div>
          <div className={styles.cardStat}>{printedCount}</div>
          <div className={styles.cardDesc}>
            projects completed &mdash; {pendingPrints} in progress or planned
          </div>
        </Link>
      </div>
    </div>
  )
}
