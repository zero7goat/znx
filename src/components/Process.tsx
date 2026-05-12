import { motion } from 'motion/react';
import { MessageSquare, Scissors, Eye, Send } from 'lucide-react';

const steps = [
  {
    title: 'Consultation',
    description: 'We discuss your vision, goals, and target audience to ensure the best possible outcome.',
    icon: MessageSquare,
    color: 'bg-white/[0.05] text-white/80'
  },
  {
    title: 'Editing Phase',
    description: 'I bring your footage to life with precise cuts, sound design, and visual effects.',
    icon: Scissors,
    color: 'bg-white/[0.05] text-white/80'
  },
  {
    title: 'Review & Revision',
    description: 'You review the draft and we make any necessary adjustments to perfect the final product.',
    icon: Eye,
    color: 'bg-white/[0.05] text-white/80'
  },
  {
    title: 'Final Delivery',
    description: 'Your high-quality video is delivered in the required formats, ready to be published.',
    icon: Send,
    color: 'bg-white/[0.05] text-white/80'
  }
];

export default function Process() {
  return (
    <section id="process" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-6xl font-black mb-6 uppercase leading-[1.2] overflow-visible gpu-accel"
          >
            Tactical <span className="text-gradient">Workflow</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/30 max-w-xl mx-auto text-sm md:text-base font-medium tracking-wide"
          >
            A high-performance pipeline engineered for cinematic precision and creative excellence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-y-1/2 z-0" />

          {projects_steps_map()}
        </div>
      </div>
    </section>
  );

  function projects_steps_map() {
    return steps.map((step, index) => (
      <motion.div
        key={step.title}
        initial={{ opacity: 0, y: 30, rotateX: 15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.1, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        whileHover={{ y: -10, transition: { duration: 0.4 } }}
        className="glass-card p-8 md:p-10 rounded-[2.8rem] relative z-10 flex flex-col items-center text-center group active:scale-[0.98] transition-all duration-500 perspective-1000 gpu-accel will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-apple-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.8rem]" />
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-apple-gold/10 text-apple-gold group-hover:bg-apple-gold/20 transition-all duration-700 ease-[0.23, 1, 0.32, 1]`}>
          <step.icon size={32} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full glass flex items-center justify-center font-bold text-apple-gold/40 text-[10px] tracking-widest border-white/10">
          0{index + 1}
        </div>
        <h3 className="text-xl font-bold mb-4 text-white/90 tracking-tight">{step.title}</h3>
        <p className="text-white/40 text-[14px] leading-relaxed font-medium">{step.description}</p>
      </motion.div>
    ));
  }
}
