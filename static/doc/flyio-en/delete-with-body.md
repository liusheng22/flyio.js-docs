# Mini-Program DELETE Request with Body Parameters

## Project Background

This project is optimized and improved based on [fly.js](https://www.npmjs.com/package/flyio). The original fly.js has an important limitation in mini-program environments: **DELETE requests cannot pass body parameters, and all parameters are forcibly converted to query parameters**.

### Issues with Original fly.js

```javascript
// Original fly.js behavior in mini-programs
fly.delete('/api/users', {
  ids: '1,2,3',
  reason: 'batch delete'
})
// Actual request sent: DELETE /api/users?ids=1,2,3&reason=batch delete
// Cannot send body parameters!
```

#### Root Cause

The original fly.js forcibly converts parameters of GET, HEAD, DELETE, OPTION and other methods to query parameters in the source code:
<!-- Source code location -->
[Source code line 148](https://github.com/wendux/fly/blob/master/src/fly.js#L148)
```javascript
// Source code location: https://github.com/wendux/fly/blob/master/src/fly.js#L148
let needQuery = ["GET", "HEAD", "DELETE", "OPTION"].indexOf(options.method) !== -1;
```

**This line of code causes all DELETE request parameters in mini-program environments to be forcibly converted to URL query parameters, completely preventing body data from being sent in mini-program environments. This is an important BUG in the original `fly.js`**

#### Community Feedback

This issue has been reported multiple times in the community, for example:
- [GitHub Issue #238](https://github.com/wendux/fly/issues/238): User feedback that `fly.delete` cannot send RequestBody parameters
- User code example:
```javascript
let fly = require('flyio')
fly.delete('/sys/resource/op/batchDel', [1]).then(res => {
  debugger
})
// Parameters were not sent as body
```

### Our Solution

Since the author has not updated for a long time, we forked the [original project](https://github.com/wendux/fly) and optimized it. Flyio.js implements the `deleteWithBody` feature, **which can independently and simultaneously pass query parameters and body parameters**, perfectly solving this limitation in mini-program environments.

## Installation

```bash
npm i flyio.js
```

## Solution: deleteWithBody

Flyio.js provides the `deleteWithBody` configuration option, allowing the use of both query parameters and body parameters in DELETE requests.

### Comparison with Original fly.js

| Feature | Original fly.js | Flyio.js (Optimized) |
|---------|-----------------|---------------------|
| DELETE body support | ❌ Not supported | ✅ Fully supported |
| Parameter separation | ❌ Forcibly converted to query | ✅ Independently controllable |
| Mini-program compatibility | ❌ Limited | ✅ Perfect support |
| Complex data structures | ❌ Cannot pass | ✅ Fully supported |
| Security | ❌ Sensitive info exposed in URL | ✅ Supports body transmission |

### Core Improvements

```javascript
// Original fly.js behavior (mini-program environment)
fly.delete('/api/users', { ids: '1,2,3' })
// Result: DELETE /api/users?ids=1,2,3

// Flyio.js behavior (using deleteWithBody)
fly.delete('/api/users', { ids: [1, 2, 3] }, { deleteWithBody: true })
// Result: DELETE /api/users
// Body: { "ids": [1, 2, 3] }
```

### Basic Syntax

```javascript
fly.delete(url, data, {
  deleteWithBody: true // Allow DELETE requests to pass body parameters
})

// or

fly.delete(url, null, {
  params: { key: 'params-value' }, // Support query parameters
  body: { key: 'body-value' }, // Support body parameters
  deleteWithBody: true // Allow DELETE requests to pass body parameters
})
```

### Parameter Description

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | String | Request URL, can include query parameters |
| `data` | Object | Request body data |
| `options.deleteWithBody` | Boolean | Enable DELETE requests to pass body |

## Usage Examples

### 1. Use the second parameter `data` of `fly` as `body` parameter

```javascript
fly.delete('/api/users', {
  ids: [1, 2, 3, 4, 5],
  reason: 'batch cleanup of invalid users',
  operator: 'admin'
}, {
  deleteWithBody: true
})
```

### 2. Pass both `query` & `body` parameters in `delete`

```javascript
fly.delete('/api/users', null, {
  params: { userId: '123' },
  body: {
    reason: 'user logout',
    operator: 'admin'
  },
  deleteWithBody: true
})
```

## Complete Example

### Mini-Program Implementation

```javascript
// Import Flyio.js
import Fly from 'flyio.js/dist/npm/wx'

const fly = new Fly()
```

```javascript
// Batch delete shopping cart items
async function batchDeleteCartItems() {
  try {
    const response = await fly.delete('/api/cart/items', null, {
      params: { userId: '123' },
      body: {
        items: [
          {
            productId: 'p001',
            skuId: 's001',
            reason: 'product removed'
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

    console.log('Delete successful:', response.data)
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
```

## Summary

### Why is this improvement important?

1. **Solve mini-program limitations**: The DELETE request limitation of original fly.js in mini-program environments is a known issue, and our optimization completely solves this problem. This issue has been reported multiple times in the community in [GitHub Issue #238](https://github.com/wendux/fly/issues/238).

2. **Fix source code defects**: The original fly.js forcibly converts all DELETE request parameters to query parameters at [source code line 148](https://github.com/wendux/fly/blob/master/src/fly.js#L148), and our improvement elegantly bypasses this limitation through the `deleteWithBody` option.

3. **Improve development experience**: Developers no longer need to change API design to adapt to the original library's limitations and can develop according to standard RESTful specifications.

4. **Enhance security**: Sensitive information is no longer exposed in URLs, improving application security.

5. **Maintain compatibility**: When body parameters are not needed, Flyio.js behavior is completely consistent with the original fly.js, ensuring backward compatibility.

### Migration Guide

If you are using the original fly.js, migrating to Flyio.js is very simple:

```javascript
// Original fly.js import
import Fly from 'flyio/dist/npm/wx'

// After migrating to flyio.js import
import Fly from 'flyio.js/dist/npm/wx'
```

This improvement makes Flyio.js the best choice for handling DELETE requests in mini-program development, perfectly solving the limitation problem of the original fly.js.
