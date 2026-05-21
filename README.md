# ⚛️ Quantum-Safe Storage

**The world's first Quantum-Resistant encrypted localStorage & sessionStorage for the web.**

While traditional encryption (like AES alone) can theoretically be broken by future quantum computers using Shor's and Grover's algorithms, `quantum-safe-storage` adds a **Lattice-Based Key Derivation** layer inspired by **CRYSTALS-Kyber** (the NIST-selected post-quantum standard) to make your stored data resistant to both classical AND quantum attacks.

## 🛡️ Three Layers of Protection

| Layer | Technology | Protects Against |
|-------|-----------|-----------------|
| **1. Lattice-Based KDF** | CRYSTALS-Kyber inspired key derivation | Quantum computers (Shor's algorithm) |
| **2. AES-256 Encryption** | Military-grade symmetric encryption | Classical brute-force attacks |
| **3. HMAC Integrity** | Hash-based message authentication | Data tampering & corruption |

## 🚀 Installation

```bash
npm install quantum-safe-storage
```

## 💻 Usage

### Basic (Vanilla JS / TypeScript)

```typescript
import { QuantumSafeStorage } from 'quantum-safe-storage';

const vault = new QuantumSafeStorage({
  secretKey: 'your-ultra-secret-key',
  storageType: 'local', // or 'session'
  latticeRounds: 4,     // Higher = more secure (default: 4)
});

// Store data with quantum-resistant encryption
vault.setItem('auth_token', { token: 'xyz123', expiry: '2026-12-31' });

// Retrieve with automatic integrity verification
const data = vault.getItem('auth_token');
console.log(data); // { token: 'xyz123', expiry: '2026-12-31' }

// Check if data is valid (not tampered with)
vault.hasValidItem('auth_token'); // true
```

### React Hook (SSR-Safe for Next.js)

```tsx
import { useQuantumStorage } from 'quantum-safe-storage';

function App() {
  const [token, setToken] = useQuantumStorage('auth', 'default-token', {
    secretKey: 'my-quantum-key',
  });

  return (
    <div>
      <p>Token: {token}</p>
      <button onClick={() => setToken('new-quantum-token')}>
        Update Token
      </button>
    </div>
  );
}
```

### Direct Encrypt/Decrypt (Advanced)

```typescript
import { quantumEncrypt, quantumDecrypt } from 'quantum-safe-storage';

const secret = 'my-secret';
const encrypted = quantumEncrypt('sensitive data', secret);
const decrypted = quantumDecrypt(encrypted, secret);
// decrypted === 'sensitive data'
```

### Pre-configured Instances

```typescript
import { quantumLocal, quantumSession } from 'quantum-safe-storage';

// Ready-to-use instances (no config needed)
quantumLocal.setItem('key', 'value');
quantumSession.setItem('temp', 'data');
```

## 🧠 How It Works

### 1. Lattice-Based Key Derivation (Kyber-Inspired)
Instead of using your secret key directly, we derive a **quantum-resistant key** through multiple rounds of:
- **SHA-256/SHA-512 hashing** to create a deterministic "public matrix"
- **XOR noise injection** simulating the "Learning With Errors" (LWE) problem
- **Multi-round compression** acting as the "rounding" step in Kyber

This makes the derived key computationally infeasible to reverse, even with quantum algorithms.

### 2. AES-256 Encryption
The derived key is used for standard AES-256 encryption, providing military-grade symmetric protection.

### 3. HMAC Integrity Verification
Every piece of stored data includes an HMAC tag. Before decryption, the integrity is verified. If **anyone tampers** with the stored data, the library will detect it and refuse to decrypt.

## 🔒 Security Comparison

| Feature | Standard localStorage | AES-Only Libraries | **quantum-safe-storage** |
|---------|----------------------|--------------------|-----------------------|
| Plaintext visible | ✅ Yes | ❌ No | ❌ No |
| Brute-force resistant | ❌ No | ✅ Yes | ✅ Yes |
| Tamper detection | ❌ No | ❌ No | ✅ Yes |
| Quantum-resistant | ❌ No | ❌ No | ✅ Yes |
| SSR-Safe (Next.js) | ❌ No | ❌ Varies | ✅ Yes |

## 📄 License

MIT
