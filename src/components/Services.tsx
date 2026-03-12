import { motion } from 'motion/react';
import { Video, Layers, Smartphone, Clapperboard, Gamepad2, Sparkles } from 'lucide-react';

const services = [
  {
    title: 'YouTube Editing',
    description: 'High-retention editing for long-form content, including storytelling, pacing, and visual hooks.',
    icon: Video,
    color: 'text-neon-red',
  },
  {
    title: 'Motion Graphics',
    description: 'Custom 2D/3D animations, kinetic typography, and visual assets to elevate your brand.',
    icon: Layers,
    color: 'text-neon-red',
  },
  {
    title: 'Short Form Content',
    description: 'Viral-optimized edits for TikTok, Reels, and Shorts with fast pacing and engaging captions.',
    icon: Smartphone,
    color: 'text-neon-red',
  },
  {
    title: 'Cinematic Edits',
    description: 'Premium color grading, sound design, and visual effects for high-end commercial or personal projects.',
    icon: Clapperboard,
    color: 'text-neon-red',
  },
  {
    title: 'Gaming Montages',
    description: 'Sync-heavy gameplay edits with 3D tracking, custom transitions, and high-impact sound design.',
    icon: Gamepad2,
    color: 'text-neon-red',
  },
  {
    title: 'VFX & Compositing',
    description: 'Advanced visual effects, green screen removal, and seamless digital compositing.',
    icon: Sparkles,
    color: 'text-neon-red',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Premium <span className="text-gradient">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto"
          >
            Tailored video editing solutions designed to make your content stand out in a crowded digital landscape.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-[2rem] glass-hover group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                <service.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/50 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
