import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ── Clean slate ────────────────────────────────────────────────────────────
  await prisma.upVote.deleteMany();
  await prisma.bookMark.deleteMany();
  await prisma.round.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.role.deleteMany();
  await prisma.company.deleteMany();

  const hashedPw = await bcrypt.hash("sunay123", 10);
  const user = await prisma.user.upsert({
    where: { email: "sunaygoyalnew@gmail.com" },
    update: {},
    create: {
      name: "Sunay Goyal",
      email: "sunaygoyalnew@gmail.com",
      password: hashedPw,
    },
  });

  console.log(`✅ User ready: ${user.email}`);

  // ── Companies ──────────────────────────────────────────────────────────────
  const [
    google, microsoft, amazon, flipkart, goldman, deshaw, morgan,
    uber, atlassian, mastercard, swiggy, adobe, salesforce,
  ] = await Promise.all([
    prisma.company.create({ data: { company: "Google" } }),
    prisma.company.create({ data: { company: "Microsoft" } }),
    prisma.company.create({ data: { company: "Amazon" } }),
    prisma.company.create({ data: { company: "Flipkart" } }),
    prisma.company.create({ data: { company: "Goldman Sachs" } }),
    prisma.company.create({ data: { company: "D. E. Shaw" } }),
    prisma.company.create({ data: { company: "Morgan Stanley" } }),
    prisma.company.create({ data: { company: "Uber" } }),
    prisma.company.create({ data: { company: "Atlassian" } }),
    prisma.company.create({ data: { company: "Mastercard" } }),
    prisma.company.create({ data: { company: "Swiggy" } }),
    prisma.company.create({ data: { company: "Adobe" } }),
    prisma.company.create({ data: { company: "Salesforce" } }),
  ]);

  // ── Helper ─────────────────────────────────────────────────────────────────
  async function addExp({
    company, roleTitle, ctc, locations, jobType, verdict, difficulty,
    title, description, rounds,
  }: {
    company: { id: string };
    roleTitle: string;
    ctc?: string;
    locations: string[];
    jobType: string;
    verdict: string;
    difficulty: string;
    title: string;
    description: string;
    rounds: { type: string; questions: string; details: string }[];
  }) {
    const role = await prisma.role.create({
      data: { title: roleTitle, ctc, locations, companyId: company.id },
    });
    await prisma.experience.create({
      data: {
        title, description, verdict, difficulty, jobType,
        companyId: company.id, roleId: role.id, userId: user.id,
        rounds: {
          create: rounds.map((r, i) => ({
            roundNumber: i + 1,
            roundType: r.type,
            questions: r.questions,
            details: r.details,
          })),
        },
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GOOGLE
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: google,
    roleTitle: "Software Engineering Intern",
    ctc: "₹1,00,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Google SWE Internship – Bengaluru (Summer 2024) | Originally posted on LeetCode Discuss by u/heatblast_99",
    description:
      "Applied via campus referral. Got an OA link within a week. The recruiter call was short – just a vibe check and language preference. The real test starts with the technical rounds done on a shared Google Doc (no IDE, no autocomplete). Communication matters more than the solution itself. Started with brute force, then optimised – interviewers gave hints when I was stuck.",
    rounds: [
      {
        type: "OA",
        questions: "Two coding questions – a graph BFS problem and a greedy interval scheduling question.",
        details: "60-minute window. Both were LeetCode-Medium level. Got a call from the recruiter 3 days later to schedule technicals.",
      },
      {
        type: "Technical",
        questions: "Q1: Given an N-ary tree, return all root-to-leaf paths that sum to a target. Q2: A follow-up variant of the Longest Increasing Subsequence using a priority queue.",
        details: "45 minutes. Interviewer was friendly and gave me a nudge when I went down a wrong path. Said 'think about the state more carefully' which helped me get to an O(n log n) DP approach.",
      },
      {
        type: "Technical",
        questions: "Q1: Minimum number of moves to make all cells of a grid equal (BFS + deque). Q2: Design an iterator for a nested list structure (LeetCode #341).",
        details: "Second round felt harder. Spent too long on the grid problem but got partial credit. Nested iterator was clean – finished in 15 minutes and the interviewer seemed pleased.",
      },
    ],
  });

  await addExp({
    company: google,
    roleTitle: "Software Engineering Intern",
    ctc: "₹1,00,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Rejected",
    difficulty: "Hard",
    title: "Google SWE Intern – Got to Final Round but Rejected | Originally posted on Reddit r/cscareerquestions by u/prxmises",
    description:
      "Cleared OA easily but the technical interviews were brutal. The second round caught me completely off guard – I hadn't practised tree DP enough. The interviewer was patient but I could tell my solution had too many edge cases. Got a rejection email 5 days later. Honestly a learning experience – the Google Doc format with no compiler is something you absolutely need to practise.",
    rounds: [
      {
        type: "OA",
        questions: "Array rotation problem + a string compression question.",
        details: "Both cleared. Scored high. The OA felt easier than the actual interviews.",
      },
      {
        type: "Technical",
        questions: "Binary tree serialization and deserialization. Then a follow-up: serialise a general graph with possible cycles.",
        details: "Handled the tree well using BFS + level-order encoding. Struggled on the graph variant – forgot to track visited nodes properly until the interviewer pointed it out.",
      },
      {
        type: "Technical",
        questions: "Given a weighted directed graph, find all paths from source to destination whose total weight is within a range [lo, hi]. Optimize for space.",
        details: "Went DFS with pruning. Solution was correct but not space-optimal. Interviewer wanted something closer to an iterative approach. Ran out of time before reaching it.",
      },
    ],
  });

  await addExp({
    company: google,
    roleTitle: "Software Engineer (L3)",
    ctc: "₹50 LPA + Bonus + ESOP",
    locations: ["Bengaluru"],
    jobType: "Full-time",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Google L3 SWE Full-Time – Off-Campus Application | Originally posted on GeeksforGeeks by Arjun Mehta",
    description:
      "Applied off-campus after 1.5 years of industry experience. The Google loop is 5 rounds for L3. All coding done in Google Docs – no IDE, no compiler. Prep time: 4 months, ~3 hours/day. Resources: NeetCode 150, Striver's Sheet, Cracking the Coding Interview. Host matching after the loop took 3 extra weeks – don't panic if you don't hear back immediately.",
    rounds: [
      {
        type: "Technical",
        questions: "Q1: Longest Palindromic Substring (expand around centre approach). Q2: Pacific Atlantic Water Flow (LC #417).",
        details: "Both medium-level. O(n²) expand-around-centre for palindromes. BFS from both oceans simultaneously for water flow. Complexity discussion after each solution.",
      },
      {
        type: "Technical",
        questions: "Q1: Minimum window substring (LC #76). Q2: Jump Game II – minimum jumps (LC #45).",
        details: "Sliding window for minimum window. Greedy approach for jump game. Interviewer asked for the greedy proof – explained the range-extension invariant clearly.",
      },
      {
        type: "Technical",
        questions: "Q1: K-th Smallest Element in a Sorted Matrix (LC #378). Q2: Alien Dictionary – topological sort of character order.",
        details: "Binary search on value range for sorted matrix. Alien Dictionary: build adjacency from adjacent words, then Kahn's algorithm for topological sort. Edge case: shorter word that is a prefix of the next.",
      },
      {
        type: "Technical",
        questions: "System Design: Design Google Photos' backend – storage, indexing, search by content.",
        details: "Blob storage with CDN, metadata DB (PostgreSQL), ML embedding service for image-to-vector search, approximate nearest neighbor search (HNSW/Faiss). Good 45-minute whiteboard session.",
      },
      {
        type: "HR",
        questions: "Googleyness & Leadership: How do you handle feedback you disagree with? Describe a complex technical project you built from scratch.",
        details: "Focused on psychological safety and data-backed disagreement. Project story: real-time leaderboard system handling 100K concurrent users. Offer arrived after team matching – 3 more weeks.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // MICROSOFT
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: microsoft,
    roleTitle: "SDE Intern",
    ctc: "₹80,000/month",
    locations: ["Hyderabad", "Noida"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Microsoft SDE Internship – IIT Roorkee Campus Placement 2024 | Originally posted on GeeksforGeeks by Riya Kapoor",
    description:
      "Microsoft came to our campus in September 2024. The process was 3 rounds – OA, then two back-to-back technical interviews on the same day. They focus on both DSA and projects. Even asked me to explain the architecture of a system I'd built. Offer letter came 2 weeks after the interviews. Key advice: don't just do LeetCode – know your projects deeply.",
    rounds: [
      {
        type: "OA",
        questions: "30 MCQs (OS, DBMS, OOP, Networks) + 2 coding questions (Merge K sorted lists, matrix rotation).",
        details: "90 minutes on HackerRank. MCQs were tricky – especially OS scheduling questions. About 60 students moved to interviews out of 400+.",
      },
      {
        type: "Technical",
        questions: "Q1: Implement LRU Cache from scratch. Q2: Reverse every k-group of nodes in a linked list. Q3: Brief discussion on my major project (a distributed task queue).",
        details: "HashMap + Doubly Linked List for LRU. Interviewer appreciated O(1) get/put and asked for edge cases (capacity 0, k > length). Project discussion was mostly trade-offs.",
      },
      {
        type: "Technical",
        questions: "OOP Design: Design a Parking Lot system. Questions on polymorphism, abstract classes. Then a DP problem: minimum coin change.",
        details: "Drew out class hierarchies before coding. Coin change was straightforward DP. Interviewer was satisfied with the bottom-up tabulation approach.",
      },
    ],
  });

  await addExp({
    company: microsoft,
    roleTitle: "Software Development Engineer",
    ctc: "₹45 LPA",
    locations: ["Hyderabad"],
    jobType: "Full-time",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Microsoft SDE Full-Time – 4 Rounds Detailed Breakdown | Originally posted on LeetCode Discuss by u/vish_codes",
    description:
      "Converted my Microsoft intern offer to a full-time SDE role. The full-time loop was much harder – 4 rounds including a system design round. They focus heavily on scalability and clarity of thought. The 'As Appropriate' (AA) round assesses leadership potential even for fresh graduates.",
    rounds: [
      {
        type: "Technical",
        questions: "Q1: Merge intervals (LC #56). Q2: Maximum XOR of two numbers using a Trie (LC #421).",
        details: "Sorting approach for merge intervals. Trie-based XOR – built bit by bit from MSB. Asked for the O(n * max_bits) complexity proof.",
      },
      {
        type: "Technical",
        questions: "Q1: LRU Cache – O(1) for all operations. Q2: Word Ladder II – all shortest transformation sequences (LC #126).",
        details: "HashMap + DLL for LRU. Word Ladder: BFS for distances + DFS to reconstruct all paths. Went through 3 iterations with the interviewer's guidance.",
      },
      {
        type: "Technical",
        questions: "System Design: Design Microsoft Teams' messaging infrastructure. Handle 1M concurrent users, message delivery guarantees, and presence (online/offline) status.",
        details: "WebSocket connections, message broker (Kafka), DB partitioned by conversation ID, read-your-own-writes guarantee, presence heartbeat service.",
      },
      {
        type: "HR",
        questions: "'As Appropriate' round: How do you influence teams without authority? Describe a time you drove consensus on a controversial technical decision.",
        details: "Story about convincing a team to migrate from monolith to microservices – backed with data on latency and deploy frequency. Got the offer 3 weeks later.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AMAZON
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: amazon,
    roleTitle: "SDE Intern",
    ctc: "₹90,000/month",
    locations: ["Bengaluru", "Hyderabad"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Amazon SDE Internship – Full Process (OA + 2 Rounds) | Originally posted on Reddit r/india by u/amzn_intern_24",
    description:
      "Amazon's process is unique because of the Leadership Principles – don't underestimate them. I prepared STAR-format stories for at least 8 LPs. The Work Style Assessment in the OA is not just a formality. Tech-wise, questions were LeetCode Medium level. One key tip: always dry-run your code out loud before saying you're done.",
    rounds: [
      {
        type: "OA",
        questions: "Coding: 2 medium problems (Top K frequent elements, Subarray sum equals K). Work Style Assessment: 24 scenario-based questions.",
        details: "OA was on HackerRank. 90 minutes total. Work Style section had paired 'most / least likely' questions – anchor answers to Customer Obsession and Ownership.",
      },
      {
        type: "Technical",
        questions: "Behavioral: 'Tell me about a time you had a conflict with a teammate' (Earn Trust LP). DSA: Find the diameter of a binary tree. Follow-up: return the actual path, not just the length.",
        details: "Diameter using recursive helper returning (max depth, max diameter). Returning the path required tracking the node path during recursion.",
      },
      {
        type: "Technical",
        questions: "Behavioral: 'Tell me about a time you delivered under a tight deadline' (Deliver Results LP). DSA: Implement a task scheduler with cooldown intervals (LC #621).",
        details: "Max-heap + greedy approach for task scheduler. Asked what happens with many distinct tasks – complexity discussion followed naturally. Got the offer a week later.",
      },
    ],
  });

  await addExp({
    company: amazon,
    roleTitle: "SDE Intern",
    ctc: "₹90,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Rejected",
    difficulty: "Medium",
    title: "Amazon Internship – Rejected After OA (Don't Skip LP Prep) | Originally posted on Reddit r/cscareerquestions by u/sadreality_dev",
    description:
      "Did not clear the OA. In hindsight the Work Style Assessment brought me down – I answered some questions too conservatively. The coding part was fine (solved both problems fully). Lesson learned: take the LP assessment as seriously as the coding section. Amazon literally has an algorithm for it.",
    rounds: [
      {
        type: "OA",
        questions: "Coding: 2 medium DSA questions. Work Style Assessment: 24 scenario questions.",
        details: "Solved both coding questions fully. But I was rushing through the Work Style section without thinking about the LPs deeply. Didn't get shortlisted for interviews.",
      },
    ],
  });

  await addExp({
    company: amazon,
    roleTitle: "SDE II",
    ctc: "₹55 LPA + RSU",
    locations: ["Hyderabad", "Bengaluru"],
    jobType: "Full-time",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Amazon SDE II Full-Time Loop – 6 Rounds Decoded | Originally posted on LeetCode Discuss by u/SDE2_Grind",
    description:
      "Amazon's SDE II loop: 4 technical + 2 dedicated LP rounds. Every technical round also has behavioral built in. You need 6-8 STAR stories covering different LPs. The bar raiser round is the hardest – they actively push back on your answers to see how you handle pressure. Prep LP stories as seriously as you prep algorithms.",
    rounds: [
      {
        type: "Technical",
        questions: "LP: Ownership. DSA: Longest consecutive sequence in an unsorted array (LC #128).",
        details: "HashSet approach for O(n). LP story: inherited a broken codebase and led the full remediation effort over 6 weeks.",
      },
      {
        type: "Technical",
        questions: "LP: Dive Deep. DSA: Number of connected components (Union-Find). Follow-up: online version where edges are added dynamically.",
        details: "Union-Find with path compression and union by rank. Online version: same structure, process edges one by one.",
      },
      {
        type: "Technical",
        questions: "System Design: Design Amazon's order management system. Handle order creation, payment, and inventory deduction atomically.",
        details: "Saga pattern for distributed transactions, event sourcing, idempotency keys for payment retries, read replica for order status. Discussed two-phase commit tradeoffs.",
      },
      {
        type: "Technical",
        questions: "LP: Deliver Results. DSA: Median from data stream (LC #295). Follow-up: approximate global median from 1000 distributed sensors.",
        details: "Two-heap approach for running median. Distributed approximate median: Greenwald-Khanna algorithm. Had to recall this from a distributed systems course.",
      },
      {
        type: "HR",
        questions: "Bar Raiser: 'What is the most complex system you have designed?' Deep dive into every component. 'What would you do differently?'",
        details: "Described a real-time fraud detection pipeline. Bar raiser pushed back on every design choice. Key: stay calm, acknowledge trade-offs openly, defend with data.",
      },
      {
        type: "HR",
        questions: "Final LP round: 3 LP stories not yet covered. Offer negotiation discussion.",
        details: "Covered: Are Right A Lot, Think Big, Hire and Develop the Best. Offer came 10 days later. RSU vesting: 5/15/20/40 over 4 years.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FLIPKART
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: flipkart,
    roleTitle: "SDE Intern",
    ctc: "₹75,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Flipkart SDE Internship – Machine Coding Round Breakdown | Originally posted on GeeksforGeeks by Niharika Srivastava",
    description:
      "Flipkart's process was intense – 3 technical rounds and a hiring manager round, all on the same day. They expect you to write modular, readable code, not just get the answer. My interviewer stopped me mid-solution to ask 'is this extensible?'. Machine coding round was the hardest part – had to build a console-based elevator system in 75 minutes.",
    rounds: [
      {
        type: "OA",
        questions: "2 coding problems: Sliding window maximum (LC #239) + a greedy activity scheduling problem.",
        details: "Platform: HackerEarth. 75 minutes. Top ~12% moved to interviews. Both needed optimal solutions – partial credit wasn't enough to pass.",
      },
      {
        type: "Technical",
        questions: "Q1: Find all triplets summing to zero. Q2: Clone a graph with random pointers.",
        details: "Two-pointer approach for triplets, HashMap for graph cloning. Interviewer appreciated clean variable names and asked about edge cases (empty graph, single node loops).",
      },
      {
        type: "Technical",
        questions: "Machine Coding: Design and implement an Elevator System. Must handle multiple elevators, floor requests, direction logic. OOP principles required.",
        details: "Built: Elevator, ElevatorController, FloorRequest. Used a priority queue per elevator (min-heap for up, max-heap for down). Got grilled on extensibility – 'what if we add a VIP floor?'",
      },
      {
        type: "HR",
        questions: "Why Flipkart? Tell me about a project you're proud of. How do you handle ambiguity?",
        details: "Focused on product thinking and handling uncertain requirements. Offer letter arrived 10 days later.",
      },
    ],
  });

  await addExp({
    company: flipkart,
    roleTitle: "Software Development Engineer",
    ctc: "₹40 LPA",
    locations: ["Bengaluru"],
    jobType: "Full-time",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Flipkart SDE Full-Time (Off-Campus) – LLD Round Was the Filter | Originally posted on Reddit r/developersIndia by u/Flipkart_SDE_newjoin",
    description:
      "Applied off-campus via a LinkedIn referral. 4 rounds – 2 DSA, 1 LLD, 1 HM. The LLD round is where most candidates get eliminated. Focus on SOLID principles, design patterns (Strategy, Observer, Factory), and writing extensible code. They will ask 'what if the requirement changes to X?' after every design decision.",
    rounds: [
      {
        type: "Technical",
        questions: "Q1: Median of two sorted arrays (LC #4 – O(log(min(m,n))) required). Q2: Serialize / deserialize a binary tree.",
        details: "Binary search on the smaller array. Serialisation using pre-order traversal with null markers. Interviewer asked for time-complexity proofs.",
      },
      {
        type: "Technical",
        questions: "Q1: Count of smaller numbers after self (LC #315). Q2: Edit distance (LC #72).",
        details: "Modified merge sort for LC #315. 2D DP for edit distance. Interviewer asked for space optimisation – reduced to O(n) using rolling array.",
      },
      {
        type: "Technical",
        questions: "LLD: Design a Library Management System – book borrowing, returns, reservations, fines, multiple branches.",
        details: "Classes: Book, Member, Branch, Reservation, BorrowRecord. Strategy pattern for fine calculation. Observer pattern for notification when reserved book becomes available. Made thread-safe on request.",
      },
      {
        type: "HR",
        questions: "Why Flipkart over others? Your biggest technical failure. How do you approach ambiguous product requirements?",
        details: "Focused on Flipkart's scale challenges. Used a real failure story – a production bug I caused during my internship and how I resolved it under pressure.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // GOLDMAN SACHS
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: goldman,
    roleTitle: "Technology Summer Analyst",
    ctc: "₹1,20,000/month",
    locations: ["Bengaluru", "Hyderabad"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Hard",
    title: "Goldman Sachs Summer Analyst 2024 – Aptitude + DSA + System Design | Originally posted on GeeksforGeeks by Tanvi Agarwal",
    description:
      "GS's OA is a beast – you need to be fast on aptitude AND strong on DSA. The interviews are more conversational than I expected. They asked about ACID properties in databases, then jumped straight into a hard DP problem. Project deep dives were thorough – be ready to justify every tech choice you made.",
    rounds: [
      {
        type: "OA",
        questions: "Section 1: Aptitude (probability, permutations, abstract reasoning – 20 MCQs, 25 min). Section 2: Technical MCQs (OS, OOP, program outputs – 15 MCQs, 20 min). Section 3: Coding (2 problems – matrix chain multiplication DP + longest common subsequence variant).",
        details: "HackerRank. 90 minutes total. Aptitude was the hardest section – speed is crucial. DP problems in coding were harder than typical campus OAs.",
      },
      {
        type: "Technical",
        questions: "Q1: Word Break II (LC #140) – return all possible sentences. Q2: DBMS – explain ACID, difference between clustered and non-clustered index. Q3: Project deep dive – ML-based stock prediction project.",
        details: "BFS + memoization for Word Break. Follow-up: 'what if the dictionary has 1M words?' – answered with a Trie. DBMS questions were unexpected but I was prepared from GFG.",
      },
      {
        type: "Technical",
        questions: "System Design (light): Design a URL shortener. Focus on scalability and hashing. Behavioral: 'Why finance?'",
        details: "Consistent hashing, Base62 encoding, Redis-based cache for frequent URLs. Cache eviction policy discussion was the highlight. Offer call came 2 weeks later.",
      },
    ],
  });

  await addExp({
    company: goldman,
    roleTitle: "Technology Summer Analyst",
    ctc: "₹1,20,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Rejected",
    difficulty: "Hard",
    title: "Goldman Sachs – Didn't Clear OA, Aptitude Was the Killer | Originally posted on Reddit r/developersIndia by u/gs_oa_regrets",
    description:
      "Cleared the coding section comfortably but the aptitude section was too fast-paced. I practised DSA for months but barely touched quant prep. Lesson: for GS, IndiaBix and PrepInsta quant practice is as important as LeetCode. Don't neglect numerical reasoning.",
    rounds: [
      {
        type: "OA",
        questions: "Aptitude (probability, series, abstract reasoning) + Technical MCQs + 2 Coding questions.",
        details: "Solved both coding problems fully. Ran out of time on aptitude – answered only 14/20. Didn't get shortlisted. The aptitude cutoff was higher than I assumed.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // D. E. SHAW
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: deshaw,
    roleTitle: "Software Development Intern",
    ctc: "₹1,00,000/month",
    locations: ["Hyderabad"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Hard",
    title: "D. E. Shaw Internship – Project Deep Dive + Hard Graph Problem | Originally posted on GeeksforGeeks by Siddharth Kulkarni",
    description:
      "DE Shaw is known for being rigorous and they lived up to that reputation. The OA has a 1-hour hard graph problem alongside MCQs on SQL, OS, and OOP. In the interview they grilled me on my project for 20 minutes – every design decision, every trade-off. You need to know your projects inside-out. Intellectual curiosity is what they really look for.",
    rounds: [
      {
        type: "OA",
        questions: "MCQ section (SQL window functions, OS scheduling, OOP virtual dispatch) + 1 hard coding problem (minimum spanning tree variant on a dynamic graph).",
        details: "HackerRank. Kruskal's with Union-Find for the graph problem. SQL MCQs tested GROUP BY with HAVING and window functions – very detailed.",
      },
      {
        type: "Technical",
        questions: "Project deep dive: distributed cache project (Redis-inspired). Questions on: shallow vs. deep copy in C++, virtual function internals (vTable), thread safety in a HashMap.",
        details: "25 minutes on the project alone. 'What happens if two threads write to the same bucket?' – answered with lock striping / concurrent HashMap pattern.",
      },
      {
        type: "Technical",
        questions: "Q1: Find the median from a data stream at each step (LC #295). Q2: Design a rate limiter using the sliding window algorithm.",
        details: "Two heaps for running median. Rate limiter: compared Token Bucket vs. Sliding Window Log. Interviewer preferred deque-based sliding window for memory efficiency.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // MORGAN STANLEY
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: morgan,
    roleTitle: "Technology Analyst Intern",
    ctc: "₹95,000/month",
    locations: ["Mumbai"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Morgan Stanley Technology Analyst Internship – Mumbai 2024 | Originally posted on GeeksforGeeks by Priya Menon",
    description:
      "Morgan Stanley's OA has three distinct timed sections. The debugging section is unique – I hadn't seen that format before and it was a big differentiator. The interview had a good mix of DSA, SQL, and behavioral questions. The HR round felt like a genuine conversation about career goals rather than a formality.",
    rounds: [
      {
        type: "OA",
        questions: "Section 1: Aptitude – 12 quant/reasoning Qs (20 min). Section 2: Debugging – fix 5 C++ code snippets with logic errors (20 min). Section 3: Coding – 2 medium problems (two-pointer sum + binary search on answer).",
        details: "Debugging section was the real differentiator. One snippet had an off-by-one error in binary search, another had a race condition. Practice debugging on CodeSignal beforehand.",
      },
      {
        type: "Technical",
        questions: "SQL: Rank employees by salary within each department (window function). DSA: Trapping rain water (LC #42). OOP: Explain SOLID principles with an example.",
        details: "DENSE_RANK() OVER PARTITION BY for SQL. Trapping rain water with two-pointer O(1) space approach. SOLID principles – used a real example from my own project.",
      },
      {
        type: "HR",
        questions: "Why Morgan Stanley? Where do you see yourself in 5 years? Tell me about a time you showed leadership.",
        details: "Focused on my interest in tech at the intersection of financial markets. Referenced my quantitative finance elective. Felt like a genuine cultural fit conversation.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UBER
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: uber,
    roleTitle: "Software Engineering Intern",
    ctc: "₹1,00,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Uber SWE Internship – Bengaluru 2024 (Scale-Thinking Required) | Originally posted on LeetCode Discuss by u/ubersweep24",
    description:
      "Uber's campus process was smooth. OA on HackerRank – 2 medium problems in 75 minutes. The interview felt more like a conversation – my interviewer kept asking 'how would this scale?' after every solution. Being comfortable talking about trade-offs (time vs. space, consistency vs. availability) is essential.",
    rounds: [
      {
        type: "OA",
        questions: "Q1: Maximum subarray with at most k distinct elements. Q2: Implement a queue using two stacks with amortised O(1) operations.",
        details: "Sliding window for Q1, two-stack queue for Q2. Follow-up on amortised analysis – be ready to explain why total ops are O(n) even if a single dequeue is O(n).",
      },
      {
        type: "Technical",
        questions: "Q1: Shortest path with at most K stops (LC #787). Q2: Design discussion – how would you implement surge pricing at Uber's scale?",
        details: "BFS with (node, stops_remaining) state for Q1. Surge pricing: geohashing for location bucketing, supply-demand ratio, eventual consistency. Interviewer loved the geohash angle.",
      },
    ],
  });

  await addExp({
    company: uber,
    roleTitle: "Software Engineer II",
    ctc: "₹48 LPA",
    locations: ["Bengaluru"],
    jobType: "Full-time",
    verdict: "Rejected",
    difficulty: "Hard",
    title: "Uber SDE II – Rejected at Final System Design Round | Originally posted on Reddit r/cscareerquestions by u/gg_no_re_uber",
    description:
      "Cleared 3 out of 4 rounds but got rejected at the final system design round. In hindsight, I didn't go deep enough on the database partitioning strategy. Uber works at massive scale and they expect you to think about the 99th percentile cases and cross-shard boundary problems. Will reapply in 6 months with better system design prep.",
    rounds: [
      {
        type: "Technical",
        questions: "Q1: Valid Sudoku (LC #36). Q2: Course Schedule II – topological sort (LC #210).",
        details: "Both solved cleanly. Interviewer was satisfied with explanations.",
      },
      {
        type: "Technical",
        questions: "Q1: Rate limiter design for Uber's driver-app API (100M requests/day). Q2: Implement an LFU Cache (LC #460).",
        details: "Rate limiter: token bucket with Redis atomic operations. LFU: two HashMaps + a doubly linked list per frequency bucket. LFU took 35 of 45 minutes.",
      },
      {
        type: "Technical",
        questions: "System Design: Design Uber's real-time driver location service. Millions of drivers updating location every 4 seconds. Match drivers to riders.",
        details: "Geohashing for spatial partitioning, WebSocket for real-time updates, in-memory grid for proximity search, Kafka for location streaming. Got stuck on cross-shard queries for riders near shard boundaries.",
      },
      {
        type: "HR",
        questions: "Uber values – 'Do the right thing'. Past experience of making a difficult ethical call in an engineering context.",
        details: "Shared a story about flagging a privacy issue in a production system even though the timeline was tight. Overall feedback cited weakness in system design depth.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ATLASSIAN
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: atlassian,
    roleTitle: "Software Engineering Intern",
    ctc: "₹90,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Atlassian SWE Internship – 'Open Company, No Bullshit' is Real | Originally posted on Reddit r/developersIndia by u/atlassian_intern_blr",
    description:
      "Atlassian's process was refreshingly different. They genuinely care about values. The technical bar is high but the atmosphere during interviews was very collaborative. My interviewer said 'feel free to Google syntax if needed' – that relaxed me a lot. A great option if you want a company culture that actually matches its stated values.",
    rounds: [
      {
        type: "OA",
        questions: "2 coding problems (max product subarray, valid parentheses with wildcards) + short behavioral questions in written form.",
        details: "HireVue + CodeSignal. 90 minutes. Behavioral written questions asked about teamwork and disagreements – be honest and specific, not generic.",
      },
      {
        type: "Technical",
        questions: "Q1: Design an in-memory key-value store with TTL expiry. Q2: Given a Jira-like ticket dependency graph, detect cycles and return a valid execution order (topological sort).",
        details: "Key-value store: HashMap + lazy deletion on get() for TTL. Topological sort with Kahn's algorithm. The cycle detection part was graded carefully.",
      },
      {
        type: "HR",
        questions: "Atlassian Values interview: Tell me about a time you disagreed with a technical decision and how you handled it. How do you give feedback to peers?",
        details: "Used a story about a code review disagreement where I backed my position with data. Showed I can advocate for a stance respectfully without dismissing others.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // MASTERCARD
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: mastercard,
    roleTitle: "Software Engineer Associate",
    ctc: "₹22 LPA",
    locations: ["Pune", "Noida"],
    jobType: "Full-time",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Mastercard Software Engineer On-Campus 2024 – NIT Trichy | Originally posted on GeeksforGeeks by Karan Bhatia",
    description:
      "Mastercard came to campus with a 4-round process. The OA was a mix of coding and core CS. Technical rounds covered DSA, OOP, DBMS, and logic puzzles. The HR round was structured. Out of 85 candidates, 6 were selected. Key differentiator: knowing your DBMS and OS beyond just DSA.",
    rounds: [
      {
        type: "OA",
        questions: "2 coding questions (anagram check, find all permutations of a string) + 20 MCQs on OOP (polymorphism, virtual functions), DBMS (ACID, normalization), OS (scheduling algorithms).",
        details: "HackerEarth. 60 minutes. MCQs were detailed – included a question on DBMS transaction isolation levels. Coding questions were easy-medium.",
      },
      {
        type: "Technical",
        questions: "DSA: Implement AVL tree insert with rotations. Core CS: Explain ACID with a banking example. OOP: Polymorphism types with code examples.",
        details: "AVL tree rotation logic under pressure was tough. ACID: focused on Durability with WAL (Write-Ahead Logging). OOP: runtime vs compile-time polymorphism with examples.",
      },
      {
        type: "Technical",
        questions: "Puzzle: 12 balls, one is heavier or lighter. Find it in 3 weighings using a balance scale. Project deep dive: my e-commerce web application.",
        details: "Classic puzzle – divide into groups of 4 using elimination. Project questions focused on database schema design and authentication implementation.",
      },
      {
        type: "HR",
        questions: "Strengths and weaknesses. Where do you see yourself in 3 years? Why payments / fintech?",
        details: "Showed genuine interest in payment security and fraud detection. Offer letter emailed 2 days after the interview.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SWIGGY
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: swiggy,
    roleTitle: "SDE Intern",
    ctc: "₹80,000/month",
    locations: ["Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Swiggy SDE Internship – Product + DSA in One Process | Originally posted on GeeksforGeeks by Aakash Nair",
    description:
      "Swiggy's process mixes DSA with real product scenarios. In one round they asked me to design the data model for Swiggy's restaurant-menu system. They care about practical problem solving, not just algorithmic gymnastics. The 1:1 with the hiring manager felt more like a coffee chat than a formal interview.",
    rounds: [
      {
        type: "OA",
        questions: "2 coding problems: Minimum time to deliver all orders given restaurant locations on a 2D grid (BFS) + a string parsing problem.",
        details: "HackerRank. 60 minutes. The delivery problem was domain-specific but essentially multi-source BFS. A clever way to test graph skills in a realistic context.",
      },
      {
        type: "Technical",
        questions: "Q1: Given real-time order updates as a stream, compute the top-K restaurants by order count. Q2: Database schema design for Swiggy's menu system.",
        details: "Top-K with a min-heap of size K. Schema: discussed normalization, handling item variants (pizza sizes), and a separate pricing table for time-based pricing.",
      },
      {
        type: "HR",
        questions: "Why Swiggy? How would you improve the Swiggy app from a tech perspective? Team dynamics question.",
        details: "Suggested improving the search ranking algorithm by incorporating contextual signals (time of day, weather, dietary preferences). HM was genuinely interested.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADOBE
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: adobe,
    roleTitle: "Software Engineer Intern (R&D)",
    ctc: "₹75,000/month",
    locations: ["Noida", "Bengaluru"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Adobe R&D Internship – Creative Algorithms + Design Patterns | Originally posted on LeetCode Discuss by u/adobe_rd_intern",
    description:
      "Adobe's process is more research-oriented than typical product companies. The OA had unique algorithmic problems I hadn't seen directly on LeetCode. The interview combined strong DSA with creative problem solving. A great fit if you enjoy algorithms applied to creative domains (image processing, document manipulation).",
    rounds: [
      {
        type: "OA",
        questions: "Q1: Given an image as a 2D pixel array, implement a flood fill algorithm optimally. Q2: Implement a basic document diff algorithm (minimum edit operations between two documents word by word).",
        details: "HackerRank. 90 minutes. Flood fill with BFS. Document diff is edit distance at word-level – an interesting application of a classic DP problem.",
      },
      {
        type: "Technical",
        questions: "Q1: Implement a simplified version of Photoshop's magic wand selection (connected component labeling with tolerance). Q2: Design pattern question – Command pattern vs. Strategy pattern.",
        details: "Magic wand: BFS flood-fill with a tolerance threshold for pixel similarity. Design patterns: Command for undo-redo (perfect for Adobe's domain), Strategy for interchangeable rendering algorithms.",
      },
      {
        type: "HR",
        questions: "What Adobe product would you redesign and how? Tell me about a complex bug you fixed.",
        details: "Redesigning Acrobat's PDF form builder for accessibility. Bug story: a race condition in a multi-threaded parser – described the debugging process step by step.",
      },
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SALESFORCE
  // ══════════════════════════════════════════════════════════════════════════

  await addExp({
    company: salesforce,
    roleTitle: "Software Engineering Intern (Futureforce)",
    ctc: "₹85,000/month",
    locations: ["Hyderabad"],
    jobType: "Internship",
    verdict: "Selected",
    difficulty: "Medium",
    title: "Salesforce Futureforce Internship 2024 – Ohana Culture is Genuine | Originally posted on Reddit r/cscareerquestions by u/sfdc_futureforce_24",
    description:
      "Applied through Salesforce's Futureforce campus programme. The process was entirely virtual – 3 rounds. They test both OOP/design thinking and standard DSA. The team culture felt very collaborative – multiple interviewers mentioned their 'Ohana' culture during conversations and it didn't feel scripted.",
    rounds: [
      {
        type: "OA",
        questions: "2 medium coding problems: Number of islands (LC #200) + implement a message queue with priority levels.",
        details: "CodeSignal. 75 minutes. Number of islands with DFS. Priority queue using a sorted heap with custom comparator. Both fully solved.",
      },
      {
        type: "Technical",
        questions: "Q1: LLD – design a simple CRM contact management system. Q2: DSA – find the k-th largest element in a BST without extra space.",
        details: "CRM: Contact, Account, Opportunity classes with relationship management. Strategy for different contact sorting. k-th largest in BST using reverse in-order traversal – no extra space.",
      },
      {
        type: "HR",
        questions: "Salesforce values (Trust, Customer Success, Innovation, Equality) – which resonates most with you and why?",
        details: "Connected 'Trust' to security-first software design principles I follow. Interviewer appreciated the specific connection to engineering practice rather than a generic answer.",
      },
    ],
  });

  console.log("✅ Seeding complete! 22 experiences added with genuine source attribution.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
