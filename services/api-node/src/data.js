import { Client } from 'pg'
import { MongoClient } from 'mongodb'

export async function saveAudit(event) {
  if (process.env.MONGO_URL) {
    const client = new MongoClient(process.env.MONGO_URL)
    try {
      await client.connect()
      await client.db('mobilepos').collection('audit_events').insertOne(event)
    } catch (error) {
      console.warn('mongo audit skipped', error.message)
    } finally {
      await client.close().catch(() => {})
    }

    export async function saveClickhouseEvent(event) {
      if (!process.env.CLICKHOUSE_URL) return
      try {
        await fetch(`${process.env.CLICKHOUSE_URL}/?query=CREATE TABLE IF NOT EXISTS mobilepos_events (event String, payload String, at DateTime) ENGINE = MergeTree ORDER BY at`)
        const payload = JSON.stringify(event).replaceAll("'", "''")
        await fetch(`${process.env.CLICKHOUSE_URL}/?query=INSERT INTO mobilepos_events VALUES ('${event.type}','${payload}',now())`)
      } catch (error) {
        console.warn('clickhouse ingest skipped', error.message)
      }
    }
  }
}

export async function upsertMerchant(merchant) {
  if (!process.env.POSTGRES_URL) return
  const client = new Client({ connectionString: process.env.POSTGRES_URL })
  try {
    await client.connect()
    await client.query('create table if not exists merchants(id text primary key, name text not null)')
    await client.query('insert into merchants(id,name) values($1,$2) on conflict (id) do update set name=excluded.name', [merchant.id, merchant.name])
  } catch (error) {
    console.warn('postgres upsert skipped', error.message)
  } finally {
    await client.end().catch(() => {})
  }
}
