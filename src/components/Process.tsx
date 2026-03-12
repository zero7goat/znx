import { motion } from 'motion/react';
import { MessageSquare, Scissors, Eye, Send } from 'lucide-react';

const steps = [
  {
    title: 'Consultation',
    description: 'We discuss your vision, goals, and target audience to ensure the best possible outcome.',
    icon: MessageSquare,
    color: 'bg-neon-red/20 text-neon-red'
  },
  {
    title: 'Editing Phase',
    description: 'I bring your footage to life with precise cuts, sound design, and visual effects.',
    icon: Scissors,
    color: 'bg-neon-red/20 text-neon-red'
  },
  {
    title: 'Review & Revision',
    description: 'You review the draft and we make any necessary adjustments to perfect the final product.',
    icon: Eye,
    color: 'bg-neon-red/20 text-neon-red'
  },
  {
    title: 'Final Delivery',
    description: 'Your high-quality video is delivered in the required formats, ready to be published.',
    icon: Send,
    color: 'bg-neon-red/20 text-neon-red'
  }
];

export default function Process() {
  return (
    <section id="process" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            My <span className="text-gradient">Workflow</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto"
          >
            A streamlined process designed to deliver high-quality results efficiently and effectively.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          {projects_steps_map()}
        </div>
      </div>
    </section>
  );

  function projects_steps_map() {
    return steps.map((step, index) => (
      <motion.div
        key={step.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="glass p-8 rounded-[2.5rem] relative z-10 flex flex-col items-center text-center group"
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${step.color}`}>
          <step.icon size={32} />
        </div>
        <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full glass flex items-center justify-center font-bold text-neon-red">
          0{index + 1}
        </div>
        <h3 className="text-xl font-bold mb-4">{step.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
      </motion.div>
    ));
  }
}
