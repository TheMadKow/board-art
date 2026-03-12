import { createFileRoute } from '@tanstack/react-router'
import { getGames } from '~/lib/serverFns/games'
import SectionHeader from '~/components/SectionHeader/SectionHeader'
import RouteError from '~/components/RouteError/RouteError'
import { LOCALE } from '~/lib/constants'
import styles from './index.module.css'

export const Route = createFileRoute('/library/')({
  errorComponent: ({ error }) => <RouteError error={error as Error} />,
  loader: () => getGames(),
  component: Library,
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Library() {
  const games = Route.useLoaderData()

  return (
    <div>
      <SectionHeader
        title="Game Library"
        subtitle={`${games.filter((g) => g.owned).length} owned · ${games.length} total tracked`}
      />

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Sessions</th>
              <th>Last Played</th>
              <th>Recent Note</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const sorted = [...game.playLog].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              const last = sorted[0]

              return (
                <tr key={game.id}>
                  <td>{game.title}</td>
                  <td>
                    <span className={`${styles.badge} ${game.owned ? styles.owned : styles.wishlist}`}>
                      {game.owned ? 'Owned' : 'Wishlist'}
                    </span>
                  </td>
                  <td className={styles.sessions}>
                    {game.playLog.length > 0
                      ? `${game.playLog.length} session${game.playLog.length !== 1 ? 's' : ''}`
                      : <span className={styles.noSessions}>Never played</span>}
                  </td>
                  <td className={styles.sessions}>
                    {last ? formatDate(last.date) : '—'}
                  </td>
                  <td className={styles.sessions}>
                    {last?.notes ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
