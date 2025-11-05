import { motion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';
import { settingsService } from '../../services/settingsService';
import MilestoneTimeline from './MilestoneTimeline';

/**
 * About Section Component - Professional presentation
 * Follows Single Responsibility Principle
 */
function AboutSection() {
  const { t } = useI18n();
  const showMilestone = settingsService.isFeatureEnabled('features.showMilestone.enabled');

  return (
    <section id="about" className="pt-20 md:pt-32 pb-8 md:pb-12 bg-bolf-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-bolf-white">{t('about.title')}</span>
            </h2>
          </div>

          {/* Professional Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Who We Are Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-bolf-black border border-bolf-white/10 rounded-xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-bolf-neon-blue mb-6">
                {t('about.whoAreWe')}
              </h3>
              <div className="text-bolf-gray text-base md:text-lg leading-relaxed space-y-4">
                <p>{t('about.content.paragraph1')}</p>
                <p>{t('about.content.paragraph3')}</p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-bolf-neon-blue/10 to-bolf-orange/10 border border-bolf-neon-blue/20 rounded-xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-xl md:text-2xl font-bold text-bolf-white mb-4">
                {t('about.mission')}
              </h3>
              <p className="text-bolf-gray text-base md:text-lg leading-relaxed italic">
                "{t('about.content.paragraph2')}"
              </p>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <div className="p-6 bg-bolf-black/50 border border-bolf-white/5 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-bolf-neon-blue mb-2">2+</div>
              <div className="text-bolf-gray text-sm md:text-base">{t('about.stats.yearsExperience')}</div>
            </div>
            <div className="p-6 bg-bolf-black/50 border border-bolf-white/5 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-bolf-orange mb-2">5</div>
              <div className="text-bolf-gray text-sm md:text-base">{t('about.stats.teamMembers')}</div>
            </div>
            <div className="p-6 bg-bolf-black/50 border border-bolf-white/5 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-bolf-neon-blue mb-2">∞</div>
              <div className="text-bolf-gray text-sm md:text-base">{t('about.stats.passion')}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Milestone Timeline */}
      {showMilestone && <MilestoneTimeline />}
    </section>
  );
}

export default AboutSection;

