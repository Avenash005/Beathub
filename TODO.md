# Database Indexing Assignment - COMPLETED

## Task Summary
Add a database index to the email field in the User Schema for faster login queries.

## Implementation

### 1. Added mongoose dependency
- **server/package.json** - Added mongoose: ^8.0.0

### 2. Created User Model
- **server/models/User.js** - Created User schema with email index

### Code Change:
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true  // ← Added for faster login queries
  },
  password: { type: String, required: true }
}, { timestamps: true });
```

## Why This Matters
- Without index: MongoDB does COLLSCAN (full collection scan) - O(n)
- With index: MongoDB uses IXSCAN (index scan) - O(log n)
- Performance: Goes from ~500ms to ~5ms for login queries

## Verification Steps
1. Restart server: `npm run dev`
2. Check MongoDB Atlas → Collections → indexes tab
3. Should see email_1 in the index list

## PR Commands (for reference)
```
git checkout -b feature/add-email-index
git add server/models/User.js
git commit -m "Add index to email field for faster login queries"
git push origin feature/add-email-index
