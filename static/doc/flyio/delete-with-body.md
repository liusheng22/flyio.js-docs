# 小程序 DELETE 请求传递 Body 参数

## 项目背景

本项目基于 [fly.js](https://www.npmjs.com/package/flyio) 进行优化改进。原 fly.js 在小程序环境中存在一个重要限制：**DELETE 请求无法传入 body 参数，所有参数都会被强制转换为 query 参数**。

### 原 fly.js 的问题

```javascript
// 原 fly.js 在小程序中的行为
fly.delete('/api/users', {
  ids: '1,2,3',
  reason: '批量删除'
})
// 实际发送的请求：DELETE /api/users?ids=1,2,3&reason=批量删除
// 无法发送 body 参数！
```

#### 问题根源

原 fly.js 在源码中强制将 GET、HEAD、DELETE、OPTION 等方法的参数转换为 query 参数：
<!-- 源码位置 -->
[源码位置:148行](https://github.com/wendux/fly/blob/master/src/fly.js#L148)
```javascript
// 源码位置：https://github.com/wendux/fly/blob/master/src/fly.js#L148
let needQuery = ["GET", "HEAD", "DELETE", "OPTION"].indexOf(options.method) !== -1;
```

** 这行代码导致小程序环境下所有 DELETE 请求的参数都被强制转换为 URL 查询参数，小程序环境下完全不支持 body 数据的发送，这是原 `fly.js` 一个重要的BUG**

#### 社区反馈

这个问题在社区中已经被多次反馈，例如：
- [GitHub Issue #238](https://github.com/wendux/fly/issues/238)：用户反馈 `fly.delete` 不能发送 RequestBody 参数
- 用户代码示例：
```javascript
let fly = require('flyio')
fly.delete('/sys/resource/op/batchDel', [1]).then(res => {
  debugger
})
// 参数未能以 body 方式发送
```

### 我们的解决方案

由于作者已经长期不更新，于是我们了 fork [原项目](https://github.com/wendux/fly)并进行优化，Flyio.js 实现了 `deleteWithBody` 功能，**能够独立并同时传递 query 参数和 body 参数**，完美解决了小程序环境下的这个限制。


## 安装

```bash
npm i flyio.js
```

## 解决方案：deleteWithBody

Flyio.js 提供了 `deleteWithBody` 配置选项，允许在 DELETE 请求中同时使用 query 参数和 body 参数。

### 与原 fly.js 的对比

| 特性 | 原 fly.js | Flyio.js (优化版) |
|------|-----------|----------------|
| DELETE body 支持 | ❌ 不支持 | ✅ 完全支持 |
| 参数分离 | ❌ 强制转换为 query | ✅ 可独立控制 |
| 小程序兼容性 | ❌ 有限制 | ✅ 完美支持 |
| 复杂数据结构 | ❌ 无法传递 | ✅ 完全支持 |
| 安全性 | ❌ 敏感信息暴露在 URL | ✅ 支持 body 传递 |

### 核心改进

```javascript
// 原 fly.js 的行为（小程序环境）
fly.delete('/api/users', { ids: '1,2,3' })
// 结果：DELETE /api/users?ids=1,2,3

// Flyio.js 的行为（使用 deleteWithBody）
fly.delete('/api/users', { ids: [1, 2, 3] }, { deleteWithBody: true })
// 结果：DELETE /api/users
// Body: { "ids": [1, 2, 3] }
```

### 基本语法

```javascript
fly.delete(url, data, {
  deleteWithBody: true // 允许 DELETE 请求传递 body 参数
})

// or

fly.delete(url, null, {
  params: { key: 'params-value' }, // 支持 query 参数
  body: { key: 'body-value' }, // 支持 body 参数
  deleteWithBody: true // 允许 DELETE 请求传递 body 参数
})
```

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | String | 请求地址，可包含 query 参数 |
| `data` | Object | 请求体数据 |
| `options.deleteWithBody` | Boolean | 启用 DELETE 请求传递 body |

## 使用示例

### 1. 将`fly`的第二个入参`data`作为`body`参数

```javascript
fly.delete('/api/users', {
  ids: [1, 2, 3, 4, 5],
  reason: '批量清理无效用户',
  operator: 'admin'
}, {
  deleteWithBody: true
})
```

### 2. `delete` 同时传入 `query` & `body` 参数

```javascript
fly.delete('/api/users', null, {
  params: { userId: '123' },
  body: {
    reason: '用户注销',
    operator: 'admin'
  },
  deleteWithBody: true
})
```

## 完整示例

### 小程序端实现

```javascript
// 导入 Flyio.js
import Fly from 'flyio.js/dist/npm/wx'

const fly = new Fly()
```

```javascript
// 批量删除购物车商品
async function batchDeleteCartItems() {
  try {
    const response = await fly.delete('/api/cart/items', null, {
      params: { userId: '123' },
      body: {
        items: [
          {
            productId: 'p001',
            skuId: 's001',
            reason: '商品下架'
          }
        ],
        operation: {
          type: 'batch_delete',
          source: 'user_action',
          timestamp: Date.now()
        }
      },
      deleteWithBody: true
    })

    console.log('删除成功：', response.data)
  } catch (error) {
    console.error('删除失败：', error)
  }
}
```

## 总结

### 为什么这个改进很重要？

1. **解决小程序限制**：原 fly.js 在小程序环境中的 DELETE 请求限制是一个已知问题，我们的优化彻底解决了这个问题。这个问题在 [GitHub Issue #238](https://github.com/wendux/fly/issues/238) 中已经被社区多次反馈。

2. **修复源码缺陷**：原 fly.js 在 [源码第148行](https://github.com/wendux/fly/blob/master/src/fly.js#L148) 强制将所有 DELETE 请求参数转换为 query 参数，我们的改进通过 `deleteWithBody` 选项优雅地绕过了这个限制。

2. **提升开发体验**：开发者不再需要为了适应原库的限制而改变 API 设计，可以按照标准的 RESTful 规范进行开发。

3. **增强安全性**：敏感信息不再暴露在 URL 中，提高了应用的安全性。

4. **保持兼容性**：在不需要 body 参数的场景下，Flyio,js 的行为与原 fly.js 完全一致，保证了向后兼容。

### 迁移指南

如果您正在使用原 fly.js，迁移到 Flyio.js 非常简单：

```javascript
// 原使用 fly.js 的导入
import Fly from 'flyio/dist/npm/wx'

// 迁移到 flyio.js 后的导入
import Fly from 'flyio.js/dist/npm/wx'
```

这个改进使得 Flyio.js 成为小程序开发中处理 DELETE 请求的最佳选择，完美解决了原 fly.js 的限制问题。
