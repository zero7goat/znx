import { motion } from 'motion/react';
import { Cpu, Film, Zap, Palette } from 'lucide-react';

const stats = [
  { label: 'Projects Done', value: '150+' },
  { label: 'Happy Clients', value: '80+' },
  { label: 'Years Exp', value: '4+' },
];

const tools = [
  'After Effects', 'Premiere Pro', 'Photoshop', 'Davinci Resolve', 'Cinema 4D'
];

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">The Mind Behind <span className="text-gradient">ZNX</span></h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                I'm Suyog BC, a passionate video editor and motion designer dedicated to pushing the boundaries of visual storytelling. With over 4 years of experience in After Effects, I specialize in creating high-octane cinematic edits that leave a lasting impression.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                My philosophy is simple: every frame matters. I don't just cut clips together; I craft experiences through precise timing, dynamic transitions, and immersive sound design.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass p-4 rounded-2xl text-center">
                  <div className="text-2xl font-bold text-neon-red">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 glass p-4 rounded-[3rem] aspect-square overflow-hidden mb-8 hidden lg:block"
            >
              <img 
                src="https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Mee.png" 
                alt="Suyog BC" 
                className="w-full h-full object-cover rounded-[2.5rem]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-red/20 flex items-center justify-center text-neon-red">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map(tool => (
                    <span key={tool} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10">{tool}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass p-8 rounded-3xl space-y-4 mt-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-red/20 flex items-center justify-center text-neon-red">
                  <Film size={24} />
                </div>
                <h3 className="text-xl font-bold">Style</h3>
                <p className="text-sm text-white/50">Cinematic, High-Energy, Minimalist, Futuristic</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass p-8 rounded-3xl space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-red/20 flex items-center justify-center text-neon-red">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold">Impact</h3>
                <p className="text-sm text-white/50">Focusing on high-retention and viral potential.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="glass p-8 rounded-3xl space-y-4 mt-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-neon-red/20 flex items-center justify-center text-neon-red">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold">Creative</h3>
                <p className="text-sm text-white/50">Custom motion graphics and unique visual assets.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
