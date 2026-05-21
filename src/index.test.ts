import { describe, it, expect, beforeEach, vi } from 'vitest';
import { quantumEncrypt, quantumDecrypt, QuantumSafeStorage } from './index';

// Mock localStorage for Node.js test environment
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null,
};

Object.defineProperty(globalThis, 'window', {
  value: { localStorage: localStorageMock, sessionStorage: localStorageMock },
  writable: true,
});

describe('Quantum-Safe Storage', () => {
  const SECRET = 'test-quantum-key-2024';

  beforeEach(() => {
    localStorageMock.clear();
  });

  // --- Core Encryption Tests ---

  it('should encrypt and decrypt a string correctly', () => {
    const original = 'Hello Quantum World!';
    const encrypted = quantumEncrypt(original, SECRET);
    const decrypted = quantumDecrypt(encrypted, SECRET);

    expect(decrypted).toBe(original);
    expect(encrypted).not.toBe(original);
  });

  it('should encrypt and decrypt JSON objects correctly', () => {
    const original = { user: 'imac', role: 'admin', token: 'secret-xyz' };
    const encrypted = quantumEncrypt(JSON.stringify(original), SECRET);
    const decrypted = quantumDecrypt(encrypted, SECRET);

    expect(JSON.parse(decrypted)).toEqual(original);
  });

  it('should fail decryption with wrong key', () => {
    const encrypted = quantumEncrypt('secret data', SECRET);
    const decrypted = quantumDecrypt(encrypted, 'wrong-key');

    expect(decrypted).toBe('');
  });

  it('should detect tampering (integrity check)', () => {
    const encrypted = quantumEncrypt('important data', SECRET);

    // Tamper with the data by modifying one character
    const tampered = encrypted.slice(0, -2) + 'XX';
    const decrypted = quantumDecrypt(tampered, SECRET);

    expect(decrypted).toBe('');
  });

  it('should produce different ciphertexts for the same plaintext (salt)', () => {
    const text = 'same input';
    const enc1 = quantumEncrypt(text, SECRET);
    const enc2 = quantumEncrypt(text, SECRET);

    // AES uses random IV, so ciphertexts should differ
    expect(enc1).not.toBe(enc2);

    // But both should decrypt to the same value
    expect(quantumDecrypt(enc1, SECRET)).toBe(text);
    expect(quantumDecrypt(enc2, SECRET)).toBe(text);
  });

  // --- Storage Class Tests ---

  it('should store and retrieve data via QuantumSafeStorage', () => {
    const storage = new QuantumSafeStorage({ secretKey: SECRET });

    storage.setItem('config', { theme: 'dark', fontSize: 14 });
    const retrieved = storage.getItem('config');

    expect(retrieved).toEqual({ theme: 'dark', fontSize: 14 });
  });

  it('should return null for non-existent keys', () => {
    const storage = new QuantumSafeStorage({ secretKey: SECRET });

    expect(storage.getItem('non_existent')).toBeNull();
  });

  it('should remove items correctly', () => {
    const storage = new QuantumSafeStorage({ secretKey: SECRET });

    storage.setItem('temp', 'value');
    expect(storage.getItem('temp')).toBe('value');

    storage.removeItem('temp');
    expect(storage.getItem('temp')).toBeNull();
  });

  it('should validate item integrity with hasValidItem', () => {
    const storage = new QuantumSafeStorage({ secretKey: SECRET });

    storage.setItem('valid_key', { data: 'test' });
    expect(storage.hasValidItem('valid_key')).toBe(true);
    expect(storage.hasValidItem('invalid_key')).toBe(false);
  });

  it('should clear all data', () => {
    const storage = new QuantumSafeStorage({ secretKey: SECRET });

    storage.setItem('a', 1);
    storage.setItem('b', 2);
    storage.clear();

    expect(storage.getItem('a')).toBeNull();
    expect(storage.getItem('b')).toBeNull();
  });
});
