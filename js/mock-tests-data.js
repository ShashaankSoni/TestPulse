// ExamOrbit - Comprehensive Question Bank for Indian Competitive Exams
// Contains realistic, high-yield questions for JEE, NEET, UPSC, CAT, SSC CGL, and Banking exams

const EXAM_DATA = {
  jee: {
    name: "JEE (Main & Advanced)",
    category: "Engineering",
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    durationMinutes: 45,
    tests: [
      {
        id: "jee-full-1",
        title: "JEE Main Grand Mock 01 (PCM)",
        subject: "Full Syllabus (Physics, Chemistry, Maths)",
        questions: [
          {
            id: 1,
            subject: "Physics",
            question: "A block of mass 2 kg is placed on a rough horizontal surface with coefficient of friction μ = 0.4. A horizontal force F = 6 N is applied on the block. The frictional force acting on the block is (take g = 10 m/s²):",
            options: [
              "8 N",
              "6 N",
              "0 N",
              "2 N"
            ],
            correctAnswer: 1,
            explanation: "Maximum static friction f_max = μ * N = μ * m * g = 0.4 * 2 * 10 = 8 N. Since the applied force F = 6 N is less than f_max (8 N), the block does not move. In static equilibrium, the static frictional force exactly balances the applied force. Hence, f = F = 6 N."
          },
          {
            id: 2,
            subject: "Physics",
            question: "In a Young's double slit experiment, if the distance between the slits is halved and the distance between the screen and the slits is doubled, the fringe width will:",
            options: [
              "Remain unchanged",
              "Become double",
              "Become four times",
              "Become one-fourth"
            ],
            correctAnswer: 2,
            explanation: "Fringe width β = (λ * D) / d. New distance D' = 2D and new slit spacing d' = d/2. Therefore, β' = (λ * 2D) / (d/2) = 4 * (λ * D / d) = 4β. The fringe width becomes four times."
          },
          {
            id: 3,
            subject: "Chemistry",
            question: "Which of the following compounds exhibits maximum paramagnetic character?",
            options: [
              "[Fe(CN)6]³⁻",
              "[Fe(H2O)6]³⁺",
              "[Ni(CN)4]²⁻",
              "[Zn(H2O)6]²⁺"
            ],
            correctAnswer: 1,
            explanation: "In [Fe(H2O)6]³⁺, Fe is in +3 state (3d⁵). Water (H2O) is a weak field ligand, so no pairing occurs (t2g³ eg²), resulting in 5 unpaired electrons, which gives maximum magnetic moment (μ ≈ 5.92 BM)."
          },
          {
            id: 4,
            subject: "Chemistry",
            question: "The standard reduction potentials for Cu²⁺/Cu and Zn²⁺/Zn are +0.34 V and -0.76 V respectively. The standard EMF of the Daniell cell (Zn | Zn²⁺ || Cu²⁺ | Cu) is:",
            options: [
              "+0.42 V",
              "-1.10 V",
              "+1.10 V",
              "+0.76 V"
            ],
            correctAnswer: 2,
            explanation: "E°_cell = E°_cathode - E°_anode = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 V - (-0.76 V) = +1.10 V."
          },
          {
            id: 5,
            subject: "Mathematics",
            question: "Evaluate: lim (x -> 0) [sin(5x) / tan(2x)]",
            options: [
              "2/5",
              "5/2",
              "1",
              "0"
            ],
            correctAnswer: 1,
            explanation: "lim (x -> 0) [sin(5x)/tan(2x)] = lim (x -> 0) [(sin(5x)/5x) * 5x] / [(tan(2x)/2x) * 2x] = (1 * 5) / (1 * 2) = 5/2."
          },
          {
            id: 6,
            subject: "Mathematics",
            question: "If a line makes angles α, β, γ with the positive coordinate axes, then cos²(α) + cos²(β) + cos²(γ) is equal to:",
            options: [
              "0",
              "1",
              "2",
              "3"
            ],
            correctAnswer: 1,
            explanation: "By property of direction cosines l, m, n of a directed line in 3D geometry: l² + m² + n² = cos²(α) + cos²(β) + cos²(γ) = 1."
          }
        ]
      }
    ]
  },
  neet: {
    name: "NEET UG",
    category: "Medical",
    markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
    durationMinutes: 45,
    tests: [
      {
        id: "neet-full-1",
        title: "NEET UG PCB Mock Assessment",
        subject: "Physics, Chemistry & Biology",
        questions: [
          {
            id: 1,
            subject: "Biology",
            question: "Which cell organelle is responsible for the formation of the acrosome of the sperm?",
            options: [
              "Lysosome",
              "Golgi complex",
              "Endoplasmic reticulum",
              "Ribosome"
            ],
            correctAnswer: 1,
            explanation: "The acrosome of the mammalian spermatozoon is derived from the Golgi apparatus during spermiogenesis. It contains lytic enzymes like hyaluronidase."
          },
          {
            id: 2,
            subject: "Biology",
            question: "During DNA replication, Okazaki fragments are synthesized in which direction on the lagging strand?",
            options: [
              "3' to 5'",
              "5' to 3'",
              "Both directions simultaneously",
              "Random direction"
            ],
            correctAnswer: 1,
            explanation: "DNA Polymerase can only synthesize DNA in the 5' to 3' direction. On the lagging strand, discontinuous Okazaki fragments are synthesized in the 5' to 3' direction away from the replication fork."
          },
          {
            id: 3,
            subject: "Chemistry",
            question: "Which of the following is an aromatic compound according to Hückel's rule?",
            options: [
              "Cyclooctatetraene",
              "Benzene (6 π electrons)",
              "Cyclobutadiene",
              "Cyclopentadiene"
            ],
            correctAnswer: 1,
            explanation: "Hückel's rule states that planar cyclic conjugated systems with (4n + 2) π electrons are aromatic. For n = 1, (4*1 + 2) = 6 π electrons. Benzene is planar, cyclic, completely conjugated with 6 π electrons."
          },
          {
            id: 4,
            subject: "Physics",
            question: "A body of mass 5 kg falls freely from a height of 20 m. Its kinetic energy just before hitting the ground is (take g = 10 m/s²):",
            options: [
              "500 J",
              "1000 J",
              "2000 J",
              "100 J"
            ],
            correctAnswer: 1,
            explanation: "By conservation of mechanical energy, Loss in PE = Gain in KE. KE = m * g * h = 5 * 10 * 20 = 1000 J."
          }
        ]
      }
    ]
  },
  upsc: {
    name: "UPSC Civil Services (IAS/IPS)",
    category: "Civil Services",
    markingScheme: { correct: 2, incorrect: -0.66, unattempted: 0 },
    durationMinutes: 40,
    tests: [
      {
        id: "upsc-gs-1",
        title: "UPSC Prelims GS Paper 1 - Core Practice",
        subject: "Polity, Economy, Modern History & Environment",
        questions: [
          {
            id: 1,
            subject: "Indian Polity",
            question: "Which Article of the Constitution of India provides for the 'Right to Privacy' as an intrinsic part of the Right to Life and Personal Liberty?",
            options: [
              "Article 14",
              "Article 19",
              "Article 21",
              "Article 25"
            ],
            correctAnswer: 2,
            explanation: "In the landmark Justice K.S. Puttaswamy (Retd.) vs Union of India (2017) judgment, a nine-judge bench of the Supreme Court unanimously declared that the Right to Privacy is a Fundamental Right protected under Article 21 of the Indian Constitution."
          },
          {
            id: 2,
            subject: "Economy",
            question: "If the Reserve Bank of India (RBI) decides to adopt an expansionary monetary policy, which of the following would it NOT do?",
            options: [
              "Cut and optimize the Statutory Liquidity Ratio (SLR)",
              "Increase the Marginal Standing Facility (MSF) rate",
              "Cut the Repo rate and Bank rate",
              "Infuse liquidity through Open Market Operations (OMOs)"
            ],
            correctAnswer: 1,
            explanation: "An expansionary monetary policy aims to stimulate economic growth by increasing money supply and reducing borrowing costs. Increasing the MSF rate makes borrowing more expensive, which is a contractionary measure. Therefore, the RBI would NOT increase the MSF rate."
          },
          {
            id: 3,
            subject: "Modern History",
            question: "With reference to the Indian freedom struggle, which event occurred FIRST chronologically?",
            options: [
              "Rowlatt Act agitation",
              "Champaran Satyagraha",
              "Non-Cooperation Movement",
              "Kheda Satyagraha"
            ],
            correctAnswer: 1,
            explanation: "Champaran Satyagraha (1917, Bihar) was Mahatma Gandhi's first civil disobedience movement in India against the Tinkathia system. Kheda occurred in 1918, Rowlatt Act agitation in 1919, and Non-Cooperation Movement in 1920."
          },
          {
            id: 4,
            subject: "Environment & Ecology",
            question: "The term 'Biomagnification' refers to:",
            options: [
              "Increase in population of a biological species",
              "Increase in concentration of a non-biodegradable toxicant at successive trophic levels",
              "Expansion of protected biosphere reserves",
              "Growth of phytoplankton blooms due to excess nitrogen"
            ],
            correctAnswer: 1,
            explanation: "Biomagnification (or biological magnification) refers to the tendency of pollutants (such as DDT, mercury) to concentrate as they move from one trophic level to the next higher level in a food chain."
          }
        ]
      }
    ]
  },
  cat: {
    name: "CAT (IIM Entrance)",
    category: "Management",
    markingScheme: { correct: 3, incorrect: -1, unattempted: 0 },
    durationMinutes: 40,
    tests: [
      {
        id: "cat-mock-1",
        title: "CAT Quantitative & Verbal Mock",
        subject: "Quant, VARC & DILR",
        questions: [
          {
            id: 1,
            subject: "Quantitative Aptitude",
            question: "A vendor buys apples at 6 for ₹10 and sells them at 4 for ₹10. What is his percentage profit or loss?",
            options: [
              "50% profit",
              "50% loss",
              "25% profit",
              "33.33% profit"
            ],
            correctAnswer: 0,
            explanation: "Cost Price (CP) of 1 apple = 10/6 = ₹5/3. Selling Price (SP) of 1 apple = 10/4 = ₹5/2. Profit = SP - CP = 5/2 - 5/3 = 5/6. Profit % = (Profit / CP) * 100 = (5/6 / 5/3) * 100 = (3/6) * 100 = 50% profit."
          },
          {
            id: 2,
            subject: "Quantitative Aptitude",
            question: "If log₂ (x) + log₄ (x) + log₁₆ (x) = 21/4, find the value of x.",
            options: [
              "8",
              "16",
              "32",
              "64"
            ],
            correctAnswer: 0,
            explanation: "Change base to 2: log₄(x) = log₂(x)/log₂(4) = log₂(x)/2. log₁₆(x) = log₂(x)/4. So log₂(x) [1 + 1/2 + 1/4] = log₂(x) * (7/4) = 21/4. Therefore, log₂(x) = 3 => x = 2³ = 8."
          },
          {
            id: 3,
            subject: "Verbal Ability (VARC)",
            question: "Select the word most nearly OPPOSITE in meaning to 'EPHEMERAL':",
            options: [
              "Transient",
              "Perpetual",
              "Fleeting",
              "Evanescent"
            ],
            correctAnswer: 1,
            explanation: "Ephemeral means lasting for a very short time; transient. Its antonym is perpetual, eternal, or permanent."
          },
          {
            id: 4,
            subject: "Logical Reasoning (DILR)",
            question: "In a class of 60 students, 35 like Coffee, 25 like Tea, and 10 like neither. How many students like BOTH Coffee and Tea?",
            options: [
              "10",
              "15",
              "20",
              "5"
            ],
            correctAnswer: 0,
            explanation: "Total who like either Coffee or Tea = Total - Neither = 60 - 10 = 50. By Principle of Inclusion-Exclusion: n(C ∪ T) = n(C) + n(T) - n(C ∩ T) => 50 = 35 + 25 - n(C ∩ T) => 50 = 60 - n(C ∩ T) => n(C ∩ T) = 10."
          }
        ]
      }
    ]
  },
  ssc: {
    name: "SSC CGL / Govt Exams",
    category: "Staff Selection Commission",
    markingScheme: { correct: 2, incorrect: -0.5, unattempted: 0 },
    durationMinutes: 30,
    tests: [
      {
        id: "ssc-tier1-1",
        title: "SSC CGL Tier-1 Speed Test",
        subject: "General Intelligence & Reasoning, Math & GS",
        questions: [
          {
            id: 1,
            subject: "General Intelligence",
            question: "Find the missing number in the series: 4, 9, 25, 49, 121, ?",
            options: [
              "144",
              "169",
              "196",
              "225"
            ],
            correctAnswer: 1,
            explanation: "The series consists of squares of consecutive prime numbers: 2² = 4, 3² = 9, 5² = 25, 7² = 49, 11² = 121, 13² = 169. Next is 13² = 169."
          },
          {
            id: 2,
            subject: "Quantitative Aptitude",
            question: "The simple interest on a certain sum of money for 3 years at 5% per annum is ₹1200. What would be the compound interest on the same sum at the same rate and time?",
            options: [
              "₹1261",
              "₹1240",
              "₹1280",
              "₹1320"
            ],
            correctAnswer: 0,
            explanation: "SI = (P * R * T)/100 => 1200 = (P * 5 * 3)/100 => P = 120000 / 15 = ₹8000. CI = P[(1 + R/100)³ - 1] = 8000 * [(21/20)³ - 1] = 8000 * [9261/8000 - 1] = 9261 - 8000 = ₹1261."
          },
          {
            id: 3,
            subject: "General Awareness",
            question: "Who was the founder of the Maurya Dynasty in ancient India?",
            options: [
              "Ashoka",
              "Bindusara",
              "Chandragupta Maurya",
              "Samudragupta"
            ],
            correctAnswer: 2,
            explanation: "Chandragupta Maurya founded the Maurya Empire around 322 BCE with the guidance of his guru and chief advisor Chanakya (Kautilya)."
          }
        ]
      }
    ]
  },
  banking: {
    name: "Banking (IBPS PO / SBI PO)",
    category: "Banking & Insurance",
    markingScheme: { correct: 1, incorrect: -0.25, unattempted: 0 },
    durationMinutes: 30,
    tests: [
      {
        id: "bank-pre-1",
        title: "IBPS / SBI PO Prelims Drill",
        subject: "Reasoning & Quantitative Aptitude",
        questions: [
          {
            id: 1,
            subject: "Reasoning Ability",
            question: "Statements: All Cups are Plates. Some Plates are Bowls. Conclusion: I. Some Cups are Bowls. II. No Cup is Bowl.",
            options: [
              "Only conclusion I follows",
              "Only conclusion II follows",
              "Either conclusion I or II follows",
              "Neither conclusion I nor II follows"
            ],
            correctAnswer: 2,
            explanation: "Here, both individual conclusions do not definitively follow. However, conclusion I ('Some Cups are Bowls') and conclusion II ('No Cup is Bowl') form a complementary pair (Particular Affirmative + Universal Negative) with common subject and predicate. Hence, Either I or II follows."
          },
          {
            id: 2,
            subject: "Quantitative Aptitude",
            question: "A train running at 72 km/h crosses a 200 m long platform in 22 seconds. What is the length of the train?",
            options: [
              "240 m",
              "220 m",
              "200 m",
              "250 m"
            ],
            correctAnswer: 0,
            explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance covered = Speed * Time = 20 * 22 = 440 m. Total distance = Length of train + Length of platform => 440 = L + 200 => L = 240 m."
          }
        ]
      }
    ]
  },
  gate: {
    name: "GATE (Engineering Graduates)",
    category: "Engineering & Science",
    markingScheme: { correct: 2, incorrect: -0.66, unattempted: 0 },
    durationMinutes: 40,
    tests: [
      {
        id: "gate-cs-1",
        title: "GATE Computer Science Core Mock",
        subject: "Data Structures, Algorithms & OS",
        questions: [
          {
            id: 1,
            subject: "Algorithms",
            question: "What is the worst-case time complexity of QuickSort on an array of n elements?",
            options: [
              "O(n log n)",
              "O(n)",
              "O(n²)",
              "O(log n)"
            ],
            correctAnswer: 2,
            explanation: "In QuickSort, when the selected pivot is consistently the smallest or largest element (such as in an already sorted array with standard first/last element pivot), the partition is unbalanced into subproblems of size 0 and n-1, leading to recurrence T(n) = T(n-1) + O(n), which resolves to O(n²)."
          },
          {
            id: 2,
            subject: "Operating Systems",
            question: "Which of the following condition is NOT one of Coffman's four necessary conditions for Deadlock?",
            options: [
              "Mutual Exclusion",
              "Hold and Wait",
              "Preemption",
              "Circular Wait"
            ],
            correctAnswer: 2,
            explanation: "Coffman's 4 conditions for deadlock are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly taken), and 4. Circular Wait. Preemption breaks deadlock, so 'Preemption' is not a condition."
          }
        ]
      }
    ]
  },
  clat: {
    name: "CLAT (Common Law Admission Test)",
    category: "Law",
    markingScheme: { correct: 1, incorrect: -0.25, unattempted: 0 },
    durationMinutes: 30,
    tests: [
      {
        id: "clat-legal-1",
        title: "CLAT Legal Reasoning & GK Mock",
        subject: "Legal Aptitude & Current Affairs",
        questions: [
          {
            id: 1,
            subject: "Legal Reasoning",
            question: "Principle: Volenti non fit injuria - Harm suffered voluntarily does not constitute a legal injury. Fact: Sachin goes to watch a cricket match in a stadium. A batsman hits a six that strikes Sachin on the head. Sachin sues the batsman.",
            options: [
              "The batsman is liable for negligence",
              "The stadium owner is liable for poor netting",
              "The batsman is not liable because Sachin impliedly assumed the risk by attending the match",
              "Sachin is entitled to full compensation from BCCI"
            ],
            correctAnswer: 2,
            explanation: "By purchasing a ticket and sitting in a stadium where balls can fly into the stands, a spectator voluntarily consents to the ordinary and foreseeable risks of the game. Under the doctrine of Volenti non fit injuria, the batsman is not liable."
          }
        ]
      }
    ]
  }
};

