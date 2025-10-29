'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    type: 'title',
    title: 'ATOMX',
    subtitle: 'Capturing MEV for Retail',
    tagline: 'What Jito does for validators, we do for regular traders'
  },
  {
    id: 2,
    type: 'mev_problem',
    title: 'Why do I need to talk to the jurors about MEV today',
    subtitle: 'Because retail traders subsidize bot profits on every swap',
    stats: [
      {
        number: '$328M',
        label: 'MEV Extracted on Solana in 2024',
        sublabel: '70%+ of validators run Jito to capture MEV'
      },
      {
        number: '$2-5',
        label: 'Average MEV Per User Swap',
        sublabel: 'Bots frontrun, sandwich, and arbitrage your trades'
      },
      {
        number: '15+ DEXs',
        label: 'Price Gaps Across Markets',
        sublabel: 'Same token, different prices, constant opportunity'
      }
    ]
  },
  {
    id: 3,
    type: 'atomx_solution',
    title: 'How ATOMX Flips MEV',
    subtitle: 'Turn users from MEV victims into MEV earners',
    comparison: [
      {
        title: 'TYPICAL USER SWAP',
        flow: [
          'User submits: Swap 100 SOL → USDC',
          'Bot sees transaction in mempool',
          'Bot frontruns with arbitrage',
          'User receives worse price',
          'Bot captures $3-5 profit'
        ],
        result: 'USER LOSES',
        color: 'red'
      },
      {
        title: 'ATOMX ARBITRAGE',
        flow: [
          'Scanner finds: Raydium $150.20, Orca $151.50',
          'User clicks execute from vault',
          'Atomic swap: Buy Raydium → Sell Orca',
          'Profit: $1.30 per SOL traded',
          'Split: 10% executor, 90% vault'
        ],
        result: 'USER EARNS',
        color: 'green'
      }
    ]
  },
  {
    id: 4,
    type: 'why_solana',
    title: 'Why Solana',
    subtitle: 'Architecture designed for high-frequency execution',
    reasons: [
      {
        title: 'Parallel Transaction Processing',
        stat: 'Sealevel Runtime',
        description: 'Transactions declare which accounts they touch upfront. The runtime executes non overlapping transactions in parallel across cores. Our SOL arbitrage runs simultaneously with other BONK trades. No global lock, no gas wars.',
        impact: 'Zero contention between unrelated trades'
      },
      {
        title: 'No Public Mempool',
        stat: 'Gulf Stream',
        description: 'Transactions forward directly to upcoming leaders via Gulf Stream. No public mempool means no frontrunning bots watching pending transactions. Our arbitrage execution stays invisible until already confirmed onchain.',
        impact: 'Protected from sandwich attacks'
      },
      {
        title: 'Atomic Execution Across Programs',
        stat: 'CPI',
        description: 'CPI lets our vault call Jupiter router within the same transaction. Buy on Raydium, route through Jupiter, sell on Orca, all atomic. If any step fails, the entire transaction reverts. No stuck capital, no partial fills eating profit.',
        impact: 'All or nothing execution guarantees'
      },
      {
        title: 'Isolated Fee Competition',
        stat: 'Per Account Priority',
        description: 'Fees compete per writable account, not globally. High activity on Pump.fun tokens does not inflate fees for our SOL arbitrage. Each market has its own fee dynamics. We only pay for congestion we are actually competing in.',
        impact: 'Independent economics per trading pair'
      }
    ]
  },
  {
    id: 5,
    type: 'architecture_graph',
    title: 'System Architecture',
    subtitle: 'Transaction flow from detection to settlement'
  },
  {
    id: 6,
    type: 'tech_stack',
    title: 'How It Works',
    subtitle: 'Three layers working together',
    layers: [
      {
        name: 'DETECTION',
        description: 'Scanner monitors Jupiter API across all Solana DEXs',
        specs: ['WebSocket real-time feed', 'Millisecond latency', '0.3-2% spread detection'],
        output: 'Opportunities → Frontend'
      },
      {
        name: 'EXECUTION',
        description: 'Vault holds pooled capital for instant arbitrage',
        specs: ['Anchor smart contract on Solana', 'CPI to Jupiter Router', 'Atomic success or full revert'],
        output: 'Profit → Distribution'
      },
      {
        name: 'DISTRIBUTION',
        description: 'On-chain fee split with no trust required',
        specs: ['10% to executor (incentive)', '90% to vault depositors', 'Share-based accounting'],
        output: 'Everyone earns'
      }
    ]
  },
  {
    id: 7,
    type: 'market_data',
    title: 'Market Size',
    subtitle: 'Real numbers from Solana today',
    figures: [
      { amount: '$2.4B', context: 'Daily DEX volume', footnote: 'DefiLlama, Q4 2024' },
      { amount: '0.5-2%', context: 'Cross-DEX spreads', footnote: 'Jupiter API monitoring' },
      { amount: '$12M+', context: 'Daily arb opportunity', footnote: '0.5% of volume, conservative' },
      { amount: '15+ DEXs', context: 'Liquidity split across', footnote: 'Raydium, Orca, Meteora, Phoenix...' }
    ],
    takeaway: 'High volume + spread across many markets = constant arbitrage opportunities. We scan them all.'
  },
  {
    id: 8,
    type: 'business',
    title: 'Business Model',
    subtitle: 'Revenue from volume, not speculation',
    model: [
      {
        source: 'Executor Fees',
        description: '10% of every profitable arbitrage goes to executor',
        unit: '$0.10 per $1 profit'
      },
      {
        source: 'Vault Management',
        description: '0.5% annual management fee on TVL (future)',
        unit: '$5K per $1M TVL/year'
      },
      {
        source: 'Premium Features',
        description: 'Advanced scanning, analytics, custom strategies (future)',
        unit: '$99-499/month subscription'
      }
    ],
    projection: 'At $10M TVL + 50 executions/day = $18K monthly revenue'
  },
  {
    id: 9,
    type: 'competition',
    title: 'Competition',
    subtitle: 'First mover in democratized Solana arbitrage',
    competitors: [
      { name: 'Jito MEV', approach: 'Validator-level MEV extraction', gap: 'Requires validator access, not retail' },
      { name: 'Manual Trading', approach: 'Individual traders doing manual arb', gap: 'Too slow, lacks detection tools' },
      { name: 'Private Bots', approach: 'Proprietary arbitrage bots', gap: 'Not accessible, no pooled liquidity' }
    ],
    advantage: 'Only platform offering: Pooled capital + Real-time detection + One-click execution for retail'
  },
  {
    id: 10,
    type: 'roadmap',
    title: 'Roadmap',
    subtitle: 'Year 1 growth trajectory',
    phases: [
      {
        phase: 'NOW',
        title: 'Devnet Live',
        items: ['✓ Smart contracts deployed', '✓ Scanner operational', '✓ Frontend functional']
      },
      {
        phase: 'MONTH 2-3',
        title: 'Mainnet Launch',
        items: ['→ OtterSec audit', '→ $100K seed capital', '→ 50 beta users', '→ First live arbitrages']
      },
      {
        phase: 'MONTH 6-12',
        title: 'Scale',
        items: ['→ $500K → $2M TVL', '→ Token launch for governance', '→ Advanced strategies', '→ Mobile app deployment']
      }
    ]
  },
  {
    id: 11,
    type: 'team',
    title: 'The Team',
    subtitle: 'Finance meets engineering',
    members: [
      {
        name: 'Alexis',
        role: 'Student & Data Scientist',
        university: 'Paris-Dauphine',
        bio: 'Works for Mentat Minds on Bittsensor. Founder of university blockchain club at Paris-Dauphine. Built entire smart contract infrastructure: vault system, router integration, and Jupiter CPI execution.',
        why: 'Built DeFi infrastructure professionally. Watched students trade on DEXs and lose value to bots on every swap. Built ATOMX to flip who captures that value.',
        links: [
          { label: 'Twitter', url: 'x.com/AJatiere' },
          { label: 'GitHub', url: 'github.com/Mrhashf0x' }
        ]
      },
      {
        name: 'Shay',
        role: 'Student & Finance Analyst',
        university: 'Paris-Dauphine',
        bio: 'Won Best Tokenomics Awards. Board member at Kryptosphere (French blockchain non-profit). Finance major in wealth management with academic distinction.',
        why: 'Studied MEV extraction in markets. Saw retail traders bleeding value to bots. Built ATOMX to flip who captures it.',
        links: [
          { label: 'Twitter', url: 'x.com/donaltcoins' },
          { label: 'GitHub', url: 'github.com/shaygp' }
        ]
      }
    ],
    footer: 'github.com/shaygp/ATOMX'
  }
];

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      if (prev < slides.length - 1) {
        setDirection(1);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => {
      if (prev > 0) {
        setDirection(-1);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const handleSlideClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      prevSlide();
    } else {
      nextSlide();
    }
  }, [prevSlide, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 })
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-y-auto">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-50">
        <div
          className="h-full bg-[#9333ea] transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 pb-24 cursor-pointer" onClick={handleSlideClick}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "tween", duration: 0.3 }, opacity: { duration: 0.2 } }}
            className="w-full max-w-5xl"
          >
            {/* Title Slide */}
            {slide.type === 'title' && (
              <div className="text-center space-y-6">
                <div className="text-8xl font-bold text-[#9333ea] font-mono mb-4">{slide.title}</div>
                <div className="text-3xl text-gray-300 mb-8">{slide.subtitle}</div>
                <div className="text-xl text-gray-500 max-w-3xl mx-auto italic">{slide.tagline}</div>
                <div className="pt-12 text-sm text-gray-600">Colosseum Hackathon 2025 • Solana DeFi</div>
              </div>
            )}

            {/* MEV Problem Slide */}
            {slide.type === 'mev_problem' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {slide.stats?.map((stat, i) => (
                    <div key={i} className="border-2 border-red-900/50 bg-red-900/5 p-8 space-y-4 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:border-red-700/70 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all duration-300">
                      <div className="text-6xl font-bold text-red-500">{stat.number}</div>
                      <div className="text-xl font-bold text-white">{stat.label}</div>
                      <div className="text-sm text-gray-400 leading-relaxed">{stat.sublabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ATOMX Solution Slide */}
            {slide.type === 'atomx_solution' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {slide.comparison?.map((comp, i) => (
                    <div key={i} className={`border-2 p-8 space-y-5 transition-all duration-300 ${
                      comp.color === 'red'
                        ? 'border-red-900/50 bg-red-900/5 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:border-red-700/70 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                        : 'border-green-900/50 bg-green-900/5 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:border-green-700/70 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                    }`}>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{comp.title}</div>
                      <div className="space-y-2.5">
                        {comp.flow.map((step, j) => (
                          <div key={j} className="text-sm text-gray-300 leading-relaxed">→ {step}</div>
                        ))}
                      </div>
                      <div className={`text-3xl font-bold pt-2 ${
                        comp.color === 'red' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {comp.result}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Solana Slide */}
            {slide.type === 'why_solana' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                {/* Terminal command output */}
                <div className="bg-black border-2 border-[#9333ea]/30 p-8 font-mono shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                  <div className="text-xs text-[#9333ea] mb-6 opacity-70">$ explain_architecture --blockchain=solana --focus=arbitrage</div>
                  <div className="space-y-6">
                    {slide.reasons?.map((reason, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="text-[#9333ea] text-lg">{'>'}</div>
                          <div className="text-xl font-bold text-white">{reason.title}</div>
                          <div className="text-sm text-[#9333ea]/70 font-mono">({reason.stat})</div>
                        </div>
                        <div className="pl-6 text-sm text-gray-400 leading-relaxed border-l-2 border-[#9333ea]/30 ml-2">
                          {reason.description}
                        </div>
                        <div className="pl-6 ml-2 text-xs text-[#00ff88] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></div>
                          <div>{reason.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#9333ea]/20">
                    <div className="text-xs text-[#9333ea]/70">$ exit 0</div>
                  </div>
                </div>
              </div>
            )}

            {/* Architecture Graph Slide */}
            {slide.type === 'architecture_graph' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>

                {/* GitHub-style architecture diagram */}
                <div className="relative flex flex-col items-center space-y-8 py-8">
                  {/* Scanner Layer */}
                  <div className="w-full max-w-3xl">
                    <div className="border-2 border-gray-700 bg-gray-900/50 p-6 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-white font-mono">scanner.ts</div>
                        <div className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 border border-blue-700/50 rounded">WebSocket</div>
                      </div>
                      <div className="text-sm text-gray-400 font-mono space-y-1">
                        <div>→ Monitor Jupiter V6 API</div>
                        <div>→ Detect price gaps across 15+ DEXs</div>
                        <div>→ Filter opportunities &gt; 0.3% spread</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-gray-700 to-[#9333ea]"></div>
                    </div>
                  </div>

                  {/* Vault Program */}
                  <div className="w-full max-w-3xl">
                    <div className="border-2 border-[#9333ea]/50 bg-[#9333ea]/5 p-6 rounded shadow-[0_0_20px_rgba(147,51,234,0.15)]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-[#9333ea] font-mono">vault_program.rs</div>
                        <div className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1 border border-purple-700/50 rounded">Anchor</div>
                      </div>
                      <div className="text-sm text-gray-300 font-mono space-y-1">
                        <div>→ Pooled capital from depositors</div>
                        <div>→ Share-based accounting (mint/burn)</div>
                        <div>→ Execute arbitrage via CPI</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-[#9333ea] to-green-600"></div>
                    </div>
                  </div>

                  {/* Jupiter Router */}
                  <div className="w-full max-w-3xl">
                    <div className="border-2 border-green-700/50 bg-green-900/10 p-6 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-green-400 font-mono">jupiter_router</div>
                        <div className="text-xs bg-green-900/30 text-green-400 px-3 py-1 border border-green-700/50 rounded">CPI</div>
                      </div>
                      <div className="text-sm text-gray-300 font-mono space-y-1">
                        <div>→ Atomic swap: Buy DEX_A → Sell DEX_B</div>
                        <div>→ All or nothing execution</div>
                        <div>→ Return profit to vault</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-green-600 to-gray-700"></div>
                    </div>
                  </div>

                  {/* Settlement */}
                  <div className="w-full max-w-3xl">
                    <div className="border-2 border-gray-700 bg-gray-900/50 p-6 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-white font-mono">settlement</div>
                        <div className="text-xs bg-gray-700/30 text-gray-300 px-3 py-1 border border-gray-600/50 rounded">Onchain</div>
                      </div>
                      <div className="text-sm text-gray-400 font-mono space-y-1">
                        <div>→ 10% fee to executor</div>
                        <div>→ 90% profit to vault</div>
                        <div>→ Update share price for depositors</div>
                      </div>
                    </div>
                  </div>

                  {/* Timing annotation */}
                  <div className="absolute right-0 top-1/2 transform translate-y-[-50%] text-right space-y-2">
                    <div className="text-xs text-gray-500 font-mono">t = 0ms</div>
                    <div className="text-xs text-gray-500 font-mono" style={{ marginTop: '120px' }}>t = 200ms</div>
                    <div className="text-xs text-gray-500 font-mono" style={{ marginTop: '120px' }}>t = 400ms</div>
                    <div className="text-xs text-gray-500 font-mono" style={{ marginTop: '120px' }}>t = 600ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Stack Slide */}
            {slide.type === 'tech_stack' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                {/* Terminal execution log */}
                <div className="bg-black border-2 border-[#00ff41]/30 p-8 font-mono shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                  <div className="text-xs text-[#00ff41] mb-6 opacity-70">$ run_arbitrage_pipeline --mode=production</div>
                  <div className="space-y-6">
                    {slide.layers?.map((layer, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="text-[#00ff41]">[{i + 1}/3]</div>
                          <div className="text-xl font-bold text-white">{layer.name}</div>
                          <div className="flex-1 border-b border-[#00ff41]/20"></div>
                          <div className="text-xs text-[#00ff41]/70">{layer.output}</div>
                        </div>
                        <div className="pl-12 text-sm text-gray-400 leading-relaxed">
                          {layer.description}
                        </div>
                        <div className="pl-12 flex flex-wrap gap-2">
                          {layer.specs.map((spec, j) => (
                            <div key={j} className="text-xs bg-[#00ff41]/10 border border-[#00ff41]/30 px-3 py-1 text-[#00ff41]">
                              • {spec}
                            </div>
                          ))}
                        </div>
                        {i < (slide.layers?.length || 0) - 1 && (
                          <div className="pl-12 text-xs text-gray-600 mt-2">
                            │
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#00ff41]/20">
                    <div className="flex items-center gap-2 text-xs text-[#00ff41]">
                      <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
                      <div>Pipeline running successfully</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Market Data Slide */}
            {slide.type === 'market_data' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                {/* Terminal style output */}
                <div className="bg-black border-2 border-[#00ff41]/30 p-8 font-mono shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                  <div className="text-xs text-[#00ff41] mb-6 opacity-70">$ query_market_data --chain=solana --timeframe=24h</div>
                  <div className="space-y-6">
                    {slide.figures?.map((fig, i) => (
                      <div key={i} className="flex items-baseline gap-4 border-l-2 border-[#00ff41]/50 pl-4">
                        <div className="text-4xl font-bold text-[#00ff41] min-w-[200px]">{fig.amount}</div>
                        <div className="flex-1">
                          <div className="text-lg text-white mb-1">{fig.context}</div>
                          <div className="text-xs text-gray-500">// {fig.footnote}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#00ff41]/20">
                    <div className="text-sm text-[#00ff41]/80">{'>'} {slide.takeaway}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Model Slide */}
            {slide.type === 'business' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                {/* Table style revenue breakdown */}
                <div className="border-2 border-[#ffff00]/30 bg-[#ffff00]/5 overflow-hidden">
                  <div className="bg-[#ffff00]/10 border-b-2 border-[#ffff00]/30 p-4">
                    <div className="grid grid-cols-3 gap-4 font-mono text-sm text-[#ffff00] uppercase tracking-wider">
                      <div>Revenue Stream</div>
                      <div>Mechanism</div>
                      <div className="text-right">Unit Economics</div>
                    </div>
                  </div>
                  {slide.model?.map((item, i) => (
                    <div key={i} className="border-b border-[#ffff00]/10 p-6 hover:bg-[#ffff00]/5 transition-colors">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-xl font-bold text-white">{item.source}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                        <div className="text-right">
                          <div className="inline-block bg-[#ffff00]/10 border border-[#ffff00]/30 px-4 py-2 text-[#ffff00] font-mono text-sm">
                            {item.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffff00]/5 via-[#ffff00]/10 to-[#ffff00]/5"></div>
                  <div className="relative border-2 border-[#ffff00]/50 bg-black p-6 text-center">
                    <div className="text-xs text-[#ffff00]/70 uppercase tracking-widest mb-2 font-mono">Projected Monthly Revenue</div>
                    <div className="text-3xl font-bold text-[#ffff00]">{slide.projection}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Competition Slide */}
            {slide.type === 'competition' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                {/* VS style comparison */}
                <div className="space-y-4">
                  {slide.competitors?.map((comp, i) => (
                    <div key={i} className="relative">
                      <div className="grid grid-cols-[1fr,auto,1fr] gap-6 items-center">
                        {/* Competitor */}
                        <div className="border-2 border-red-900/30 bg-red-900/5 p-6">
                          <div className="text-2xl font-bold text-red-500 mb-3">{comp.name}</div>
                          <div className="text-sm text-gray-400 mb-3">{comp.approach}</div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="text-xs text-red-400 font-mono">{comp.gap}</div>
                          </div>
                        </div>

                        {/* VS divider */}
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-mono text-gray-600 mb-1">VS</div>
                          <div className="w-px h-16 bg-gradient-to-b from-red-500 via-gray-700 to-[#00ff88]"></div>
                        </div>

                        {/* ATOMX (shown once per competitor) */}
                        <div className="border-2 border-[#00ff88]/30 bg-[#00ff88]/5 p-6">
                          <div className="text-2xl font-bold text-[#00ff88] mb-3">ATOMX</div>
                          <div className="text-sm text-gray-300">Pooled capital + Real-time detection + One-click execution</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Winner banner */}
                <div className="relative mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent"></div>
                  <div className="relative border-2 border-[#00ff88] bg-[#00ff88]/10 p-6 text-center">
                    <div className="text-sm font-mono text-[#00ff88] mb-2 uppercase tracking-widest">Winner</div>
                    <div className="text-xl text-white font-bold">{slide.advantage}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap Slide */}
            {slide.type === 'roadmap' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {slide.phases?.map((phase, i) => (
                    <div key={i} className={`border-2 p-8 space-y-5 transition-all duration-300 ${
                      i === 0
                        ? 'border-[#00ff88]/50 bg-[#00ff88]/5 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:border-[#00ff88]/70 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                        : 'border-gray-700/50 bg-gray-900/30 shadow-[0_0_15px_rgba(107,114,128,0.1)] hover:border-gray-600/70 hover:shadow-[0_0_25px_rgba(107,114,128,0.15)]'
                    }`}>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">{phase.phase}</div>
                      <div className="text-2xl font-bold text-white">{phase.title}</div>
                      <div className="space-y-2.5">
                        {phase.items.map((item, j) => (
                          <div key={j} className={`text-sm leading-relaxed ${item.startsWith('✓') ? 'text-[#00ff88] font-semibold' : 'text-gray-400'}`}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Slide */}
            {slide.type === 'team' && (
              <div className="space-y-8">
                <div className="border-b border-gray-800 pb-4">
                  <h1 className="text-5xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xl text-gray-400">{slide.subtitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {slide.members?.map((member, i) => (
                    <div key={i} className="border-2 border-[#9333ea]/30 bg-[#9333ea]/5 p-8 space-y-5 shadow-[0_0_20px_rgba(147,51,234,0.1)] hover:border-[#9333ea]/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)] transition-all duration-300">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-[#9333ea]">{member.name}</div>
                        <div className="text-lg text-gray-300">{member.role}</div>
                        <div className="text-sm text-gray-400">{member.university}</div>
                      </div>
                      <div className="border-t border-[#9333ea]/20 pt-5 space-y-4">
                        <div className="text-gray-300 leading-relaxed">{member.bio}</div>
                        {member.why && (
                          <div className="border-l-4 border-[#9333ea] pl-4 py-3 bg-[#9333ea]/10">
                            <div className="text-sm font-bold text-[#9333ea] mb-2">Why ATOMX?</div>
                            <div className="text-sm text-gray-300 leading-relaxed">{member.why}</div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 pt-2">
                        {member.links.map((link, j) => (
                          <div key={j} className="text-sm">
                            <span className="text-gray-500">{link.label}: </span>
                            <span className="text-[#9333ea] font-mono">{link.url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-800 pt-6 text-center pb-20">
                  <div className="text-sm text-gray-500 mb-2">Project Repository</div>
                  <div className="text-xl font-mono text-[#9333ea]">{slide.footer}</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-gray-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 disabled:opacity-30 hover:bg-gray-900 rounded transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-8 bg-[#9333ea]' : 'w-2 bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 disabled:opacity-30 hover:bg-gray-900 rounded transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-4 right-4 text-sm text-gray-500 font-mono z-40">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
