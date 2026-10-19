export const person = {
  name: 'Parampreet Singh',
  role: 'Software Developer',
  location: 'Doraha, Punjab, India',
  email: 'parampreetsinghlall@gmail.com',
  github: 'https://github.com/ParampreetSingh23',
  githubUser: 'ParampreetSingh23',
  linkedin: 'https://www.linkedin.com/in/parampreetsingh23',
  site: 'https://parampreetsingh.dev',
  summary: 'Final-year Computer Science undergraduate (CGPA 9.44) with a strong foundation in data structures, algorithms (350+ problems), and system design. Full-stack software developer skilled in Java, Python, and TypeScript, building scalable web applications, REST and real-time APIs, and cloud-deployed systems on AWS.',
};

export const education = { degree: 'B.Tech, Computer Science', school: 'Chitkara University, Rajpura, Punjab', cgpa: '9.44', year: 'Final year' };

export const experience = { role: 'Software Developer Intern', company: 'Rabbitt AI', period: 'April 2026 — Present' };

export interface Project { slug: string; name: string; type: string; context: string; description: string; stack: string[]; points: string[]; url?: string; }
export const projects: Project[] = [
  { slug: 'tally', name: 'Tally Reconciliation', type: 'ACCOUNTING AUTOMATION', context: 'RABBITT AI / CLIENT PROJECT', description: 'Reconciliation and TallyPrime posting platform delivered end to end for 45+ accounting users.', stack: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Docker', 'Nginx', 'AWS EC2'], points: [
    'Owned it end to end: requirements, client calls, demos, technical design, delivery.',
    'Next.js frontend, Node.js REST backend, separate BullMQ worker; Redis + PostgreSQL on RDS, Docker Compose behind Nginx on EC2.',
    'Ingestion from seven invoice APIs, payment-gateway/bank reports and email/Excel imports with configurable mappings and dedup.',
    'Strict one-to-one reconciliation engine with an exception-review workflow.',
    'Fault-tolerant batch posting of up to 13,000 TallyPrime vouchers: idempotency keys, verify-before-retry, resumable state, audit logs.',
  ] },
  { slug: 'drip', name: 'DRIP', type: 'CODING ASSESSMENT PLATFORM', context: 'RABBITT AI / FULL STACK', description: 'Browser-based IDE sessions in isolated containers with automated grading and AI feedback.', stack: ['Node.js', 'Express', 'Next.js', 'React', 'TypeScript', 'MongoDB', 'WebSockets', 'Docker', 'AWS ECS', 'S3', 'OpenAI API', 'Zustand'], points: [
    'Users launch isolated IDE sessions, run test suites and get automated grading with AI-assisted feedback.',
    'Session orchestration provisioning per-user Docker containers on AWS ECS.',
    'WebSocket proxy routing traffic between the browser and container-hosted code-server.',
    'Express + Mongoose APIs with JWT auth and RBAC; S3 presigned URLs for file delivery.',
  ] },
  { slug: 'cloudwatcher', name: 'CloudWatcher', type: 'CLOUD OBSERVABILITY', context: 'RABBITT AI / PRODUCTION WORK', description: 'CloudWatch metrics, threshold rules and SNS alerts, provisioned with reusable Terraform modules.', stack: ['Node.js', 'Python', 'AWS CloudWatch', 'SNS', 'IAM', 'Terraform'], points: [
    'Node.js and Python services pull CloudWatch metrics, evaluate thresholds and publish SNS alerts.',
    'Reusable Terraform modules for alarms, SNS topics and IAM roles, shipped through PR reviews.',
  ] },
  { slug: 'tisiops', name: 'TisiOps', type: 'AI-POWERED DEVOPS', context: 'PERSONAL PROJECT / FOUNDER & DEVELOPER', description: 'AI agents plan provisioning and deployment through a Plan, Validate, Approve, Execute, Verify pipeline.', stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Docker', 'Terraform', 'AWS EC2', 'Clerk', 'OpenTelemetry'], url: 'https://github.com/ParampreetSingh23/TisiOps', points: [
    'Specialised agents for provisioning, deployment, staging, monitoring and diagnosis; no direct LLM shell access.',
    'Production-to-staging automation: analyse repo + server, plan, provision EC2 with Terraform, deploy with Docker.',
    'Async execution on Redis/BullMQ with retries, idempotency and SSH readiness checks; OpenTelemetry/SigNoz monitoring.',
  ] },
  { slug: 'campusbarter', name: 'CampusBarter', type: 'CAMPUS MARKETPLACE', context: 'PERSONAL PROJECT / FULL STACK', description: 'Peer-to-peer campus marketplace with OAuth login and real-time chat.', stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'WebSockets'], url: 'https://campusbarter.onrender.com', points: [
    'Passport.js sessions (Google OAuth + local) and real-time chat over WebSockets.',
    'Serverless PostgreSQL with Drizzle ORM, React Query caching and Zod validation; deployed on Render.',
  ] },
];

// Add supplied assets here; paths are relative to public/. Never substitute stock photographs.
export interface Photo { src: string; alt: string; caption: string; width: number; height: number; }
export const assets: { profile: Photo | null; personal: Photo[]; screenshots: Partial<Record<string, Photo>> } = {
  profile: { src: '/images/profile/parampreet-cutout.png', alt: 'Parampreet Singh wearing a burgundy turban and a light blue shirt.', caption: 'The human behind the system.', width: 1024, height: 1536 },
  personal: [
    { src: '/images/personal/book-market.jpg', alt: 'Book stalls filled with stacks of books under colorful canopies.', caption: 'A different kind of rabbit hole. / Book market', width: 1330, height: 2364 },
    { src: '/images/personal/hillside-dusk.jpg', alt: 'Hillside lights beneath an orange sunset and blue evening sky.', caption: 'Away from the screen. / Hillside at dusk', width: 664, height: 1182 },
    { src: '/images/personal/bakery-counter.jpg', alt: 'Cakes under glass domes and pastries in a warmly lit bakery display.', caption: 'Something worth slowing down for. / Bakery counter', width: 664, height: 1182 },
  ],
  screenshots: {},
};

export const skillGroups = [
  { name: 'Languages', items: 'Java / Python / C++ / JavaScript / TypeScript / SQL / Bash' },
  { name: 'Frontend', items: 'React / Next.js / Tailwind CSS / Zustand / React Query' },
  { name: 'Backend', items: 'Node.js / Express / REST / JWT / OAuth / RBAC / OpenAI API' },
  { name: 'Real-time & async', items: 'WebSockets / WebRTC / Redis / BullMQ / n8n' },
  { name: 'Data', items: 'PostgreSQL / MySQL / MongoDB / Prisma / Drizzle / Mongoose' },
  { name: 'Cloud & DevOps', items: 'AWS (EC2, S3, RDS, ECS, ECR, SNS, CloudWatch) / Docker / Kubernetes / Terraform / Nginx / GitHub Actions' },
  { name: 'CS fundamentals', items: 'DSA (350+ problems) / System design / OOP / OS / DBMS / Networks' },
];