// All Indian exams list for the initial onboarding screen & switcher
const ALL_INDIAN_EXAMS = [
  { id: "jee", name: "JEE (Main & Advanced)", tag: "Engineering", icon: "atom", desc: "IIT, NIT, IIIT Entrance" },
  { id: "neet", name: "NEET UG", tag: "Medical", icon: "stethoscope", desc: "All India Medical & Dental Entrance" },
  { id: "upsc", name: "UPSC Civil Services", tag: "Civil Services", icon: "landmark", desc: "IAS, IPS, IFS, IRS" },
  { id: "cat", name: "CAT (IIM Entrance)", tag: "Management", icon: "trending-up", desc: "IIMs & Top Business Schools" },
  { id: "gate", name: "GATE", tag: "Postgrad Engg", icon: "cpu", desc: "M.Tech & PSU Recruitment" },
  { id: "ssc", name: "SSC CGL / CHSL", tag: "Govt Jobs", icon: "shield-check", desc: "Central Govt Officers & Inspectors" },
  { id: "banking", name: "IBPS / SBI PO & Clerk", tag: "Banking", icon: "wallet", desc: "Public Sector Banks & RBI" },
  { id: "clat", name: "CLAT", tag: "Law", icon: "scale", desc: "National Law Universities (NLUs)" },
  { id: "nda", name: "NDA & CDS", tag: "Defence", icon: "compass", desc: "Armed Forces Academy & Officer Cadet" },
  { id: "state_psc", name: "State PSC (BPSC/UPPSC/MPSC)", tag: "State Govt", icon: "building", desc: "State Administrative Services" }
];
