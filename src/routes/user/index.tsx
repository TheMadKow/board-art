import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getSettings, saveSettings, syncBggCollection } from '~/lib/serverFns/user'
import type { SyncResult } from '~/lib/serverFns/user'
import RouteError from '~/components/RouteError/RouteError'
import SectionHeader from '~/components/SectionHeader/SectionHeader'
import styles from './index.module.css'

export const Route = createFileRoute('/user/')({
  errorComponent: ({ error }) => <RouteError error={error as Error} />,
  loader: () => getSettings(),
  component: UserPage,
})

function UserPage() {
  const settings = Route.useLoaderData()
  const router = useRouter()

  const [username, setUsername] = useState(settings.bggUsername ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await saveSettings({ data: { bggUsername: username.trim() } })
    setSaving(false)
    setSaved(true)
  }

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    setSyncError(null)
    try {
      const result = await syncBggCollection({ data: { username: username.trim() } })
      setSyncResult(result)
      router.invalidate()
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const canSync = username.trim().length > 0 && !syncing

  return (
    <div>
      <SectionHeader title="User Settings" subtitle="Configure your BoardGameGeek integration" />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>BoardGameGeek Username</div>
        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Thinker1"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setSaved(false) }}
          />
          <button
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={saving || username.trim() === ''}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className={styles.saved}>Saved</span>}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Sync with BGG Collection</div>
        <div className={styles.syncRow}>
          <button
            className={styles.btnSync}
            onClick={handleSync}
            disabled={!canSync}
          >
            {syncing ? 'Syncing…' : 'Sync Library'}
          </button>
          {username.trim() === '' && (
            <span className={styles.hint}>Save a BGG username first</span>
          )}
          {syncing && (
            <span className={styles.hint}>Fetching from BGG, this may take a moment…</span>
          )}
        </div>

        {syncError && <div className={styles.error}>{syncError}</div>}

        {syncResult && (
          <div className={styles.resultBox}>
            <div className={styles.resultTitle}>Sync complete</div>
            <div className={styles.resultStat}>
              <strong className={styles.added}>{syncResult.added.length}</strong> game{syncResult.added.length !== 1 ? 's' : ''} added
            </div>
            {syncResult.added.length > 0 && (
              <ul className={styles.gameList}>
                {syncResult.added.map((g) => <li key={g.bggId}>{g.title}</li>)}
              </ul>
            )}
            <div className={styles.resultStat} style={{ marginTop: 10 }}>
              <strong className={styles.removed}>{syncResult.removed.length}</strong> game{syncResult.removed.length !== 1 ? 's' : ''} marked as removed
            </div>
            {syncResult.removed.length > 0 && (
              <ul className={styles.gameList}>
                {syncResult.removed.map((g) => <li key={g.title}>{g.title}</li>)}
              </ul>
            )}
            <div className={styles.resultStat} style={{ marginTop: 10 }}>
              <strong>{syncResult.unchanged}</strong> game{syncResult.unchanged !== 1 ? 's' : ''} unchanged
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
