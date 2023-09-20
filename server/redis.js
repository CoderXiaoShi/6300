import { createClient } from 'redis';

const client = createClient();
// client.connect();

client.on('error', err => console.log('Redis Client Error', err));

client.on('connect', async () => {
    console.log('Redis 链接成功')
    /*
        测试增删改查
    */
    // 曾
    // await hSet('test-1', 'room-1', [{ userId: 1, name: 1 }, { userId: 2, name: 2 }])

    // 查
    // let res = await hGetAll('test-1')
    // console.log(res)

    // 改
    // let dbKey = 'test-1'
    // let roomId = 'room-1'
    // let res = await hGetAll(dbKey);
    // console.log('res', res)
    // let users = JSON.parse(res[roomId])
    // users[0].name = 112233
    // console.log('users', users);
    // await hSet(dbKey, roomId, users)

    // res = await hGetAll(dbKey);
    // console.log(res)
    // 删
})

// await client.set('key444', 'value222');
// const value = await client.get('key');
// await client.disconnect();

export const hSet = async (key, hashKey, hashValue) => {
    if (typeof hashValue === 'object') {
        hashValue = JSON.stringify(hashValue)
    }
    await client.hset(key, hashKey, hashValue)
}

export const hGetAll = (key) => {
    return new Promise((resolve, reject) => {
        client.hgetall(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            resolve(val)
        })
    })
}

export const hDel = async (key, hashKey) => {
    if (hashKey) {
        await client.hdel(key, hashKey)
    } else {
        await client.del(key)
    }
}

export default {
    hSet,
    hGetAll,
    hDel
}

