/**
 * Seed script for creating 12 mockup blog posts with longer content and code blocks
 * Run with: npx tsx scripts/seed-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'present' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const mockPosts = [
  {
    title: 'Building a Real-Time Chat Application with WebSockets',
    slug: 'real-time-chat-websockets',
    excerpt: 'Learn how to build a production-ready real-time chat application using WebSockets, Node.js, and React.',
    content: `# Building a Real-Time Chat Application with WebSockets

Real-time communication is essential for modern web applications. In this comprehensive guide, we'll build a production-ready chat application using WebSockets.

## Why WebSockets?

Traditional HTTP polling is inefficient for real-time features. WebSockets provide a persistent, bidirectional communication channel between client and server, perfect for chat applications.

### Setting Up the Server

First, let's create our WebSocket server using Node.js and the \`ws\` library:

\`\`\`javascript
const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = app.listen(3000);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
\`\`\`

## Client Implementation

On the client side, we'll use React with hooks to manage WebSocket connections:

\`\`\`typescript
import { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (input && ws.current) {
      const message = {
        id: crypto.randomUUID(),
        user: 'User',
        text: input,
        timestamp: Date.now()
      };
      ws.current.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  );
}
\`\`\`

## Handling Reconnections

Production applications need robust reconnection logic:

\`\`\`typescript
const connectWebSocket = () => {
  const ws = new WebSocket('ws://localhost:3000');

  ws.onclose = () => {
    console.log('Disconnected, reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  };

  return ws;
};
\`\`\`

## Conclusion

WebSockets enable powerful real-time features with minimal overhead. This foundation can be extended with authentication, message persistence, and advanced features like typing indicators.`,
    published: true,
    reading_time_minutes: 8,
    meta_title: 'Build Real-Time Chat with WebSockets - Complete Guide',
    meta_description: 'Step-by-step tutorial on building a production-ready real-time chat application using WebSockets, Node.js, and React.',
  },
  {
    title: 'Understanding React Server Components: A Deep Dive',
    slug: 'understanding-react-server-components',
    excerpt: 'Explore the architecture and benefits of React Server Components, the future of React development.',
    content: `# Understanding React Server Components: A Deep Dive

React Server Components (RSC) represent a fundamental shift in how we build React applications. Let's explore what they are and why they matter.

## What Are Server Components?

Server Components are React components that run exclusively on the server. Unlike traditional SSR, they never hydrate on the client, reducing JavaScript bundle size significantly.

### Traditional Component (Client)

\`\`\`jsx
'use client';

import { useState, useEffect } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
\`\`\`

### Server Component Version

\`\`\`jsx
// No 'use client' directive - this is a Server Component
import { db } from '@/lib/database';

export default async function UserList() {
  const users = await db.user.findMany();

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
\`\`\`

## Key Benefits

**1. Zero JavaScript Bundle**

Server Components don't ship to the client. This example saves ~40KB:

\`\`\`jsx
// Server Component - date-fns stays on server
import { format } from 'date-fns';

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{format(post.date, 'MMMM dd, yyyy')}</time>
      <div>{post.content}</div>
    </article>
  );
}
\`\`\`

**2. Direct Backend Access**

No API routes needed:

\`\`\`typescript
import { prisma } from '@/lib/prisma';

export default async function Dashboard() {
  const stats = await prisma.analytics.aggregate({
    _sum: { views: true },
    _count: { posts: true }
  });

  return (
    <div>
      <h2>Total Views: {stats._sum.views}</h2>
      <h2>Total Posts: {stats._count.posts}</h2>
    </div>
  );
}
\`\`\`

**3. Automatic Code Splitting**

Each Server Component is automatically split, loading only what's needed.

## Composition Patterns

Server and Client Components can be composed together:

\`\`\`jsx
// app/page.tsx (Server Component)
import ClientCounter from './ClientCounter';

export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <h1>Server Data: {data}</h1>
      <ClientCounter />
    </div>
  );
}
\`\`\`

\`\`\`jsx
// ClientCounter.tsx
'use client';

import { useState } from 'react';

export default function ClientCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

## When to Use Each

**Server Components:**
- Data fetching
- Backend logic
- Large dependencies
- SEO-critical content

**Client Components:**
- Interactivity (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- State management
- Effects and lifecycle

## Conclusion

React Server Components are not a replacement for Client Components—they're complementary. Understanding when to use each unlocks powerful performance optimizations.`,
    published: true,
    reading_time_minutes: 10,
    meta_title: 'React Server Components Explained - Complete Guide',
    meta_description: 'Deep dive into React Server Components architecture, benefits, and best practices for modern React development.',
  },
  {
    title: 'Mastering TypeScript Generics: From Basics to Advanced',
    slug: 'mastering-typescript-generics',
    excerpt: 'A comprehensive guide to TypeScript generics with practical examples and advanced patterns.',
    content: `# Mastering TypeScript Generics: From Basics to Advanced

TypeScript generics are one of the most powerful features for writing reusable, type-safe code. Let's master them step by step.

## The Problem Generics Solve

Without generics, we lose type information:

\`\`\`typescript
function identity(arg: any): any {
  return arg;
}

const result = identity("hello"); // Type is 'any', not 'string'
\`\`\`

With generics, we preserve types:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity("hello"); // Type is 'string' ✓
const num = identity(42);          // Type is 'number' ✓
\`\`\`

## Generic Functions

Let's build a type-safe API client:

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Usage with type safety
interface User {
  id: number;
  name: string;
  email: string;
}

const userResponse = await fetchApi<User>('/api/user/1');
console.log(userResponse.data.email); // ✓ TypeScript knows this is a string
\`\`\`

## Generic Constraints

Constrain generics to ensure certain properties exist:

\`\`\`typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Works with any type that has an 'id' property
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 25 }
];

const product = findById(products, 1); // Type: Product | undefined
\`\`\`

## Advanced Patterns

### Conditional Types with Generics

\`\`\`typescript
type ApiResult<T> = T extends { error: string }
  ? { success: false; error: string }
  : { success: true; data: T };

async function processApi<T>(promise: Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await promise;
    return { success: true, data } as ApiResult<T>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResult<T>;
  }
}
\`\`\`

### Generic Utility Types

\`\`\`typescript
// Make all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      user: string;
      password: string;
    };
  };
  cache: {
    ttl: number;
  };
}

// All properties are now optional, including nested ones
type PartialConfig = DeepPartial<Config>;

const config: PartialConfig = {
  database: {
    host: "localhost"
    // port, credentials optional
  }
  // cache optional
};
\`\`\`

### Generic Class Example

\`\`\`typescript
class DataStore<T extends { id: string | number }> {
  private items: Map<string | number, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string | number): T | undefined {
    return this.items.get(id);
  }

  update(id: string | number, updates: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (item) {
      const updated = { ...item, ...updates };
      this.items.set(id, updated);
      return updated;
    }
  }

  delete(id: string | number): boolean {
    return this.items.delete(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }
}

// Type-safe usage
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const todoStore = new DataStore<Todo>();
todoStore.add({ id: 1, title: "Learn generics", completed: false });
const todo = todoStore.get(1); // Type: Todo | undefined
\`\`\`

## Best Practices

1. **Use meaningful generic names**: \`<T>\` is fine for simple cases, but \`<TUser>\`, \`<TResponse>\` are clearer
2. **Constrain when possible**: \`<T extends BaseType>\` provides better IntelliSense
3. **Avoid over-generalization**: Not everything needs to be generic
4. **Provide default types**: \`<T = string>\` for common cases

## Conclusion

Generics enable powerful type-safe abstractions. Master them to write more maintainable and robust TypeScript code.`,
    published: true,
    reading_time_minutes: 12,
    meta_title: 'TypeScript Generics Complete Guide - Basics to Advanced',
    meta_description: 'Learn TypeScript generics from fundamentals to advanced patterns with practical examples and best practices.',
  },
  {
    title: 'Database Indexing Strategies for High Performance',
    slug: 'database-indexing-strategies',
    excerpt: 'Learn how to optimize database queries with effective indexing strategies and understand when to use different index types.',
    content: `# Database Indexing Strategies for High Performance

Database indexes are crucial for query performance, but choosing the right strategy requires understanding the trade-offs.

## How Indexes Work

Think of an index like a book's index—it helps you find information quickly without reading every page.

### Without Index (Sequential Scan)

\`\`\`sql
-- Slow: scans all 1 million rows
SELECT * FROM users WHERE email = 'john@example.com';
-- Execution time: ~500ms
\`\`\`

### With Index (Index Scan)

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'john@example.com';
-- Execution time: ~2ms
\`\`\`

## Index Types

### 1. B-Tree Indexes (Default)

Best for equality and range queries:

\`\`\`sql
CREATE INDEX idx_created_at ON posts(created_at);

-- Efficient queries
SELECT * FROM posts WHERE created_at > '2024-01-01';
SELECT * FROM posts WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;
\`\`\`

### 2. Composite Indexes

Multiple columns in one index:

\`\`\`sql
CREATE INDEX idx_user_status_created ON posts(user_id, status, created_at);

-- Efficient: uses all index columns
SELECT * FROM posts
WHERE user_id = 123 AND status = 'published'
ORDER BY created_at DESC;

-- Less efficient: only uses first column
SELECT * FROM posts WHERE status = 'published';
\`\`\`

**Column Order Matters!** Most selective columns first:

\`\`\`sql
-- Good: user_id is more selective than status
CREATE INDEX idx_posts_user_status ON posts(user_id, status);

-- Bad: status has few unique values
CREATE INDEX idx_posts_status_user ON posts(status, user_id);
\`\`\`

### 3. Partial Indexes

Index only rows that match a condition:

\`\`\`sql
-- Only index published posts
CREATE INDEX idx_published_posts ON posts(created_at)
WHERE status = 'published';

-- Efficient for this query
SELECT * FROM posts
WHERE status = 'published'
ORDER BY created_at DESC;

-- Smaller index size, faster writes
\`\`\`

### 4. Full-Text Search Indexes

For text search queries:

\`\`\`sql
-- PostgreSQL
CREATE INDEX idx_posts_content_fts ON posts
USING gin(to_tsvector('english', content));

-- Efficient text search
SELECT * FROM posts
WHERE to_tsvector('english', content) @@ to_tsquery('postgresql & performance');
\`\`\`

## Query Optimization Examples

### Analyzing Query Plans

\`\`\`sql
EXPLAIN ANALYZE
SELECT p.*, u.name
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'published'
  AND p.created_at > NOW() - INTERVAL '30 days'
ORDER BY p.view_count DESC
LIMIT 20;
\`\`\`

### Optimizing Common Patterns

**Pagination:**

\`\`\`sql
-- Slow: OFFSET causes sequential scan
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;

-- Fast: Keyset pagination
SELECT * FROM posts
WHERE created_at < '2024-01-15 10:30:00'
ORDER BY created_at DESC
LIMIT 20;

-- Index needed
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
\`\`\`

**Counting:**

\`\`\`sql
-- Slow: counts all rows
SELECT COUNT(*) FROM posts WHERE status = 'published';

-- Faster: use index-only scan
CREATE INDEX idx_posts_status ON posts(status) WHERE status = 'published';

-- Or: maintain a counter
CREATE TABLE post_counts (
  status VARCHAR(20) PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Update with triggers
CREATE TRIGGER update_post_count
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_count_function();
\`\`\`

## Index Maintenance

### Monitor Index Usage

\`\`\`sql
-- PostgreSQL: Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE 'pg_toast_%'
ORDER BY pg_relation_size(indexrelid) DESC;
\`\`\`

### Rebuild Fragmented Indexes

\`\`\`sql
-- PostgreSQL
REINDEX INDEX idx_posts_created_at;

-- Or rebuild table and all indexes
VACUUM FULL posts;
\`\`\`

## Trade-offs

**Pros:**
- Faster reads (10-1000x improvement)
- Efficient sorting and filtering

**Cons:**
- Slower writes (INSERT, UPDATE, DELETE)
- Storage overhead (indexes take disk space)
- Maintenance cost

## Best Practices

1. **Index foreign keys**: Always index columns used in JOINs
2. **Index WHERE clauses**: Index columns frequently filtered
3. **Index ORDER BY**: Index columns used for sorting
4. **Avoid over-indexing**: Each index slows down writes
5. **Monitor query patterns**: Use EXPLAIN ANALYZE
6. **Update statistics**: Keep query planner informed

\`\`\`sql
-- PostgreSQL: Update statistics
ANALYZE posts;
\`\`\`

## Conclusion

Effective indexing is about balance. Profile your queries, understand access patterns, and measure the impact of each index.`,
    published: true,
    reading_time_minutes: 11,
    meta_title: 'Database Indexing Strategies - Performance Optimization Guide',
    meta_description: 'Comprehensive guide to database indexing strategies, query optimization, and performance tuning with practical SQL examples.',
  },
  {
    title: 'Building Microservices with Docker and Kubernetes',
    slug: 'microservices-docker-kubernetes',
    excerpt: 'A practical guide to building, deploying, and orchestrating microservices using Docker containers and Kubernetes.',
    content: `# Building Microservices with Docker and Kubernetes

Microservices architecture combined with containerization provides scalability and maintainability. Let's build a production-ready system.

## Architecture Overview

We'll build a simple e-commerce system with three services:
- **Product Service**: Manages product catalog
- **Order Service**: Handles order processing
- **API Gateway**: Routes requests to services

## Dockerizing Services

### Product Service Dockerfile

\`\`\`dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER node
EXPOSE 3000

CMD ["node", "dist/index.js"]
\`\`\`

### Multi-stage Benefits

- **Smaller images**: Final image ~150MB vs ~1GB
- **Security**: No build tools in production
- **Faster deploys**: Less data to transfer

### Docker Compose for Local Development

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  product-service:
    build: ./services/product
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://dev:devpass@postgres:5432/ecommerce
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  order-service:
    build: ./services/order
    ports:
      - "3002:3000"
    environment:
      DATABASE_URL: postgresql://dev:devpass@postgres:5432/ecommerce
      PRODUCT_SERVICE_URL: http://product-service:3000
    depends_on:
      - postgres

  api-gateway:
    build: ./services/gateway
    ports:
      - "8080:8080"
    environment:
      PRODUCT_SERVICE_URL: http://product-service:3000
      ORDER_SERVICE_URL: http://order-service:3000
    depends_on:
      - product-service
      - order-service

volumes:
  postgres_data:
\`\`\`

## Kubernetes Deployment

### Product Service Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  labels:
    app: product-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
      - name: product-service
        image: myregistry/product-service:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: REDIS_URL
          value: redis://redis-service:6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
spec:
  selector:
    app: product-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
\`\`\`

### Horizontal Pod Autoscaling

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: product-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: product-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
\`\`\`

### Ingress Configuration

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /products(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 80
      - path: /orders(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 80
\`\`\`

## Health Checks Implementation

\`\`\`typescript
// src/health.ts
import express from 'express';
import { db } from './database';
import { redis } from './redis';

const router = express.Router();

// Liveness probe - is the app running?
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness probe - is the app ready to serve traffic?
router.get('/ready', async (req, res) => {
  try {
    // Check database connection
    await db.raw('SELECT 1');

    // Check Redis connection
    await redis.ping();

    res.status(200).json({
      status: 'ready',
      checks: {
        database: 'ok',
        redis: 'ok'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
});

export default router;
\`\`\`

## Service Discovery

Services communicate using Kubernetes DNS:

\`\`\`typescript
// In order-service, calling product-service
const response = await fetch('http://product-service/api/products/123');
// Resolves to product-service.default.svc.cluster.local
\`\`\`

## Deployment Strategy

### Rolling Update (Zero Downtime)

\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Create 1 extra pod during update
      maxUnavailable: 0  # Never have less than desired replicas
\`\`\`

### Blue-Green Deployment

\`\`\`bash
# Deploy green version
kubectl apply -f product-service-green.yaml

# Test green version
kubectl port-forward svc/product-service-green 3000:80

# Switch traffic to green
kubectl patch service product-service -p '{"spec":{"selector":{"version":"green"}}}'

# Remove blue deployment
kubectl delete deployment product-service-blue
\`\`\`

## Monitoring and Logging

\`\`\`yaml
# Prometheus ServiceMonitor
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: product-service
spec:
  selector:
    matchLabels:
      app: product-service
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s
\`\`\`

## Best Practices

1. **Use specific image tags**, not \`latest\`
2. **Set resource limits** to prevent resource exhaustion
3. **Implement health checks** for proper orchestration
4. **Use ConfigMaps/Secrets** for configuration
5. **Enable logging** with structured output
6. **Monitor metrics** (Prometheus + Grafana)
7. **Plan for failures** (circuit breakers, retries)

## Conclusion

Microservices with Docker and Kubernetes provide powerful scalability, but require careful planning around service communication, deployment strategies, and monitoring.`,
    published: true,
    reading_time_minutes: 15,
    meta_title: 'Microservices with Docker & Kubernetes - Complete Guide',
    meta_description: 'Learn to build, deploy, and orchestrate microservices using Docker containers and Kubernetes with production-ready examples.',
  },
  {
    title: 'Advanced Git Techniques for Team Collaboration',
    slug: 'advanced-git-techniques',
    excerpt: 'Master advanced Git workflows, rebasing strategies, and collaboration patterns for efficient team development.',
    content: `# Advanced Git Techniques for Team Collaboration

Git is more than just \`git commit\` and \`git push\`. Let's explore advanced techniques that improve team collaboration and code quality.

## Interactive Rebase for Clean History

### Basic Rebase

\`\`\`bash
# Rebase last 3 commits
git rebase -i HEAD~3
\`\`\`

You'll see an editor with:

\`\`\`
pick abc1234 Add user authentication
pick def5678 Fix typo in auth
pick ghi9012 Add tests for auth

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like squash, but discard commit message
# d, drop = remove commit
\`\`\`

### Squash Related Commits

\`\`\`bash
pick abc1234 Add user authentication
fixup def5678 Fix typo in auth  # Squashed into abc1234
pick ghi9012 Add tests for auth
\`\`\`

Result: Clean commit history with logical units.

## Cherry-Picking Commits

Apply specific commits from one branch to another:

\`\`\`bash
# On feature branch, you want a bug fix from main
git checkout feature-branch
git cherry-pick a1b2c3d

# Cherry-pick multiple commits
git cherry-pick commit1 commit2 commit3

# Cherry-pick without committing (for modifications)
git cherry-pick -n commit-hash
\`\`\`

## Stash Management

### Advanced Stash Usage

\`\`\`bash
# Stash with description
git stash push -m "Work in progress on login feature"

# Stash only specific files
git stash push -m "Partial work" src/auth.ts src/login.tsx

# List stashes with details
git stash list
# stash@{0}: On feature: Work in progress on login feature
# stash@{1}: On main: Quick fix

# Apply specific stash
git stash apply stash@{1}

# Pop (apply and remove)
git stash pop stash@{0}

# Create branch from stash
git stash branch feature-login stash@{0}
\`\`\`

## Bisect for Bug Hunting

Find the commit that introduced a bug using binary search:

\`\`\`bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark a known good commit
git bisect good v1.5.0

# Git checks out middle commit
# Test your code, then mark:
git bisect good  # if test passes
git bisect bad   # if test fails

# Git repeats until it finds the bad commit
# When done:
git bisect reset
\`\`\`

### Automated Bisect

\`\`\`bash
# Use a test script
git bisect start HEAD v1.5.0
git bisect run npm test
# Git automatically finds the breaking commit
\`\`\`

## Worktrees for Parallel Work

Work on multiple branches simultaneously:

\`\`\`bash
# Create worktree for hotfix
git worktree add ../myproject-hotfix hotfix/critical-bug

# Now you have:
# ~/myproject (main branch)
# ~/myproject-hotfix (hotfix branch)

# Work in both directories independently
cd ../myproject-hotfix
# Fix bug, commit, push

# Remove worktree when done
git worktree remove ../myproject-hotfix

# List all worktrees
git worktree list
\`\`\`

## Reflog to Recover Lost Work

Git's safety net - nothing is truly lost:

\`\`\`bash
# View reflog
git reflog

# Output:
# a1b2c3d HEAD@{0}: commit: Add feature
# d4e5f6g HEAD@{1}: reset: moving to HEAD~1
# h7i8j9k HEAD@{2}: commit: Accidentally deleted work

# Recover lost commit
git checkout h7i8j9k
git checkout -b recovery-branch

# Or cherry-pick it
git cherry-pick h7i8j9k
\`\`\`

## Submodules for Code Reuse

Embed external repositories:

\`\`\`bash
# Add submodule
git submodule add https://github.com/user/shared-utils libs/utils

# Clone project with submodules
git clone --recursive https://github.com/user/myproject

# Update submodules
git submodule update --remote --merge

# Remove submodule
git submodule deinit libs/utils
git rm libs/utils
rm -rf .git/modules/libs/utils
\`\`\`

## Hooks for Automation

### Pre-commit Hook Example

\`\`\`bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Commit aborted."
  exit 1
fi

# Run type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "Type checking failed. Commit aborted."
  exit 1
fi

# Check for debugging code
if git diff --cached | grep -E 'console\.log|debugger'; then
  echo "Found debugging code. Remove before committing."
  exit 1
fi

exit 0
\`\`\`

### Commit Message Hook

\`\`\`bash
#!/bin/sh
# .git/hooks/commit-msg

# Enforce conventional commits
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,100}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "Invalid commit message format."
  echo "Use: type(scope): description"
  echo "Types: feat, fix, docs, style, refactor, test, chore"
  exit 1
fi
\`\`\`

## Git Aliases for Productivity

\`\`\`bash
# .gitconfig
[alias]
  # Shortcuts
  st = status -sb
  co = checkout
  br = branch
  cm = commit -m

  # Advanced
  lg = log --graph --oneline --decorate --all
  last = log -1 HEAD --stat
  unstage = reset HEAD --
  undo = reset --soft HEAD~1

  # Find commits by message
  find = "!git log --all --grep"

  # List aliases
  alias = config --get-regexp ^alias\\.
\`\`\`

## Merge Strategies

### Merge vs Rebase vs Squash

\`\`\`bash
# Regular merge (preserves history)
git checkout main
git merge feature-branch

# Rebase (linear history)
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch --ff-only

# Squash merge (single commit)
git checkout main
git merge --squash feature-branch
git commit -m "feat: complete feature implementation"
\`\`\`

## Best Practices

1. **Commit Often**: Small, focused commits are easier to review and revert
2. **Write Good Messages**: Follow conventional commits format
3. **Keep Branches Short-lived**: Merge or delete after 1-2 weeks
4. **Review Before Push**: Use \`git diff\` and \`git log\`
5. **Never Rewrite Public History**: Only rebase local commits
6. **Use \`.gitignore\`**: Keep generated files out of repo
7. **Tag Releases**: \`git tag -a v1.0.0 -m "Release 1.0.0"\`

## Conclusion

These advanced Git techniques enable cleaner history, better collaboration, and more efficient workflows. Practice them to become a Git power user.`,
    published: true,
    reading_time_minutes: 13,
    meta_title: 'Advanced Git Techniques - Team Collaboration Guide',
    meta_description: 'Master advanced Git workflows including interactive rebase, bisect, worktrees, and hooks for efficient team collaboration.',
  },
  {
    title: 'Optimizing React Performance: Comprehensive Guide',
    slug: 'optimizing-react-performance',
    excerpt: 'Deep dive into React performance optimization techniques including memoization, code splitting, and virtual scrolling.',
    content: `# Optimizing React Performance: Comprehensive Guide

React is fast, but poorly written React apps can be slow. Let's explore systematic optimization techniques.

## Identifying Performance Issues

### React DevTools Profiler

\`\`\`jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // component name
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime,
  commitTime
) {
  console.log(\`\${id} took \${actualDuration}ms to render\`);
}

<Profiler id="UserList" onRender={onRenderCallback}>
  <UserList users={users} />
</Profiler>
\`\`\`

## Memoization Techniques

### React.memo for Components

\`\`\`jsx
// Without memo: rerenders on every parent render
function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// With memo: only rerenders when user changes
const UserCard = React.memo(function UserCard({ user }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// Custom comparison
const UserCard = React.memo(
  UserCard,
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
\`\`\`

### useMemo for Expensive Calculations

\`\`\`jsx
function DataTable({ data, filters }) {
  // Without useMemo: recalculates on every render
  const filteredData = data.filter(item =>
    item.category === filters.category
  );

  // With useMemo: only recalculates when dependencies change
  const filteredData = useMemo(() => {
    return data.filter(item => item.category === filters.category);
  }, [data, filters.category]);

  return <Table data={filteredData} />;
}
\`\`\`

### useCallback for Function Props

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function on every render
  const handleClick = () => {
    setCount(c => c + 1);
  };

  // With useCallback: same function reference
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  // Only rerenders when onClick reference changes
  return <button onClick={onClick}>Click me</button>;
});
\`\`\`

## Code Splitting

### Dynamic Imports

\`\`\`jsx
import { lazy, Suspense } from 'react';

// Split code by route
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Analytics = lazy(() => import('./Analytics'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
\`\`\`

### Component-Level Splitting

\`\`\`jsx
// Heavy chart library - only load when needed
const Chart = lazy(() => import('./Chart'));

function Dashboard({ showChart }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart data={chartData} />
        </Suspense>
      )}
    </div>
  );
}
\`\`\`

## Virtual Scrolling

For large lists, only render visible items:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Without virtualization: 10,000 DOM nodes
// With virtualization: ~20 DOM nodes (only visible)
\`\`\`

## State Management Optimization

### Context Splitting

\`\`\`jsx
// Bad: Single context causes unnecessary rerenders
const AppContext = createContext();

// Good: Split contexts by update frequency
const UserContext = createContext(); // Rarely changes
const ThemeContext = createContext(); // Changes occasionally
const NotificationsContext = createContext(); // Changes frequently

function App() {
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <NotificationsContext.Provider value={notifications}>
          <Layout />
        </NotificationsContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
\`\`\`

### Atomic State Updates

\`\`\`jsx
// Bad: Large state object, updates cause wide rerenders
const [state, setState] = useState({
  user: {},
  theme: 'light',
  notifications: [],
  settings: {}
});

// Good: Separate state by concern
const [user, setUser] = useState({});
const [theme, setTheme] = useState('light');
const [notifications, setNotifications] = useState([]);
const [settings, setSettings] = useState({});
\`\`\`

## Debouncing and Throttling

\`\`\`jsx
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

function SearchInput() {
  const [query, setQuery] = useState('');

  // Debounce API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      const results = await fetch(\`/api/search?q=\${searchQuery}\`);
      setResults(await results.json());
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
\`\`\`

## Image Optimization

\`\`\`jsx
import Image from 'next/image';

// Bad: Large images block rendering
<img src="/hero.jpg" alt="Hero" />

// Good: Optimized with Next.js Image
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preload above fold images
  placeholder="blur"
  blurDataURL="/hero-blur.jpg"
/>

// Lazy load below-fold images
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
/>
\`\`\`

## Bundle Analysis

\`\`\`bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});

# Run analysis
ANALYZE=true npm run build
\`\`\`

## Web Vitals Monitoring

\`\`\`jsx
// pages/_app.tsx
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'FCP': // First Contentful Paint
    case 'LCP': // Largest Contentful Paint
    case 'CLS': // Cumulative Layout Shift
    case 'FID': // First Input Delay
    case 'TTFB': // Time to First Byte
      // Send to analytics
      console.log(metric);
      break;
  }
}
\`\`\`

## Common Pitfalls

### Avoid Inline Functions in JSX

\`\`\`jsx
// Bad: Creates new function on every render
<button onClick={() => handleClick(item.id)}>Click</button>

// Good: Use useCallback or bind
const handleItemClick = useCallback((id) => {
  // handle click
}, []);

<button onClick={() => handleItemClick(item.id)}>Click</button>
\`\`\`

### Avoid Inline Object/Array Creation

\`\`\`jsx
// Bad: Creates new object on every render
<UserCard user={{ id: 1, name: 'John' }} />

// Good: Define outside or use useMemo
const user = useMemo(() => ({ id: 1, name: 'John' }), []);
<UserCard user={user} />
\`\`\`

## Performance Checklist

- [ ] Use React DevTools Profiler to identify slow components
- [ ] Memoize expensive computations with useMemo
- [ ] Memoize callback functions with useCallback
- [ ] Wrap pure components with React.memo
- [ ] Implement code splitting for routes and heavy components
- [ ] Use virtual scrolling for large lists
- [ ] Split context by update frequency
- [ ] Debounce/throttle frequent operations
- [ ] Optimize images with next/image or similar
- [ ] Analyze bundle size and remove unused code
- [ ] Monitor Web Vitals in production

## Conclusion

Performance optimization is about measurement and targeted improvements. Profile first, optimize bottlenecks, measure again. Don't optimize prematurely.`,
    published: true,
    reading_time_minutes: 14,
    meta_title: 'React Performance Optimization - Complete Guide',
    meta_description: 'Comprehensive guide to optimizing React applications including memoization, code splitting, virtual scrolling, and Web Vitals monitoring.',
  },
  {
    title: 'REST API Design Best Practices for Scalable Systems',
    slug: 'rest-api-design-best-practices',
    excerpt: 'Learn industry-standard patterns for designing robust, maintainable REST APIs with proper error handling and versioning.',
    content: `# REST API Design Best Practices for Scalable Systems

Well-designed REST APIs are intuitive, consistent, and maintainable. Let's explore patterns used by industry-leading APIs.

## Resource Naming Conventions

### Use Nouns, Not Verbs

\`\`\`
❌ Bad:
GET /getUsers
POST /createUser
DELETE /deleteUser

✅ Good:
GET /users
POST /users
DELETE /users/:id
\`\`\`

### Plural Resource Names

\`\`\`
✅ Consistent:
GET /users
GET /users/:id
GET /posts
GET /posts/:id/comments
\`\`\`

### Nested Resources

\`\`\`
GET /users/:userId/posts              # User's posts
GET /users/:userId/posts/:postId      # Specific post
POST /users/:userId/posts             # Create post for user
GET /posts/:postId/comments           # Post's comments
\`\`\`

## HTTP Methods Properly

\`\`\`
GET    /users           # List users
GET    /users/:id       # Get single user
POST   /users           # Create user
PUT    /users/:id       # Full update (replace)
PATCH  /users/:id       # Partial update
DELETE /users/:id       # Delete user
\`\`\`

## Status Codes

Use appropriate HTTP status codes:

\`\`\`typescript
// Success codes
200 OK                  // Successful GET, PUT, PATCH
201 Created             // Successful POST
204 No Content          // Successful DELETE

// Client error codes
400 Bad Request         // Invalid request data
401 Unauthorized        // Authentication required
403 Forbidden           // Authenticated but not authorized
404 Not Found           // Resource doesn't exist
409 Conflict            // Conflict with current state
422 Unprocessable Entity // Validation errors
429 Too Many Requests   // Rate limit exceeded

// Server error codes
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
\`\`\`

### Implementation Example

\`\`\`typescript
import express from 'express';

const app = express();

// GET /users/:id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.params.id }
    });

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validation
    if (!email || !name) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and name are required',
          details: {
            email: !email ? 'Email is required' : undefined,
            name: !name ? 'Name is required' : undefined
          }
        }
      });
    }

    // Check conflict
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    const user = await db.user.create({
      data: { email, name }
    });

    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
});
\`\`\`

## Pagination

Always paginate large collections:

\`\`\`typescript
// Offset-based pagination
GET /users?page=2&limit=20

app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    db.user.count()
  ]);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  });
});
\`\`\`

### Cursor-Based Pagination (Better for Real-Time Data)

\`\`\`typescript
GET /posts?cursor=abc123&limit=20

app.get('/posts', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const cursor = req.query.cursor;

  const posts = await db.post.findMany({
    take: limit + 1, // Fetch one extra to check for next page
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1 // Skip the cursor
    }),
    orderBy: { createdAt: 'desc' }
  });

  const hasNext = posts.length > limit;
  const data = hasNext ? posts.slice(0, -1) : posts;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  res.json({
    data,
    pagination: {
      nextCursor,
      hasNext
    }
  });
});
\`\`\`

## Filtering and Sorting

\`\`\`typescript
GET /users?status=active&role=admin&sort=-createdAt,name

app.get('/users', async (req, res) => {
  const { status, role, sort } = req.query;

  // Build where clause
  const where = {};
  if (status) where.status = status;
  if (role) where.role = role;

  // Parse sort parameter
  const orderBy = sort?.split(',').map(field => {
    const desc = field.startsWith('-');
    const key = desc ? field.slice(1) : field;
    return { [key]: desc ? 'desc' : 'asc' };
  }) || [{ createdAt: 'desc' }];

  const users = await db.user.findMany({
    where,
    orderBy
  });

  res.json({ data: users });
});
\`\`\`

## Versioning

### URL Versioning (Recommended)

\`\`\`
GET /api/v1/users
GET /api/v2/users
\`\`\`

\`\`\`typescript
// v1/users.ts
export const getUsersV1 = async (req, res) => {
  // Old implementation
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true }
  });
  res.json({ users });
};

// v2/users.ts
export const getUsersV2 = async (req, res) => {
  // New implementation with different structure
  const users = await db.user.findMany({
    select: {
      id: true,
      profile: { select: { name: true, email: true } },
      metadata: true
    }
  });
  res.json({ data: users });
};
\`\`\`

## Error Response Format

Consistent error structure:

\`\`\`typescript
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional context
    field?: string;         // For validation errors
    timestamp?: string;
  };
}

// Example responses
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "email": "Must be a valid email address",
      "age": "Must be at least 18"
    }
  }
}

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "retryAfter": 60
    }
  }
}
\`\`\`

## Rate Limiting

\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

app.use('/api/', limiter);
\`\`\`

## Authentication and Authorization

\`\`\`typescript
import jwt from 'jsonwebtoken';

// Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }
};

const authorize = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }
    next();
  };
};

// Usage
app.delete('/users/:id',
  authenticate,
  authorize(['admin']),
  deleteUser
);
\`\`\`

## HATEOAS (Hypermedia)

Include links to related resources:

\`\`\`typescript
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "links": {
    "self": "/users/123",
    "posts": "/users/123/posts",
    "followers": "/users/123/followers"
  }
}
\`\`\`

## Documentation

Use OpenAPI/Swagger:

\`\`\`yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
\`\`\`

## Best Practices Summary

1. **Use nouns for resources**, not verbs
2. **Consistent plural naming** for collections
3. **Proper HTTP methods** and status codes
4. **Always paginate** large collections
5. **Version your API** from day one
6. **Implement rate limiting** to prevent abuse
7. **Consistent error responses** with codes
8. **Authentication/Authorization** on sensitive endpoints
9. **Document with OpenAPI/Swagger**
10. **Include CORS headers** for browser clients

These patterns create maintainable, scalable APIs that developers love to use.`,
    published: true,
    reading_time_minutes: 16,
    meta_title: 'REST API Design Best Practices - Complete Guide',
    meta_description: 'Industry-standard patterns for designing robust REST APIs including versioning, pagination, error handling, and authentication.',
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'Understand the differences between CSS Grid and Flexbox, and learn when to use each layout system for optimal results.',
    content: `# CSS Grid vs Flexbox: When to Use Each

CSS Grid and Flexbox are both powerful layout systems, but they excel in different scenarios. Let's understand when to use each.

## Fundamental Differences

**Flexbox**: One-dimensional layout (row OR column)
**Grid**: Two-dimensional layout (rows AND columns)

## Flexbox: One-Dimensional Layouts

### Navigation Bars

\`\`\`css
/* Perfect for horizontal/vertical alignment */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
\`\`\`

\`\`\`html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button>Sign In</button>
</nav>
\`\`\`

### Form Controls

\`\`\`css
.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group label {
  flex: 0 0 120px; /* Fixed width */
}

.form-group input {
  flex: 1; /* Takes remaining space */
}
\`\`\`

### Card Actions

\`\`\`css
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
}
\`\`\`

## Grid: Two-Dimensional Layouts

### Page Layout

\`\`\`css
.app-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

\`\`\`html
<div class="app-layout">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Content</main>
  <footer class="footer">Footer</footer>
</div>
\`\`\`

### Responsive Image Gallery

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

### Dashboard Layout

\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding: 2rem;
}

.card-large {
  grid-column: span 8;
}

.card-medium {
  grid-column: span 4;
}

.card-small {
  grid-column: span 3;
}

/* Responsive */
@media (max-width: 768px) {
  .card-large,
  .card-medium,
  .card-small {
    grid-column: span 12;
  }
}
\`\`\`

## Combining Grid and Flexbox

### Complex Card Component

\`\`\`css
/* Grid for overall card structure */
.product-card {
  display: grid;
  grid-template-rows: 200px auto 60px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Flexbox for content alignment */
.product-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: auto; /* Push to bottom */
}

/* Flexbox for action buttons */
.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.product-actions button {
  flex: 1;
}
\`\`\`

## Advanced Grid Techniques

### Asymmetric Layouts

\`\`\`css
.featured-posts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.post:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}

.post:nth-child(4) {
  grid-column: span 2;
}
\`\`\`

### Named Grid Lines

\`\`\`css
.content-layout {
  display: grid;
  grid-template-columns:
    [full-start] minmax(1rem, 1fr)
    [content-start] minmax(0, 600px) [content-end]
    minmax(1rem, 1fr) [full-end];
}

.full-width {
  grid-column: full-start / full-end;
}

.content-width {
  grid-column: content-start / content-end;
}
\`\`\`

## Advanced Flexbox Techniques

### Equal Height Columns

\`\`\`css
.pricing-table {
  display: flex;
  gap: 2rem;
}

.pricing-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.pricing-features {
  flex: 1; /* Takes available space */
  margin: 2rem 0;
}

.pricing-button {
  margin-top: auto; /* Pushed to bottom */
}
\`\`\`

### Sticky Footer with Flexbox

\`\`\`css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

main {
  flex: 1; /* Takes all available space */
}

footer {
  /* Stays at bottom */
}
\`\`\`

## When to Use What

### Use Flexbox For:
- ✅ Navigation bars
- ✅ Button groups
- ✅ Form controls
- ✅ Vertically centering content
- ✅ Equal-height columns
- ✅ One-dimensional lists

### Use Grid For:
- ✅ Page layouts
- ✅ Image galleries
- ✅ Card layouts
- ✅ Dashboards
- ✅ Complex responsive layouts
- ✅ Overlapping elements

### Use Both Together:
- ✅ Complex components
- ✅ Nested layouts
- ✅ Responsive designs

## Common Patterns

### Centered Content

\`\`\`css
/* Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Grid */
.center-grid {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
\`\`\`

### Responsive Columns

\`\`\`css
/* Flexbox */
.flex-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-columns > * {
  flex: 1 1 300px; /* Grow, shrink, min-width */
}

/* Grid */
.grid-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

## Browser Support

Both Grid and Flexbox have excellent modern browser support:
- **Flexbox**: 98%+ (safe to use everywhere)
- **Grid**: 96%+ (safe for modern browsers)

For older browsers, consider:
\`\`\`css
@supports (display: grid) {
  /* Grid layout */
}

@supports not (display: grid) {
  /* Flexbox fallback */
}
\`\`\`

## Performance Considerations

- Grid and Flexbox have similar performance
- Both are much faster than float-based layouts
- Grid can be slightly faster for complex layouts
- Use \`will-change\` carefully with animations

\`\`\`css
.animated-grid-item {
  will-change: transform;
  transition: transform 0.3s ease;
}

.animated-grid-item:hover {
  transform: scale(1.05);
}
\`\`\`

## Conclusion

Don't think "Grid vs Flexbox"—think "Grid AND Flexbox." They complement each other perfectly. Use Grid for page-level layouts and two-dimensional content, use Flexbox for component-level layouts and one-dimensional content.`,
    published: true,
    reading_time_minutes: 12,
    meta_title: 'CSS Grid vs Flexbox - When to Use Each Layout System',
    meta_description: 'Comprehensive guide to CSS Grid and Flexbox differences with practical examples showing when to use each layout system.',
  },
  {
    title: 'Secure Authentication Patterns for Modern Web Apps',
    slug: 'secure-authentication-patterns',
    excerpt: 'Implement robust authentication systems with JWT, OAuth, and session management best practices.',
    content: `# Secure Authentication Patterns for Modern Web Apps

Authentication is critical for web security. Let's implement industry-standard patterns that protect user data.

## JWT (JSON Web Tokens)

### Token Generation

\`\`\`typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
\`\`\`

### Secure Password Hashing

\`\`\`typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
\`\`\`

## OAuth 2.0 Integration

\`\`\`typescript
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

export async function handleGoogleCallback(code: string) {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  // Create or update user
  const user = await db.user.upsert({
    where: { email: payload!.email },
    create: {
      email: payload!.email,
      name: payload!.name,
      avatar: payload!.picture
    },
    update: {
      name: payload!.name,
      avatar: payload!.picture
    }
  });

  return createSession(user);
}
\`\`\`

## Session Management

\`\`\`typescript
import { cookies } from 'next/headers';

export async function createSession(user: User) {
  const sessionToken = crypto.randomUUID();

  await db.session.create({
    data: {
      token: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  cookies().set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });

  return sessionToken;
}
\`\`\`

## Best Practices

1. **Never store passwords in plain text** - always hash with bcrypt
2. **Use HTTPS only** in production
3. **Implement rate limiting** on login endpoints
4. **Set secure cookie flags** (httpOnly, secure, sameSite)
5. **Validate tokens** on every protected request

## Conclusion

Secure authentication requires multiple layers of protection. Combine strong hashing, secure tokens, and proper session management.`,
    published: true,
    reading_time_minutes: 8,
    meta_title: 'Secure Authentication Patterns - JWT, OAuth, Sessions',
    meta_description: 'Learn to implement robust authentication with JWT tokens, OAuth 2.0 integration, and secure session management.',
  },
  {
    title: 'Testing Strategies: Unit, Integration, and E2E',
    slug: 'testing-strategies-unit-integration-e2e',
    excerpt: 'Build a comprehensive testing strategy with Jest, React Testing Library, and Playwright for maximum confidence.',
    content: `# Testing Strategies: Unit, Integration, and E2E

A solid testing strategy catches bugs early and enables confident deployments. Let's build a comprehensive approach.

## Testing Pyramid

**Unit Tests (70%)**: Test individual functions and components
**Integration Tests (20%)**: Test component interactions
**E2E Tests (10%)**: Test complete user flows

## Unit Testing with Jest

\`\`\`typescript
// utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// utils/calculator.test.ts
import { add, divide } from './calculator';

describe('Calculator', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('handles negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });
  });

  describe('divide', () => {
    it('divides numbers correctly', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
\`\`\`

## Component Testing

\`\`\`tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
\`\`\`

## Integration Testing

\`\`\`tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from './UserProfile';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

describe('UserProfile Integration', () => {
  it('fetches and displays user data', async () => {
    server.use(
      rest.get('/api/user', (req, res, ctx) => {
        return res(ctx.json({
          name: 'John Doe',
          email: 'john@example.com'
        }));
      })
    );

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
});
\`\`\`

## E2E Testing with Playwright

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
\`\`\`

## Test Coverage

\`\`\`bash
# Generate coverage report
jest --coverage

# View coverage in browser
open coverage/lcov-report/index.html
\`\`\`

## Best Practices

1. **Write tests first** (TDD) when possible
2. **Test behavior, not implementation** details
3. **Keep tests independent** - no shared state
4. **Use descriptive test names**
5. **Mock external dependencies** in unit tests
6. **Run tests in CI/CD** pipeline

Testing gives confidence to refactor and deploy. Start with critical paths, then expand coverage.`,
    published: true,
    reading_time_minutes: 9,
    meta_title: 'Testing Strategies - Unit, Integration, E2E Tests',
    meta_description: 'Complete guide to testing strategies with Jest, React Testing Library, and Playwright for web applications.',
  },
  {
    title: 'GraphQL vs REST: Choosing the Right API Architecture',
    slug: 'graphql-vs-rest-api-architecture',
    excerpt: 'Compare GraphQL and REST APIs with real-world examples to choose the best architecture for your project.',
    content: `# GraphQL vs REST: Choosing the Right API Architecture

Both GraphQL and REST are valid choices. Let's understand when each shines.

## REST API Example

\`\`\`typescript
// Multiple requests needed
GET /users/123
GET /users/123/posts
GET /users/123/followers

// Response 1
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}

// Response 2
{
  "posts": [
    { "id": "1", "title": "Hello World" },
    { "id": "2", "title": "GraphQL Guide" }
  ]
}

// Response 3
{
  "followers": [
    { "id": "456", "name": "Jane" }
  ]
}
\`\`\`

## GraphQL Example

\`\`\`graphql
# Single request
query {
  user(id: "123") {
    id
    name
    email
    posts {
      id
      title
    }
    followers {
      id
      name
    }
  }
}

# Single response with exactly what you need
{
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "posts": [
        { "id": "1", "title": "Hello World" },
        { "id": "2", "title": "GraphQL Guide" }
      ],
      "followers": [
        { "id": "456", "name": "Jane" }
      ]
    }
  }
}
\`\`\`

## GraphQL Server Setup

\`\`\`typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    user(id: ID!): User
    posts: [Post!]!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
  }
\`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      return db.user.findUnique({ where: { id } });
    },
    posts: async () => {
      return db.post.findMany();
    }
  },
  Mutation: {
    createPost: async (_, { title, content }, context) => {
      return db.post.create({
        data: {
          title,
          content,
          authorId: context.user.id
        }
      });
    }
  },
  User: {
    posts: async (parent) => {
      return db.post.findMany({
        where: { authorId: parent.id }
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server);
console.log(\`Server ready at \${url}\`);
\`\`\`

## When to Use REST

✅ **Simple CRUD operations**
✅ **Public APIs** with many consumers
✅ **File uploads/downloads**
✅ **Caching is critical**
✅ **Team familiar with REST**

## When to Use GraphQL

✅ **Complex, nested data requirements**
✅ **Mobile apps** (minimize requests)
✅ **Rapid frontend iteration**
✅ **Strong typing needed**
✅ **Multiple clients** with different needs

## Comparison

| Feature | REST | GraphQL |
|---------|------|---------|
| Learning Curve | Low | Medium |
| Caching | Easy (HTTP) | Complex |
| Over-fetching | Common | Rare |
| Under-fetching | Common | Rare |
| Versioning | URLs | Schema evolution |

Both are valid. Choose based on your specific requirements, not hype.`,
    published: true,
    reading_time_minutes: 7,
    meta_title: 'GraphQL vs REST - API Architecture Comparison',
    meta_description: 'Practical comparison of GraphQL and REST APIs with examples to help choose the right architecture for your project.',
  },
];

async function seedPosts() {
  console.log('Starting to seed posts...');

  for (const post of mockPosts) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
        .single();

      if (error) {
        console.error(`Error inserting post "${post.title}":`, error.message);
      } else {
        console.log(`✓ Created post: ${data.title} (${data.slug})`);
      }
    } catch (err) {
      console.error(`Failed to insert post "${post.title}":`, err);
    }
  }

  console.log('Seeding completed!');
}

seedPosts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
