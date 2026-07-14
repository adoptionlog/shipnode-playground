var express = require('express');
var router = express.Router();
var { Pool } = require('pg');
var Redis = require('ioredis');

var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var redis = new Redis(process.env.REDIS_URL || '', {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

async function checkDatabase() {
  try {
    await pool.query('SELECT 1');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function checkRedis() {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    await redis.ping();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

router.get('/', async function (req, res) {
  var database = await checkDatabase();
  var redisStatus = await checkRedis();
  res.json({
    status: database.ok && redisStatus.ok ? 'ok' : 'degraded',
    database: database,
    redis: redisStatus,
  });
});

module.exports = router;
